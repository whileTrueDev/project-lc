import { Injectable } from '@nestjs/common';
import { DeleteObjectsCommand, ObjectIdentifier, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { parse } from 'node-html-parser';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly S3_BUCKET_REGION = 'ap-northeast-2';

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.S3_BUCKET_REGION,
      credentials: {
        secretAccessKey: this.configService.get('NEXT_PUBLIC_AWS_S3_ACCESS_KEY_SECRET'),
        accessKeyId: this.configService.get('NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID'),
      },
    });
  }

  /** lc-project 버킷에서 key[]에 해당하는 오브젝트 삭제 */
  deleteMultipleObjects(objList: ObjectIdentifier[]) {
    return this.s3Client.send(
      new DeleteObjectsCommand({
        Bucket: this.configService.get('NEXT_PUBLIC_S3_BUCKET_NAME'),
        Delete: {
          Objects: objList,
        },
      }),
    );
  }
}

/** htmlString[] 에서 <img> 태그 src[] 리턴  */
export function getImgSrcListFromHtmlStringList(htmlContentsList: string[]) {
  return [].concat(
    ...htmlContentsList.map((content) => {
      const dom = parse(content);
      return Array.from(dom.querySelectorAll('img')).map((elem) =>
        elem.getAttribute('src'),
      );
    }),
  );
}

/** imgSrc 에서 s3에 업로드 된 url의 key[] 리턴 */
export function getS3KeyListFromImgSrcList(srcList: string[]) {
  const S3_DOMIAN = 'https://lc-project.s3.ap-northeast-2.amazonaws.com/';
  const GOODS_DIRECTORY = 'goods/';
  const GOODS_IMAGE_URL_DOMAIN = `${S3_DOMIAN}${GOODS_DIRECTORY}`;

  return srcList
    .filter((src) => src.startsWith(GOODS_IMAGE_URL_DOMAIN))
    .map((src) => src.replace(S3_DOMIAN, ''));
}
