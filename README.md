# tiny-router

A lightweight router that supports Express-style route patterns.

## Installation

```bash
npm install @skyfe79/tiny-router
```

## Features

- Express-style route pattern support
- Basic parameters (`:param`)
- Regular expression constraints (`:userId(\d+)`)
- Optional parameters (`:param?`)
- Wildcard patterns (`*`)
- Support for paths with hyphens (-) and dots (.)
- Full HTTP method support (GET, POST, PUT, DELETE, etc.)
- TypeScript support with detailed interfaces
- Lightweight implementation

## Usage

### Basic Examples

```javascript
import { createRouter } from '@skyfe79/tiny-router';

const router = createRouter();

// Basic route
router.map('/', (params) => {
  console.log('Home page');
});

// Basic parameter
router.map('/users/:id', (params) => {
  console.log('User ID:', params.id);
});

// Multiple parameters
router.map('/users/:userId/posts/:postId', (params) => {
  console.log('User ID:', params.userId);
  console.log('Post ID:', params.postId);
});

// Regular expression constraints
router.map('/users/:userId(\d+)', (params) => {
  console.log('Numeric User ID:', params.userId);
});

// Optional parameters
router.map('/posts/:page?', (params) => {
  console.log('Page:', params.page || 'default');
});

// Wildcard
router.map('/files/*', (params) => {
  console.log('File path:', params.wildcard);
});

// Multiple wildcards
router.map('/*/*/*', (params) => {
  console.log('Segments:', params.wildcards);
});
```

### Real-world Examples

```javascript
const router = createRouter();

// Blog routes
router.map('/blog/:slug', (params) => {
  // Handle blog post with slug
  console.log('Blog post:', params.slug);
});

router.map('/blog/category/:category', (params) => {
  // Handle blog category
  console.log('Blog category:', params.category);
});

// API routes with version and constraints
router.map('/api/v:version(\d+)/users/:userId(\d+)', (params) => {
  console.log('API Version:', params.version);
  console.log('User ID:', params.userId);
});

// File system routes
router.map('/assets/*', (params) => {
  // Handle static assets
  console.log('Asset path:', params.wildcard);
});

// Example route executions
router.route('/users/123');                    // User ID: 123
router.route('/posts');                        // Page: default
router.route('/posts/2');                      // Page: 2
router.route('/files/docs/example.txt');       // File path: docs/example.txt
router.route('/blog/my-awesome-post');         // Blog post: my-awesome-post
router.route('/api/v1/users/456');            // API Version: 1, User ID: 456
router.route('/products/electronics/phones');   // Segments: ['products', 'electronics', 'phones']
```

## API Reference

### `createRouter()`
Creates a new router instance.

#### Returns
A router object with the following methods:

##### `map(pattern: string | RegExp, handler: Function)`
Maps a route pattern to a handler function. The handler can be either synchronous or asynchronous.

- `pattern`: Route pattern string or regular expression
- `handler`: Handler function for the matched path (sync or async)
- Returns: void

##### `route(path: string)`
Executes the handler for the matching route. If the handler is async, it returns a Promise.

- `path`: Path to execute
- Returns: Result of the handler execution, Promise if async handler, or `null` if no matching route is found

## Async Handler Support

```javascript
const router = createRouter();

// Async route handler example
router.map('/api/users/:id', async (params) => {
  try {
    const response = await fetch(`https://api.example.com/users/${params.id}`);
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
});

// Using async route
async function handleUserRoute() {
  try {
    const user = await router.route('/api/users/123');
    console.log('User data:', user);
  } catch (error) {
    console.error('Route error:', error);
  }
}

// Multiple async operations example
router.map('/api/posts/:postId/comments', async (params) => {
  try {
    const [post, comments] = await Promise.all([
      fetch(`https://api.example.com/posts/${params.postId}`).then(r => r.json()),
      fetch(`https://api.example.com/posts/${params.postId}/comments`).then(r => r.json())
    ]);
    
    return {
      post,
      comments
    };
  } catch (error) {
    console.error('Failed to fetch post and comments:', error);
    throw error;
  }
});
```

## Error Handling

```javascript
const router = createRouter();

// Add error handling to your routes
router.map('/api/:resource', (params) => {
  try {
    // Your route logic here
    if (!params.resource) {
      throw new Error('Resource not specified');
    }
    return `Handling ${params.resource}`;
  } catch (error) {
    console.error('Route error:', error);
    return null;
  }
});
```

## TypeScript Support

```typescript
// Route parameter interface
interface RouteParams {
  [key: string]: string | string[] | undefined;
  wildcards?: string[];  // Available when using multiple wildcards
  wildcard?: string;     // Available when using single wildcard
}

// Route handler interface
interface RouteHandler {
  (params: RouteParams): any | Promise<any>;
}

// Router interface
interface Router {
  map: (pattern: string | RegExp, handler: RouteHandler) => void;
  get: (pattern: string | RegExp, handler: RouteHandler) => void;
  post: (pattern: string | RegExp, handler: RouteHandler) => void;
  put: (pattern: string | RegExp, handler: RouteHandler) => void;
  delete: (pattern: string | RegExp, handler: RouteHandler) => void;
  head: (pattern: string | RegExp, handler: RouteHandler) => void;
  options: (pattern: string | RegExp, handler: RouteHandler) => void;
  patch: (pattern: string | RegExp, handler: RouteHandler) => void;
  trace: (pattern: string | RegExp, handler: RouteHandler) => void;
  connect: (pattern: string | RegExp, handler: RouteHandler) => void;
  route: (methodOrPath: string, path?: string) => any;
}

// Usage examples
const router = createRouter();

// Using with specific HTTP method
router.get('/users/:id', (params: RouteParams) => {
  const userId: string = params.id;
  return { userId };
});

// Using with POST method and async handler
router.post('/api/users', async (params: RouteParams) => {
  const response = await fetch('https://api.example.com/users', {
    method: 'POST',
    // ... request configuration
  });
  return response.json();
});

// Using wildcards with type safety
router.get('/files/*', (params: RouteParams) => {
  console.log('Single wildcard path:', params.wildcard);
});

router.get('/*/*/*', (params: RouteParams) => {
  console.log('Multiple wildcard segments:', params.wildcards);
});
```

## HTTP Method Support

The router supports all standard HTTP methods:

```javascript
const router = createRouter();

// GET request
router.get('/api/users', (params) => {
  // Handle GET request
});

// POST request
router.post('/api/users', (params) => {
  // Handle POST request
});

// PUT request
router.put('/api/users/:id', (params) => {
  // Handle PUT request
});

// DELETE request
router.delete('/api/users/:id', (params) => {
  // Handle DELETE request
});

// Other supported methods
router.head('/api/status', (params) => {});
router.options('/api/users', (params) => {});
router.patch('/api/users/:id', (params) => {});
router.trace('/api/debug', (params) => {});
router.connect('/api/tunnel', (params) => {});
```

## License

MIT 
