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
   * 라우트 패턴과 핸들러를 매핑합니다.
   * @param {string|RegExp} pattern 라우트 패턴
   * @param {Function} handler 핸들러 함수
   */
  const map = (pattern, handler) => {
    const { regex, paramNames, hasWildcard, wildcardCount } = parsePattern(pattern);
    routes.set(regex, { handler, paramNames, hasWildcard, wildcardCount });
  };

  /**
   * 주어진 경로에 대해 매칭되는 핸들러를 실행합니다.
   * @param {string} path 실행할 경로
   * @returns {*} 핸들러의 실행 결과 또는 매칭되는 라우트가 없을 경우 null
   */
  const route = (path) => {
    // 쿼리 파라미터 제거
    const pathWithoutQuery = path.split('?')[0];
    
    for (const [regex, { handler, paramNames, hasWildcard, wildcardCount }] of routes) {
      const match = pathWithoutQuery.match(regex);
      console.log('Path:', path);
      console.log('Regex:', regex);
      console.log('Match:', match);
      
      if (match) {
        const params = {};
        let matchIndex = 1;
        
        // 파라미터 매칭 처리
        if (!hasWildcard) {
          paramNames.forEach((name) => {
            params[name] = match[matchIndex++] || '';
          });
        }
        
        // 와일드카드 매칭 처리
        if (hasWildcard) {
          if (wildcardCount > 1) {
            params.wildcards = Array.from({ length: wildcardCount }, (_, i) => match[i + 1]);
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
    route
  };
};

export default createRouter; 