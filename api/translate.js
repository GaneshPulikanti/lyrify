export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  try {
    let lines = [];

    if (req.method === 'POST') {
      let bodyStr = '';
      await new Promise((resolve) => {
        req.on('data', chunk => { bodyStr += chunk; });
        req.on('end', resolve);
      });
      try {
        const parsed = JSON.parse(bodyStr || '{}');
        if (Array.isArray(parsed.lines)) {
          lines = parsed.lines;
        } else if (typeof parsed.text === 'string') {
          lines = parsed.text.split('\n');
        }
      } catch (e) {
        // Fallback to query
      }
    }

    if (lines.length === 0) {
      const urlObj = new URL(req.url, 'http://localhost');
      const textParam = urlObj.searchParams.get('text');
      if (textParam) {
        lines = textParam.split('\n');
      }
    }

    lines = lines.map(l => (typeof l === 'string' ? l.trim() : '')).filter(l => l.length > 0);

    if (lines.length === 0) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: 'No lyrics lines provided to translate' }));
      return;
    }

    const fullText = lines.join('\n');

    // Query Google Translate with dt=t (translation) and dt=rm (transliteration / Romanization)
    const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&dt=rm&q=${encodeURIComponent(fullText)}`;
    const gRes = await fetch(googleUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      }
    });

    if (!gRes.ok) {
      throw new Error(`Google Translate responded with ${gRes.status}`);
    }

    const gData = await gRes.json();
    const detectedLang = gData[2] || 'auto';

    // Friendly language name map
    const langNames = {
      te: 'Telugu',
      hi: 'Hindi',
      ta: 'Tamil',
      ml: 'Malayalam',
      kn: 'Kannada',
      pa: 'Punjabi',
      bn: 'Bengali',
      mr: 'Marathi',
      gu: 'Gujarati',
      ur: 'Urdu',
      es: 'Spanish',
      ko: 'Korean',
      ja: 'Japanese',
      fr: 'French',
      de: 'German',
      ar: 'Arabic',
      ru: 'Russian',
      pt: 'Portuguese',
      it: 'Italian',
      en: 'English'
    };

    const languageName = langNames[detectedLang] || detectedLang.toUpperCase();

    // 1. Extract Romanized text (English letters for non-Latin script)
    let romanizedBlock = '';
    if (Array.isArray(gData[0])) {
      for (const chunk of gData[0]) {
        if (chunk && chunk[3] && typeof chunk[3] === 'string') {
          romanizedBlock = chunk[3];
          break;
        }
      }
    }

    // Capitalize first letter of each sentence/line for clean aesthetics
    const capitalize = (str) => {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    let romanizedLines = [];
    if (romanizedBlock) {
      romanizedLines = romanizedBlock
        .split('\n')
        .map(l => capitalize(l.trim()))
        .filter(l => l.length > 0);
    }

    // If romanized lines count differs, align or pad/slice
    if (romanizedLines.length !== lines.length && romanizedLines.length > 0) {
      if (romanizedLines.length > lines.length) {
        romanizedLines = romanizedLines.slice(0, lines.length);
      } else {
        while (romanizedLines.length < lines.length) {
          romanizedLines.push(lines[romanizedLines.length]);
        }
      }
    }

    // 2. Extract English meaning translation
    let translatedLines = [];
    if (Array.isArray(gData[0])) {
      let combinedTranslation = '';
      for (const chunk of gData[0]) {
        if (chunk && chunk[0] && typeof chunk[0] === 'string' && chunk[1]) {
          combinedTranslation += chunk[0];
        }
      }
      translatedLines = combinedTranslation
        .split('\n')
        .map(l => capitalize(l.trim()))
        .filter(l => l.length > 0);
    }

    if (translatedLines.length !== lines.length && translatedLines.length > 0) {
      if (translatedLines.length > lines.length) {
        translatedLines = translatedLines.slice(0, lines.length);
      } else {
        while (translatedLines.length < lines.length) {
          translatedLines.push(lines[translatedLines.length]);
        }
      }
    }

    const isNonLatin = /[^\u0000-\u007F]/.test(fullText);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800');
    res.end(JSON.stringify({
      success: true,
      detectedLang,
      languageName,
      isNonLatin,
      originalLines: lines,
      romanizedLines: romanizedLines.length === lines.length ? romanizedLines : (isNonLatin ? romanizedLines : lines),
      translatedLines: translatedLines.length === lines.length ? translatedLines : lines
    }));
  } catch (err) {
    console.error('Translation error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: 'Failed to translate lyrics' }));
  }
}
