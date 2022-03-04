// 파일명에서 확장자를 추출하는 과정
export function getExtension(fileName: string | null): string {
  if (!fileName) {
    return '';
  }
  const location = fileName.lastIndexOf('.');
  const result = fileName.substring(location);
  return result;
}

export type FileReaderResultType = string | ArrayBuffer | null;

export type Preview = {
  id: number;
  filename: string;
  url: FileReaderResultType;
  file: File;
};
/** File 데이터를 FileReader.readAsDataUrl로 변환 */
export function readAsDataURL(file: File): Promise<{
  data: FileReaderResultType;
  name: string;
  size: number;
  type: string;
}> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = function () {
      return resolve({
        data: fileReader.result,
        name: file.name,
        size: file.size,
        type: file.type,
      });
    };
    fileReader.readAsDataURL(file);
  });
}
