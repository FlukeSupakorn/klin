# Gemini Project Context: Klin - AI-Powered File Manager

This document provides a comprehensive overview of the Klin project, its architecture, and development conventions to guide future interactions and development.

## 1. Project Overview

Klin is a modern, AI-powered desktop file management application. It is designed with intelligent automation, AI-powered insights, and smart file organization capabilities.

The project is structured as a "monorepo" containing three distinct, interconnected components:

1.  **Frontend (`src/`)**: A **React + TypeScript** application built with Vite. It serves as the primary user interface (UI) for the application. Users interact with all features through this interface.

2.  **Native Backend / Desktop Wrapper (`src-tauri/`)**: A **Tauri v2 + Rust** application. This component wraps the React frontend into a cross-platform desktop application. It provides the frontend with secure access to native OS capabilities, such as file system operations (reading/writing files), managing notes on-disk, and showing native dialogs.

3.  **AI Backend (`worker/`)**: A **Python + FastAPI** service. This is a separate backend server that handles all heavy computational and AI-related tasks. Its responsibilities include document processing, interacting with Large Language Models (LLMs) via `langchain-ollama`, and managing a `LanceDB` vector database for semantic search and analysis.

### Communication Flow

-   **Frontend <-> Native Backend**: The React frontend communicates with the Tauri/Rust layer using the `invoke()` function provided by Tauri's API. This is used for all native operations like file access.
-   **Frontend <-> AI Backend**: The React frontend communicates with the Python/FastAPI worker via standard HTTP requests to a local server, by default running on `http://127.0.0.1:7071`.

## 2. Tech Stack

-   **Frontend (`src/`)**:
    -   Framework: React 19 + Vite
    -   Language: TypeScript
    -   Styling: TailwindCSS with Radix UI primitives
    -   State Management: Zustand
    -   Package Manager: Bun

-   **Native Backend (`src-tauri/`)**:
    -   Framework: Tauri v2
    -   Language: Rust
    -   Package Manager: Cargo

-   **AI Backend (`worker/`)**:
    -   Framework: FastAPI
    -   Language: Python
    -   Key Libraries: `uv` (package manager), `lancedb` (vector DB), `langchain-ollama` (LLM interaction)

## 3. Building and Running the Project

To run the full application, you must start both the **AI Backend** and the **Desktop App** in separate terminal sessions.

### Prerequisites

-   [Bun](https://bun.sh/)
-   [Rust](https://www.rust-lang.org/)
-   [Python](https://www.python.org/) (>=3.13) & [uv](https://github.com/astral-sh/uv)

### Step 1: Install Dependencies

First, install the dependencies for both the frontend and the AI worker.

```bash
# Install frontend dependencies
bun install

# Install AI worker dependencies
cd worker
uv sync
cd ..
```

### Step 2: Run the AI Backend

In your first terminal, navigate to the `worker` directory and start the FastAPI server.

```bash
cd worker
uv run uvicorn app.main:app --host 127.0.0.1 --port 7071 --reload
```

This will start the AI service, which the frontend will call for AI features.

### Step 3: Run the Desktop Application

In your second terminal, run the Tauri development command from the project root.

```bash
bun tauri dev
```

This command will:
1.  Build and run the Rust native backend.
2.  Start the Vite development server for the React frontend.
3.  Launch the desktop application window, which loads the frontend.

## 4. Development Conventions & Quality Checks

The project uses specific commands for linting, formatting, and type-checking across its different parts.

-   **Frontend (TypeScript)**:
    -   **Type Checking**: Run from the root directory.
        ```bash
        bun run tsc --noEmit
        ```

-   **Native Backend (Rust)**:
    -   Navigate to the `src-tauri` directory to run these commands.
    -   **Check**: `cargo check`
    -   **Format Check**: `cargo fmt --check`
    -   **Lint**: `cargo clippy -- -D warnings`

-   **AI Backend (Python)**:
    -   Navigate to the `worker` directory to run these commands.
    -   **Linting & Formatting**: The project uses `ruff`.
        ```bash
        # Check for linting errors
        uv run ruff check .

        # Check for formatting issues
        uv run ruff format --check .
        ```

## 5. Key Architectural Points & Documentation

-   **Tauri Command Wrappers**: All communication from the frontend to the Rust backend is handled through wrapper functions located in `src/lib/tauri-api.ts`. Refer to this file to see how native functionality is exposed.
-   **AI API Wrappers**: The intended location for functions that call the Python AI worker is `src/lib/ai-api.ts`.
-   **In-depth Documentation**: The `docs/` directory contains detailed markdown files for the frontend and native backend:
    -   `docs/FRONTEND.md`: Provides a deep dive into the React components, state management (Zustand), and UI architecture.
    -   `docs/BACKEND.md`: Provides exhaustive documentation for every Tauri command available in the Rust backend, complete with TypeScript examples. This is the source of truth for the native API.
