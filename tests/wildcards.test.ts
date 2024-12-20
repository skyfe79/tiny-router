import { describe, it, expect } from 'vitest';
import createTinyRouter from '../src/index';
import type { RouteParams } from '../src/index';

describe('Wildcard Handling', () => {
  it('should handle wildcard patterns', () => {
    const router = createTinyRouter();
    let result: RouteParams | null = null;

    router.map('/files/*', (params) => {
      result = params;
    });

    router.route('/files/documents/report.pdf');
    expect(result).toEqual({ wildcard: 'documents/report.pdf' });
  });

  it('should handle multiple wildcards', () => {
    const router = createTinyRouter();
    let result: RouteParams | null = null;

    router.map('/*/*/*', (params) => {
      result = params;
    });

    router.route('/users/123/posts');
    expect(result).toEqual({
      wildcards: ['users', '123', 'posts']
    });
  });

  it('should handle route priority correctly', () => {
    const router = createTinyRouter();
    const results: string[] = [];

    router.map('/items/:id', () => {
      results.push('params');
    });

    router.map('/items/*', () => {
      results.push('wildcard');
    });

    router.route('/items/123');
    router.route('/items/abc');
    expect(results).toEqual(['params', 'params']);
  });
}); 