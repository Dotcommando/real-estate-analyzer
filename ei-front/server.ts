import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';

import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { getIntFromEnv } from './bff/utils';
import { APP_THEME } from './src/app/tokens';
import bootstrap from './src/main.server';


dotenv.config();

const GATEWAY_HOST = process.env['GATEWAY_HOST'];
const GATEWAY_PORT = getIntFromEnv('GATEWAY_PORT', 3332);
const ORIGIN_PROTOCOL = process.env['ORIGIN_PROTOCOL'];
const ORIGIN_HOST = process.env['ORIGIN_HOST'];
const ORIGIN_PORT = getIntFromEnv('ORIGIN_PORT', 80);
const FRONTEND_BFF_HOST = process.env['FRONTEND_BFF_HOST'];
const FRONTEND_BFF_PORT = getIntFromEnv('FRONTEND_BFF_PORT', 4000);
const API_PREFIX: string = process.env['API_PREFIX'] ?? '/api/v1';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.use(cookieParser());
  server.use(API_PREFIX, createProxyMiddleware({
    target: `http://${GATEWAY_HOST}:${GATEWAY_PORT}`,
    changeOrigin: true,
    pathRewrite: { '^/api/v1': API_PREFIX },
    logLevel: 'debug',
  }));

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y',
  }));

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;
    const themeCookie = req.cookies['user-theme'];
    const themePreferred = Boolean(themeCookie)
      ? themeCookie === 'dark'
        ? 'dark'
        : 'light'
      : Boolean(req.headers['user-agent']) && req.headers['user-agent']?.includes('prefers-color-scheme: light')
        ? 'light'
        : 'dark';

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [
          {
            provide: APP_BASE_HREF,
            useValue: baseUrl,
          },
          {
            provide: APP_THEME,
            useValue: themePreferred,
          },
        ],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const server = app();

  server.listen(FRONTEND_BFF_PORT, () => {
    console.log(`Node Express server listening on http://${FRONTEND_BFF_HOST}:${FRONTEND_BFF_PORT}`);
  });
}

run();
