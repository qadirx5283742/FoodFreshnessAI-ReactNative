# Contributing

Thank you for your interest in contributing to FoodFreshnessAI! We welcome improvements, bug fixes, and documentation updates. Please follow the guidelines below to make the process smooth.

Getting started

1. Fork the repository and create a feature branch from main:
   ```bash
   git checkout -b feat/your-feature
   ```
2. Install dependencies and start the app locally:
   ```bash
   npm install
   npm run start
   ```

Branching and PRs

- Use descriptive branch names like `feat/`, `fix/`, or `chore/` (e.g., `feat/scan-ui`).
- Open pull requests against the `main` branch and provide a clear description of the change, rationale, and screenshots for UI changes.

Code style & checks

- This is a TypeScript-first project. Please follow existing code patterns and types.
- Run the linter and type checker before opening a PR:
  ```bash
  npm run lint
  npm run typecheck
  ```

Testing & screenshots

- Include tests where appropriate. If you add UI changes, include screenshots in `assets/screenshots/` and update `README.md` to reference them.
- Recommended screenshot filenames:
  - `scan.png`
  - `product-details.png`

Commit messages

- Use clear, concise commit messages. For example:
  - `feat: add scan history view`
  - `fix: correct camera permission flow`
  - `chore: update dependencies`

Pull request checklist

- [ ] The branch is up-to-date with `main`.
- [ ] Linting passes (`npm run lint`).
- [ ] Typecheck passes (`npm run typecheck`).
- [ ] Screenshots added for UI changes and README updated.

Thank you for contributing — we appreciate your help improving FoodFreshnessAI!
