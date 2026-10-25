import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import imageProxyHandler from './api/image-proxy.js';
import spotifyHandler from './api/spotify.js';
import lyricsHandler from './api/lyrics.js';

export default defineConfig({
  server: {
    port: 5173,
    host: true,
  },
  plugins: [
    react(),
    {
      name: 'spotify-lyrics-api',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const urlObj = new URL(req.url, 'http://localhost');

          if (urlObj.pathname === '/api/image-proxy') {
            await imageProxyHandler(req, res);
            return;
          }

          if (urlObj.pathname === '/api/spotify') {
            await spotifyHandler(req, res);
            return;
          }

          if (urlObj.pathname === '/api/lyrics') {
            await lyricsHandler(req, res);
            return;
          }

          next();
        });
      }
    }
  ]
});
