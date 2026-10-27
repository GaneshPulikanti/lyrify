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
    let track = req.query?.track || req.query?.title;
    let artist = req.query?.artist;

    if (!track) {
      const urlObj = new URL(req.url, 'http://localhost');
      track = urlObj.searchParams.get('track') || urlObj.searchParams.get('title');
      artist = urlObj.searchParams.get('artist');
    }

    track = (track || '').trim();
    artist = (artist || '').trim();

    if (!track) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: 'Missing track title' }));
      return;
    }

    // Clean title: remove suffixes like - Male, (Remastered 2021), - From "Movie", (feat. ...)
    const cleanTrack = track
      .replace(/\s*[-–]\s*.*(?:Remaster|Live|Deluxe|Mono|Stereo|Edit|Version|From|Instrumental|Mix|Radio|Male|Female).*$/i, '')
      .replace(/\s*\(.*?(?:Remaster|Live|Deluxe|Mono|Stereo|Edit|Version|From|Instrumental|Mix|Radio|feat|Male|Female).*?\)/i, '')
      .replace(/\s*\[.*?(?:Remaster|Live|Deluxe|Mono|Stereo|Edit|Version|From|Instrumental|Mix|Radio|feat|Male|Female).*?\]/i, '')
      .trim() || track;

    const primaryArtist = artist.split(/[,&/]/)[0].replace(/\bfeat\b.*$/i, '').trim() || artist;

    const browserHeaders = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    };

    const searchUrls = [
      // 1. Exact track and artist fields
      `https://lrclib.net/api/search?track_name=${encodeURIComponent(track)}&artist_name=${encodeURIComponent(artist)}`,
      // 2. Cleaned track and primary artist fields
      `https://lrclib.net/api/search?track_name=${encodeURIComponent(cleanTrack)}&artist_name=${encodeURIComponent(primaryArtist)}`,
      // 3. Full-text query with cleaned track and artist
      `https://lrclib.net/api/search?q=${encodeURIComponent(cleanTrack + ' ' + primaryArtist)}`,
      // 4. Full-text query with raw track and artist
      `https://lrclib.net/api/search?q=${encodeURIComponent(track + ' ' + primaryArtist)}`,
      // 5. Cleaned track name only
      `https://lrclib.net/api/search?q=${encodeURIComponent(cleanTrack)}`
    ];

    let foundResults = [];

    for (const url of searchUrls) {
      try {
        const lrcRes = await fetch(url, { headers: browserHeaders });
        if (lrcRes.ok) {
          const data = await lrcRes.json();
          if (Array.isArray(data) && data.length > 0) {
            const hasValidLyrics = data.some(item => (item.plainLyrics && item.plainLyrics.trim()) || (item.syncedLyrics && item.syncedLyrics.trim()));
            if (hasValidLyrics) {
              foundResults = data;
              break;
            }
          }
        }
      } catch (e) {
        // Try next fallback strategy
      }
    }

    // Fallback 6: If LRCLIB had no lyrics, try lyrics.ovh
    if (foundResults.length === 0 && primaryArtist && cleanTrack) {
      try {
        const ovhUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(primaryArtist)}/${encodeURIComponent(cleanTrack)}`;
        const ovhRes = await fetch(ovhUrl, { headers: browserHeaders });
        if (ovhRes.ok) {
          const ovhData = await ovhRes.json();
          if (ovhData.lyrics && ovhData.lyrics.trim()) {
            foundResults = [{
              trackName: cleanTrack,
              artistName: primaryArtist,
              plainLyrics: ovhData.lyrics.trim()
            }];
          }
        }
      } catch (e) {
        // Fallback failed
      }
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800');
    res.end(JSON.stringify({
      success: foundResults.length > 0,
      results: foundResults
    }));
  } catch (err) {
    console.error('Lyrics API error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: 'Internal server error while searching lyrics' }));
  }
}
