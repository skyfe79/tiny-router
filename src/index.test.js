import { describe, it, expect } from 'vitest';
import createRouter from './index.js';

describe('createRouter', () => {
  it('should handle basic parameter routes', () => {
    const router = createRouter();
    let result = null;

    router.map('/users/:id', (params) => {
      result = params;
    });

    router.route('/users/123');
    expect(result).toEqual({ id: '123' });
  });

  it('should handle regex constrained parameters', () => {
    const router = createRouter();
    let result = null;

    router.map('/users/:userId(\\d+)', (params) => {
      result = params;
    });

    router.route('/users/123');
    expect(result).toEqual({ userId: '123' });
    
    result = null;
    router.route('/users/abc');
    expect(result).toBeNull();
  });

  it('should handle optional parameters', () => {
    const router = createRouter();
    let result = null;

    router.map('/posts/:page?', (params) => {
      console.log('1', params);
      result = params;
    });

    router.route('/posts');
    expect(result).toEqual(null);

    router.route('/posts/1');
    expect(result).toEqual({ page: '1' });
  });

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

  it('should handle paths with hyphens and dots', () => {
    const router = createRouter();
    let result = null;

    router.map('/api/v1.0/users/:id', (params) => {
      result = params;
    });

    router.route('/api/v1.0/users/123');
    expect(result).toEqual({ id: '123' });
  });

  it('should handle multiple parameters in one route', () => {
    const router = createRouter();
    let result = null;

    router.map('/users/:userId/posts/:postId', (params) => {
      result = params;
    });

    router.route('/users/123/posts/456');
    expect(result).toEqual({ userId: '123', postId: '456' });
  });

  it('should return null for non-matching routes', () => {
    const router = createRouter();
    let result = 'unchanged';

    router.map('/users/:id', (params) => {
      result = params;
    });

    const output = router.route('/not/found');
    expect(output).toBeNull();
    expect(result).toBe('unchanged');
  });

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

  it('should handle query parameters', () => {
    const router = createRouter();
    let result = null;

    router.map('/search/:query', (params) => {
      result = params;
    });

    router.route('/search/javascript?page=1&sort=desc');
    expect(result).toEqual({ query: 'javascript' });
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

  it('should handle consecutive parameters', () => {
    const router = createRouter();
    let result = null;

    router.map('/api/:version/:resource/:id', (params) => {
      result = params;
    });

    router.route('/api/v1/users/123');
    expect(result).toEqual({ 
      version: 'v1',
      resource: 'users',
      id: '123'
    });
  });
}); 