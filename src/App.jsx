import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, Download, Copy, Sparkles, Check, Star,
  Search, Sliders, Music, Layout, Image as ImageIcon,
  Type, AlignLeft, AlignCenter, RefreshCw, X, Plus, Layers,
  Eye, Edit3, Palette, Pipette, Languages, Loader2, Globe
} from 'lucide-react';
import { toPng, toBlob, toCanvas } from 'html-to-image';
import confetti from 'canvas-confetti';
import { PRESET_SONGS } from './presets.js';

// Curated 16 Aesthetic Color Palette Presets
const COLOR_PRESETS = [
  { id: 'dynamic', label: 'Album Match', bg: 'dynamic' },
  { id: '#1db954', label: 'Spotify', bg: '#1db954' },
  { id: '#8b5cf6', label: 'Violet', bg: '#8b5cf6' },
  { id: '#f43f5e', label: 'Rose Pink', bg: '#f43f5e' },
  { id: '#0284c7', label: 'Ocean Blue', bg: '#0284c7' },
  { id: '#ea580c', label: 'Sunset Red', bg: '#ea580c' },
  { id: '#eab308', label: 'Cyber Gold', bg: '#eab308' },
  { id: '#312e81', label: 'Midnight', bg: '#312e81' },
  { id: '#06b6d4', label: 'Cyan', bg: '#06b6d4' },
  { id: '#10b981', label: 'Emerald', bg: '#10b981' },
  { id: '#701a75', label: 'Plum Wine', bg: '#701a75' },
  { id: '#451a03', label: 'Warm Amber', bg: '#451a03' },
  { id: '#3e2723', label: 'Mocha', bg: '#3e2723' },
  { id: '#000000', label: 'Pitch OLED', bg: '#000000' },
  { id: '#18181b', label: 'Charcoal', bg: '#18181b' },
  { id: '#ffffff', label: 'Pure White', bg: '#ffffff' }
];

export default function App() {
  // --- Song & Lyrics State ---
  const [currentSong, setCurrentSong] = useState(PRESET_SONGS[0]);
  const [lyrics, setLyrics] = useState(PRESET_SONGS[0].lyrics);
  const [selectedIndices, setSelectedIndices] = useState(PRESET_SONGS[0].selectedIndices);
  const [highlightIndex, setHighlightIndex] = useState(PRESET_SONGS[0].highlightIndex);

  // --- Multi-Language & Translation Script State ---
  const [lyricsScripts, setLyricsScripts] = useState({
    original: PRESET_SONGS[0].lyrics,
    romanized: PRESET_SONGS[0].lyrics,
    translated: []
  });
  const [activeScript, setActiveScript] = useState('romanized'); // 'romanized' | 'original' | 'translated'
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [isNonLatinScript, setIsNonLatinScript] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);

  // --- Search & Input State ---
  const [spotifyUrlInput, setSpotifyUrlInput] = useState('');
  const [isLoadingSong, setIsLoadingSong] = useState(false);

  // --- Active Tab State ('lyrics' | 'style' | 'details') ---
  const [activeTab, setActiveTab] = useState('lyrics');
  const [mobileTab, setMobileTab] = useState('preview'); // 'preview' | 'editor' (mobile screen toggle)

  // --- Card Customization State ---
  // Default format is 'sticker' (Transparent Card cropped tightly up to cover with 100% transparent corners)
  const [format, setFormat] = useState('sticker'); // 'sticker' | 'story' | 'square' | 'portrait'
  const [selectedColor, setSelectedColor] = useState('dynamic'); // 'dynamic' | '#1db954' | hex string | 'custom'
  const [customColor, setCustomColor] = useState('#8b5cf6');
  const [colorStyle, setColorStyle] = useState('gradient'); // 'gradient' | 'solid' | 'glass'
  const [albumColor, setAlbumColor] = useState(PRESET_SONGS[0].spotifyColor || 'rgb(29, 185, 84)');
  const [borderRadius, setBorderRadius] = useState(32);
  const [bgStyle, setBgStyle] = useState('album-blur'); // 'album-blur' | 'mesh' | 'minimal' | 'vinyl'
  const [fontFamily, setFontFamily] = useState('Plus Jakarta Sans');
  const [fontSize, setFontSize] = useState(24);
  const [textAlign, setTextAlign] = useState('left');
  const [exportQuality, setExportQuality] = useState(4); // 4 = Ultra HD 4K (1640px+), 3 = Full HD 1080p+ (1230px+)

  // --- Details & Toggles State ---
  const [coverStyle, setCoverStyle] = useState('rounded'); // 'rounded' | 'vinyl' | 'circle' | 'none'
  const [showBarcode, setShowBarcode] = useState(true);
  const [showBadge, setShowBadge] = useState(true);
  const [showProgress, setShowProgress] = useState(true);
  const [showShadow, setShowShadow] = useState(true);
  const [showArtist, setShowArtist] = useState(true);
  const [cardPadding, setCardPadding] = useState(32);

  // --- Stage Simulator & Export State ---
  const [simBackdrop, setSimBackdrop] = useState('checkerboard'); // 'checkerboard' | 'dark' | 'photo' | 'light' | 'custom'
  const [customBackdropColor, setCustomBackdropColor] = useState('#4f46e5');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(42);
  const [toasts, setToasts] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  // --- Custom Lyrics Modal State ---
  const [isCustomLyricsOpen, setIsCustomLyricsOpen] = useState(false);
  const [customLyricsText, setCustomLyricsText] = useState('');

  // Refs
  const exportFrameRef = useRef(null);
  const lyricsCardRef = useRef(null);
  const audioRef = useRef(null);

  // Show Toast Helper
  const showToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  // Resolve translations & Romanized script (Spotify English letters)
  const resolveLyricsTranslations = async (lines, autoSwitchToRomanized = true) => {
    if (!Array.isArray(lines) || lines.length === 0) return;

    const fullText = lines.join('\n');
    const hasNonLatin = /[^\u0000-\u007F]/.test(fullText);

    if (!hasNonLatin) {
      setIsNonLatinScript(false);
      setDetectedLanguage('English');
      setLyricsScripts({
        original: lines,
        romanized: lines,
        translated: []
      });
      setActiveScript('original');
      setLyrics(lines);
      return;
    }

    setIsNonLatinScript(true);
    setIsTranslating(true);

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          const original = data.originalLines || lines;
          const romanized = (data.romanizedLines && data.romanizedLines.length > 0) ? data.romanizedLines : original;
          const translated = (data.translatedLines && data.translatedLines.length > 0) ? data.translatedLines : [];

          setLyricsScripts({ original, romanized, translated });
          setDetectedLanguage(data.languageName || 'Regional');

          if (autoSwitchToRomanized && romanized.length > 0) {
            setActiveScript('romanized');
            setLyrics(romanized);
            showToast(`✨ Detected ${data.languageName}! Switched to Spotify English letters.`);
          } else {
            setActiveScript('original');
            setLyrics(original);
          }
          return;
        }
      }
    } catch (err) {
      console.warn('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }

    // Fallback if translation fails
    setLyricsScripts({ original: lines, romanized: lines, translated: [] });
    setActiveScript('original');
    setLyrics(lines);
  };

  // Switch active lyrics script
  const handleSwitchScript = (scriptKey) => {
    setActiveScript(scriptKey);
    let targetLines = lyricsScripts[scriptKey];
    if (!targetLines || targetLines.length === 0) {
      targetLines = lyricsScripts.original || lyrics;
    }
    setLyrics(targetLines);
    const labelMap = {
      romanized: 'English Letters (Spotify)',
      original: `${detectedLanguage || 'Native'} Script`,
      translated: 'English Meaning'
    };
    showToast(`🔤 Switched lyrics to ${labelMap[scriptKey] || scriptKey}`);
  };

  // Run on initial load to resolve default song scripts
  useEffect(() => {
    resolveLyricsTranslations(PRESET_SONGS[0].lyrics, true);
  }, []);

  // Change active song to preset
  const handleSelectPreset = (preset) => {
    setCurrentSong(preset);
    setSelectedIndices(preset.selectedIndices);
    setHighlightIndex(preset.highlightIndex);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
    showToast(`Loaded "${preset.title}" by ${preset.artist}`);
    resolveLyricsTranslations(preset.lyrics, true);
  };

  // Fetch song details from Spotify URL & Lyrics
  const handleFetchSong = async (e) => {
    if (e) e.preventDefault();
    const query = spotifyUrlInput.trim();
    if (!query) {
      showToast('⚠️ Please paste a valid Spotify track link or song title');
      return;
    }

    setIsLoadingSong(true);
    try {
      // 1. Fetch Spotify Track info via our server endpoint
      const spotifyRes = await fetch(`/api/spotify?url=${encodeURIComponent(query)}`);
      const spotifyData = await spotifyRes.json();

      if (!spotifyRes.ok || !spotifyData.success) {
        throw new Error(spotifyData.error || 'Could not extract Spotify track details.');
      }

      // 2. Fetch lyrics from multi-tier lyrics endpoint
      let fetchedLyrics = [];
      try {
        const lyricsRes = await fetch(`/api/lyrics?track=${encodeURIComponent(spotifyData.title)}&artist=${encodeURIComponent(spotifyData.artist)}`);
        if (lyricsRes.ok) {
          const lrcData = await lyricsRes.json();
          if (lrcData.results && Array.isArray(lrcData.results)) {
            // Find the first candidate that contains lyrics
            for (const item of lrcData.results) {
              if (item.plainLyrics && item.plainLyrics.trim()) {
                fetchedLyrics = item.plainLyrics
                  .split('\n')
                  .map((l) => l.trim())
                  .filter((l) => l.length > 0 && !l.startsWith('---') && !l.toLowerCase().includes('lyrics by'));
                if (fetchedLyrics.length > 0) break;
              } else if (item.syncedLyrics && item.syncedLyrics.trim()) {
                // Strip timestamps like [00:12.34] or [01:23.456]
                fetchedLyrics = item.syncedLyrics
                  .split('\n')
                  .map((l) => l.replace(/\[\d+:\d+(?:\.\d+)?\]/g, '').trim())
                  .filter((l) => l.length > 0);
                if (fetchedLyrics.length > 0) break;
              }
            }
          }
        }
      } catch (err) {
        console.warn('Lyrics fetch warning:', err);
      }

      if (fetchedLyrics.length === 0) {
        fetchedLyrics = [
          `Listening to ${spotifyData.title}`,
          `By ${spotifyData.artist}`,
          'Add your favorite lyrics lines anytime!',
          'Tap + Custom Line in the editor to write or paste.'
        ];
        showToast('ℹ️ Song extracted! You can edit or add lyrics in the Lyrics tab.');
      } else {
        showToast(`✨ Extracted "${spotifyData.title}" and lyrics!`);
      }

      const newSong = {
        id: spotifyData.id,
        title: spotifyData.title,
        artist: spotifyData.artist,
        album: spotifyData.album || 'Single',
        coverArt: spotifyData.coverArt || PRESET_SONGS[0].coverArt,
        spotifyColor: spotifyData.spotifyColor || 'rgb(35, 40, 50)',
        previewUrl: spotifyData.previewUrl || '',
        durationMs: spotifyData.durationMs || 180000,
        lyrics: fetchedLyrics,
        selectedIndices: fetchedLyrics.length >= 4 ? [0, 1, 2, 3] : [0],
        highlightIndex: fetchedLyrics.length >= 2 ? 1 : 0
      };

      setCurrentSong(newSong);
      setSelectedIndices(newSong.selectedIndices);
      setHighlightIndex(newSong.highlightIndex);
      setSpotifyUrlInput('');

      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlayingAudio(false);
      }

      // Automatically translate / Romanize non-Latin songs to Spotify English letters
      resolveLyricsTranslations(fetchedLyrics, true);
    } catch (err) {
      console.error(err);
      showToast(`❌ Error: ${err.message || 'Failed to fetch song'}`);
    } finally {
      setIsLoadingSong(false);
    }
  };

  // Toggle Lyric line selection
  const handleToggleLine = (index) => {
    if (selectedIndices.includes(index)) {
      const next = selectedIndices.filter((i) => i !== index);
      setSelectedIndices(next);
      if (highlightIndex === index) {
        setHighlightIndex(next.length > 0 ? next[0] : null);
      }
    } else {
      const next = [...selectedIndices, index].sort((a, b) => a - b);
      setSelectedIndices(next);
      if (highlightIndex === null) {
        setHighlightIndex(index);
      }
    }
  };

  // Set highlight / punchline
  const handleSetHighlight = (index, e) => {
    e.stopPropagation();
    if (!selectedIndices.includes(index)) {
      handleToggleLine(index);
    }
    setHighlightIndex(highlightIndex === index ? null : index);
  };

  // Quick Selectors
  const handleSelectAll = () => {
    setSelectedIndices(lyrics.map((_, i) => i));
  };

  const handleSelectChorus = () => {
    const start = Math.min(3, Math.max(0, lyrics.length - 4));
    const count = Math.min(5, lyrics.length);
    const chorus = [];
    for (let i = start; i < start + count; i++) {
      chorus.push(i);
    }
    setSelectedIndices(chorus);
    setHighlightIndex(chorus[Math.floor(chorus.length / 2)] || chorus[0]);
  };

  const handleClearSelection = () => {
    setSelectedIndices([]);
    setHighlightIndex(null);
  };

  // Custom lyrics save
  const handleSaveCustomLyrics = () => {
    if (!customLyricsText.trim()) return;
    const lines = customLyricsText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (lines.length > 0) {
      setSelectedIndices(lines.map((_, i) => i).slice(0, 5));
      setHighlightIndex(0);
      setIsCustomLyricsOpen(false);
      setCustomLyricsText('');
      showToast('✍️ Custom lyrics applied to card!');
      resolveLyricsTranslations(lines, true);
    }
  };

  // Audio preview playback
  const handleToggleAudio = () => {
    if (!audioRef.current) return;
    if (!currentSong.previewUrl) {
      showToast('ℹ️ No Spotify preview audio track available for this song');
      return;
    }
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.src = currentSong.previewUrl;
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch((e) => {
        showToast('Playback not allowed or preview unavailable');
      });
    }
  };

  // Pure 2D Canvas Round-Rect Clipping: guarantees 100% mathematical alpha = 0 outside rounded corners
  // AND directly paints the live album artwork onto the canvas to eliminate any Safari/WebKit <foreignObject> bugs
  const getRenderedCanvas = async (isSticker) => {
    const targetNode = isSticker ? lyricsCardRef.current : exportFrameRef.current;
    if (!targetNode) return null;

    // Helper: Paint the decoded DOM album cover image directly onto the output canvas
    // This bypasses any Safari/WebKit foreignObject rendering glitches with 100% reliability
    const paintDirectCover = (destCtx, destCanvas, node) => {
      try {
        const coverImg = node.querySelector('.card-cover-wrapper img');
        if (coverImg && (coverImg.complete || coverImg.naturalWidth > 0)) {
          const targetRect = node.getBoundingClientRect();
          const coverRect = coverImg.getBoundingClientRect();
          if (targetRect.width > 0 && targetRect.height > 0) {
            const scaleX = destCanvas.width / targetRect.width;
            const scaleY = destCanvas.height / targetRect.height;
            const dx = (coverRect.left - targetRect.left) * scaleX;
            const dy = (coverRect.top - targetRect.top) * scaleY;
            const dw = coverRect.width * scaleX;
            const dh = coverRect.height * scaleY;

            destCtx.save();
            const r = (coverStyle === 'circle' || coverStyle === 'vinyl') 
              ? dw / 2 
              : 12 * (scaleX / 3 * 3);

            destCtx.beginPath();
            if (typeof destCtx.roundRect === 'function') {
              destCtx.roundRect(dx, dy, dw, dh, r);
            } else {
              destCtx.rect(dx, dy, dw, dh);
            }
            destCtx.clip();

            destCtx.drawImage(coverImg, dx, dy, dw, dh);

            if (coverStyle === 'vinyl') {
              const holeR = (7 / 58) * dw;
              destCtx.beginPath();
              destCtx.arc(dx + dw / 2, dy + dh / 2, holeR, 0, Math.PI * 2);
              destCtx.fillStyle = '#111111';
              destCtx.fill();
              destCtx.lineWidth = 2 * (scaleX / 3);
              destCtx.strokeStyle = '#444444';
              destCtx.stroke();
            }

            destCtx.restore();
          }
        }
      } catch (err) {
        console.warn('Direct cover paint notice:', err);
      }
    };

    const pixelRatio = exportQuality || 4;

    const sourceCanvas = await toCanvas(targetNode, {
      pixelRatio: pixelRatio,
      cacheBust: false,
      backgroundColor: isSticker ? null : '#000000',
      style: isSticker ? {
        margin: '0',
        boxShadow: 'none',
        transform: 'none'
      } : undefined
    });

    if (!isSticker) {
      const cleanCanvas = document.createElement('canvas');
      cleanCanvas.width = sourceCanvas.width;
      cleanCanvas.height = sourceCanvas.height;
      const ctx = cleanCanvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(sourceCanvas, 0, 0);
      paintDirectCover(ctx, cleanCanvas, targetNode);
      return cleanCanvas;
    }

    // Precise canvas round-rect clipping to eliminate any foreignObject anti-aliased white fringe:
    const width = sourceCanvas.width;
    const height = sourceCanvas.height;
    const cleanCanvas = document.createElement('canvas');
    cleanCanvas.width = width;
    cleanCanvas.height = height;
    const ctx = cleanCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Start with a 100% clean, clear transparent canvas
    ctx.clearRect(0, 0, width, height);

    // Precise corner radius in canvas pixels (scaled by pixelRatio)
    const scaledRadius = borderRadius * pixelRatio;

    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(0, 0, width, height, scaledRadius);
    } else {
      const r = Math.min(scaledRadius, width / 2, height / 2);
      ctx.moveTo(r, 0);
      ctx.lineTo(width - r, 0);
      ctx.quadraticCurveTo(width, 0, width, r);
      ctx.lineTo(width, height - r);
      ctx.quadraticCurveTo(width, height, width - r, height);
      ctx.lineTo(r, height);
      ctx.quadraticCurveTo(0, height, 0, height - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
    }
    ctx.clip();

    // Draw the card inside the clipped boundary
    ctx.drawImage(sourceCanvas, 0, 0);

    // Direct paint cover image over the card to guarantee it's drawn in every browser
    paintDirectCover(ctx, cleanCanvas, targetNode);

    return cleanCanvas;
  };

  // Monetag Direct Ad Link (Zone 12131596) - Active
  const MONETAG_DIRECT_LINK = 'https://uplcm.com/4/12131596';

  const triggerDirectAd = () => {
    try {
      const lastAd = parseInt(sessionStorage.getItem('lyrify_monetag_ad') || '0', 10);
      const now = Date.now();
      // Polite 45s cooldown between ad popups to protect UX and guarantee browser pop-up permissions
      if (now - lastAd > 45 * 1000) {
        sessionStorage.setItem('lyrify_monetag_ad', now.toString());
        // Synchronous call in direct user gesture to bypass iOS/Chrome popup blockers
        window.open(MONETAG_DIRECT_LINK, '_blank', 'noopener,noreferrer');
      }
    } catch (e) {
      console.debug('Monetag direct link suppressed:', e);
    }
  };

  // Export to Ultra High-Res PNG (Guarantees transparent background outside rounded corners in sticker mode!)
  const handleExportPNG = async (forceSticker = false) => {
    // Open Monetag direct link in background tab on user export
    triggerDirectAd();
    const isSticker = forceSticker || format === 'sticker';
    setIsExporting(true);
    const qualityLabel = exportQuality === 4 ? 'Ultra HD 4K (4x)' : 'Full HD (3x)';
    showToast(isSticker ? `📸 Rendering ${qualityLabel} transparent sticker...` : `📸 Rendering ${qualityLabel} Instagram Story...`);

    try {
      const canvas = await getRenderedCanvas(isSticker);
      if (!canvas) throw new Error('Canvas rendering failed');

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const cleanTitle = currentSong.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      link.download = `${cleanTitle}_lyrics_${isSticker ? 'sticker_transparent' : format}_${exportQuality === 4 ? 'ultra_hd_4k' : 'full_hd'}.png`;
      link.href = dataUrl;
      link.click();

      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#1db954', '#1ed760', '#ffffff', '#8a2be2']
      });

      showToast(isSticker ? `🎉 Downloaded ${qualityLabel} sticker (${canvas.width}×${canvas.height}px)!` : `🎉 Story exported in ${qualityLabel}!`);
    } catch (err) {
      console.error('Export failed:', err);
      showToast('❌ Failed to export image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Copy to Clipboard (Copies transparent PNG blob in Ultra HD for Instagram Stories)
  const handleCopyStory = async (forceSticker = false) => {
    // Open Monetag direct link in background tab on copy
    triggerDirectAd();
    const isSticker = forceSticker || format === 'sticker';
    setIsExporting(true);
    const qualityLabel = exportQuality === 4 ? 'Ultra HD 4K' : 'Full HD';

    try {
      const canvas = await getRenderedCanvas(isSticker);
      if (!canvas) throw new Error('Canvas rendering failed');

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Could not generate image blob');

      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        confetti({
          particleCount: 45,
          spread: 45,
          origin: { y: 0.85 },
          colors: ['#1db954', '#ffffff']
        });
        showToast(isSticker ? `📋 Copied ${qualityLabel} sticker (${canvas.width}×${canvas.height}px)!` : `📋 Copied story in ${qualityLabel}!`);
      } else {
        handleExportPNG(isSticker);
      }
    } catch (err) {
      console.warn('Clipboard write error:', err);
      handleExportPNG(isSticker);
    } finally {
      setIsExporting(false);
    }
  };

  // Paste from clipboard to input
  const handlePasteInput = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setSpotifyUrlInput(text);
        showToast('Pasted link from clipboard');
      }
    } catch (e) {
      showToast('Please press Cmd+V / Ctrl+V to paste');
    }
  };

  // Generate aesthetic barcode bars
  const barcodeBars = [8, 14, 6, 18, 12, 5, 16, 10, 18, 7, 13, 17, 9, 15, 6, 12, 18, 10, 6, 14, 8];

  // Selected lyrics lines
  const displayLyrics = selectedIndices.map((idx) => ({
    text: lyrics[idx],
    isHighlighted: idx === highlightIndex,
    index: idx
  }));

  // Format dimensions display text
  const getDimensionText = () => {
    if (format === 'sticker') return 'Transparent Card (Cropped)';
    if (format === 'story') return '1080 × 1920 (9:16 Story)';
    if (format === 'square') return '1080 × 1080 (1:1 Post)';
    return '1080 × 1350 (4:5 Post)';
  };

  // Safe cover art source
  const getCoverSrc = (coverArt) => {
    if (!coverArt) return '';
    if (coverArt.startsWith('data:') || coverArt.startsWith('/')) return coverArt;
    return `/api/image-proxy?url=${encodeURIComponent(coverArt)}`;
  };

  // Automatically extract vibrant dominant color from album cover dynamically per song
  useEffect(() => {
    if (currentSong?.spotifyColor) {
      setAlbumColor(currentSong.spotifyColor);
      return;
    }
    if (!currentSong?.coverArt) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 16, 16);
        const data = ctx.getImageData(0, 0, 16, 16).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 16) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        setAlbumColor(`rgb(${r}, ${g}, ${b})`);
      } catch (e) {
        setAlbumColor('rgb(35, 45, 60)');
      }
    };
    img.src = currentSong.coverArt;
  }, [currentSong]);

  // Helper to convert hex / rgb color to rgba with specific alpha
  const hexToRgba = (color, alpha = 0.35) => {
    if (!color) return `rgba(255, 255, 255, ${alpha})`;
    if (color.startsWith('rgb')) {
      if (color.startsWith('rgba')) {
        return color.replace(/[\d\.]+\)$/g, `${alpha})`);
      }
      return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
    }
    let c = color.replace('#', '');
    if (c.length === 3) {
      c = c.split('').map((ch) => ch + ch).join('');
    }
    const num = parseInt(c, 16);
    if (isNaN(num)) return `rgba(255, 255, 255, ${alpha})`;
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Compute Card Background (dynamic, custom, gradient, solid, or glass)
  const getCardBackground = () => {
    const isDynamic = selectedColor === 'dynamic';
    const baseColor = isDynamic
      ? (currentSong.spotifyColor || albumColor || 'rgb(35, 45, 60)')
      : (selectedColor === 'custom' ? customColor : selectedColor);

    if (colorStyle === 'solid') {
      return baseColor;
    }

    if (colorStyle === 'glass') {
      if (baseColor === '#000000') {
        return `linear-gradient(135deg, rgba(25, 28, 36, 0.72) 0%, rgba(12, 14, 18, 0.48) 100%)`;
      }
      if (baseColor === '#ffffff') {
        return `linear-gradient(135deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.22) 100%)`;
      }
      // Rich tinted frosted glass with depth
      const cTop = hexToRgba(baseColor, 0.42);
      const cBottom = hexToRgba(baseColor, 0.16);
      return `linear-gradient(135deg, ${cTop} 0%, ${cBottom} 100%)`;
    }

    // Default: Gradient mode
    if (baseColor === '#000000') return '#000000';
    if (baseColor === '#ffffff') return '#ffffff';
    return `linear-gradient(145deg, ${baseColor}, #08090d 88%)`;
  };

  const isLightCard = () => {
    const hex = selectedColor === 'custom' ? customColor : selectedColor;
    return hex === '#ffffff';
  };

  return (
    <div className="app-root">

      {/* Top Header */}
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.625.625 0 01-.86.207c-2.355-1.439-5.32-1.765-8.813-.967a.624.624 0 11-.278-1.218c3.826-.874 7.112-.507 9.744 1.118a.625.625 0 01.207.86zm1.225-2.723a.782.782 0 01-1.077.257c-2.696-1.658-6.806-2.137-9.995-1.17a.781.781 0 01-.453-1.497c3.64-1.104 8.188-.574 11.268 1.333a.781.781 0 01.257 1.077zm.106-2.836C14.689 8.91 9.36 8.73 6.273 9.667a.937.937 0 11-.543-1.792c3.54-1.074 9.444-.866 13.254 1.396a.938.938 0 01-.937 1.621z" />
            </svg>
          </div>
          <div className="brand-text">
            <h1>Lyrify <span className="badge-studio">Studio</span></h1>
            <p>Aesthetic Spotify Lyrics Card & Transparent Sticker Generator</p>
          </div>
        </div>
      </header>

      {/* URL Input & Presets Section */}
      <section className="search-section">
        <div className="search-container">
          <form className="search-bar" onSubmit={handleFetchSong}>
            <div className="search-input-wrapper">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                className="search-input"
                value={spotifyUrlInput}
                onChange={(e) => setSpotifyUrlInput(e.target.value)}
                placeholder="Paste any Spotify song URL or title (e.g. Love Me Not Ravyn Lenae)..."
              />
              <button
                type="button"
                className="btn-paste-inside"
                onClick={handlePasteInput}
              >
                Paste
              </button>
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-fetch"
              disabled={isLoadingSong}
            >
              {isLoadingSong ? (
                <>
                  <RefreshCw className="spin-icon" size={16} />
                  <span>Extracting...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Extract Song</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Songs for Instant Play */}
          <div className="preset-wrapper">
            <span className="preset-label">Trending Hits:</span>
            <div className="preset-pills">
              {PRESET_SONGS.map((song) => (
                <button
                  key={song.id}
                  type="button"
                  className={`preset-pill-btn ${currentSong.id === song.id ? 'active' : ''}`}
                  onClick={() => handleSelectPreset(song)}
                >
                  <img src={getCoverSrc(song.coverArt)} alt={song.title} />
                  <span>{song.title} — {song.artist}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Segmented Navigation (Visible only on mobile devices <= 768px) */}
      <div className="mobile-view-nav">
        <button
          type="button"
          className={`mobile-view-btn ${mobileTab === 'preview' ? 'active' : ''}`}
          onClick={() => setMobileTab('preview')}
        >
          <Eye size={15} />
          <span>Card Preview</span>
        </button>
        <button
          type="button"
          className={`mobile-view-btn ${mobileTab === 'editor' ? 'active' : ''}`}
          onClick={() => setMobileTab('editor')}
        >
          <Edit3 size={15} />
          <span>Edit & Style</span>
        </button>
      </div>

      {/* Main Workspace Layout */}
      <main className={`main-workspace mobile-view-${mobileTab}`}>

        {/* Left Panel: Editor & Controls */}
        <aside className="editor-sidebar">

          {/* Navigation Tabs */}
          <div className="editor-tabs" role="tablist">
            <button
              className={`tab-btn ${activeTab === 'lyrics' ? 'active' : ''}`}
              onClick={() => setActiveTab('lyrics')}
            >
              <Music size={15} />
              <span>1. Lyrics</span>
              <span className="tab-badge">{selectedIndices.length}</span>
            </button>

            <button
              className={`tab-btn ${activeTab === 'style' ? 'active' : ''}`}
              onClick={() => setActiveTab('style')}
            >
              <Sliders size={15} />
              <span>2. Style & Format</span>
            </button>

            <button
              className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              <Layout size={15} />
              <span>3. Details</span>
            </button>
          </div>

          {/* TAB 1: LYRICS SELECTOR */}
          {activeTab === 'lyrics' && (
            <div className="tab-pane tab-pane-lyrics">
              <div className="lyrics-top-sticky-controls">
                {/* Script / Language Switcher (Spotify English Letters / Native Script / English Meaning) */}
                {(isNonLatinScript || detectedLanguage) && (
                  <div className="lyrics-script-switcher">
                    <div className="script-switcher-header">
                      <div className="script-header-left">
                        <Languages size={14} className="script-globe-icon" />
                        <span className="script-label">Language &amp; Script:</span>
                        {isTranslating ? (
                          <span className="translating-indicator">
                            <Loader2 size={12} className="spin-icon" /> Converting...
                          </span>
                        ) : (
                          <span className="script-badge-detected">
                            {detectedLanguage}
                          </span>
                        )}
                      </div>
                      {lyricsScripts.translated && lyricsScripts.translated.length > 0 && activeScript !== 'translated' && (
                        <label className="bilingual-switch-label" title="Show English meaning under each line on card">
                          <input
                            type="checkbox"
                            checked={showSubtitles}
                            onChange={(e) => setShowSubtitles(e.target.checked)}
                          />
                          <span className="bilingual-toggle-text">Subtitles</span>
                        </label>
                      )}
                    </div>
                    <div className="script-pills-group">
                      <button
                        type="button"
                        className={`script-pill-btn ${activeScript === 'romanized' ? 'active' : ''}`}
                        onClick={() => handleSwitchScript('romanized')}
                        title="Display English alphabet letters (Spotify style)"
                      >
                        <span className="pill-icon">🔤</span>
                        <span className="pill-text">English Letters (Spotify)</span>
                      </button>
                      <button
                        type="button"
                        className={`script-pill-btn ${activeScript === 'original' ? 'active' : ''}`}
                        onClick={() => handleSwitchScript('original')}
                        title="Display original native script"
                      >
                        <span className="pill-icon">🇮🇳</span>
                        <span className="pill-text">{detectedLanguage || 'Native'} Script</span>
                      </button>
                      <button
                        type="button"
                        className={`script-pill-btn ${activeScript === 'translated' ? 'active' : ''}`}
                        onClick={() => handleSwitchScript('translated')}
                        title="Display English meaning translation"
                      >
                        <span className="pill-icon">📖</span>
                        <span className="pill-text">English Meaning</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="lyrics-header-toolbar">
                  <div className="lyrics-summary">
                    <span><strong>{selectedIndices.length}</strong> selected</span>
                    <span className="no-limit-tag">No Limit!</span>
                  </div>
                  <div className="lyrics-quick-actions">
                    <button type="button" className="btn-chip" onClick={handleSelectAll}>All</button>
                    <button type="button" className="btn-chip" onClick={handleSelectChorus}>Chorus</button>
                    <button type="button" className="btn-chip" onClick={handleClearSelection}>Clear</button>
                    <button
                      type="button"
                      className="btn-chip btn-chip-highlight"
                      onClick={() => {
                        setCustomLyricsText(lyrics.join('\n'));
                        setIsCustomLyricsOpen(true);
                      }}
                    >
                      <Plus size={12} /> Add / Edit
                    </button>
                  </div>
                </div>

                <div className="lyrics-hint-compact">
                  💡 Tap lines to toggle on card • Click ⭐ to glow punchline
                </div>
              </div>

              {/* Scrollable Lyrics List (Takes all remaining height!) */}
              <div className="lyrics-list-container">
                {lyrics.map((line, idx) => {
                  const isSelected = selectedIndices.includes(idx);
                  const isHighlighted = highlightIndex === idx;
                  return (
                    <div
                      key={idx}
                      className={`lyric-item ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                      onClick={() => handleToggleLine(idx)}
                    >
                      <div className="lyric-checkbox">
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                      <span className="lyric-text">{line}</span>
                      <button
                        type="button"
                        className={`btn-star-highlight ${isHighlighted ? 'active' : ''}`}
                        onClick={(e) => handleSetHighlight(idx, e)}
                        title="Highlight this punchline"
                      >
                        <Star size={15} fill={isHighlighted ? '#ffc107' : 'none'} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: AESTHETIC STYLE */}
          {activeTab === 'style' && (
            <div className="tab-pane">

              {/* Aspect Ratio / Format */}
              <div className="control-group">
                <label className="control-label">Export Format</label>
                <div className="format-grid">
                  <button
                    type="button"
                    className={`format-btn ${format === 'sticker' ? 'active' : ''}`}
                    onClick={() => setFormat('sticker')}
                  >
                    <div className="format-preview format-sticker-icon">🏷️</div>
                    <span>Transparent Card (Cropped)</span>
                  </button>
                  <button
                    type="button"
                    className={`format-btn ${format === 'story' ? 'active' : ''}`}
                    onClick={() => setFormat('story')}
                  >
                    <div className="format-preview format-9-16"></div>
                    <span>IG Story (9:16)</span>
                  </button>
                  <button
                    type="button"
                    className={`format-btn ${format === 'square' ? 'active' : ''}`}
                    onClick={() => setFormat('square')}
                  >
                    <div className="format-preview format-1-1"></div>
                    <span>Feed Square (1:1)</span>
                  </button>
                  <button
                    type="button"
                    className={`format-btn ${format === 'portrait' ? 'active' : ''}`}
                    onClick={() => setFormat('portrait')}
                  >
                    <div className="format-preview format-4-5"></div>
                    <span>Portrait (4:5)</span>
                  </button>
                </div>
              </div>

              {/* Card Color Panel */}
              <div className="control-group">
                <div className="label-with-meta">
                  <div className="panel-title-row">
                    <Palette size={16} className="panel-icon" />
                    <label className="control-label">Card Background &amp; Colors</label>
                  </div>
                  <div className="color-style-toggle">
                    <button
                      type="button"
                      className={`style-pill-btn ${colorStyle === 'gradient' ? 'active' : ''}`}
                      onClick={() => setColorStyle('gradient')}
                      title="Subtle Dark Gradient"
                    >
                      Gradient
                    </button>
                    <button
                      type="button"
                      className={`style-pill-btn ${colorStyle === 'solid' ? 'active' : ''}`}
                      onClick={() => setColorStyle('solid')}
                      title="Clean Flat Solid Color"
                    >
                      Solid
                    </button>
                    <button
                      type="button"
                      className={`style-pill-btn ${colorStyle === 'glass' ? 'active' : ''}`}
                      onClick={() => setColorStyle('glass')}
                      title="Frosted Acrylic Glass"
                    >
                      Glass
                    </button>
                  </div>
                </div>

                {/* 16 Palette Swatches */}
                <div className="color-palette-grid">
                  {COLOR_PRESETS.map((c) => {
                    const isDynamic = c.id === 'dynamic';
                    const isActive = selectedColor === c.id;
                    const displayBg = isDynamic ? (currentSong.spotifyColor || albumColor || 'linear-gradient(135deg, #1db954, #191414)') : c.bg;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        className={`palette-swatch-btn ${isActive ? 'active' : ''}`}
                        onClick={() => setSelectedColor(c.id)}
                        title={c.label}
                      >
                        <span
                          className={`palette-swatch-circle ${isDynamic ? 'dynamic-swatch' : ''}`}
                          style={{ background: displayBg }}
                        >
                          {isActive && <Check size={12} className="swatch-check" />}
                        </span>
                        <span className="palette-swatch-name">{c.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Color Wheel & Hex Picker */}
                <div className="custom-color-picker-box">
                  <div className="custom-color-left">
                    <div className="color-input-wrapper">
                      <input
                        type="color"
                        id="customColorInput"
                        value={customColor}
                        onChange={(e) => {
                          setCustomColor(e.target.value);
                          setSelectedColor('custom');
                        }}
                        className="native-color-input"
                      />
                      <label htmlFor="customColorInput" className="color-circle-preview" style={{ background: customColor }}>
                        <Pipette size={13} />
                      </label>
                    </div>
                    <div className="hex-input-group">
                      <span className="hex-prefix">#</span>
                      <input
                        type="text"
                        value={customColor.replace('#', '')}
                        maxLength={6}
                        onChange={(e) => {
                          const val = '#' + e.target.value.replace(/[^0-9A-Fa-f]/g, '');
                          setCustomColor(val);
                          setSelectedColor('custom');
                        }}
                        className="hex-text-input"
                        placeholder="8B5CF6"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`btn-apply-custom ${selectedColor === 'custom' ? 'active' : ''}`}
                    onClick={() => setSelectedColor('custom')}
                  >
                    {selectedColor === 'custom' ? '✓ Custom Active' : 'Use Custom'}
                  </button>
                </div>
              </div>

              {/* Custom Rounded Corners Slider */}
              <div className="control-group">
                <div className="label-with-meta">
                  <label className="control-label">Card Rounded Corners</label>
                  <span className="meta-tip">{borderRadius}px</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="52"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(Number(e.target.value))}
                  className="slider"
                />
                <div className="slider-presets">
                  <button
                    type="button"
                    className={`btn-micro ${borderRadius === 12 ? 'active' : ''}`}
                    onClick={() => setBorderRadius(12)}
                  >
                    Subtle (12px)
                  </button>
                  <button
                    type="button"
                    className={`btn-micro ${borderRadius === 32 ? 'active' : ''}`}
                    onClick={() => setBorderRadius(32)}
                  >
                    Spotify Pill (32px)
                  </button>
                  <button
                    type="button"
                    className={`btn-micro ${borderRadius === 48 ? 'active' : ''}`}
                    onClick={() => setBorderRadius(48)}
                  >
                    Ultra Round (48px)
                  </button>
                </div>
              </div>

              {/* Background Atmosphere for full story format */}
              {format !== 'sticker' && (
                <div className="control-group">
                  <label className="control-label">Story Background Atmosphere</label>
                  <div className="chip-toggle-group">
                    {[
                      { id: 'album-blur', label: 'Album Blur' },
                      { id: 'mesh', label: 'Ambient Mesh' },
                      { id: 'minimal', label: 'Deep OLED' },
                      { id: 'vinyl', label: 'Vinyl Studio' },
                      { id: 'custom-color', label: 'Color Wheel' }
                    ].map((bg) => (
                      <button
                        key={bg.id}
                        type="button"
                        className={`chip-toggle ${bgStyle === bg.id ? 'active' : ''}`}
                        onClick={() => setBgStyle(bg.id)}
                      >
                        {bg.label}
                      </button>
                    ))}
                  </div>
                  {bgStyle === 'custom-color' && (
                    <div className="custom-color-picker-box" style={{ marginTop: '0.75rem' }}>
                      <div className="custom-color-left">
                        <div className="color-input-wrapper">
                          <input
                            type="color"
                            id="storyCustomBgInput"
                            value={customBackdropColor}
                            onChange={(e) => setCustomBackdropColor(e.target.value)}
                            className="native-color-input"
                          />
                          <label htmlFor="storyCustomBgInput" className="color-circle-preview" style={{ background: customBackdropColor }}>
                            <Pipette size={13} />
                          </label>
                        </div>
                        <div className="hex-input-group">
                          <span className="hex-prefix">#</span>
                          <input
                            type="text"
                            value={customBackdropColor.replace('#', '')}
                            maxLength={6}
                            onChange={(e) => {
                              const val = '#' + e.target.value.replace(/[^0-9A-Fa-f]/g, '');
                              setCustomBackdropColor(val);
                            }}
                            className="hex-text-input"
                            placeholder="4F46E5"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Typography */}
              <div className="control-group">
                <label className="control-label">Lyrics Typography</label>
                <div className="font-selector-grid">
                  {[
                    { id: 'Plus Jakarta Sans', label: 'Spotify Sans', sub: 'Clean & Bold' },
                    { id: 'Playfair Display', label: 'Playfair Serif', sub: 'Poetic Elegance' },
                    { id: 'Outfit', label: 'Outfit Grotesk', sub: 'Modern Geometric' },
                    { id: 'Caveat', label: 'Caveat Script', sub: 'Handwritten Indie' }
                  ].map((font) => (
                    <button
                      key={font.id}
                      type="button"
                      className={`font-btn ${fontFamily === font.id ? 'active' : ''}`}
                      onClick={() => setFontFamily(font.id)}
                      style={{ fontFamily: font.id }}
                    >
                      <span>{font.label}</span>
                      <small>{font.sub}</small>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size & Alignment */}
              <div className="control-group">
                <div className="label-with-meta">
                  <label className="control-label">Lyrics Font Size</label>
                  <span className="meta-tip">{fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="36"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="slider"
                />
              </div>

              <div className="control-group">
                <label className="control-label">Text Alignment</label>
                <div className="align-btn-group">
                  <button
                    type="button"
                    className={`align-btn ${textAlign === 'left' ? 'active' : ''}`}
                    onClick={() => setTextAlign('left')}
                  >
                    <AlignLeft size={16} />
                    <span>Left Align</span>
                  </button>
                  <button
                    type="button"
                    className={`align-btn ${textAlign === 'center' ? 'active' : ''}`}
                    onClick={() => setTextAlign('center')}
                  >
                    <AlignCenter size={16} />
                    <span>Center Align</span>
                  </button>
                </div>
              </div>

              {/* Export Resolution & Clarity */}
              <div className="control-group">
                <div className="label-with-meta">
                  <label className="control-label">Export Clarity & Resolution</label>
                  <span className="meta-tip">{exportQuality === 4 ? '4X ULTRA HD' : '3X FULL HD'}</span>
                </div>
                <div className="chip-toggle-group">
                  <button
                    type="button"
                    className={`chip-toggle ${exportQuality === 4 ? 'active' : ''}`}
                    onClick={() => setExportQuality(4)}
                  >
                    💎 4K Ultra HD (1640px+ Super-Res)
                  </button>
                  <button
                    type="button"
                    className={`chip-toggle ${exportQuality === 3 ? 'active' : ''}`}
                    onClick={() => setExportQuality(3)}
                  >
                    ✨ Full HD (1230px+ Crisp)
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: CARD DETAILS & TOGGLES */}
          {activeTab === 'details' && (
            <div className="tab-pane">

              <div className="control-group">
                <label className="control-label">Album Art Style</label>
                <div className="chip-toggle-group">
                  {[
                    { id: 'rounded', label: 'Rounded Box' },
                    { id: 'vinyl', label: 'Vinyl Disc' },
                    { id: 'circle', label: 'Circle' },
                    { id: 'none', label: 'Hidden' }
                  ].map((cov) => (
                    <button
                      key={cov.id}
                      type="button"
                      className={`chip-toggle ${coverStyle === cov.id ? 'active' : ''}`}
                      onClick={() => setCoverStyle(cov.id)}
                    >
                      {cov.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle Switches */}
              <div className="control-group">
                <label className="control-label">Visible Elements</label>

                <label className="switch-row">
                  <span className="switch-label">
                    <strong>Spotify Waveform Barcode</strong>
                    <small>Aesthetic scan code soundwave</small>
                  </span>
                  <input
                    type="checkbox"
                    className="custom-switch"
                    checked={showBarcode}
                    onChange={(e) => setShowBarcode(e.target.checked)}
                  />
                </label>

                <label className="switch-row">
                  <span className="switch-label">
                    <strong>Spotify Branding Pill</strong>
                    <small>"Spotify" logo pill</small>
                  </span>
                  <input
                    type="checkbox"
                    className="custom-switch"
                    checked={showBadge}
                    onChange={(e) => setShowBadge(e.target.checked)}
                  />
                </label>

                <label className="switch-row">
                  <span className="switch-label">
                    <strong>Music Progress Bar</strong>
                    <small>Playback seekbar & timestamps</small>
                  </span>
                  <input
                    type="checkbox"
                    className="custom-switch"
                    checked={showProgress}
                    onChange={(e) => setShowProgress(e.target.checked)}
                  />
                </label>

                <label className="switch-row">
                  <span className="switch-label">
                    <strong>Card Drop Shadow (Preview)</strong>
                    <small>Turn off for flat export</small>
                  </span>
                  <input
                    type="checkbox"
                    className="custom-switch"
                    checked={showShadow}
                    onChange={(e) => setShowShadow(e.target.checked)}
                  />
                </label>

                <label className="switch-row">
                  <span className="switch-label">
                    <strong>Song Artist & Subtitle</strong>
                    <small>Display artist name below title</small>
                  </span>
                  <input
                    type="checkbox"
                    className="custom-switch"
                    checked={showArtist}
                    onChange={(e) => setShowArtist(e.target.checked)}
                  />
                </label>
              </div>

              {/* Card Padding */}
              <div className="control-group">
                <div className="label-with-meta">
                  <label className="control-label">Card Inner Spacing</label>
                  <span className="meta-tip">{cardPadding}px</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="44"
                  value={cardPadding}
                  onChange={(e) => setCardPadding(Number(e.target.value))}
                  className="slider"
                />
              </div>

            </div>
          )}

          {/* Mobile Bottom Switcher: Jump directly to preview */}
          <div className="mobile-only-action">
            <button
              type="button"
              className="btn btn-primary btn-full-width"
              onClick={() => {
                setMobileTab('preview');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <Eye size={16} />
              <span>Done Editing — View Card Preview & Export →</span>
            </button>
          </div>

        </aside>

        {/* Right Panel: Live Aesthetic Preview Stage */}
        <section className="preview-stage">

          {/* Stage Toolbar */}
          <div className="stage-toolbar">
            <div className="stage-toolbar-left">
              <div className="format-pill-group">
                <button
                  type="button"
                  className={`format-pill-btn ${format === 'sticker' ? 'active' : ''}`}
                  onClick={() => setFormat('sticker')}
                  title="Crop tightly to card with 100% transparent corners for Instagram Add Photo sticker"
                >
                  <span>🏷️ Sticker</span>
                </button>
                <button
                  type="button"
                  className={`format-pill-btn ${format === 'story' ? 'active' : ''}`}
                  onClick={() => setFormat('story')}
                  title="Full 9:16 screen Instagram story with Spotify ambient blur"
                >
                  <span>📱 Story</span>
                </button>
                <button
                  type="button"
                  className={`format-pill-btn ${format === 'square' ? 'active' : ''}`}
                  onClick={() => setFormat('square')}
                  title="1:1 Square post"
                >
                  <span>⏹️ Square</span>
                </button>
              </div>
            </div>

            <div className="stage-toolbar-right">
              {/* Resolution / Quality Pill Picker */}
              <div className="res-pill-group">
                <button
                  type="button"
                  className={`res-pill-btn ${exportQuality === 4 ? 'active' : ''}`}
                  onClick={() => setExportQuality(4)}
                  title="Ultra HD 4K (4x Super-Res — Razor Sharp 1640px+)"
                >
                  <span>💎 4K Ultra HD</span>
                </button>
                <button
                  type="button"
                  className={`res-pill-btn ${exportQuality === 3 ? 'active' : ''}`}
                  onClick={() => setExportQuality(3)}
                  title="Full HD (3x — 1230px+ Crisp Standard)"
                >
                  <span>✨ Full HD</span>
                </button>
              </div>

              {/* Story Backdrop Picker */}
              <div className="sim-bg-picker">
                <span className="sim-label">Backdrop:</span>
                <button
                  type="button"
                  className={`sim-btn ${simBackdrop === 'checkerboard' ? 'active' : ''}`}
                  data-sim="checkerboard"
                  onClick={() => setSimBackdrop('checkerboard')}
                  title="Transparency Checkerboard"
                />
                <button
                  type="button"
                  className={`sim-btn ${simBackdrop === 'dark' ? 'active' : ''}`}
                  data-sim="dark"
                  onClick={() => setSimBackdrop('dark')}
                  title="Dark Story Simulator"
                />
                <button
                  type="button"
                  className={`sim-btn ${simBackdrop === 'light' ? 'active' : ''}`}
                  data-sim="light"
                  onClick={() => setSimBackdrop('light')}
                  title="Light Story Simulator"
                />
                <button
                  type="button"
                  className={`sim-btn ${simBackdrop === 'photo' ? 'active' : ''}`}
                  data-sim="photo"
                  onClick={() => setSimBackdrop('photo')}
                  title="Photo Story Simulator"
                />
                <div className="sim-colorwheel-wrapper" title={`Color Wheel: Pick custom backdrop color (${customBackdropColor})`}>
                  <input
                    type="color"
                    id="customBackdropColorInput"
                    value={customBackdropColor}
                    onChange={(e) => {
                      setCustomBackdropColor(e.target.value);
                      setSimBackdrop('custom');
                    }}
                    className="native-backdrop-color-input"
                  />
                  <label
                    htmlFor="customBackdropColorInput"
                    className={`sim-btn sim-btn-colorwheel ${simBackdrop === 'custom' ? 'active' : ''}`}
                    title={`Color Wheel (${customBackdropColor})`}
                  >
                    <span
                      className="colorwheel-swatch"
                      style={{ background: customBackdropColor }}
                    />
                  </label>
                </div>
              </div>

              <div className="stage-action-buttons">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleCopyStory(format === 'sticker')}
                  disabled={isExporting}
                  title="Copy transparent card to clipboard"
                >
                  <Copy size={13} />
                  <span>{format === 'sticker' ? 'Copy Sticker' : 'Copy Story'}</span>
                </button>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => handleExportPNG(format === 'sticker')}
                  disabled={isExporting}
                  title="Download PNG image"
                >
                  <Download size={13} />
                  <span>{format === 'sticker' ? 'Download Sticker' : 'Download Story'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Canvas Viewport */}
          <div
            className={`preview-viewport sim-${simBackdrop}`}
            style={
              simBackdrop === 'custom'
                ? {
                    background: `radial-gradient(circle at 50% 50%, ${customBackdropColor}e6 0%, ${customBackdropColor} 100%)`,
                    backgroundImage: 'none'
                  }
                : undefined
            }
          >

            {/* The Master Export Frame */}
            <div
              ref={exportFrameRef}
              className={`export-frame format-${format}`}
            >

              {/* Ambient Background Layer (only in full story mode) */}
              {format !== 'sticker' && (
                <div
                  className={`ambient-layer ${bgStyle}`}
                  style={{
                    backgroundImage: bgStyle === 'album-blur' ? `url(${getCoverSrc(currentSong.coverArt)})` : undefined,
                    background: bgStyle === 'custom-color' ? customBackdropColor : undefined,
                    '--theme-accent': currentSong.spotifyColor || '#1db954'
                  }}
                />
              )}

              {/* The Floating Spotify Lyrics Card (tight bounds, 100% transparent outside rounded corners!) */}
              <div
                ref={lyricsCardRef}
                className={`lyrics-card style-${colorStyle} ${isLightCard() ? 'is-light-theme' : ''}`}
                style={{
                  background: getCardBackground(),
                  borderRadius: `${borderRadius}px`,
                  padding: `${cardPadding}px`,
                  textAlign: textAlign,
                  boxShadow: (showShadow && format !== 'sticker') ? undefined : 'none',
                  '--card-padding': `${cardPadding}px`,
                  '--lyrics-font-size': `${fontSize}px`
                }}
              >

                {/* Card Header: Album Art & Title */}
                <div className="card-header">
                  <div className="card-track-info">
                    {coverStyle !== 'none' && (
                      <div className={`card-cover-wrapper style-${coverStyle}`}>
                        <img
                          src={getCoverSrc(currentSong.coverArt)}
                          alt={currentSong.title}
                          loading="eager"
                          onError={(e) => {
                            if (!e.target.src.startsWith('data:') && !e.target.src.includes('/api/image-proxy')) {
                              e.target.src = `/api/image-proxy?url=${encodeURIComponent(currentSong.coverArt)}`;
                            }
                          }}
                        />
                        {coverStyle === 'vinyl' && <div className="vinyl-center-hole" />}
                      </div>
                    )}
                    <div className="card-title-block">
                      <div className="title-row">
                        <h2 className="card-song-title">{currentSong.title}</h2>
                        <span className="explicit-badge">E</span>
                      </div>
                      {showArtist && (
                        <p className="card-song-artist">{currentSong.artist}</p>
                      )}
                    </div>
                  </div>

                  {/* Spotify Barcode */}
                  {showBarcode && (
                    <div className="card-spotify-code">
                      <div className="code-logo">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.625.625 0 01-.86.207c-2.355-1.439-5.32-1.765-8.813-.967a.624.624 0 11-.278-1.218c3.826-.874 7.112-.507 9.744 1.118a.625.625 0 01.207.86zm1.225-2.723a.782.782 0 01-1.077.257c-2.696-1.658-6.806-2.137-9.995-1.17a.781.781 0 01-.453-1.497c3.64-1.104 8.188-.574 11.268 1.333a.781.781 0 01.257 1.077zm.106-2.836C14.689 8.91 9.36 8.73 6.273 9.667a.937.937 0 11-.543-1.792c3.54-1.074 9.444-.866 13.254 1.396a.938.938 0 01-.937 1.621z" />
                        </svg>
                      </div>
                      <div className="code-bars">
                        {barcodeBars.map((height, i) => (
                          <div
                            key={i}
                            className="code-bar"
                            style={{ height: `${height}px` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Lyrics Content */}
                <div
                  className="card-lyrics-content"
                  style={{
                    fontFamily: fontFamily,
                    fontSize: `${fontSize}px`
                  }}
                >
                  {displayLyrics.length > 0 ? (
                    displayLyrics.map((item, idx) => (
                      <div
                        key={idx}
                        className={`card-lyric-line ${item.isHighlighted ? 'highlight' : ''}`}
                      >
                        <div className="card-lyric-main-text">{item.text}</div>
                        {showSubtitles && lyricsScripts.translated && lyricsScripts.translated[item.index] && (
                          <div className="card-lyric-sub-text">
                            {lyricsScripts.translated[item.index]}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="card-lyric-line">
                      (No lyrics selected. Tap lines in Lyrics tab to add!)
                    </div>
                  )}
                </div>

                {/* Card Footer: Progress Bar & Spotify Pill */}
                <div className="card-footer">

                  {/* Progress Bar */}
                  {showProgress && (
                    <div className="card-progress-container">
                      <div className="progress-bar-track">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${audioProgress}%` }}
                        />
                        <div
                          className="progress-bar-thumb"
                          style={{ left: `${audioProgress}%` }}
                        />
                      </div>
                      <div className="progress-timestamps">
                        <span>1:24</span>
                        <span>{Math.floor(currentSong.durationMs / 60000)}:{Math.floor((currentSong.durationMs % 60000) / 1000).toString().padStart(2, '0')}</span>
                      </div>
                    </div>
                  )}

                  {/* Spotify Badge */}
                  {showBadge && (
                    <div className="spotify-pill">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.625.625 0 01-.86.207c-2.355-1.439-5.32-1.765-8.813-.967a.624.624 0 11-.278-1.218c3.826-.874 7.112-.507 9.744 1.118a.625.625 0 01.207.86zm1.225-2.723a.782.782 0 01-1.077.257c-2.696-1.658-6.806-2.137-9.995-1.17a.781.781 0 01-.453-1.497c3.64-1.104 8.188-.574 11.268 1.333a.781.781 0 01.257 1.077zm.106-2.836C14.689 8.91 9.36 8.73 6.273 9.667a.937.937 0 11-.543-1.792c3.54-1.074 9.444-.866 13.254 1.396a.938.938 0 01-.937 1.621z" />
                      </svg>
                      <span>Spotify</span>
                    </div>
                  )}

                </div>

              </div>
            </div>

          </div>

          <div className="stage-footer-hint">
            <div className="hint-card">
              <div className="hint-badge">💡 How to Share to Instagram Stories (Zero White Edges)</div>
              <p>
                <strong>• Option 1 (Full 9:16 Story — Easiest):</strong> Switch to <strong>📱 Full Story (9:16)</strong> above and tap <strong>Download Story</strong>. You get a full-screen story with Spotify ambient blur background — ready to post directly!
              </p>
              <p>
                <strong>• Option 2 (Floating Sticker):</strong> Keep <strong>🏷️ Sticker (Transparent)</strong> active and tap <strong>Download Sticker</strong>.
              </p>
              <div className="hint-subbox">
                <span className="hint-subbox-title">🔍 Why does my downloaded PNG look white in Photos or chat?</span>
                <p>
                  Transparent PNGs have <em>no background</em> at the corners. When opened in macOS Preview, Apple Photos, or light chat windows, the transparent corners show the viewer's white window.
                </p>
                <p>
                  <strong>To post on Instagram without white edges:</strong> Open your photo/video in Instagram Story → tap the <strong>Sticker icon</strong> (the smiley face) → tap <strong>Add Photo</strong> sticker → pick the downloaded PNG from Camera Roll. <em>(Note: Do NOT use clipboard paste in Instagram, as Instagram's paste tool turns transparent areas white!)</em>
                </p>
              </div>
            </div>
          </div>

        </section>

      </main>

      {/* Site Footer with Legal Trademark Disclaimer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">⚡ Lyrify</span>
            <p className="footer-tagline">
              Aesthetic Spotify lyrics sticker &amp; card generator for Instagram Stories, TikTok, and WhatsApp.
            </p>
          </div>
          <div className="footer-disclaimer">
            <p>
              <strong>Legal Disclaimer:</strong> This website is an independent design utility and is <strong>not affiliated with, endorsed, sponsored, or officially connected with Spotify AB</strong>. "Spotify" and the Spotify logo are registered trademarks of Spotify AB. All song lyrics and album artworks are the intellectual property of their respective artists, songwriters, and record labels.
            </p>
            <p className="footer-copyright">
              © {new Date().getFullYear()} Lyrify • 4K Lossless Exporter • Free for creators
            </p>
          </div>
        </div>
      </footer>

      {/* Custom Lyrics Modal */}
      {isCustomLyricsOpen && (
        <div className="modal-overlay" onClick={() => setIsCustomLyricsOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit / Add Custom Lyrics</h3>
              <button
                type="button"
                onClick={() => setIsCustomLyricsOpen(false)}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
            <p className="lyrics-hint">
              Paste or type your lyrics line by line. Each line becomes a selectable row in the editor!
            </p>
            <textarea
              className="modal-textarea"
              value={customLyricsText}
              onChange={(e) => setCustomLyricsText(e.target.value)}
              placeholder="Paste song lyrics here..."
            />
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsCustomLyricsOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleSaveCustomLyrics}
              >
                Apply Lyrics
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast">
            <Sparkles size={16} />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Audio element */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlayingAudio(false)}
        onTimeUpdate={() => {
          if (audioRef.current && audioRef.current.duration) {
            setAudioProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
          }
        }}
      />

    </div>
  );
}
