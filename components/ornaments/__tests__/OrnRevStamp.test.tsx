import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { OrnRevStamp } from '../OrnRevStamp';

describe('OrnRevStamp', () => {
  it('renders the rev label and number', () => {
    const { getByText } = render(<OrnRevStamp rev="3.2" />);
    expect(getByText(/REV/)).toBeInTheDocument();
    expect(getByText(/3\.2/)).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<OrnRevStamp rev="3.2" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
