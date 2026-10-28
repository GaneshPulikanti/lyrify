// Deterministic Phonetic Transliteration Engine for Indic Scripts
// Supports Telugu, Hindi/Devanagari, Tamil, Kannada, Malayalam, Bengali, Gurmukhi (Punjabi), Gujarati

export const INDIC_SCRIPTS = {
  telugu: {
    range: [0x0C00, 0x0C7F],
    name: 'Telugu',
    vowels: {
      0x0C05: 'a', 0x0C06: 'aa', 0x0C07: 'i', 0x0C08: 'ee', 0x0C09: 'u', 0x0C0A: 'oo',
      0x0C0B: 'ri', 0x0C0E: 'e', 0x0C0F: 'e', 0x0C10: 'ai', 0x0C12: 'o', 0x0C13: 'o', 0x0C14: 'au'
    },
    matras: {
      0x0C3E: 'aa', 0x0C3F: 'i', 0x0C40: 'ee', 0x0C41: 'u', 0x0C42: 'oo', 0x0C43: 'ri',
      0x0C46: 'e', 0x0C47: 'e', 0x0C48: 'ai', 0x0C4A: 'o', 0x0C4B: 'o', 0x0C4C: 'au'
    },
    consonants: {
      0x0C15: 'k', 0x0C16: 'kh', 0x0C17: 'g', 0x0C18: 'gh', 0x0C19: 'ng',
      0x0C1A: 'ch', 0x0C1B: 'chh', 0x0C1C: 'j', 0x0C1D: 'jh', 0x0C1E: 'ny',
      0x0C1F: 't', 0x0C20: 'th', 0x0C21: 'd', 0x0C22: 'dh', 0x0C23: 'n',
      0x0C24: 't', 0x0C25: 'th', 0x0C26: 'd', 0x0C27: 'dh', 0x0C28: 'n',
      0x0C2A: 'p', 0x0C2B: 'ph', 0x0C2C: 'b', 0x0C2D: 'bh', 0x0C2E: 'm',
      0x0C2F: 'y', 0x0C30: 'r', 0x0C31: 'r', 0x0C32: 'l', 0x0C33: 'l',
      0x0C35: 'v', 0x0C36: 'sh', 0x0C37: 'sh', 0x0C38: 's', 0x0C39: 'h'
    },
    virama: 0x0C4D,
    anusvara: 0x0C02,
    visarga: 0x0C03
  },
  devanagari: {
    range: [0x0900, 0x097F],
    name: 'Hindi',
    vowels: {
      0x0905: 'a', 0x0906: 'aa', 0x0907: 'i', 0x0908: 'ee', 0x0909: 'u', 0x090A: 'oo',
      0x090B: 'ri', 0x090E: 'e', 0x090F: 'e', 0x0910: 'ai', 0x0911: 'o', 0x0912: 'o', 0x0913: 'o', 0x0914: 'au'
    },
    matras: {
      0x093E: 'aa', 0x093F: 'i', 0x0940: 'ee', 0x0941: 'u', 0x0942: 'oo', 0x0943: 'ri',
      0x0947: 'e', 0x0948: 'ai', 0x0949: 'o', 0x094A: 'o', 0x094B: 'o', 0x094C: 'au'
    },
    consonants: {
      0x0915: 'k', 0x0916: 'kh', 0x0917: 'g', 0x0918: 'gh', 0x0919: 'ng',
      0x091A: 'ch', 0x091B: 'chh', 0x091C: 'j', 0x091D: 'jh', 0x091E: 'ny',
      0x091F: 't', 0x0920: 'th', 0x0921: 'd', 0x0922: 'dh', 0x0923: 'n',
      0x0924: 't', 0x0925: 'th', 0x0926: 'd', 0x0927: 'dh', 0x0928: 'n',
      0x092A: 'p', 0x092B: 'ph', 0x092C: 'b', 0x092D: 'bh', 0x092E: 'm',
      0x092F: 'y', 0x0930: 'r', 0x0932: 'l', 0x0933: 'l', 0x0935: 'v',
      0x0936: 'sh', 0x0937: 'sh', 0x0938: 's', 0x0939: 'h'
    },
    virama: 0x094D,
    anusvara: 0x0902,
    visarga: 0x0903
  },
  tamil: {
    range: [0x0B80, 0x0BFF],
    name: 'Tamil',
    vowels: {
      0x0B85: 'a', 0x0B86: 'aa', 0x0B87: 'i', 0x0B88: 'ee', 0x0B89: 'u', 0x0B8A: 'oo',
      0x0B8E: 'e', 0x0B8F: 'e', 0x0B90: 'ai', 0x0B92: 'o', 0x0B93: 'o', 0x0B94: 'au'
    },
    matras: {
      0x0BBE: 'aa', 0x0BBF: 'i', 0x0BC0: 'ee', 0x0BC1: 'u', 0x0BC2: 'oo',
      0x0BC6: 'e', 0x0BC7: 'e', 0x0BC8: 'ai', 0x0BCA: 'o', 0x0BCB: 'o', 0x0BCC: 'au'
    },
    consonants: {
      0x0B95: 'k', 0x0B99: 'ng', 0x0B9A: 'ch', 0x0B9C: 'j', 0x0B9E: 'ny',
      0x0B9F: 't', 0x0BA3: 'n', 0x0BA4: 'th', 0x0BA8: 'n', 0x0BA9: 'n',
      0x0BAA: 'p', 0x0BAE: 'm', 0x0BAF: 'y', 0x0BB0: 'r', 0x0BB1: 'r',
      0x0BB2: 'l', 0x0BB3: 'l', 0x0BB4: 'zh', 0x0BB5: 'v', 0x0BB6: 'sh',
      0x0BB7: 'sh', 0x0BB8: 's', 0x0BB9: 'h'
    },
    virama: 0x0BCD,
    anusvara: 0x0B82,
    visarga: 0x0B83
  },
  kannada: {
    range: [0x0C80, 0x0CFF],
    name: 'Kannada',
    vowels: {
      0x0C85: 'a', 0x0C86: 'aa', 0x0C87: 'i', 0x0C88: 'ee', 0x0C89: 'u', 0x0C8A: 'oo',
      0x0C8B: 'ri', 0x0C8E: 'e', 0x0C8F: 'e', 0x0C90: 'ai', 0x0C92: 'o', 0x0C93: 'o', 0x0C94: 'au'
    },
    matras: {
      0x0CBE: 'aa', 0x0CBF: 'i', 0x0CC0: 'ee', 0x0CC1: 'u', 0x0CC2: 'oo', 0x0CC3: 'ri',
      0x0CC6: 'e', 0x0CC7: 'e', 0x0CC8: 'ai', 0x0CCA: 'o', 0x0CCB: 'o', 0x0CCC: 'au'
    },
    consonants: {
      0x0C95: 'k', 0x0C96: 'kh', 0x0C97: 'g', 0x0C98: 'gh', 0x0C99: 'ng',
      0x0C9A: 'ch', 0x0C9B: 'chh', 0x0C9C: 'j', 0x0C9D: 'jh', 0x0C9E: 'ny',
      0x0C9F: 't', 0x0CA0: 'th', 0x0CA1: 'd', 0x0CA2: 'dh', 0x0CA3: 'n',
      0x0CA4: 'th', 0x0CA5: 'th', 0x0CA6: 'd', 0x0CA7: 'dh', 0x0CA8: 'n',
      0x0CAA: 'p', 0x0CAB: 'ph', 0x0CAC: 'b', 0x0CAD: 'bh', 0x0CAE: 'm',
      0x0CAF: 'y', 0x0CB0: 'r', 0x0CB1: 'r', 0x0CB2: 'l', 0x0CB3: 'l',
      0x0CB5: 'v', 0x0CB6: 'sh', 0x0CB7: 'sh', 0x0CB8: 's', 0x0CB9: 'h'
    },
    virama: 0x0CCD,
    anusvara: 0x0C82,
    visarga: 0x0C83
  },
  malayalam: {
    range: [0x0D00, 0x0D7F],
    name: 'Malayalam',
    vowels: {
      0x0D05: 'a', 0x0D06: 'aa', 0x0D07: 'i', 0x0D08: 'ee', 0x0D09: 'u', 0x0D0A: 'oo',
      0x0D0B: 'ri', 0x0D0E: 'e', 0x0D0F: 'e', 0x0D10: 'ai', 0x0D12: 'o', 0x0D13: 'o', 0x0D14: 'au'
    },
    matras: {
      0x0D3E: 'aa', 0x0D3F: 'i', 0x0D40: 'ee', 0x0D41: 'u', 0x0D42: 'oo', 0x0D43: 'ri',
      0x0D46: 'e', 0x0D47: 'e', 0x0D48: 'ai', 0x0D4A: 'o', 0x0D4B: 'o', 0x0D4C: 'au'
    },
    consonants: {
      0x0D15: 'k', 0x0D16: 'kh', 0x0D17: 'g', 0x0D18: 'gh', 0x0D19: 'ng',
      0x0D1A: 'ch', 0x0D1B: 'chh', 0x0D1C: 'j', 0x0D1D: 'jh', 0x0D1E: 'ny',
      0x0D1F: 't', 0x0D20: 'th', 0x0D21: 'd', 0x0D22: 'dh', 0x0D23: 'n',
      0x0D24: 'th', 0x0D25: 'th', 0x0D26: 'd', 0x0D27: 'dh', 0x0D28: 'n',
      0x0D2A: 'p', 0x0D2B: 'ph', 0x0D2C: 'b', 0x0D2D: 'bh', 0x0D2E: 'm',
      0x0D2F: 'y', 0x0D30: 'r', 0x0D31: 'r', 0x0D32: 'l', 0x0D33: 'l',
      0x0D34: 'zh', 0x0D35: 'v', 0x0D36: 'sh', 0x0D37: 'sh', 0x0D38: 's', 0x0D39: 'h'
    },
    virama: 0x0D4D,
    anusvara: 0x0D02,
    visarga: 0x0D03
  },
  bengali: {
    range: [0x0980, 0x09FF],
    name: 'Bengali',
    vowels: {
      0x0985: 'a', 0x0986: 'aa', 0x0987: 'i', 0x0988: 'ee', 0x0989: 'u', 0x098A: 'oo',
      0x098B: 'ri', 0x098F: 'e', 0x0990: 'ai', 0x0993: 'o', 0x0994: 'au'
    },
    matras: {
      0x09BE: 'aa', 0x09BF: 'i', 0x09C0: 'ee', 0x09C1: 'u', 0x09C2: 'oo', 0x09C3: 'ri',
      0x09C7: 'e', 0x09C8: 'ai', 0x09CB: 'o', 0x09CC: 'au'
    },
    consonants: {
      0x0995: 'k', 0x0996: 'kh', 0x0997: 'g', 0x0998: 'gh', 0x0999: 'ng',
      0x099A: 'ch', 0x099B: 'chh', 0x099C: 'j', 0x099D: 'jh', 0x099E: 'ny',
      0x099F: 't', 0x09A0: 'th', 0x09A1: 'd', 0x09A2: 'dh', 0x09A3: 'n',
      0x09A4: 't', 0x09A5: 'th', 0x09A6: 'd', 0x09A7: 'dh', 0x09A8: 'n',
      0x09AA: 'p', 0x09AB: 'ph', 0x09AC: 'b', 0x09AD: 'bh', 0x09AE: 'm',
      0x09AF: 'y', 0x09B0: 'r', 0x09B2: 'l', 0x09B6: 'sh', 0x09B7: 'sh',
      0x09B8: 's', 0x09B9: 'h'
    },
    virama: 0x09CD,
    anusvara: 0x0982,
    visarga: 0x0983
  },
  gurmukhi: {
    range: [0x0A00, 0x0A7F],
    name: 'Punjabi',
    vowels: {
      0x0A05: 'a', 0x0A06: 'aa', 0x0A07: 'i', 0x0A08: 'ee', 0x0A09: 'u', 0x0A0A: 'oo',
      0x0A0F: 'e', 0x0A10: 'ai', 0x0A13: 'o', 0x0A14: 'au'
    },
    matras: {
      0x0A3E: 'aa', 0x0A3F: 'i', 0x0A40: 'ee', 0x0A41: 'u', 0x0A42: 'oo',
      0x0A47: 'e', 0x0A48: 'ai', 0x0A4B: 'o', 0x0A4C: 'au'
    },
    consonants: {
      0x0A15: 'k', 0x0A16: 'kh', 0x0A17: 'g', 0x0A18: 'gh', 0x0A19: 'ng',
      0x0A1A: 'ch', 0x0A1B: 'chh', 0x0A1C: 'j', 0x0A1D: 'jh', 0x0A1E: 'ny',
      0x0A1F: 't', 0x0A20: 'th', 0x0A21: 'd', 0x0A22: 'dh', 0x0A23: 'n',
      0x0A24: 't', 0x0A25: 'th', 0x0A26: 'd', 0x0A27: 'dh', 0x0A28: 'n',
      0x0A2A: 'p', 0x0A2B: 'ph', 0x0A2C: 'b', 0x0A2D: 'bh', 0x0A2E: 'm',
      0x0A2F: 'y', 0x0A30: 'r', 0x0A32: 'l', 0x0A35: 'v', 0x0A36: 'sh',
      0x0A38: 's', 0x0A39: 'h'
    },
    virama: 0x0A4D,
    anusvara: 0x0A02,
    visarga: 0x0A03
  },
  gujarati: {
    range: [0x0A80, 0x0AFF],
    name: 'Gujarati',
    vowels: {
      0x0A85: 'a', 0x0A86: 'aa', 0x0A87: 'i', 0x0A88: 'ee', 0x0A89: 'u', 0x0A8A: 'oo',
      0x0A8B: 'ri', 0x0A8F: 'e', 0x0A90: 'ai', 0x0A93: 'o', 0x0A94: 'au'
    },
    matras: {
      0x0ABE: 'aa', 0x0ABF: 'i', 0x0AC0: 'ee', 0x0AC1: 'u', 0x0AC2: 'oo', 0x0AC3: 'ri',
      0x0AC7: 'e', 0x0AC8: 'ai', 0x0ACB: 'o', 0x0ACC: 'au'
    },
    consonants: {
      0x0A95: 'k', 0x0A96: 'kh', 0x0A97: 'g', 0x0A98: 'gh', 0x0A99: 'ng',
      0x0A9A: 'ch', 0x0A9B: 'chh', 0x0A9C: 'j', 0x0A9D: 'jh', 0x0A9E: 'ny',
      0x0A9F: 't', 0x0AA0: 'th', 0x0AA1: 'd', 0x0AA2: 'dh', 0x0AA3: 'n',
      0x0AA4: 't', 0x0AA5: 'th', 0x0AA6: 'd', 0x0AA7: 'dh', 0x0AA8: 'n',
      0x0AAA: 'p', 0x0AAB: 'ph', 0x0AAC: 'b', 0x0AAD: 'bh', 0x0AAE: 'm',
      0x0AAF: 'y', 0x0AB0: 'r', 0x0AB2: 'l', 0x0AB5: 'v', 0x0AB6: 'sh',
      0x0AB7: 'sh', 0x0AB8: 's', 0x0AB9: 'h'
    },
    virama: 0x0ACD,
    anusvara: 0x0A82,
    visarga: 0x0A83
  }
};

export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Transliterate a single line or full text of any Indic language to English letters
export function transliterateIndic(text) {
  if (!text) return '';
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
          // Contextual nasal: 'n' before dentals, 'm' elsewhere
          const nextCode = text.charCodeAt(i + 1);
          const nextC = map.consonants[nextCode];
          if (nextC && ['t', 'th', 'd', 'dh', 's'].includes(nextC)) {
            res += 'n';
          } else {
            res += 'm';
          }
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

  // Clean double spaces or awkward spacing
  return res.replace(/\s+/g, ' ');
}

// Detect language name from script ranges
export function detectIndicLanguage(text) {
  if (!text) return 'English';
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

// Check if string contains any non-ASCII characters
export function hasNonLatinScript(text) {
  if (!text) return false;
  return /[^\u0000-\u007F]/.test(text);
}
