export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  try {
    let rawUrl = req.query?.url;
    if (!rawUrl) {
      const urlObj = new URL(req.url, 'http://localhost');
      rawUrl = urlObj.searchParams.get('url');
    }
    rawUrl = (rawUrl || '').trim();

    if (!rawUrl) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Please provide a Spotify URL or song title' }));
      return;
    }

    const trackIdMatch = rawUrl.match(/(?:track\/|spotify:track:)([a-zA-Z0-9]{22})/);
    const trackId = trackIdMatch ? trackIdMatch[1] : (rawUrl.length === 22 && !rawUrl.includes(' ') ? rawUrl : null);

    let extractedData = null;

    // 1. If track ID, try Spotify embed
    if (trackId) {
      try {
        const spotifyEmbedUrl = `https://open.spotify.com/embed/track/${trackId}`;
        const embedRes = await fetch(spotifyEmbedUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
          }
        });

        if (embedRes.ok) {
          const html = await embedRes.text();
          const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([^<]+)<\/script>/);
          if (match) {
            const data = JSON.parse(match[1]);
            const entity = data?.props?.pageProps?.state?.data?.entity;
            if (entity && entity.name) {
              const artistNames = entity.artists?.map(a => a.name).join(', ') || 'Unknown Artist';
              const coverImages = entity.visualIdentity?.image || [];
              const bestCover = coverImages[coverImages.length - 1]?.url || coverImages[0]?.url || '';
              const previewUrl = entity.audioPreview?.url || '';
              const durationMs = entity.duration || 0;
              const bg = entity.visualIdentity?.backgroundBase;
              const spotifyColor = bg ? `rgb(${bg.red}, ${bg.green}, ${bg.blue})` : null;

              extractedData = {
                success: true,
                id: trackId,
                title: entity.name || entity.title,
                artist: artistNames,
                album: entity.album?.name || '',
                coverArt: bestCover,
                previewUrl,
                durationMs,
                spotifyColor
              };
            }
          }
        }
      } catch (e) {
        console.warn('Spotify embed fetch warning:', e);
      }
    }

    // 2. iTunes Search Resolver Fallback (handles song titles, typos, movie names, or failed Spotify IDs)
    if (!extractedData) {
      try {
        let cleanQuery = rawUrl;
        if (cleanQuery.includes('spotify.com')) {
          const parts = cleanQuery.split('?')[0].split('/');
          cleanQuery = parts[parts.length - 1] || rawUrl;
        }

        const stopWords = new Set([
          'from', 'telugu', 'tamil', 'hindi', 'kannada', 'malayalam', 'bengali', 'punjabi',
          'song', 'songs', 'movie', 'film', 'cinema', 'ost', 'audio', 'video', 'lyrics',
          'by', 'original', 'soundtrack', 'album', 'full', 'track', 'mp3'
        ]);

        const queryWords = cleanQuery
          .trim()
          .split(/\s+/)
          .filter(w => !stopWords.has(w.toLowerCase()));

        // Multi-tier candidate search queries
        const candidateQueries = [
          cleanQuery,
          queryWords.join(' '),
          // Movie / artist suffix phrases (e.g., 'arjun reddy')
          queryWords.length >= 2 ? queryWords.slice(-2).join(' ') : null,
          queryWords.length >= 2 ? queryWords.slice(0, 2).join(' ') : null,
          // Individual strong words (>= 4 chars)
          ...queryWords.filter(w => w.length >= 4)
        ].filter(Boolean);

        const scoreTrack = (t, words) => {
          let score = 0;
          const combined = (t.trackName + ' ' + (t.collectionName || '') + ' ' + (t.artistName || '')).toLowerCase();
          for (const w of words) {
            const wClean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (!wClean || wClean.length < 3) continue;
            if (combined.includes(wClean)) {
              score += 10;
            } else {
              const prefix = wClean.slice(0, 5);
              if (prefix.length >= 4 && combined.includes(prefix)) {
                score += 7;
              }
            }
          }
          return score;
        };

        let bestItem = null;
        let bestScore = -1;

        for (const term of candidateQueries) {
          try {
            const itunesRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=15`);
            if (itunesRes.ok) {
              const itunesData = await itunesRes.json();
              if (itunesData.results && itunesData.results.length > 0) {
                for (const item of itunesData.results) {
                  const s = scoreTrack(item, queryWords.length > 0 ? queryWords : cleanQuery.split(/\s+/));
                  if (s > bestScore) {
                    bestScore = s;
                    bestItem = item;
                  }
                }
                // If we found a confident match (score >= 14), we can stop searching further
                if (bestScore >= 14) break;
              }
            }
          } catch (err) {
            // Try next candidate query
          }
        }

        if (bestItem) {
          extractedData = {
            success: true,
            id: trackId || String(bestItem.trackId),
            title: bestItem.trackName,
            artist: bestItem.artistName,
            album: bestItem.collectionName || '',
            coverArt: (bestItem.artworkUrl100 || '').replace('100x100bb.jpg', '600x600bb.jpg'),
            previewUrl: bestItem.previewUrl || '',
            durationMs: bestItem.trackTimeMillis || 180000,
            spotifyColor: 'rgb(35, 40, 50)'
          };
        }
      } catch (e) {
        console.warn('iTunes search fallback warning:', e);
      }
    }

    // 3. Convert coverArt to Base64 so client never suffers from CORS or missing image
    if (extractedData && extractedData.coverArt && extractedData.coverArt.startsWith('http')) {
      try {
        const imgRes = await fetch(extractedData.coverArt, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' }
        });
        if (imgRes.ok) {
          const buf = await imgRes.arrayBuffer();
          const cType = imgRes.headers.get('content-type') || 'image/jpeg';
          extractedData.coverArt = `data:${cType};base64,${Buffer.from(buf).toString('base64')}`;
        }
      } catch (err) {
        console.warn('Cover base64 conversion warning:', err);
      }
    }

    if (extractedData) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
      res.end(JSON.stringify(extractedData));
    } else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Could not find track information for this link or query.' }));
    }
  } catch (err) {
    console.error('Spotify API error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal server error while resolving track' }));
  }
}
