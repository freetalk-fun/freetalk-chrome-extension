const esbuild = require('esbuild');
const { copy } = require('esbuild-plugin-copy');
const fs = require('fs');
const path = require('path');

// Clean build directory
if (fs.existsSync('./build')) {
  fs.rmSync('./build', { recursive: true });
}

// Create build directories
fs.mkdirSync('./build', { recursive: true });
fs.mkdirSync('./build/static/js', { recursive: true });
fs.mkdirSync('./build/static/media', { recursive: true });

// Build TypeScript files
esbuild.build({
  entryPoints: {
    'background': 'src/background/index.ts',
    'content': 'src/content/index.ts',
  },
  bundle: true,
  outdir: 'build/static/js',
  format: 'iife',
  platform: 'browser',
  target: 'chrome96',
  loader: {
    '.png': 'dataurl',
    '.svg': 'dataurl',
  },
}).then(() => {
  console.log('✓ TypeScript files compiled');

  // Copy public files to build
  const publicFiles = [
    'index.html',
    'popup.js',
    'popup.css',
    'manifest.json',
    'favicon.ico',
    'favicon32.png',
    'favicon48.png',
    'favicon128.png',
    'norwester.otf',
    'Sensei-Medium.otf'
  ];

  publicFiles.forEach(file => {
    const src = path.join('./public', file);
    const dest = path.join('./build', file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`✓ Copied ${file}`);
    }
  });

  // Copy Brandon font directory
  if (fs.existsSync('./public/Brandon-font')) {
    fs.cpSync('./public/Brandon-font', './build/Brandon-font', { recursive: true });
    console.log('✓ Copied Brandon-font directory');
  }

  console.log('\n✓ Build complete!');
  console.log('Build output: ./build');
}).catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});
