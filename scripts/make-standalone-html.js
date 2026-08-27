import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const htmlPath = path.join(distDir, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Inline all CSS files in dist/assets
const assetFiles = fs.readdirSync(path.join(distDir, 'assets'));
const cssFiles = assetFiles.filter(f => f.endsWith('.css'));
const jsFiles = assetFiles.filter(f => f.endsWith('.js'));

// Replace stylesheet links with inline style tags
for (const cssFile of cssFiles) {
  const cssContent = fs.readFileSync(path.join(distDir, 'assets', cssFile), 'utf8');
  // Match link tag for this CSS file
  const linkRegex = new RegExp(`<link[^>]*href=["'][^"']*${cssFile}["'][^>]*>`, 'i');
  html = html.replace(linkRegex, `<style>\n${cssContent}\n</style>`);
}

// Replace script tags with inline script tags
for (const jsFile of jsFiles) {
  const jsContent = fs.readFileSync(path.join(distDir, 'assets', jsFile), 'utf8');
  // Match script tag for this JS file
  const scriptRegex = new RegExp(`<script[^>]*src=["'][^"']*${jsFile}["'][^>]*><\\/script>`, 'i');
  html = html.replace(scriptRegex, `<script type="module">\n${jsContent}\n</script>`);
}

// Write to dist and directly to Desktop for instant sharing
const outPathDist = path.join(distDir, 'NudgeBuddy-Sanctuary.html');
const outPathDesktop = path.join(process.env.HOME || '/Users/macjanice', 'Desktop', 'NudgeBuddy-Sanctuary.html');

fs.writeFileSync(outPathDist, html);
fs.writeFileSync(outPathDesktop, html);

console.log(`✅ Standalone single-file HTML generated:`);
console.log(`   -> ${outPathDist}`);
console.log(`   -> ${outPathDesktop}`);
