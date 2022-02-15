import {
  DeleteObjectCommand,
  S3Client,
  CopyObjectCommand,
  ListObjectsCommand,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly S3_BUCKET_REGION = 'ap-northeast-2';

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.S3_BUCKET_REGION,
      credentials: {
        secretAccessKey: this.configService.get('AWS_S3_ACCESS_KEY_SECRET'),
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY_ID'),
      },
    });
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
}
