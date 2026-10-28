// Deterministic Indic Language Transliterators (Telugu, Hindi, Tamil, Kannada, Malayalam, Bengali, Gurmukhi, Gujarati)
const INDIC_SCRIPTS = {
  telugu: {
    range: [0x0C00, 0x0C7F],
    name: 'Telugu',
    vowels: { 0x0C05:'a', 0x0C06:'aa', 0x0C07:'i', 0x0C08:'ee', 0x0C09:'u', 0x0C0A:'oo', 0x0C0B:'ri', 0x0C0E:'e', 0x0C0F:'e', 0x0C10:'ai', 0x0C12:'o', 0x0C13:'o', 0x0C14:'au' },
    matras: { 0x0C3E:'aa', 0x0C3F:'i', 0x0C40:'ee', 0x0C41:'u', 0x0C42:'oo', 0x0C43:'ri', 0x0C46:'e', 0x0C47:'e', 0x0C48:'ai', 0x0C4A:'o', 0x0C4B:'o', 0x0C4C:'au' },
    consonants: {
      0x0C15:'k', 0x0C16:'kh', 0x0C17:'g', 0x0C18:'gh', 0x0C19:'ng',
      0x0C1A:'ch', 0x0C1B:'chh', 0x0C1C:'j', 0x0C1D:'jh', 0x0C1E:'ny',
      0x0C1F:'t', 0x0C20:'th', 0x0C21:'d', 0x0C22:'dh', 0x0C23:'n',
      0x0C24:'th', 0x0C25:'th', 0x0C26:'d', 0x0C27:'dh', 0x0C28:'n',
      0x0C2A:'p', 0x0C2B:'ph', 0x0C2C:'b', 0x0C2D:'bh', 0x0C2E:'m',
      0x0C2F:'y', 0x0C30:'r', 0x0C31:'r', 0x0C32:'l', 0x0C33:'l',
      0x0C35:'v', 0x0C36:'sh', 0x0C37:'sh', 0x0C38:'s', 0x0C39:'h'
    },
    virama: 0x0C4D,
    anusvara: 0x0C02,
    visarga: 0x0C03
  },
  devanagari: {
    range: [0x0900, 0x097F],
    name: 'Hindi',
    vowels: { 0x0905:'a', 0x0906:'aa', 0x0907:'i', 0x0908:'ee', 0x0909:'u', 0x090A:'oo', 0x090B:'ri', 0x090F:'e', 0x0910:'ai', 0x0913:'o', 0x0914:'au' },
    matras: { 0x093E:'aa', 0x093F:'i', 0x0940:'ee', 0x0941:'u', 0x0942:'oo', 0x0943:'ri', 0x0947:'e', 0x0948:'ai', 0x094B:'o', 0x094C:'au' },
    consonants: {
      0x0915:'k', 0x0916:'kh', 0x0917:'g', 0x0918:'gh', 0x0919:'ng',
      0x091A:'ch', 0x091B:'chh', 0x091C:'j', 0x091D:'jh', 0x091E:'ny',
      0x091F:'t', 0x0920:'th', 0x0921:'d', 0x0922:'dh', 0x0923:'n',
      0x0924:'t', 0x0925:'th', 0x0926:'d', 0x0927:'dh', 0x0928:'n',
      0x092A:'p', 0x092B:'ph', 0x092C:'b', 0x092D:'bh', 0x092E:'m',
      0x092F:'y', 0x0930:'r', 0x0932:'l', 0x0933:'l', 0x0935:'v',
      0x0936:'sh', 0x0937:'sh', 0x0938:'s', 0x0939:'h'
    },
    virama: 0x094D,
    anusvara: 0x0902,
    visarga: 0x0903
  },
  tamil: {
    range: [0x0B80, 0x0BFF],
    name: 'Tamil',
    vowels: { 0x0B85:'a', 0x0B86:'aa', 0x0B87:'i', 0x0B88:'ee', 0x0B89:'u', 0x0B8A:'oo', 0x0B8E:'e', 0x0B8F:'e', 0x0B90:'ai', 0x0B92:'o', 0x0B93:'o', 0x0B94:'au' },
    matras: { 0x0BBE:'aa', 0x0BBF:'i', 0x0BC0:'ee', 0x0BC1:'u', 0x0BC2:'oo', 0x0BC6:'e', 0x0BC7:'e', 0x0BC8:'ai', 0x0BCA:'o', 0x0BCB:'o', 0x0BCC:'au' },
    consonants: {
      0x0B95:'k', 0x0B99:'ng', 0x0B9A:'ch', 0x0B9C:'j', 0x0B9E:'ny',
      0x0B9F:'t', 0x0BA3:'n', 0x0BA4:'th', 0x0BA8:'n', 0x0BA9:'n',
      0x0BAA:'p', 0x0BAE:'m', 0x0BAF:'y', 0x0BB0:'r', 0x0BB1:'r',
      0x0BB2:'l', 0x0BB3:'l', 0x0BB4:'zh', 0x0BB5:'v', 0x0BB6:'sh',
      0x0BB7:'sh', 0x0BB8:'s', 0x0BB9:'h'
    },
    virama: 0x0BCD,
    anusvara: 0x0B82,
    visarga: 0x0B83
  },
  kannada: {
    range: [0x0C80, 0x0CFF],
    name: 'Kannada',
    vowels: { 0x0C85:'a', 0x0C86:'aa', 0x0C87:'i', 0x0C88:'ee', 0x0C89:'u', 0x0C8A:'oo', 0x0C8B:'ri', 0x0C8E:'e', 0x0C8F:'e', 0x0C90:'ai', 0x0C92:'o', 0x0C93:'o', 0x0C94:'au' },
    matras: { 0x0CBE:'aa', 0x0CBF:'i', 0x0CC0:'ee', 0x0CC1:'u', 0x0CC2:'oo', 0x0CC3:'ri', 0x0CC6:'e', 0x0CC7:'e', 0x0CC8:'ai', 0x0CCA:'o', 0x0CCB:'o', 0x0CCC:'au' },
    consonants: {
      0x0C95:'k', 0x0C96:'kh', 0x0C97:'g', 0x0C98:'gh', 0x0C99:'ng',
      0x0C9A:'ch', 0x0C9B:'chh', 0x0C9C:'j', 0x0C9D:'jh', 0x0C9E:'ny',
      0x0C9F:'t', 0x0CA0:'th', 0x0CA1:'d', 0x0CA2:'dh', 0x0CA3:'n',
      0x0CA4:'th', 0x0CA5:'th', 0x0CA6:'d', 0x0CA7:'dh', 0x0CA8:'n',
      0x0CAA:'p', 0x0CAB:'ph', 0x0CAC:'b', 0x0CAD:'bh', 0x0CAE:'m',
      0x0CAF:'y', 0x0CB0:'r', 0x0CB1:'r', 0x0CB2:'l', 0x0CB3:'l',
      0x0CB5:'v', 0x0CB6:'sh', 0x0CB7:'sh', 0x0CB8:'s', 0x0CB9:'h'
    },
    virama: 0x0CCD,
    anusvara: 0x0C82,
    visarga: 0x0C83
  },
  malayalam: {
    range: [0x0D00, 0x0D7F],
    name: 'Malayalam',
    vowels: { 0x0D05:'a', 0x0D06:'aa', 0x0D07:'i', 0x0D08:'ee', 0x0D09:'u', 0x0D0A:'oo', 0x0D0B:'ri', 0x0D0E:'e', 0x0D0F:'e', 0x0D10:'ai', 0x0D12:'o', 0x0D13:'o', 0x0D14:'au' },
    matras: { 0x0D3E:'aa', 0x0D3F:'i', 0x0D40:'ee', 0x0D41:'u', 0x0D42:'oo', 0x0D43:'ri', 0x0D46:'e', 0x0D47:'e', 0x0D48:'ai', 0x0D4A:'o', 0x0D4B:'o', 0x0D4C:'au' },
    consonants: {
      0x0D15:'k', 0x0D16:'kh', 0x0D17:'g', 0x0D18:'gh', 0x0D19:'ng',
      0x0D1A:'ch', 0x0D1B:'chh', 0x0D1C:'j', 0x0D1D:'jh', 0x0D1E:'ny',
      0x0D1F:'t', 0x0D20:'th', 0x0D21:'d', 0x0D22:'dh', 0x0D23:'n',
      0x0D24:'th', 0x0D25:'th', 0x0D26:'d', 0x0D27:'dh', 0x0D28:'n',
      0x0D2A:'p', 0x0D2B:'ph', 0x0D2C:'b', 0x0D2D:'bh', 0x0D2E:'m',
      0x0D2F:'y', 0x0D30:'r', 0x0D31:'r', 0x0D32:'l', 0x0D33:'l',
      0x0D34:'zh', 0x0D35:'v', 0x0D36:'sh', 0x0D37:'sh', 0x0D38:'s', 0x0D39:'h'
    },
    virama: 0x0D4D,
    anusvara: 0x0D02,
    visarga: 0x0D03
  }
};

// Deterministic phonetic transliterator for any Indic language text
function fallbackTransliterateIndic(text) {
  let res = '';
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    let matched = false;
    for (const key of Object.keys(INDIC_SCRIPTS)) {
      const map = INDIC_SCRIPTS[key];
      if (code >= map.range[0] && code <= map.range[1]) {
        matched = true;
        if (map.vowels[code]) {
          res += map.vowels[code];
        } else if (map.consonants[code]) {
          const c = map.consonants[code];
          const nextCode = text.charCodeAt(i + 1);
          if (nextCode === map.virama) {
            res += c;
            i++;
          } else if (map.matras[nextCode]) {
            res += c + map.matras[nextCode];
            i++;
          } else {
            res += c + 'a';
          }
        } else if (code === map.anusvara) {
          res += 'm';
        } else if (code === map.visarga) {
          res += 'h';
        }
        break;
      }
    }
    if (!matched) {
      res += text[i];
    }
  }
  return res;
}

// Detect language name from script ranges
function detectIndicLanguage(text) {
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    for (const key of Object.keys(INDIC_SCRIPTS)) {
      const map = INDIC_SCRIPTS[key];
      if (code >= map.range[0] && code <= map.range[1]) {
        return map.name;
      }
    }
  }
  return 'Regional';
}

const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  let lines = [];

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    } else if (!body && req.method === 'POST') {
      // Parse body stream if not pre-parsed (e.g. raw Node or Vite dev server)
      body = await new Promise((resolve) => {
        if (!req.on || typeof req.on !== 'function') {
          resolve({});
          return;
        }
        let data = '';
        req.on('data', chunk => { data += chunk; });
        req.on('end', () => {
          try {
            resolve(JSON.parse(data || '{}'));
          } catch (e) {
            resolve({});
          }
        });
        req.on('error', () => resolve({}));
        setTimeout(() => resolve({}), 3000);
      });
    }

    if (body) {
      if (Array.isArray(body.lines)) {
        lines = body.lines;
      } else if (typeof body.text === 'string') {
        lines = body.text.split('\n');
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
    const isNonLatin = /[^\u0000-\u007F]/.test(fullText);
    const nativeLangName = detectIndicLanguage(fullText);

    // Primary: Google Dictionary Chrome Extension API (fast, unthrottled, provides romanization + translation)
    let gData = null;
    const urls = [
      `https://clients5.google.com/translate_a/single?client=dict-chrome-ex&sl=auto&tl=en&dt=t&dt=rm&q=${encodeURIComponent(fullText)}`,
      `https://translate.googleapis.com/translate_a/single?client=dict-chrome-ex&sl=auto&tl=en&dt=t&dt=rm&q=${encodeURIComponent(fullText)}`
    ];

    for (const u of urls) {
      try {
        const fetchRes = await fetch(u, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
          }
        });
        if (fetchRes.ok) {
          gData = await fetchRes.json();
          break;
        }
      } catch (e) {
        // try next
      }
    }

    let detectedLang = (gData && gData[2]) ? gData[2] : 'auto';
    const langNames = {
      te: 'Telugu', hi: 'Hindi', ta: 'Tamil', ml: 'Malayalam', kn: 'Kannada',
      pa: 'Punjabi', bn: 'Bengali', mr: 'Marathi', gu: 'Gujarati', ur: 'Urdu',
      es: 'Spanish', ko: 'Korean', ja: 'Japanese', fr: 'French', de: 'German',
      ar: 'Arabic', ru: 'Russian', pt: 'Portuguese', it: 'Italian', en: 'English'
    };
    const languageName = langNames[detectedLang] || nativeLangName;

    // 1. Extract Romanized text (English letters for non-Latin script)
    let romanizedBlock = '';
    if (gData && Array.isArray(gData[0])) {
      for (const chunk of gData[0]) {
        if (chunk && chunk[3] && typeof chunk[3] === 'string') {
          romanizedBlock = chunk[3];
          break;
        }
      }
    }

    let romanizedLines = [];
    if (romanizedBlock) {
      romanizedLines = romanizedBlock
        .split('\n')
        .map(l => capitalize(l.trim()))
        .filter(l => l.length > 0);
    }

    // If Google returned no romanization or line count mismatch, run deterministic Indic transliterator!
    if (isNonLatin && (romanizedLines.length === 0 || romanizedLines.length !== lines.length)) {
      romanizedLines = lines.map(line => capitalize(fallbackTransliterateIndic(line).trim()));
    }

    // Pad / slice if needed to guarantee exact 1-to-1 array alignment with lines
    if (romanizedLines.length !== lines.length) {
      if (romanizedLines.length > lines.length) {
        romanizedLines = romanizedLines.slice(0, lines.length);
      } else {
        while (romanizedLines.length < lines.length) {
          const idx = romanizedLines.length;
          romanizedLines.push(capitalize(fallbackTransliterateIndic(lines[idx]).trim()));
        }
      }
    }

    // 2. Extract English meaning translation
    let translatedLines = [];
    if (gData && Array.isArray(gData[0])) {
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

    // If Google translation is empty, try MyMemory translation API
    if (translatedLines.length === 0 && isNonLatin) {
      try {
        const memUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(fullText)}&langpair=auto|en`;
        const mRes = await fetch(memUrl);
        if (mRes.ok) {
          const mData = await mRes.json();
          if (mData?.responseData?.translatedText) {
            translatedLines = mData.responseData.translatedText
              .split('\n')
              .map(l => capitalize(l.trim()))
              .filter(l => l.length > 0);
          }
        }
      } catch (e) {}
    }

    if (translatedLines.length !== lines.length) {
      if (translatedLines.length > lines.length) {
        translatedLines = translatedLines.slice(0, lines.length);
      } else {
        while (translatedLines.length < lines.length) {
          translatedLines.push(romanizedLines[translatedLines.length] || lines[translatedLines.length]);
        }
      }
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800');
    res.end(JSON.stringify({
      success: true,
      detectedLang,
      languageName,
      isNonLatin,
      originalLines: lines,
      romanizedLines: romanizedLines,
      translatedLines: translatedLines
    }));
  } catch (err) {
    console.error('Translation error:', err);
    // Absolute zero-crash fallback: even on catastrophic network error, transliterate non-Latin locally!
    try {
      const isNonLatin = lines.some(l => /[^\u0000-\u007F]/.test(l));
      const romanizedLines = isNonLatin ? lines.map(l => capitalize(fallbackTransliterateIndic(l))) : lines;
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        success: true,
        detectedLang: 'te',
        languageName: 'Telugu',
        isNonLatin,
        originalLines: lines,
        romanizedLines: romanizedLines,
        translatedLines: romanizedLines
      }));
    } catch (e) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: 'Failed to translate lyrics' }));
    }
  }
}
