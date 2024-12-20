export interface RouteParams {
  [key: string]: string | string[] | undefined;
  wildcards?: string[];
  wildcard?: string;
}

export interface RouteHandler {
  (params: RouteParams): any | Promise<any>;
}

export interface RouteInfo {
  handlers: Map<string, RouteHandler>;
  regex: RegExp;
  paramNames: string[];
  hasWildcard: boolean;
  wildcardCount: number;
}

export interface Router {
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

interface ParsePatternResult {
  regex: RegExp;
  paramNames: string[];
  hasWildcard: boolean;
  wildcardCount: number;
}

/**
 * 라우터 함수를 생성합니다.
 * @returns {Router} 라우터 함수와 라우트 매핑 함수를 포함하는 객체
 */
const createRouter = (): Router => {
  const routes = new Map<string, RouteInfo>();

  /**
   * 라우트 패턴을 정규식으로 변환합니다.
   * @param {string|RegExp} pattern 라우트 패턴
   * @returns {ParsePatternResult} 변환된 정규식과 파라미터 이름 배열
   */
  const parsePattern = (pattern: string | RegExp): ParsePatternResult => {
    if (pattern instanceof RegExp) {
      return { regex: pattern, paramNames: [], hasWildcard: false, wildcardCount: 0 };
    }

    let paramNames: string[] = [];
    let regexPattern = pattern;
    const wildcardCount = (pattern.match(/\*/g) || []).length;

    // 모든 파라미터를 한 번에 찾아서 순서대로 처리
    const params = pattern.match(/:[^/]+(\([^)]+\))?(\?)?/g) || [];
    params.forEach(param => {
      const hasConstraint = param.includes('(');
      const isOptional = param.endsWith('?');
      const name = param.slice(1, hasConstraint ? param.indexOf('(') : (isOptional ? -1 : undefined));
      
      paramNames.push(isOptional ? name + '?' : name);
      
      if (hasConstraint) {
        const constraint = param.match(/\(([^)]+)\)/)?.[1];
        if (constraint) {
          regexPattern = regexPattern.replace(param, `(${constraint})`);
        }
      } else if (isOptional) {
        // 선택적 매개변수의 경우 해당 세그먼트를 선택적으로 만듦
        const segment = regexPattern.match(new RegExp(`/[^/]*${param}`))?.[0];
        if (segment) {
          regexPattern = regexPattern.replace(
            segment,
            `(?:/([^/]+))?`
          );
        }
      } else {
        regexPattern = regexPattern.replace(param, '([^/]+)');
      }
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

    // 선택적 매개변수가 있는 경우 기본 경로도 매칭되도록 함
    if (pattern.includes('?')) {
      regexPattern = `^${regexPattern}$|^${regexPattern.split('(?:')[0]}$`;
    } else {
      regexPattern = `^${regexPattern}$`;
    }

    return {
      regex: new RegExp(regexPattern),
      paramNames,
      hasWildcard,
      wildcardCount
    };
  };

  /**
   * HTTP 메서드와 라우트 패턴, 핸들러를 매핑합니다.
   * @param {string} method HTTP 메서드
   * @param {string|RegExp} pattern 라우트 패턴
   * @param {RouteHandler} handler 핸들러 함수
   */
  const mapMethod = (method: string, pattern: string | RegExp, handler: RouteHandler): void => {
    const { regex, paramNames, hasWildcard, wildcardCount } = parsePattern(pattern);
    const routeKey = regex.toString();
    const routeInfo = routes.get(routeKey) || { 
      handlers: new Map<string, RouteHandler>(), 
      regex, 
      paramNames, 
      hasWildcard, 
      wildcardCount 
    };
    
    const upperMethod = method.toUpperCase();
    routeInfo.handlers.set(upperMethod, handler);
    
    if (upperMethod === 'GET') {
      routeInfo.handlers.set('DEFAULT', handler);
    }
    
    routes.set(routeKey, routeInfo);
  };

  const get = (pattern: string | RegExp, handler: RouteHandler): void => 
    mapMethod('GET', pattern, handler);

  const post = (pattern: string | RegExp, handler: RouteHandler): void => 
    mapMethod('POST', pattern, handler);

  const put = (pattern: string | RegExp, handler: RouteHandler): void => 
    mapMethod('PUT', pattern, handler);

  const del = (pattern: string | RegExp, handler: RouteHandler): void => 
    mapMethod('DELETE', pattern, handler);

  const head = (pattern: string | RegExp, handler: RouteHandler): void => 
    mapMethod('HEAD', pattern, handler);

  const options = (pattern: string | RegExp, handler: RouteHandler): void => 
    mapMethod('OPTIONS', pattern, handler);

  const patch = (pattern: string | RegExp, handler: RouteHandler): void => 
    mapMethod('PATCH', pattern, handler);

  const trace = (pattern: string | RegExp, handler: RouteHandler): void => 
    mapMethod('TRACE', pattern, handler);

  const connect = (pattern: string | RegExp, handler: RouteHandler): void => 
    mapMethod('CONNECT', pattern, handler);

  const map = (pattern: string | RegExp, handler: RouteHandler): void => 
    get(pattern, handler);

  const route = (methodOrPath: string, path?: string): any => {
    let method = 'GET';
    let targetPath = methodOrPath;

    if (path) {
      method = methodOrPath;
      targetPath = path;
    }

    // 경로 정규화: 루트 경로가 아닌 경우에만 마지막 슬래시 제거
    targetPath = targetPath === '/' ? targetPath : (targetPath.endsWith('/') ? targetPath.slice(0, -1) : targetPath);
    const pathWithoutQuery = targetPath.split('?')[0];
    const upperMethod = method.toUpperCase();
    
    for (const [_, routeInfo] of routes) {
      const match = pathWithoutQuery.match(routeInfo.regex);
      
      if (match) {
        let handler = routeInfo.handlers.get(upperMethod);
        
        if (!handler && !path) {
          handler = routeInfo.handlers.get('DEFAULT');
        }
        
        if (!handler) {
          continue;
        }

        const params: RouteParams = {};
        let matchIndex = 1;
        
        if (routeInfo.hasWildcard) {
          if (routeInfo.wildcardCount > 1) {
            params.wildcards = Array.from(
              { length: routeInfo.wildcardCount }, 
              (_, i) => match[i + 1]
            );
            matchIndex += routeInfo.wildcardCount;
          } else {
            params.wildcard = match[matchIndex++];
          }
        }

        routeInfo.paramNames.forEach((name) => {
          const value = match[matchIndex];
          const isOptional = name.endsWith('?');
          // 선택적 매개변수의 ? 제거
          const cleanName = name.replace('?', '');
          
          // 선택적 매개변수가 아닌데 값이 없는 경우에만 null 반환
          if (!isOptional && value == null) {
            return null;
          }
          
          // 값이 있는 경우에만 파라미터에 추가
          if (value != null) {
            params[cleanName] = value;
          }
          
          matchIndex++;
        });
        
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