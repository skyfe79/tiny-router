import { describe, it, expect } from 'vitest';
import createRouter from '../src/index.ts';

describe('Parameter Handling', () => {
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
      result = params;
    });

    router.route('/posts');
    expect(result).toEqual(null);

    router.route('/posts/1');
    expect(result).toEqual({ page: '1' });
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