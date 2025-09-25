# Repository Guidelines

## Project Structure & Module Organization

- `src/` contains React entry points `main.jsx`, `App.jsx`, and shared assets under `src/assets/`. Add new views or components under `src` with folder-per-feature structure if scope grows.
- `public/` holds static files served verbatim; use it for favicons or configuration payloads that cannot be bundled.
- `index.html` is the Vite root template; adjust document metadata there when branding updates are needed.
- `vite.config.js` configures bundling and plugins; update it when introducing path aliases, environment variables, or Tailwind changes.

## Build, Test, and Development Commands

- `npm run dev` launches the Vite dev server with HMR on `http://localhost:5173`.
- `npm run build` produces the production bundle in `dist/`; run before any deployment artifact is generated.
- `npm run preview` serves the latest build locally to validate production behavior.
- `npm run lint` runs ESLint using `eslint.config.js`; fix warnings before requesting review.

## Coding Style & Naming Conventions

- Favor React 19 function components, ES modules, 2-space indentation, single quotes, and trailing commas to mirror existing code.
- Name components with PascalCase (e.g., `UserCard.jsx`) and hooks/utilities with camelCase (`useFetch.js`).
- Co-locate styles via CSS modules or Tailwind utilities; remove unused imports to satisfy the enforced `no-unused-vars` rule.
- Run editor formatters sparingly; rely on ESLint and Prettier-equivalent tooling to avoid churn.

## Testing Guidelines

- Automated tests are not bundled yet; integrate Vitest + React Testing Library under `src/__tests__/` when adding complex logic.
- Name test files `ComponentName.test.jsx`; cover state transitions, edge props, and accessibility checks.
- When introducing tests, include `npm run test -- --coverage` output in PR notes until a dedicated script is added.

## Commit & Pull Request Guidelines

- Write concise, imperative commit subjects (e.g., `Add hero CTA layout`) and squash trivial WIP commits before pushing.
- Each PR description should outline the change set, list affected routes/components, and link Jira or GitHub issues.
- Attach UI screenshots or GIFs for any visible change and document manual test steps (browser/device) prior to review.

## 요청

답변은 한글로 해줘.
commit and push 메시지를 한글로 작성해줘.
