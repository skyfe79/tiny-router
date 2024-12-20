import { describe, it, expect } from 'vitest';
import createTinyRouter from '../src';
import type { RouteParams } from '../src';

describe('Optional Parameters', () => {
  it('should handle both cases with and without optional parameters', () => {
    const router = createTinyRouter();
    const results: RouteParams[] = [];

    router.map('/posts/:page?', (params) => {
      results.push(params);
    });

    router.route('/posts/1');
    router.route('/posts/1/');
    router.route('/posts');
    router.route('/posts/');

    expect(results).toEqual([
      { page: '1' },
      { page: '1' },
      {},
      {},
    ]);
  });

  it('should handle multiple optional parameters', () => {
    const router = createTinyRouter();
    const results: RouteParams[] = [];

    router.map('/users/:userId?/posts/:postId?', (params) => {
      results.push({ ...params });
    });

    router.route('/users/123/posts/456');
    router.route('/users/123/posts/456/');
    router.route('/users/123/posts');
    router.route('/users/123/posts/');
    router.route('/users');
    router.route('/users/');

    expect(results).toEqual([
      { userId: '123', postId: '456' },
      { userId: '123', postId: '456' },
      { userId: '123' },
      { userId: '123' },
      {},
      {},
    ]);
  });

  it('should handle mixed optional and required parameters', () => {
    const router = createTinyRouter();
    const results: RouteParams[] = [];

    router.map('/users/:userId/posts/:postId?', (params) => {
      results.push({ ...params });
      console.log(results);
    });

    router.route('/users/123/posts/456');
    router.route('/users/123/posts/456/');
    router.route('/users/123/posts');
    router.route('/users/123/posts/');
    router.route('/users/123');
    router.route('/users/123/');

    expect(results).toEqual([
      { userId: '123', postId: '456' },
      { userId: '123', postId: '456' },
      { userId: '123' },
      { userId: '123' },
    ]);
  });
}); 