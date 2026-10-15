import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { PDFDocument } from 'pdf-lib';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const publicDir = path.resolve(rootDir, 'public');
const base = process.env.BASE_PATH || '/';

fs.mkdirSync(publicDir, { recursive: true });

async function run() {
  if (!fs.existsSync(distDir) || !fs.existsSync(path.join(distDir, 'en/index.html'))) {
    throw new Error('Build output not found. Run npm run generate:pdf to build and generate the CVs.');
  }

  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
    '.txt': 'text/plain; charset=utf-8',
  };

  const server = http.createServer((req, res) => {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    if (!pathname.startsWith(base)) {
      res.writeHead(404).end('Not found');
      return;
    }
    const cleanUrl = pathname.slice(base.length);
    let filePath = path.join(distDir, cleanUrl || 'index.html');

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
    }
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;

  const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const launchOptions = fs.existsSync(chromePath) ? { executablePath: chromePath } : {};

  let browser;
  try {
    browser = await chromium.launch(launchOptions);
    for (const lang of ['en', 'ru']) {
      const page = await browser.newPage();
      // The portrait is screen-only; PDF generation uses local assets exclusively.
      await page.route('https://avatars.githubusercontent.com/**', (route) => route.abort());
      const response = await page.goto(`http://127.0.0.1:${port}${base}${lang}/`, { waitUntil: 'networkidle' });

      if (!response || response.status() !== 200) {
        throw new Error(`Failed to load /${lang}/, HTTP status: ${response?.status()}`);
      }

      await page.emulateMedia({ media: 'print' });
      await page.evaluate(() => document.fonts.ready);

      const pdfBuf = await page.pdf({
        format: 'A4',
        margin: { top: '10mm', right: '12mm', bottom: '10mm', left: '12mm' },
        printBackground: true,
        tagged: true,
      });

      const fileName = `Valentine-Shishkin-CV-${lang.toUpperCase()}.pdf`;
      const outPath = path.join(publicDir, fileName);
      // Parse the actual PDF with a dependency installed by npm ci, including in CI.
      const pageCount = (await PDFDocument.load(pdfBuf)).getPageCount();
      if (pageCount !== 1) {
        throw new Error(`Expected ${fileName} to be exactly 1 page, but got ${pageCount} pages!`);
      }
      fs.writeFileSync(outPath, pdfBuf);
      console.log(`Successfully generated ${fileName} (${pdfBuf.length} bytes)`);
      console.log(`Verified ${fileName}: exactly ${pageCount} page.`);

      // Also copy to dist if dist exists
      if (fs.existsSync(distDir)) {
        fs.writeFileSync(path.join(distDir, fileName), pdfBuf);
      }

      await page.close();
    }
  } finally {
    await browser?.close();
    server.close();
  }
}

run().catch((err) => {
  console.error('PDF generation error:', err);
  process.exit(1);
});
