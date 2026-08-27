import fs from 'fs';
import { execSync } from 'child_process';

console.log('Capturing frameless widget preview...');
try {
  // Capture clean 440px widget with transparent background
  execSync(`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --screenshot=docs/screenshots/widget-card.png --window-size=440,760 --default-background-color=00000000 http://localhost:5188`);
  console.log('Successfully captured widget-card.png');
} catch (e) {
  console.error('Error capturing:', e);
}
