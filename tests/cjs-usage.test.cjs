const { createTinyRouter } = require('../dist/cjs/index.cjs');

describe('CommonJS Usage', () => {
  test('should work with CommonJS require', () => {
    const router = createTinyRouter();
    let result = null;

    router.map('/', (params) => {
      result = params;
    });

    router.route('/');
    expect(result).toEqual({});
  });

  test('should handle basic parameter routes', () => {
    const router = createTinyRouter();
    let result = null;

    router.map('/users/:id', (params) => {
      result = params;
    });

    router.route('/users/123');
    expect(result).toEqual({ id: '123' });
  });

  test('should handle HTTP methods', () => {
    const router = createTinyRouter();
    let method = '';
    let params = null;

    router.get('/users/:id', (p) => {
      method = 'GET';
      params = p;
    });

    router.post('/users', (p) => {
      method = 'POST';
      params = p;
    });

    router.route('GET', '/users/123');
    expect(method).toBe('GET');
    expect(params).toEqual({ id: '123' });

    router.route('POST', '/users');
    expect(method).toBe('POST');
    expect(params).toEqual({});
  });

  test('should handle optional parameters', () => {
    const router = createTinyRouter();
    let result = null;

    router.map('/users/:id?', (params) => {
      result = params;
    });

    router.route('/users/123');
    expect(result).toEqual({ id: '123' });

    router.route('/users');
    expect(result).toEqual({});
  });

  test('should handle wildcards', () => {
    const router = createTinyRouter();
    let result = null;

    router.map('/files/*', (params) => {
      result = params;
    });

    router.route('/files/documents/report.pdf');
    expect(result.wildcard).toBe('documents/report.pdf');
  });
}); 