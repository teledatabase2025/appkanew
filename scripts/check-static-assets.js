const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const indexPath = path.join(root, 'index.html');
const html = fs.readFileSync(indexPath, 'utf8');
const references = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((match) => match[1]);
const localReferences = references.filter((reference) => !/^(https?:|mailto:|#)/.test(reference));
const broken = [];
const absolute = [];

for (const reference of localReferences) {
  if (reference.startsWith('/')) absolute.push(reference);
  const filePath = path.join(root, reference.replace(/^\.\//, ''));
  if (!fs.existsSync(filePath)) broken.push(reference);
}

if (absolute.length || broken.length) {
  if (absolute.length) console.error(`Absolute local paths are not GitHub Pages-safe: ${absolute.join(', ')}`);
  if (broken.length) console.error(`Missing local files referenced from index.html: ${broken.join(', ')}`);
  process.exit(1);
}

console.log(`Checked ${localReferences.length} local index.html asset references.`);
