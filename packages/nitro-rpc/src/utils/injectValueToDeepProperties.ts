/**
 * 객체의 모든 깊은 속성에 지정된 값을 주입하는 함수
 * @param obj 값을 주입할 객체
 * @param value 주입할 값
 * @returns 값이 주입된 새 객체
 */
export function injectValueToDeepProperties(obj: Record<string, any>, value: any): Record<string, any> {
    // 입력이 객체가 아니면 그대로 반환
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
    
    // 배열인 경우 각 요소에 재귀적으로 적용
    if (Array.isArray(obj)) {
      return obj.map(item => injectValueToDeepProperties(item, value));
    }
    
    // 빈 객체인 경우 값을 직접 반환
    if (Object.keys(obj).length === 0) {
      return value;
    }
    
    // 객체의 각 속성에 재귀적으로 적용
    const result: Record<string, any> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const nestedValue = obj[key];
        
        if (typeof nestedValue === 'object' && nestedValue !== null) {
          result[key] = injectValueToDeepProperties(nestedValue, value);
        } else {
          // 리프 노드(가장 깊은 속성)에 값 주입
          result[key] = value;
        }
      }
    }
    
    return result;
  }