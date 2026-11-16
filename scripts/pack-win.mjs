// Builds the Windows desktop program into release/ and zips it.
//
//   npm run pack:win
//
// Output:
//   release/EWD Dashboard-win32-x64/          the program (run "EWD Dashboard.exe")
//   release/EWD-Dashboard-win32-x64.zip       the same folder, ready to send

import { packager } from '@electron/packager';
import { execFileSync } from 'node:child_process';
import { existsSync, rmSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
const release = path.join(root, 'release');

if (!existsSync(path.join(root, 'dist', 'index.html'))) {
  throw new Error('dist/ is missing. Run "npm run build" first (npm run pack:win does this).');
}

rmSync(release, { recursive: true, force: true });

const [appDir] = await packager({
  dir: root,
  out: release,
  name: pkg.productName,
  platform: 'win32',
  arch: 'x64',
  overwrite: true,
  prune: true,
  asar: true,
  appVersion: pkg.version,
  // Only what the program needs at runtime: the built site and the Electron
  // entry. Every library is already bundled into dist/, so node_modules,
  // source, scripts and Apps Script stay out.
  ignore: [
    /^\/node_modules($|\/)/, /^\/package-lock\.json$/,
    /^\/src($|\/)/, /^\/apps-script($|\/)/, /^\/scripts($|\/)/, /^\/public($|\/)/,
    /^\/release($|\/)/, /^\/\.git($|\/)/, /^\/index\.html$/, /^\/vite\.config\.js$/,
    /^\/README\.md$/, /^\/vercel\.json$/, /^\/\.gitignore$/,
  ],
});

const zip = path.join(release, `EWD-Dashboard-win32-x64.zip`);
execFileSync('powershell.exe', [
  '-NoProfile', '-Command',
  `Compress-Archive -Path '${appDir}' -DestinationPath '${zip}' -Force`,
], { stdio: 'inherit' });

console.log(`\nProgram folder: ${appDir}`);
console.log(`Zip:            ${zip}`);
