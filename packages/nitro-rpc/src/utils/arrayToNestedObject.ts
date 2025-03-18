/**
 * 문자열 배열을 중첩된 객체 구조로 변환하는 함수
 * @param arr 변환할 문자열 배열
 * @returns 중첩된 객체
 */
export function arrayToNestedObject(arr: string[]): Record<string, any> {
    // 빈 배열인 경우 빈 객체 반환
    if (arr.length === 0) {
      return {};
    }
    
    // 결과 객체 생성
    const result: Record<string, any> = {};
    
    // 배열의 첫 번째 요소를 키로 사용
    const key = arr[0];
    
    // 나머지 요소들로 재귀 호출하여 중첩 객체 생성
    result[key] = arrayToNestedObject(arr.slice(1));
    
    return result;
  }