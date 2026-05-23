// Minimal type shim for `jest-axe`. The package ships no types and there
// is no @types/jest-axe on npm. We only consume `axe()` in tests; the
// custom matcher in vitest.setup.ts handles assertion shape locally.
//
// This file is intentionally a script (no top-level imports/exports) so
// `declare module` creates a fresh ambient declaration.

declare module 'jest-axe' {
  interface AxeNode {
    html?: string;
  }
  interface AxeViolation {
    id?: string;
    description?: string;
    nodes?: AxeNode[];
  }
  export interface AxeResults {
    violations: AxeViolation[];
    passes: unknown[];
    incomplete: unknown[];
    inapplicable: unknown[];
  }
  export function axe(
    target: Element | DocumentFragment | string,
    options?: Record<string, unknown>,
  ): Promise<AxeResults>;
}

// The Vitest assertion augmentation for `.toHaveNoViolations()` lives in
// vitest.setup.ts (alongside the matcher's runtime registration), since
// this file is a script and `declare module 'vitest'` here would
// conflict with vitest's published types instead of augmenting them.
