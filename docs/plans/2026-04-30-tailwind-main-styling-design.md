# Tailwind Main Styling Design

## Decision

Tailwind CSS becomes the primary styling approach for this frontend project.

## Scope

1. Install Tailwind in the Vite React TypeScript stack.
2. Configure Vite to load Tailwind through the official Vite plugin.
3. Replace the current custom global component styling with Tailwind utility classes.
4. Keep `src/index.css` minimal and limited to Tailwind import plus small base tokens only when needed.
5. Update README so future work follows a Tailwind-first workflow.

## Rationale

1. The project is still at an initial stage, so changing styling strategy now is low-risk.
2. Tailwind fits reusable component development well because styling stays close to the component markup.
3. This keeps future UI work faster, especially for dashboard and admin-style interfaces.

## Constraints

1. Keep the changes minimal and avoid introducing extra UI libraries.
2. Preserve the current initial structure of components, layouts, hooks, services, and utils.
3. Ensure build and lint still pass after migration.

## Expected Outcome

1. The landing page renders with Tailwind utility classes instead of custom CSS selectors.
2. The project is ready for future reusable UI components using a Tailwind-first pattern.
