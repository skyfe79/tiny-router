/**
 * 라우터 함수를 생성합니다.
 * @returns {Object} 라우터 함수와 라우트 매핑 함수를 포함하는 객체
 */
const createRouter = () => {
  const routes = new Map();

  /**
   * 라우트 패턴을 정규식으로 변환합니다.
   * @param {string|RegExp} pattern 라우트 패턴
   * @returns {Object} 변환된 정규식과 파라미터 이름 배열
   */
  const parsePattern = (pattern) => {
    if (pattern instanceof RegExp) {
      return { regex: pattern, paramNames: [], wildcardCount: 0 };
    }

    let paramNames = [];
    let regexPattern = pattern;
    const wildcardCount = (pattern.match(/\*/g) || []).length;

    // 정규식 제약 조건이 있는 파라미터 처리 (예: :userId(\d+))
    regexPattern = regexPattern.replace(/:[^/()]+\([^)]+\)/g, (match) => {
      const name = match.match(/:[^(/]+/)[0].slice(1);
      const constraint = match.match(/\(.*\)/)[0];
      paramNames.push(name);
      return constraint;
    });

    // 선택적 파라미터 처리 (예: :param?)
    regexPattern = regexPattern.replace(/:[^/]+\?/g, (match) => {
      const name = match.slice(1, -1);
      paramNames.push(name);
      return '([^/]*)';
    });

    // 기본 파라미터 처리 (예: :param)
    regexPattern = regexPattern.replace(/:[^/]+/g, (match) => {
      const name = match.slice(1);
      paramNames.push(name);
      return '([^/]+)';
    });

    // 슬래시 이스케이프
    regexPattern = regexPattern.replace(/\//g, '\\/');

    // 문자 클래스 외부의 하이픈과 점만 이스케이프
    regexPattern = regexPattern.replace(/(\[(?:[^\]\\]|\\.)*\])|(-)/g, (match, charClass, hyphen) => {
      return charClass || '\\' + hyphen;
    });

    // 와일드카드 패턴 처리 (*) - 여러 세그먼트 매칭
    const hasWildcard = pattern.includes('*');
    if (hasWildcard) {
      if (wildcardCount > 1) {
        // 다중 와일드카드는 각각을 개별적으로 캡처
        regexPattern = regexPattern.replace(/\\\*|\*/g, '([^/]+)');
      } else {
        // 단일 와일드카드는 여러 세그먼트를 캡처
        regexPattern = regexPattern.replace(/\\\*|\*/g, '(.+)');
      }
    }

    console.log('Pattern:', pattern);
    console.log('Regex Pattern:', regexPattern);
    console.log('Has Wildcard:', hasWildcard);
    console.log('Wildcard Count:', wildcardCount);

    return {
      regex: new RegExp(`^${regexPattern}$`),
      paramNames,
      hasWildcard,
      wildcardCount
    };
  };

  /**
   * HTTP 메서드와 라우트 패턴, 핸들러를 매핑합니다.
   * @param {string} method HTTP 메서드
   * @param {string|RegExp} pattern 라우트 패턴
   * @param {Function} handler 핸들러 함수
   */
  const mapMethod = (method, pattern, handler) => {
    const { regex, paramNames, hasWildcard, wildcardCount } = parsePattern(pattern);
    const routeKey = regex.toString();
    const routeInfo = routes.get(routeKey) || { handlers: new Map(), regex, paramNames, hasWildcard, wildcardCount };
    
    // HTTP 메서드별 핸들러 등록
    const upperMethod = method.toUpperCase();
    routeInfo.handlers.set(upperMethod, handler);
    
    // GET 메서드인 경우 기본 핸들러로도 등록
    if (upperMethod === 'GET') {
      routeInfo.handlers.set('DEFAULT', handler);
    }
    
    routes.set(routeKey, routeInfo);
  };

  /**
   * GET 메서드 라우트를 매핑합니다.
   */
  const get = (pattern, handler) => mapMethod('GET', pattern, handler);

  /**
   * POST 메서드 라우트를 매핑합니다.
   */
  const post = (pattern, handler) => mapMethod('POST', pattern, handler);

  /**
   * PUT 메서드 라우트를 매핑합니다.
   */
  const put = (pattern, handler) => mapMethod('PUT', pattern, handler);

  /**
   * DELETE 메서드 라우트를 매핑합니다.
   */
  const del = (pattern, handler) => mapMethod('DELETE', pattern, handler);

  /**
   * HEAD 메서드 라우트를 매핑합니다.
   */
  const head = (pattern, handler) => mapMethod('HEAD', pattern, handler);

  /**
   * OPTIONS 메서드 라우트를 매핑합니다.
   */
  const options = (pattern, handler) => mapMethod('OPTIONS', pattern, handler);

  /**
   * PATCH 메서드 라우트를 매핑합니다.
   */
  const patch = (pattern, handler) => mapMethod('PATCH', pattern, handler);

  /**
   * TRACE 메서드 라우트를 매핑합니다.
   */
  const trace = (pattern, handler) => mapMethod('TRACE', pattern, handler);

  /**
   * CONNECT 메서드 라우트를 매핑합니다.
   */
  const connect = (pattern, handler) => mapMethod('CONNECT', pattern, handler);

  /**
   * 기존 map 함수는 GET 메서드의 별칭으로 유지
   */
  const map = (pattern, handler) => get(pattern, handler);

  /**
   * 주어진 메서드와 경로에 대해 매칭되는 핸들러를 실행합니다.
   * @param {string|object} methodOrPath HTTP 메서드 (기본값: GET) 또는 경로
   * @param {string} [path] 실행할 경로 (methodOrPath가 메서드인 경우)
   * @returns {*} 핸들러의 실행 결과 또는 매칭되는 라우트가 없을 경우 null
   */
  const route = (methodOrPath, path) => {
    let method = 'GET';
    let targetPath = methodOrPath;

    // 새로운 방식: route('GET', '/path')
    if (path) {
      method = methodOrPath;
      targetPath = path;
    }

    const pathWithoutQuery = targetPath.split('?')[0];
    const upperMethod = method.toUpperCase();
    
    for (const [_, routeInfo] of routes) {
      const match = pathWithoutQuery.match(routeInfo.regex);
      
      if (match) {
        // 먼저 특정 메서드의 핸들러를 찾음
        let handler = routeInfo.handlers.get(upperMethod);
        
        // 특정 메서드의 핸들러가 없으면 기본 핸들러를 사용
        if (!handler && !path) {
          handler = routeInfo.handlers.get('DEFAULT');
        }
        
        if (!handler) {
          continue; // 다른 라우트를 확인
        }

        const params = {};
        let matchIndex = 1;
        
        // 파라미터 매칭 처리
        routeInfo.paramNames.forEach((name) => {
          params[name] = match[matchIndex++] || '';
        });
        
        // 와일드카드 매칭 처리
        if (routeInfo.hasWildcard) {
          if (routeInfo.wildcardCount > 1) {
            params.wildcards = Array.from({ length: routeInfo.wildcardCount }, (_, i) => match[i + 1]);
          } else {
            params.wildcard = match[1];
          }
        }
        
        return handler(params);
      }
    }
    return null;
  };

  return {
    map,
    get,
    post,
    put,
    delete: del,
    head,
    options,
    patch,
    trace,
    connect,
    route
  };
};

export default createRouter; 