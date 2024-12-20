import { describe, it, expect } from 'vitest';
import createTinyRouter from '../src/index';
import type { RouteParams } from '../src/index';

describe('HTTP Methods', () => {
  it('should handle different HTTP methods for the same path', () => {
    const router = createTinyRouter();
    const results: Record<string, RouteParams> = {};

    router.get('/api/resource/:id', (params) => {
      results.get = params;
      return 'GET';
    });

    router.post('/api/resource/:id', (params) => {
      results.post = params;
      return 'POST';
    });

    router.put('/api/resource/:id', (params) => {
      results.put = params;
      return 'PUT';
    });

    router.delete('/api/resource/:id', (params) => {
      results.delete = params;
      return 'DELETE';
    });

    router.patch('/api/resource/:id', (params) => {
      results.patch = params;
      return 'PATCH';
    });

    router.route('GET', '/api/resource/123');
    router.route('POST', '/api/resource/123');
    router.route('PUT', '/api/resource/123');
    router.route('DELETE', '/api/resource/123');
    router.route('PATCH', '/api/resource/123');

    expect(results.get).toEqual({ id: '123' });
    expect(results.post).toEqual({ id: '123' });
    expect(results.put).toEqual({ id: '123' });
    expect(results.delete).toEqual({ id: '123' });
    expect(results.patch).toEqual({ id: '123' });
  });

  it('should handle HEAD, OPTIONS, TRACE, and CONNECT methods', () => {
    const router = createTinyRouter();
    const results: Record<string, boolean> = {};

    router.head('/api/test', () => {
      results.head = true;
      return 'HEAD';
    });

    router.options('/api/test', () => {
      results.options = true;
      return 'OPTIONS';
    });

    router.trace('/api/test', () => {
      results.trace = true;
      return 'TRACE';
    });

    router.connect('/api/test', () => {
      results.connect = true;
      return 'CONNECT';
    });

    router.route('HEAD', '/api/test');
    router.route('OPTIONS', '/api/test');
    router.route('TRACE', '/api/test');
    router.route('CONNECT', '/api/test');

    expect(results.head).toBe(true);
    expect(results.options).toBe(true);
    expect(results.trace).toBe(true);
    expect(results.connect).toBe(true);
  });

  it('should handle method case-insensitively', () => {
    const router = createTinyRouter();
    let called = false;

    router.get('/test', () => {
      called = true;
      return 'test';
    });

    router.route('get', '/test');
    expect(called).toBe(true);
  });

  it('should support both old and new route calling styles', () => {
    const router = createTinyRouter();
    let called = false;

    router.get('/test', () => {
      called = true;
      return 'test';
    });

    router.route('/test');
    expect(called).toBe(true);

    called = false;
    router.route('GET', '/test');
    expect(called).toBe(true);
  });

  it('should return null for non-matching methods', () => {
    const router = createTinyRouter();
    let called = false;

    router.get('/test', () => {
      called = true;
      return 'test';
    });

    const result = router.route('POST', '/test');
    expect(result).toBeNull();
    expect(called).toBe(false);
  });

  it('should handle multiple methods with wildcards and parameters', () => {
    const router = createTinyRouter();
    const results: Record<string, RouteParams> = {};

    router.get('/api/*/users/:id', (params) => {
      results.get = params;
      return 'GET';
    });

    router.post('/api/*/users/:id', (params) => {
      results.post = params;
      return 'POST';
    });

    router.route('GET', '/api/v1/users/123');
    router.route('POST', '/api/v2/users/456');

    expect(results.get).toEqual({ wildcard: 'v1', id: '123' });
    expect(results.post).toEqual({ wildcard: 'v2', id: '456' });
  });
}); 