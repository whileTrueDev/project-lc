/**
 * 문자열을 받아 첫글자와 끝글자를 제외하고 모두 * 로 변경해 반환합니다.
 * @param target 타겟 문자열
 * @returns 별표처리된 문자열
 */
export const asteriskify = (target: string | null): string => {
  if (!target) return '';
  let result = '';
  for (let i = 0; i < target.length; i++) {
    if (i === 0) result += target[i];
    else if (i === target.length - 1) result += target[i];
    else result += '*';
  }
  return result;
};
