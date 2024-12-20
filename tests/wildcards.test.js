import { describe, it, expect } from 'vitest';
import createRouter from '../src/index.js';

describe('Wildcard Handling', () => {
  it('should handle wildcard patterns', () => {
    const router = createRouter();
    let result = null;

    router.map('/files/*', (params) => {
      result = params;
      return params;
    });

    const output = router.route('/files/docs/example.txt');
    expect(output).toEqual({ wildcard: 'docs/example.txt' });
    expect(result).toEqual({ wildcard: 'docs/example.txt' });
  });

  it('should handle multiple wildcards', () => {
    const router = createRouter();
    let result = null;

    router.map('/*/*/*', (params) => {
      result = params;
      return params;
    });

    const output = router.route('/products/electronics/phones');
    expect(output).toEqual({ 
      wildcards: ['products', 'electronics', 'phones']
    });
  });

  it('should handle route priority correctly', () => {
    const router = createRouter();
    let result = null;

    router.map('/items/:id', (params) => {
      result = { specific: params };
    });

    router.map('/items/*', (params) => {
      result = { wildcard: params };
    });

    router.route('/items/123');
    expect(result).toEqual({ specific: { id: '123' } });
  });
}); 