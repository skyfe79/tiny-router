import { describe, it, expect } from 'vitest';
import createRouter from '../src/index';

describe('Router', () => {
  describe('Basic Routing', () => {
    it('should handle simple routes', () => {
      const router = createRouter();
      let called = false;

      router.get('/test', () => {
        called = true;
        return 'test route';
      });

      const result = router.route('/test');
      expect(called).toBe(true);
      expect(result).toBe('test route');
    });

    it('should handle different HTTP methods', () => {
      const router = createRouter();
      const results: Record<string, string> = {};

      router.get('/api', () => {
        results.get = 'GET';
        return 'GET';
      });

      router.post('/api', () => {
        results.post = 'POST';
        return 'POST';
      });

      router.route('GET', '/api');
      router.route('POST', '/api');

      expect(results.get).toBe('GET');
      expect(results.post).toBe('POST');
    });
  });

  describe('Parameter Handling', () => {
    it('should handle URL parameters', () => {
      const router = createRouter();
      let params: any;

      router.get('/user/:id', (p) => {
        params = p;
        return 'user route';
      });

      router.route('/user/123');
      expect(params.id).toBe('123');
    });

    it('should handle optional parameters', () => {
      const router = createRouter();
      let params: any;

      router.get('/user/:name?', (p) => {
        params = p;
        return 'user route';
      });

      router.route('/user/john');
      expect(params.name).toBe('john');

      params = null;

      router.route('/user');
      expect(params).toEqual({});
    });

    it('should handle regex constraints', () => {
      const router = createRouter();
      let params: any;

      router.get('/user/:id(\\d+)', (p) => {
        params = p;
        return 'user route';
      });

      router.route('/user/123');
      expect(params.id).toBe('123');

      const result = router.route('/user/abc');
      expect(result).toBe(null);
    });
  });

  describe('Wildcard Handling', () => {
    it('should handle single wildcard', () => {
      const router = createRouter();
      let params: any;

      router.get('/files/*', (p) => {
        params = p;
        return 'files route';
      });

      router.route('/files/images/photo.jpg');
      expect(params.wildcard).toBe('images/photo.jpg');
    });

    it('should handle multiple wildcards', () => {
      const router = createRouter();
      let params: any;

      router.get('/files/*/type/*', (p) => {
        params = p;
        return 'files route';
      });

      router.route('/files/images/type/jpg');
      expect(params.wildcards).toEqual(['images', 'jpg']);
    });
  });

  describe('Edge Cases', () => {
    it('should handle non-existent routes', () => {
      const router = createRouter();
      const result = router.route('/non-existent');
      expect(result).toBe(null);
    });

    it('should handle regex patterns', () => {
      const router = createRouter();
      let called = false;

      router.get(/^\/test\/\d+$/, () => {
        called = true;
        return 'regex route';
      });

      const result = router.route('/test/123');
      expect(called).toBe(true);
      expect(result).toBe('regex route');

      const invalidResult = router.route('/test/abc');
      expect(invalidResult).toBe(null);
    });
  });
}); 