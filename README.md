# tiny-router

Express 스타일의 라우트 패턴을 지원하는 작고 가벼운 라우터입니다.

## 설치

```bash
npm install tiny-router
```

## 특징

- Express 스타일의 라우트 패턴 지원
- 기본 파라미터 (`:param`)
- 정규식 제약 조건 (`:userId(\d+)`)
- 선택적 파라미터 (`:param?`)
- 와일드카드 패턴 (`*`)
- 하이픈(-)과 점(.) 포함 경로 지원
- 작고 가벼운 구현

## 사용법

```javascript
import createRouter from 'tiny-router';

const router = createRouter();

// 기본 파라미터
router.map('/users/:id', (params) => {
  console.log('User ID:', params.id);
});

// 정규식 제약 조건
router.map('/users/:userId(\d+)', (params) => {
  console.log('Numeric User ID:', params.userId);
});

// 선택적 파라미터
router.map('/posts/:page?', (params) => {
  console.log('Page:', params.page || 'default');
});

// 와일드카드
router.map('/files/*', (params) => {
  console.log('File path:', params.wildcard);
});

// 다중 와일드카드
router.map('/*/*/*', (params) => {
  console.log('Segments:', params.wildcards);
});

// 라우트 실행
router.route('/users/123');  // User ID: 123
router.route('/posts');      // Page: default
router.route('/files/docs/example.txt');  // File path: docs/example.txt
router.route('/products/electronics/phones');  // Segments: ['products', 'electronics', 'phones']
```

## API

### `createRouter()`
새로운 라우터 인스턴스를 생성합니다.

#### 반환값
라우터 객체는 다음 메서드들을 포함합니다:

##### `map(pattern: string | RegExp, handler: Function)`
라우트 패턴과 핸들러를 매핑합니다.

- `pattern`: 라우트 패턴 문자열 또는 정규식
- `handler`: 매칭된 경로에 대한 처리 함수

##### `route(path: string)`
주어진 경로에 대해 매칭되는 핸들러를 실행합니다.

- `path`: 실행할 경로
- 반환값: 핸들러의 실행 결과 또는 매칭되는 라우트가 없을 경우 `null`

## 라이선스

MIT 