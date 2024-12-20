import { describe, it, expect } from 'vitest';
import createRouter from '../src/index.ts';

describe('HTTP Methods', () => {
  it('should handle different HTTP methods for the same path', () => {
    const router = createRouter();
    const results = [];

    // 각 HTTP 메서드별 핸들러 등록
    router.get('/api/resource/:id', (params) => {
      results.push({ method: 'GET', id: params.id });
    });

    router.post('/api/resource/:id', (params) => {
      results.push({ method: 'POST', id: params.id });
    });

    router.put('/api/resource/:id', (params) => {
      results.push({ method: 'PUT', id: params.id });
    });

    router.patch('/api/resource/:id', (params) => {
      results.push({ method: 'PATCH', id: params.id });
    });

    router.delete('/api/resource/:id', (params) => {
      results.push({ method: 'DELETE', id: params.id });
    });

    // 각 메서드별 라우트 실행
    router.route('GET', '/api/resource/123');
    router.route('POST', '/api/resource/123');
    router.route('PUT', '/api/resource/123');
    router.route('PATCH', '/api/resource/123');
    router.route('DELETE', '/api/resource/123');

    // 결과 검증
    expect(results).toEqual([
      { method: 'GET', id: '123' },
      { method: 'POST', id: '123' },
      { method: 'PUT', id: '123' },
      { method: 'PATCH', id: '123' },
      { method: 'DELETE', id: '123' }
    ]);
  });

  it('should handle HEAD, OPTIONS, TRACE, and CONNECT methods', () => {
    const router = createRouter();
    const results = [];

    router.head('/api/test', () => {
      results.push({ method: 'HEAD' });
    });

    router.options('/api/test', () => {
      results.push({ method: 'OPTIONS' });
    });

    router.trace('/api/test', () => {
      results.push({ method: 'TRACE' });
    });

    router.connect('/api/test', () => {
      results.push({ method: 'CONNECT' });
    });

    router.route('HEAD', '/api/test');
    router.route('OPTIONS', '/api/test');
    router.route('TRACE', '/api/test');
    router.route('CONNECT', '/api/test');

    expect(results).toEqual([
      { method: 'HEAD' },
      { method: 'OPTIONS' },
      { method: 'TRACE' },
      { method: 'CONNECT' }
    ]);
  });

  it('should handle method case-insensitively', () => {
    const router = createRouter();
    let result = null;

    router.get('/test', () => {
      result = 'GET handled';
    });

    router.route('get', '/test');
    expect(result).toBe('GET handled');

    result = null;
    router.route('GET', '/test');
    expect(result).toBe('GET handled');
  });

  it('should support both old and new route calling styles', () => {
    const router = createRouter();
    const results = [];

    router.map('/test', () => {
      results.push('default (GET)');
    });

    // 기존 방식 (GET으로 처리)
    router.route('/test');
    // 새로운 방식
    router.route('GET', '/test');

    expect(results).toEqual([
      'default (GET)',
      'default (GET)'
    ]);
  });

  it('should return null for non-matching methods', () => {
    const router = createRouter();
    let getResult = false;

    router.get('/test', () => {
      getResult = true;
    });

    const postResult = router.route('POST', '/test');
    expect(postResult).toBeNull();
    expect(getResult).toBe(false);
  });

  it('should handle multiple methods with wildcards and parameters', () => {
    const router = createRouter();
    const results = [];

    router.get('/api/*/users/:id', (params) => {
      results.push({ method: 'GET', wildcard: params.wildcard, id: params.id });
    });

    router.post('/api/*/users/:id', (params) => {
      results.push({ method: 'POST', wildcard: params.wildcard, id: params.id });
    });

    router.route('GET', '/api/v1/users/123');
    router.route('POST', '/api/v2/users/456');

    expect(results).toEqual([
      { method: 'GET', wildcard: 'v1', id: '123' },
      { method: 'POST', wildcard: 'v2', id: '456' }
    ]);
  });
}); 