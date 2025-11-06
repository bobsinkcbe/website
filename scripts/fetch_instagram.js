#!/usr/bin/env node
// Fetch latest Instagram media using Basic Display API and update assets/instagram.json
// Requires two GitHub Secrets: IG_USER_ID and IG_LONG_TOKEN (long-lived)
// Note: Basic Display media_url links may expire; we download images locally for stability.

const fs = require('fs');
const path = require('path');
const https = require('https');

const IG_USER_ID = process.env.IG_USER_ID;
const IG_TOKEN = process.env.IG_LONG_TOKEN;

if (!IG_USER_ID || !IG_TOKEN) {
  console.error('Missing IG_USER_ID or IG_LONG_TOKEN in environment.');
  process.exit(0); // Do not fail the workflow hard
}

const repoRoot = process.cwd();
const outJsonPath = path.join(repoRoot, 'assets', 'instagram.json');
const imgDir = path.join(repoRoot, 'assets', 'images', 'instagram');

if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', reject);
  });
}

function downloadToFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          file.close();
          fs.unlink(filePath, () => {});
          return reject(new Error('Failed to download: ' + res.statusCode));
        }
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
      })
      .on('error', (err) => {
        file.close();
        fs.unlink(filePath, () => {});
        reject(err);
      });
  });
}

async function run() {
  const fields = [
    'id',
    'media_type',
    'media_url',
    'thumbnail_url',
    'permalink',
    'timestamp',
    'caption'
  ].join(',');

  const baseUrl = `https://graph.instagram.com/${IG_USER_ID}/media?fields=${fields}&access_token=${IG_TOKEN}`;

  let items = [];
  let url = baseUrl;
  let pages = 0;

  while (url && pages < 3) { // fetch up to ~75 posts
    try {
      const data = await fetchJSON(url);
      if (Array.isArray(data.data)) {
        items.push(...data.data);
      }
      url = data.paging && data.paging.next ? data.paging.next : null;
      pages += 1;
    } catch (e) {
      console.error('Error fetching Instagram data:', e.message);
      break;
    }
  }

  // Map to local items and download images
  const mapped = [];
  for (const it of items) {
    const imageUrl = it.media_type === 'VIDEO' ? (it.thumbnail_url || it.media_url) : it.media_url;
    if (!imageUrl || !it.permalink) continue;

    const ext = imageUrl.includes('.png') ? '.png' : '.jpg';
    const filename = `ig_${it.id}${ext}`;
    const localPath = path.join(imgDir, filename);
    const publicPath = `assets/images/instagram/${filename}`;

    try {
      // Download only if file is missing
      if (!fs.existsSync(localPath)) {
        /* eslint-disable no-await-in-loop */
        await downloadToFile(imageUrl, localPath);
      }
      mapped.push({ image: publicPath, url: it.permalink, id: it.id, ts: it.timestamp });
    } catch (e) {
      console.warn('Skipping image due to download error:', e.message);
    }
  }

  // Sort by timestamp desc
  mapped.sort((a, b) => new Date(b.ts) - new Date(a.ts));

  // Write JSON (cap at 60 to keep repo light)
  const out = { items: mapped.slice(0, 60) };
  fs.writeFileSync(outJsonPath, JSON.stringify(out, null, 2));

  console.log(`Wrote ${out.items.length} items to assets/instagram.json`);
}

run().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});
