import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const htmlPath = path.join(distDir, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Inline CSS
const cssMatch = html.match(/<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+)">/);
if (cssMatch) {
  const cssFile = path.join(distDir, cssMatch[1]);
  if (fs.existsSync(cssFile)) {
    const cssContent = fs.readFileSync(cssFile, 'utf8');
    html = html.replace(cssMatch[0], `<style>\n${cssContent}\n</style>`);
  }
}

// Inline JS
const jsMatch = html.match(/<script type="module" crossorigin src="(\/assets\/[^"]+)"><\/script>/);
if (jsMatch) {
  const jsFile = path.join(distDir, jsMatch[1]);
  if (fs.existsSync(jsFile)) {
    const jsContent = fs.readFileSync(jsFile, 'utf8');
    html = html.replace(jsMatch[0], `<script type="module">\n${jsContent}\n</script>`);
  }
}

fs.writeFileSync(path.join(distDir, 'NudgeBuddy-Offline.html'), html);
console.log('Successfully created standalone NudgeBuddy-Offline.html!');
