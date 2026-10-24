# Agent Guidelines for portfolio-hnoga

## 1. Project Overview & Architecture
- **Repository**: Personal developer portfolio website and LaTeX resume for Nguyen Huy Hoang.
- **Architecture**: Single-page static web application (`index.html`) deployed on GitHub Pages.
- **Tech Stack**:
  - HTML5, Vanilla CSS, Tailwind CSS (CDN for immediate preview in `index.html`, Tailwind CLI v3.4.1 for local stylesheet compilation).
  - Font Awesome 6.4.0 (via CDN), Inter font family.
  - LaTeX for resume (`cv.tex` -> `NguyenHuyHoang_CV_Jan.pdf`).
  - Tooling: Node.js / npm (`package.json` with Tailwind CSS v3).

## 2. Directory Structure & Key Files
- `index.html`: Main entry point containing all sections (About, Education, Skills, Experience, Projects).
- `style.css`: Tailwind entry directive file (`@tailwind base; @tailwind components; @tailwind utilities;`).
- `tailwind.config.js`: Tailwind CSS configuration (content paths and custom theme extensions).
- `output.css`: Compiled Tailwind CSS stylesheet.
- `assets/img/`: Project images, avatars, and visual assets.
- `cv.tex` & `NguyenHuyHoang_CV_Jan.pdf`: LaTeX resume source and precompiled PDF (independent from `index.html`).
- `.vscode/settings.json`: VS Code Live Server configuration (default port: `5501`).
- `package.json`: Contains devDependencies and build scripts.
- `.gitignore`: Configured to ignore dependencies, logs, OS files, and LaTeX build artifacts.

## 3. Safety Rules & Constraints
- **Preserve git cleanliness**: Always verify `git status` before and after operations. Do not commit unnecessary temporary files.
- **No unwanted LaTeX synchronization**: Do NOT force synchronization of content between `index.html` and `cv.tex`. Keep `index.html` updates self-contained unless explicitly asked to modify `cv.tex`.
- **Preserve asset paths**: Image assets must reside in `assets/img/` and be referenced using relative paths (e.g. `./assets/img/avatar.png`).
- **No unnecessary dependency additions**: Do not install external libraries or heavy dependencies unless explicitly requested.

## 4. Development Workflow & Commands

### Running Locally (Live Preview)
This is a static site without a backend server.
- **VS Code Live Server**: Open `index.html` and start Live Server (runs on port `5501` as configured in `.vscode/settings.json`).
- **Alternative CLI static servers**:
  ```powershell
  npx serve .
  # or
  python -m http.server 5501
  ```

### Build Commands (Tailwind CSS)
Scripts are configured in `package.json`:
- **Build stylesheet**:
  ```powershell
  npm run build
  # Runs: tailwindcss -i ./style.css -o ./output.css
  ```
- **Build for production (minified)**:
  ```powershell
  npm run build:prod
  # Runs: tailwindcss -i ./style.css -o ./output.css --minify
  ```
- **Watch mode (auto-rebuild on file change)**:
  ```powershell
  npm run watch
  # Runs: tailwindcss -i ./style.css -o ./output.css --watch
  ```

### Testing & Verification
- **Automated Tests**: **None**. There is no automated testing suite (Jest, Vitest, Cypress, Playwright, etc.) in this repository.
- **Manual Verification**: Test changes by launching the local preview server and visually verifying responsiveness (desktop, tablet, mobile), link integrity, and styling across browsers.

## 5. Coding Standards & Conventions
- **HTML Semantics**:
  - Use clean HTML5 semantic tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<a>`, `<button>`).
  - Maintain smooth scrolling (`<html class="scroll-smooth">`).
  - Maintain responsive container max-widths (`max-w-4xl mx-auto px-6`).
- **Styling Conventions**:
  - Primary color palette: `primary: '#4f46e5'` (Indigo 600), `secondary: '#64748b'` (Slate 500).
  - Background & text colors: `bg-slate-50`, `text-slate-900`, `text-slate-600`.
  - When introducing custom styles, update both `tailwind.config.js` and the inline `tailwind.config` in `index.html` to ensure visual parity between CDN and local builds.
- **Git Commit Conventions**:
  - Follow concise commit messages matching project history:
    - `fix: <description>` (e.g., `fix: feature education`)
    - `style: <description>` (e.g., `style: change layout`)
    - `Update index.html`

## 6. Definition of Done (Completion Criteria)
Before concluding any task:
1. Verify `index.html` is well-formed without broken tags or dead anchors.
2. If styling changes affect `output.css`, run `npm run build` (or `npm run build:prod`) and ensure it completes with exit code 0.
3. Review `git status` to ensure only intended files were modified.
4. Manually verify the visual display across desktop and mobile screen widths.
