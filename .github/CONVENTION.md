# Pre-Push Convention Guide

This guide outlines the checks you should run locally before pushing code to ensure CI passes.

## Quick Checklist

| Component | Command | Description |
| --------- | ------- | ----------- |
| Frontend | `bun run tsc --noEmit` | TypeScript type checking |
| Frontend | `bun run build` | Build verification |
| Worker | `uv run ruff check .` | Python linting |
| Worker | `uv run ruff format --check .` | Python format checking |
| Tauri | `cargo fmt --check` | Rust formatting |
| Tauri | `cargo clippy -- -D warnings` | Rust linting |
| Tauri | `cargo check` | Rust compilation check |

---

## Frontend (React/TypeScript)

Run these commands from the **project root**:

### 1. Type Check

```bash
bun run tsc --noEmit
```

This checks for TypeScript errors without emitting files. Fix any type errors before pushing.

### 2. Build Verification

```bash
bun run build
```

Ensures the Vite build completes successfully.

### Common Issues

- Missing type annotations
- Unused imports or variables
- Incorrect prop types in React components
- Missing dependencies in `package.json`

---

## Worker (Python/FastAPI)

Run these commands from the **`worker/` directory**:

```bash
cd worker
```

### 1. Lint with Ruff

```bash
uv run ruff check .
```

Checks for Python code quality issues. To auto-fix some issues:

```bash
uv run ruff check --fix .
```

### 2. Format Check

```bash
uv run ruff format --check .
```

Verifies code formatting. To auto-format:

```bash
uv run ruff format .
```

### Common Issues

- Unused imports
- Line length violations
- Missing docstrings
- Incorrect import ordering

---

## Tauri (Rust Backend)

Run these commands from the **`src-tauri/` directory**:

```bash
cd src-tauri
```

### 1. Format Check

```bash
cargo fmt --check
```

Checks Rust code formatting. To auto-format:

```bash
cargo fmt
```

### 2. Clippy (Linting)

```bash
cargo clippy -- -D warnings
```

Runs the Rust linter with warnings treated as errors.

### 3. Compilation Check

```bash
cargo check
```

Verifies the code compiles without building the full binary.

### Common Issues

- Unused variables (prefix with `_` if intentional)
- Missing error handling
- Clippy warnings about code style
- Formatting inconsistencies

---

## Run All Checks (Recommended)

Create a script or run these commands in sequence before pushing:

```bash
# From project root

# Frontend checks
echo "=== Frontend Type Check ==="
bun run tsc --noEmit

echo "=== Frontend Build ==="
bun run build

# Worker checks
echo "=== Worker Lint ==="
cd worker && uv run ruff check . && uv run ruff format --check .
cd ..

# Tauri checks
echo "=== Tauri Rust Check ==="
cd src-tauri && cargo fmt --check && cargo clippy -- -D warnings && cargo check
cd ..

echo "=== All checks passed! ==="
```

---

## Auto-Fix Commands

If you encounter issues, use these commands to auto-fix where possible:

| Component | Command | Description |
| --------- | ------- | ----------- |
| Worker | `uv run ruff check --fix .` | Auto-fix Python lint issues |
| Worker | `uv run ruff format .` | Auto-format Python code |
| Tauri | `cargo fmt` | Auto-format Rust code |

> **Note:** TypeScript errors must be fixed manually.

---

## IDE Setup Recommendations

### VS Code Extensions

- **Frontend**: ESLint, TypeScript, Tailwind CSS IntelliSense
- **Worker**: Ruff, Python
- **Tauri**: rust-analyzer

### Enable Format on Save

Add to your VS Code settings:

```json
{
  "editor.formatOnSave": true,
  "[rust]": {
    "editor.defaultFormatter": "rust-lang.rust-analyzer"
  },
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff"
  }
}
```

---

## Troubleshooting

### Frontend: `bun install` fails

Ensure you have the correct Bun version and run:

```bash
bun install --frozen-lockfile
```

### Worker: Dependencies not found

Ensure uv is installed and run:

```bash
cd worker
uv sync --frozen
```

### Tauri: Missing system dependencies (Linux)

Install required libraries:

```bash
sudo apt-get install -y libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf
```

---

## Summary

Always run the relevant checks for the parts of the codebase you modified:

- **Modified `src/`** → Run Frontend checks
- **Modified `worker/`** → Run Worker checks  
- **Modified `src-tauri/`** → Run Tauri checks

This ensures the CI pipeline has the highest chance of passing on the first try! 🚀
