import { Context } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import sharp from 'sharp';
import { S3PutEvent } from './S3PutEvent';

const S3_BUCKET_REGION = process.env.S3_BUCKET_REGION || 'ap-northeast-2';
const s3 = new S3({ region: S3_BUCKET_REGION });

const generateResizedKey = (targetKey: string, size: number): string => {
  const resized = 'resized-';
  const dotIdx = targetKey.lastIndexOf('.');
  const filenameWithoutExt = targetKey.slice(0, dotIdx);
  const ext = targetKey.slice(dotIdx, targetKey.length);
  const sizes = `${size}x${size}`;
  return resized + filenameWithoutExt + sizes + ext;
};

export const handler = async (event: S3PutEvent, _context: Context): Promise<any> => {
  console.log('event: ', event);

  const result = await Promise.all(
    event.Records?.map(async (record) => {
      const size = 200;
      const bucket = record.s3.bucket.name;
      const srcKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
      const resultKey = generateResizedKey(srcKey, size);

      console.log('record: ', record);

      const imageExtMatch = srcKey.match(/\.([^.]*)$/);
      if (!imageExtMatch) {
        console.log('Could not determine the image type');
        return;
      }

      const image = await s3.getObject({ Bucket: bucket, Key: srcKey }).promise();
      console.log('imageObject: ', image);

      try {
        if (!image || !image.Body) {
          console.log('s3object.Body is not defined');
          return;
        }
        const buffer = await sharp(image.Body as Buffer)
          .resize(size)
          .toBuffer();
        console.log('sharped buffer: ', buffer);

        const putResult = await s3
          .putObject({
            Bucket: bucket,
            Key: resultKey,
            Body: buffer,
            ContentType: image.ContentType,
            ACL: 'public-read',
          })
          .promise();

        console.log('putResult: ', putResult);
        // eslint-disable-next-line consistent-return
        return putResult;
      } catch (err) {
        console.log('error occurred - ', err);
        throw err;
      }
    }),
  );

  return { statusCode: 200, body: JSON.stringify(result) };
};
