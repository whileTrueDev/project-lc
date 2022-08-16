import { s3 } from '@project-lc/utils-s3';

// 상품 사진, 상세설명 이미지를 s3에 업로드 -> url 리턴
export async function uploadGoodsImageToS3(
  imageFile: { file: File | Buffer; filename: string; id: number; contentType: string },
  userMail: string,
): Promise<string> {
  const { file, filename, contentType } = imageFile;
  return s3.s3UploadImage({
    isPublic: true,
    file,
    filename,
    ContentType: contentType,
    userMail,
    type: 'goods',
  });
}

// 상품 '상세설명' contents에서 이미지 s3에 업로드 후 src url 변경
// 상세설명 이미지는data:image 형태로 들어있음
export async function saveContentsImageToS3(
  contents: string,
  userMail: string,
): Promise<string> {
  const parser = new DOMParser();
  const dom = parser.parseFromString(contents, 'text/html'); // textWithImages -> getValues('contents')
  const imageTags = Array.from(dom.querySelectorAll('img'));

  await Promise.all(
    imageTags.map(async (tag, index) => {
      const src = tag.getAttribute('src');
      const name = tag.dataset.fileName || '';
      if (src && src.slice(0, 4) !== 'http') {
        const imageBuffer = Buffer.from(
          src.replace(/^data:image\/\w+;base64,/, ''),
          'base64',
        );
        const fileType = src.substring('data:'.length, src.indexOf(';base64'));
        const url = await uploadGoodsImageToS3(
          { file: imageBuffer, filename: name, id: index, contentType: fileType },
          userMail,
        );
        // img src 바꾸기
        tag.setAttribute('src', url);
      }
    }),
  );

  const contentsBody = dom.body.innerHTML;
  return contentsBody;
}
