# FreeTalk Dictionary Chrome Extension

A Chrome extension that provides instant word definitions when you double-click any word on a webpage.

## Features

- 🔍 Double-click any word to get its definition
- 📚 Multiple meanings and examples for each word
- 🎨 Clean, professional tooltip interface
- ⚙️ Toggle the dictionary on/off from the extension popup

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Building

Build the extension for production:

```bash
npm run build
```

This will create a `build/` directory with all the extension files ready to load into Chrome.

### Loading the Extension in Chrome

1. Build the extension using `npm run build`
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the `build/` directory

## Project Structure

```
├── src/
│   ├── background/     # Background service worker
│   └── content/        # Content script (runs on web pages)
├── public/             # Static files copied to build
│   ├── index.html      # Extension popup HTML
│   ├── popup.js        # Popup functionality
│   ├── popup.css       # Popup styles
│   └── manifest.json   # Extension manifest
├── build.js            # Build script using esbuild
└── package.json
```

## Tech Stack

- TypeScript
- esbuild (fast bundler)
- Tippy.js (tooltips)
- webextension-polyfill (cross-browser compatibility)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

See LICENSE file for details.
