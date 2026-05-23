import '@testing-library/jest-dom/vitest';
import { expect } from 'vitest';

interface AxeViolation {
  id?: string;
  description?: string;
  nodes?: Array<{ html?: string }>;
}

// jest-axe's bundled `toHaveNoViolations` reaches into Jest matcher internals
// (`this.utils.matcherHint`) that Vitest 4 doesn't expose. We re-implement
// the matcher locally — same shape, just reads `results.violations.length`
// and formats them ourselves.
expect.extend({
  toHaveNoViolations(received: { violations?: AxeViolation[] }) {
    const violations = received?.violations ?? [];
    const pass = violations.length === 0;
    const message = () =>
      pass
        ? 'Expected accessibility violations, but found none.'
        : 'Expected no accessibility violations. Found:\n' +
          violations
            .map((v, i) => {
              const nodes = (v.nodes ?? []).map((n) => '      ' + (n.html ?? '')).join('\n');
              return `  ${i + 1}. ${v.id ?? 'rule'}: ${v.description ?? ''}\n${nodes}`;
            })
            .join('\n');
    return { pass, message };
  },
});
