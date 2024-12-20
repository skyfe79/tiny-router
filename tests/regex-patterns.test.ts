import { describe, it, expect } from 'vitest';
import createTinyRouter from '../src/index';
import type { RouteParams } from '../src/index';

describe('Regex Pattern Handling', () => {
  it('should handle regex patterns directly', () => {
    const router = createTinyRouter();
    let result: RouteParams | null = null;

    router.map(/^\/users\/(\d+)$/, (params) => {
      result = params;
    });

    router.route('/users/123');
    expect(result).toEqual({});

    const noMatch = router.route('/users/abc');
    expect(noMatch).toBeNull();
  });

  it('should handle complex regex patterns', () => {
    const router = createTinyRouter();
    let result: RouteParams | null = null;

    router.map('/users/:id([A-Z]{2}\\d{3})', (params) => {
      result = params;
    });

    router.route('/users/AB123');
    expect(result).toEqual({ id: 'AB123' });

    const noMatch = router.route('/users/123');
    expect(noMatch).toBeNull();
  });
}); 