import { describe, it, expect } from 'vitest';
import createRouter from '../src/index';
import type { RouteParams } from '../src/index';

describe('Basic Routing', () => {

  it('should handle root path', () => {
    const router = createRouter();
    let result: RouteParams | null = null;

    router.map('/', (params) => {
      result = params;
    });

    router.route('/');
    expect(result).toEqual({});
  });
  
  it('should handle basic parameter routes', () => {
    const router = createRouter();
    let result: RouteParams | null = null;

    router.map('/users/:id', (params) => {
      result = params;
    });

    router.route('/users/123');
    expect(result).toEqual({ id: '123' });
  });

  it('should return null for non-matching routes', () => {
    const router = createRouter();
    let result: string | RouteParams = 'unchanged';

    router.map('/users/:id', (params) => {
      result = params;
    });

    const output = router.route('/not/found');
    expect(output).toBeNull();
    expect(result).toBe('unchanged');
  });

  it('should handle paths with hyphens and dots', () => {
    const router = createRouter();
    let result: RouteParams | null = null;

    router.map('/api/v1.0/users/:id', (params) => {
      result = params;
    });

    router.route('/api/v1.0/users/123');
    expect(result).toEqual({ id: '123' });
  });

  it('should handle query parameters', () => {
    const router = createRouter();
    let result: RouteParams | null = null;

    router.map('/search/:query', (params) => {
      result = params;
    });

    router.route('/search/javascript?page=1&sort=desc');
    expect(result).toEqual({ query: 'javascript' });
  });
}); 