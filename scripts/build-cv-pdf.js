#!/usr/bin/env node
// Prints the CV page (/cv/) of the built site to resources/Jiaxing_Li_CV.pdf.
//
// Usage, from the repository root:
//   bundle exec jekyll build
//   node scripts/build-cv-pdf.js            # or: node scripts/build-cv-pdf.js path/to/_site
//
// Requires Node.js and Playwright:
//   npm install playwright && npx playwright install chromium
// Without Node: open /cv/ in Chrome, choose Print > Save as PDF, paper size Letter, default margins.
"use strict";

const fs = require("fs");
const http = require("http");
const path = require("path");
const { chromium } = require("playwright");

const repo = path.resolve(__dirname, "..");
const siteDir = path.resolve(process.argv[2] || path.join(repo, "_site"));
const outFile = path.join(repo, "resources", "Jiaxing_Li_CV.pdf");

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
};

if (!fs.existsSync(path.join(siteDir, "cv", "index.html"))) {
  console.error(`No built CV page in ${siteDir}. Run "bundle exec jekyll build" first.`);
  process.exit(1);
}

// Minimal static server for the built site, restricted to siteDir.
const server = http.createServer((req, res) => {
  let file = path.normalize(path.join(siteDir, decodeURIComponent(req.url.split("?")[0])));
  if (!file.startsWith(siteDir)) {
    res.statusCode = 403;
    return res.end();
  }
  if (file.endsWith(path.sep)) file = path.join(file, "index.html");
  fs.readFile(file, (err, data) => {
    if (err) {
      res.statusCode = 404;
      return res.end();
    }
    res.setHeader("Content-Type", types[path.extname(file)] || "application/octet-stream");
    res.end(data);
  });
});

server.listen(0, "127.0.0.1", async () => {
  const { port } = server.address();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${port}/cv/`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: outFile, format: "Letter", printBackground: true, preferCSSPageSize: true });
    console.log(`Wrote ${path.relative(repo, outFile)}`);
  } finally {
    await browser.close();
    server.close();
  }
});
