import { describe, it, expect } from 'vitest';
import createRouter from '../src/index';

describe('Async Handler Tests', () => {
  it('should handle async route handler', async () => {
    const router = createRouter();
    router.map('/users/:id', async (params) => {
      return { id: params.id, name: 'John Doe' };
    });

    const result = await router.route('/users/123');
    expect(result).toEqual({ id: '123', name: 'John Doe' });
  });

  it('should handle async route handler with error', async () => {
    const router = createRouter();
    router.map('/users/:id', async () => {
      throw new Error('User not found');
    });

    await expect(router.route('/users/123')).rejects.toThrow('User not found');
  });

  it('should handle multiple async operations', async () => {
    const router = createRouter();
    router.map('/posts/:id/comments', async (params) => {
      const post = { id: params.id, title: 'Test Post' };
      const comments = [
        { id: 1, text: 'Comment 1' },
        { id: 2, text: 'Comment 2' }
      ];
      
      return { post, comments };
    });

    const result = await router.route('/posts/123/comments');
    expect(result).toEqual({
      post: { id: '123', title: 'Test Post' },
      comments: [
        { id: 1, text: 'Comment 1' },
        { id: 2, text: 'Comment 2' }
      ]
    });
  });

  it('should handle async route with Promise.all', async () => {
    const router = createRouter();
    router.map('/data/:id', async (params) => {
      const [userData, postData] = await Promise.all([
        Promise.resolve({ id: params.id, name: 'John' }),
        Promise.resolve({ count: 5 })
      ]);

      return {
        user: userData,
        posts: postData
      };
    });

    const result = await router.route('/data/123');
    expect(result).toEqual({
      user: { id: '123', name: 'John' },
      posts: { count: 5 }
    });
  });

  it('should handle mixed sync and async routes', async () => {
    const router = createRouter();
    
    // Sync route
    router.map('/sync/:id', (params) => {
      return { id: params.id, type: 'sync' };
    });

    // Async route
    router.map('/async/:id', async (params) => {
      return { id: params.id, type: 'async' };
    });

    const syncResult = router.route('/sync/123');
    const asyncResult = await router.route('/async/456');

    expect(syncResult).toEqual({ id: '123', type: 'sync' });
    expect(asyncResult).toEqual({ id: '456', type: 'async' });
  });

  it('should handle async route with delay', async () => {
    const router = createRouter();
    router.map('/delayed/:id', async (params) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return { id: params.id, delayed: true };
    });

    const result = await router.route('/delayed/123');
    expect(result).toEqual({ id: '123', delayed: true });
  });

  it('should handle concurrent async requests', async () => {
    const router = createRouter();
    let counter = 0;
    
    router.map('/concurrent/:id', async (params) => {
      await new Promise(resolve => setTimeout(resolve, 50));
      counter++;
      return { id: params.id, count: counter };
    });

    const results = await Promise.all([
      router.route('/concurrent/1'),
      router.route('/concurrent/2'),
      router.route('/concurrent/3')
    ]);

    expect(results).toHaveLength(3);
    expect(counter).toBe(3);
    expect(results.map(r => r.count)).toEqual([1, 2, 3]);
  });
}); 