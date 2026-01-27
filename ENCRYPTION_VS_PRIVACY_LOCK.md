# Understanding Two Lock Features: Privacy Lock vs. File Encryption

Your application now has **two distinct "lock" features** to protect your files. It's important to understand the difference:

## 🔒 Privacy Lock (Amber/Yellow Lock)

**What it does:** Prevents files from being sent to AI models for processing (e.g., organizing, analyzing, or generating summaries).

**Visual appearance:**
- **Amber/Yellow "LOCKED" badge** on the file card
- Small amber lock icon in the corner
- File appears slightly faded (opacity reduced)

**How to use it:**
1. Select a file
2. Click the amber lock icon to toggle privacy protection
3. When locked, the file will not be included in any AI operations

**Where to control it:** Privacy settings panel, or click the lock icon on the file card

**Stored:** In local privacy store (not file-level metadata)

---

## 🛡️ File Encryption (Blue Shield)

**What it does:** Encrypts the PDF file itself using AES-256 encryption (bank-grade). The encrypted PDF can be opened in any PDF reader (like Adobe Reader) if you know the password.

**Visual appearance:**
- **Blue Shield icon** on the file card
- Appears in top-right corner of grid cards
- Appears next to file icon in tab view
- Also shows in list view table

**How to use it:**
1. Click the blue shield icon (or click the unencrypted lock icon on unencrypted PDFs)
2. Enter and confirm a password (minimum 6 characters)
3. The PDF is now encrypted - you'll need the password to open it anywhere
4. To decrypt: Click the shield icon → Enter password

**Important:**
- Your password is **not saved** - remember it!
- Encrypted PDFs work outside this app (in Adobe Reader, email, etc.)
- Only PDFs can be encrypted (not Word, Excel, etc.)
- Decryption creates a backup copy before removing encryption

---

## Quick Comparison

| Feature | Privacy Lock | File Encryption |
|---------|-------------|-----------------|
| **Purpose** | Exclude from AI | Secure with password |
| **Icon Color** | Amber/Yellow | Blue Shield |
| **Works Outside App?** | No | Yes (in any PDF reader) |
| **Password Protected?** | No | Yes |
| **Encryption Standard** | N/A | AES-256 |
| **Storage** | Privacy store | In the PDF file itself |
| **Reversible?** | Yes (1-click unlock) | Yes (need password) |

---

## Examples

### Privacy Locked File
- Shows **amber "LOCKED" badge**
- Will NOT be processed by AI
- Can still be opened in the app normally
- Can be unlocked by clicking lock icon

### Encrypted File (Privacy + Encryption)
- Shows **both amber badge AND blue shield**
- Will NOT be processed by AI (privacy locked)
- **AND** cannot be opened without the password
- Can be decrypted by clicking the shield icon

---

## Requirement: Install qpdf

File encryption requires the `qpdf` tool to be installed:

**On Windows (with winget):**
```bash
winget install --id qpdf
```

**On macOS (with Homebrew):**
```bash
brew install qpdf
```

**On Linux (apt):**
```bash
sudo apt-get install qpdf
```

After installing, restart the app to use encryption features.
