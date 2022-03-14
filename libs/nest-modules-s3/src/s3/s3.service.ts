import {
  DeleteObjectsCommand,
  DeleteObjectsCommandOutput,
  ObjectIdentifier,
  PutObjectCommand,
  S3Client,
  ListObjectsCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserType } from '@project-lc/shared-types';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly S3_BUCKET_REGION = 'ap-northeast-2';
  private readonly S3_DOMIAN = 'https://lc-project.s3.ap-northeast-2.amazonaws.com/';

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.S3_BUCKET_REGION,
      credentials: {
        secretAccessKey: this.configService.get('AWS_S3_ACCESS_KEY_SECRET'),
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY_ID'),
      },
    });
  }

  /** lc-project 버킷에서 key[]에 해당하는 오브젝트 삭제 */
  deleteMultipleObjects(
    objList: ObjectIdentifier[],
  ): Promise<DeleteObjectsCommandOutput> {
    return this.s3Client.send(
      new DeleteObjectsCommand({
        Bucket: this.configService.get('S3_BUCKET_NAME'),
        Delete: {
          Objects: objList,
        },
      }),
    );
  }

  async uploadProfileImage({
    key,
    file,
    email,
    userType,
  }: {
    key: string;
    file: Buffer;
    email: string;
    userType: UserType;
  }): Promise<string> {
    const avatarPath = `avatar/${userType}/${email}/${key}`;
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.get('S3_BUCKET_NAME'),
        Key: avatarPath,
        Body: file,
        ACL: 'public-read',
      }),
    );
    const avatar = `https://${this.configService.get(
      'S3_BUCKET_NAME',
    )}.s3.ap-northeast-2.amazonaws.com/${avatarPath}`;
    return avatar;
  }

  async moveObjects(folderName: string, userEmail: string): Promise<void> {
    const bucket = this.configService.get('S3_BUCKET_NAME');
    const prefix = `${folderName}/${userEmail}`;
    const targetObjects = await this.s3Client.send(
      new ListObjectsCommand({
        Bucket: bucket,
        Prefix: prefix,
      }),
    );

    if (targetObjects.Contents) {
      Promise.all([
        targetObjects.Contents.map(async (fileInfo) => {
          await this.s3Client.send(
            new CopyObjectCommand({
              Bucket: this.configService.get('S3_BUCKET_NAME'),
              CopySource: encodeURI(`${bucket}/${fileInfo.Key}`),
              Key: `inactive-${folderName}/${userEmail}/${fileInfo.Key.split('/').pop()}`,
            }),
          );
          await this.s3Client.send(
            new DeleteObjectCommand({
              Bucket: this.configService.get('S3_BUCKET_NAME'),
              Key: `${folderName}/${userEmail}/${fileInfo.Key.split('/').pop()}`,
            }),
          );
        }),
      ]);
    } else {
      console.log(`${userEmail}: 삭제할 ${folderName}이 없습니다.`);
    }
  }

  /** imgSrc[] 에서 s3에 업로드 된 상품이미지 url의 key[] 리턴 */
  getGoodsImageS3KeyListFromImgSrcList(srcList: string[]): string[] {
    const GOODS_DIRECTORY = 'goods/';
    const GOODS_IMAGE_URL_DOMAIN = `${this.S3_DOMIAN}${GOODS_DIRECTORY}`;

    return srcList
      .filter((src) => src.startsWith(GOODS_IMAGE_URL_DOMAIN))
      .map((src) => src.replace(this.S3_DOMIAN, ''));
  }
}

/** htmlString[] 에서 <img> 태그 src[] 리턴  */
export function getImgSrcListFromHtmlStringList(htmlContentsList: string[]): string[] {
  return [].concat(
    ...htmlContentsList.map((content) => {
      const dom = parse(content);
      return Array.from(dom.querySelectorAll('img')).map((elem) =>
        elem.getAttribute('src'),
      );
    }),
  );
}
