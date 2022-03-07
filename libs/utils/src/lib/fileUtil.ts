// 파일명에서 확장자를 추출하는 과정
export function getExtension(fileName: string | null): string {
  if (!fileName) {
    return '';
  }
  const location = fileName.lastIndexOf('.');
  const result = fileName.substring(location);
  return result;
}
