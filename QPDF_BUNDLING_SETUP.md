# PDF Encryption Setup Guide: Bundling qpdf

This app uses **bundled qpdf** for PDF encryption. No user installation required!

## For Developers (Local Development)

### Option 1: Install qpdf Locally (Recommended for Development)

This allows `tauri run dev` to work immediately.

#### Windows
```bash
winget install qpdf
```

#### macOS
```bash
brew install qpdf
```

#### Linux
```bash
sudo apt install qpdf
```

### Option 2: Use Bundled Binaries

If you don't want to install qpdf globally, place pre-built binaries here:

- **Windows**: `src-tauri/bin/qpdf.exe`
- **macOS**: `src-tauri/bin/qpdf`
- **Linux**: `src-tauri/bin/qpdf`

The app will automatically use bundled binaries if they exist, otherwise fall back to system installation.

---

## For Production (Building Distributable App)

### Step 1: Get qpdf Binaries for All Platforms

You need one qpdf binary per OS/architecture:

#### Windows x64
```bash
# Download from: https://github.com/qpdf/qpdf/releases
# Look for: qpdf-X.X.X-w64.zip (64-bit Windows)
# Extract qpdf.exe to: src-tauri/bin/qpdf.exe
```

#### macOS (Intel & Apple Silicon)
```bash
# Intel (x86_64)
brew install qpdf
cp $(which qpdf) src-tauri/bin/qpdf-macos-x86_64

# Apple Silicon (arm64)
# If on Apple Silicon:
# qpdf is already in /opt/homebrew/bin/qpdf
cp /opt/homebrew/bin/qpdf src-tauri/bin/qpdf-macos-arm64

# If on Intel, you'll need to cross-compile or get from CI/CD
```

#### Linux x64
```bash
# Ubuntu/Debian
sudo apt install qpdf
cp /usr/bin/qpdf src-tauri/bin/qpdf-linux-x64

# Or from AppImage/prebuilt releases
```

### Step 2: Update Tauri Config

Update `src-tauri/tauri.conf.json`:

```json
{
  "build": {
    "externalBin": [
      "bin/qpdf"
    ]
  }
}
```

### Step 3: Build & Test

```bash
# Development
bun run tauri dev

# Production build (will bundle binaries)
bun run tauri build
```

---

## File Structure After Setup

```
klin/
└── src-tauri/
    ├── bin/
    │   ├── qpdf.exe              (Windows)
    │   ├── qpdf                  (macOS/Linux)
    │   └── (optional: other OS versions)
    └── src/
        └── encryption.rs         (already configured)
```

---

## How It Works

1. **Development (`tauri run dev`)**: Uses system qpdf or bundled binary
2. **Production build**: Includes qpdf binary in installer/bundle
3. **User**: Just installs app, encryption works immediately ✅

---

## Licensing

qpdf is Apache 2.0 licensed. When bundling:
- ✅ Copy LICENSE from qpdf repo
- ✅ Include in your app's license file
- ✅ Include notice in credits

---

## Troubleshooting

### "qpdf not found" error during development
- Install locally: `winget install qpdf` (Windows) or `brew install qpdf` (macOS)
- OR place binary in `src-tauri/bin/`

### App works in dev but fails after build
- Ensure binary paths are correct in `tauri.conf.json`
- Check file permissions on bundled binary (`chmod +x bin/qpdf` on macOS/Linux)

### Cross-platform builds
For CI/CD, you'll need to build on each OS or use cross-compilation tools.

---

## Quick Setup (Next 5 Minutes)

For Windows development:
```bash
# 1. Install qpdf
winget install qpdf

# 2. Verify
tauri run dev

# 3. Try encrypting a PDF!
```

Done! 🎉
