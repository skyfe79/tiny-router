import { describe, it, expect } from 'vitest';
import createRouter from '../src/index.js';

describe('Regex Pattern Handling', () => {
  it('should handle pure regex patterns', () => {
    const router = createRouter();
    let result = null;

    router.map(/^\/regex\/(\d+)$/, (params) => {
      result = params;
      return params;
    });

    const output = router.route('/regex/123');
    expect(output).toEqual({});
    expect(result).toEqual({});
  });

  it('should handle complex regex patterns', () => {
    const router = createRouter();
    let result = null;

    router.map('/users/:id([A-Z]{2}\\d{3})', (params) => {
      result = params;
    });

    router.route('/users/AB123');
    expect(result).toEqual({ id: 'AB123' });

    result = null;
    router.route('/users/123');
    expect(result).toBeNull();
  });
}); 