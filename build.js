import { build } from 'esbuild';
import { copy } from 'esbuild-plugin-copy';
import { existsSync, rmSync, mkdirSync, copyFileSync, cpSync } from 'fs';
import { join } from 'path';

// Clean build directory
if (existsSync('./build')) {
  rmSync('./build', { recursive: true });
}

// Create build directories
mkdirSync('./build', { recursive: true });
mkdirSync('./build/static/js', { recursive: true });
mkdirSync('./build/static/media', { recursive: true });

// Build TypeScript files
build({
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
    const src = join('./public', file);
    const dest = join('./build', file);
    if (existsSync(src)) {
      copyFileSync(src, dest);
      console.log(`✓ Copied ${file}`);
    }
  });

  console.log('\n✓ Build complete!');
  console.log('Build output: ./build');
}).catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});
