# GitHub Workflows

This directory contains GitHub Actions workflows for the Klin project.

## Workflows

### CI (`ci.yml`)

Runs on every push and pull request to `main` and `develop` branches.

**Jobs:**

- **lint-frontend**: Type-checks the React/TypeScript frontend
- **lint-worker**: Lints the Python worker with Ruff
- **build-frontend**: Builds the Vite frontend
- **check-rust**: Checks Rust formatting by clippy

### Release (`release.yml`)

Runs when a version tag (e.g., `v0.1.0`) is pushed, or manually via workflow dispatch.

**Tags:**
- v0.1.0 : Production release
- v0.2.0-beta.1 : Beta release for user testing
- v0.3.0-alpha.1 : Alpha release for early feedback (internal use)

**Jobs:**

1. **build-worker**: Builds the FastAPI worker as a standalone binary using PyInstaller for each platform
2. **build-tauri**: Downloads the worker binary, sets it up as a sidecar, and builds the Tauri app
3. **cleanup**: Removes temporary artifacts

**Supported Platforms:**

| Platform | Target Triple | Runner |
| -------- | ------------------------ | -------------- |
| macOS | aarch64-apple-darwin | macos-latest |
| Windows | x86_64-pc-windows-msvc | windows-latest |

**Note:** CI jobs (linting, type checking, building) run on Linux (ubuntu-latest) for cost efficiency, but releases are only built for Windows and macOS.

## Creating a Release

1. Update version in `package.json`, `src-tauri/tauri.conf.json`, and `src-tauri/Cargo.toml`

2. Commit the changes:

   ```bash
   git add .
   git commit -m "chore: bump version to v0.1.0"
   ```

3. Create and push a tag:

   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```

4. The release workflow will automatically build for all platforms and create a draft release

5. Review the draft release on GitHub and publish when ready

## Secrets Required

- `GITHUB_TOKEN`: Automatically provided by GitHub Actions (used for creating releases)
4. The release workflow will automatically:
   - Build the worker binary for macOS and Windows
   - Build the Tauri app with the worker as a sidecar
   - Create a draft release with installers for both platforms

5. Review the draft release on GitHub and publish when ready

## Secrets Required

- `GITHUB_TOKEN`: Automatically provided by GitHub Actions (used for creating releases)

## How It Works

### CI Pipeline

The CI workflow runs on Linux runners for cost efficiency and includes:

1. **Frontend checks**: Type checking with TypeScript
2. **Worker checks**: Linting and formatting with Ruff
3. **Frontend build**: Building the Vite app to ensure no build errors
4. **Rust checks**: Formatting and Clippy checks for the Tauri backend

### Release Pipeline

The release workflow builds native installers for Windows and macOS:

1. **build-worker**: Uses PyInstaller to create standalone binaries of the FastAPI worker
2. **build-tauri**: Bundles the worker as a Tauri sidecar and builds platform-specific installers
3. **cleanup**: Removes temporary artifacts after successful builds

The worker binary is automatically included in the Tauri app as a sidecar, allowing the app to spawn and manage the Python backend.