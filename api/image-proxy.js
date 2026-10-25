export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  try {
    let targetUrl = req.query?.url;
    if (!targetUrl) {
      const urlObj = new URL(req.url, 'http://localhost');
      targetUrl = urlObj.searchParams.get('url');
    }

    if (!targetUrl) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Missing url parameter');
      return;
    }

    const imgRes = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });

    if (!imgRes.ok) {
      throw new Error(`Image fetch failed with status ${imgRes.status}`);
    }

    const buffer = await imgRes.arrayBuffer();
    const cType = imgRes.headers.get('content-type') || 'image/jpeg';

    res.setHeader('Content-Type', cType);
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    res.statusCode = 200;
    res.end(Buffer.from(buffer));
  } catch (err) {
    console.error('image-proxy error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end(err.message || 'Error fetching image');
  }
}
