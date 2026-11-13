import fs from 'node:fs';
import path from 'node:path';

const source = process.cwd();
const target = path.join(source, 'www');

const excluded = new Set([
  '.git', '.github', 'node_modules', 'android', 'www',
  'scripts', '.wrangler', '.vscode', 'dist', 'build',
  'package.json', 'package-lock.json', 'capacitor.config.json',
  'README-APK.md', '.gitignore'
]);

if (!fs.existsSync(path.join(source, 'index.html'))) {
  console.error('ERROR: index.html tidak ditemukan di root repository.');
  console.error('Pastikan kit ini digabungkan dengan repository UsahaKu yang berisi index.html.');
  process.exit(1);
}

fs.rmSync(target, { recursive: true, force: true });
fs.mkdirSync(target, { recursive: true });

function copyDirectory(from, to) {
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (from === source && excluded.has(entry.name)) continue;
    if (entry.name.startsWith('.env')) continue;

    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(dst, { recursive: true });
      copyDirectory(src, dst);
    } else if (entry.isFile()) {
      fs.copyFileSync(src, dst);
    }
  }
}

copyDirectory(source, target);

for (const required of ['index.html']) {
  if (!fs.existsSync(path.join(target, required))) {
    console.error(`ERROR: ${required} gagal disalin ke folder www.`);
    process.exit(1);
  }
}

console.log('Web UsahaKu berhasil disiapkan di folder www/.');
