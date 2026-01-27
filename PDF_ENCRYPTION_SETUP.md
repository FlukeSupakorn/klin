# PDF Encryption Feature - Setup Guide

## Overview
Your app now has **real PDF password encryption** using qpdf (bank-style AES-256 encryption). Files encrypted in your app will require a password in any PDF viewer (Adobe, Preview, etc.).

## Prerequisites
You need to install qpdf on your system:

### Windows
```powershell
winget install qpdf
```
Or using Chocolatey:
```powershell
choco install qpdf
```

### macOS
```bash
brew install qpdf
```

### Linux (Debian/Ubuntu)
```bash
sudo apt install qpdf
```

## How It Works

### Encrypt a PDF
1. In the file list, find any PDF file
2. Look for the lock icon (🔒) button next to it
3. Click the lock icon
4. Enter a password (min 6 characters)
5. Confirm the password
6. Click "Encrypt"
7. The file is now password-protected

### Decrypt a PDF
1. Click the **shield icon** (🛡️) on an encrypted PDF
2. A dialog appears showing the file is encrypted
3. Enter the password
4. Click "Decrypt"
5. The file's encryption is removed

### Features
- ✅ Real AES-256 encryption (not just metadata)
- ✅ Works in Adobe Reader, Preview, any PDF viewer
- ✅ Encrypted PDFs show a shield icon on the card
- ✅ Unencrypted PDFs show a faint lock icon to encrypt
- ✅ Auto-backup before encryption/decryption
- ✅ Password confirmation when encrypting

## Technical Details

### Backend (Rust + qpdf)
- `encrypt_pdf(filePath, password)` - Encrypts a PDF with 256-bit encryption
- `decrypt_pdf(filePath, password)` - Removes encryption (requires correct password)
- `check_is_encrypted(filePath)` - Checks if a PDF is encrypted
- `checkQpdfAvailable()` - Verifies qpdf is installed

### Frontend (React)
- `EncryptFileDialog` - UI for encrypting PDFs
- `EncryptionInfoDialog` - UI for decrypting/viewing encryption status
- FileListView displays encryption icons dynamically

### Files
- Backend: `src-tauri/src/encryption.rs`
- Frontend: `src/components/EncryptionInfoDialog.tsx`, `src/components/EncryptFileDialog.tsx`
- API Bridge: `src/lib/tauri-api.ts`

## Notes
- A backup file (`.backup`) is automatically created before encryption/decryption
- If qpdf is not installed, you'll see a helpful error message with installation instructions
- Passwords are case-sensitive
- There is no "reset password" option - users must remember their password
