# @skyfe79/tiny-router

A lightweight and flexible TypeScript router implementation.

## Installation

```bash
npm install @skyfe79/tiny-router
```

## Usage

### ESM (ECMAScript Modules)

```typescript
import createTinyRouter from '@skyfe79/tiny-router';

const router = createTinyRouter();

// Basic route
router.map('/', (params) => {
  console.log('Root path');
});

// Route with parameters
router.map('/users/:id', (params) => {
  console.log('User ID:', params.id);
});

// Execute route
router.route('/users/123'); // User ID: 123
```

### CommonJS

```javascript
const { createTinyRouter } = require('@skyfe79/tiny-router');

const router = createTinyRouter();

// Basic route
router.map('/', (params) => {
  console.log('Root path');
});

// Route with parameters
router.map('/users/:id', (params) => {
  console.log('User ID:', params.id);
});

// Execute route
router.route('/users/123'); // User ID: 123
```

## HTTP Method Support

The router supports the following HTTP methods:

```typescript
// GET method (map is an alias for get)
router.get('/users/:id', (params) => {
  console.log('GET User:', params.id);
});

// POST method
router.post('/users', (params) => {
  console.log('Create User');
});

// PUT method
router.put('/users/:id', (params) => {
  console.log('Update User:', params.id);
});

// DELETE method
router.delete('/users/:id', (params) => {
  console.log('Delete User:', params.id);
});

// Specify method and path together
router.route('POST', '/users');
```

## Advanced Routing Features

### Optional Parameters

```typescript
router.map('/users/:id?', (params) => {
  if (params.id) {
    console.log('User ID:', params.id);
  } else {
    console.log('All users');
  }
});
```

### Wildcards

```typescript
// Single wildcard
router.map('/files/*', (params) => {
  console.log('File path:', params.wildcard);
});

// Multiple wildcards
router.map('/files/*/versions/*', (params) => {
  console.log('File paths:', params.wildcards);
});
```

## Features

- Express-style route patterns
- Support for path parameters (`:param`)
- Optional parameters (`:param?`)
- Wildcard support (`*`)
- Full HTTP method support
- TypeScript support with type definitions
- Works with both ESM and CommonJS
- Zero dependencies
- Lightweight and fast

## License

MIT
