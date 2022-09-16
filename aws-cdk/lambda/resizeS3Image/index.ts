import { Context } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import sharp from 'sharp';
import { S3PutEvent } from './S3PutEvent';

const S3_BUCKET_REGION = process.env.S3_BUCKET_REGION || 'ap-northeast-2';
const s3 = new S3({ region: S3_BUCKET_REGION });

type Size = number | Record<'x' | 'y', number>;
type Prefixes = Array<{ key: string; size: Size }>;
const prefixes: Prefixes = [
  { key: 'avatar/', size: 200 },
  { key: 'goods-category/', size: 200 },
  { key: 'kkshow-main-carousel-images/', size: { x: 1000, y: 500 } },
  { key: 'kkshow-shopping-carousel-images/', size: { x: 1000, y: 500 } },
  { key: 'kkshow-shopping-banner-images/', size: 200 },
  { key: 'goods-review-images/', size: 200 },
  { key: 'goods/', size: 300 },
];

const generateResizedKey = (targetKey: string): string => {
  const resized = 'resized-';
  return resized + targetKey;
};

export const handler = async (event: S3PutEvent, _context: Context): Promise<any> => {
  console.log('event: ', event);
  const result = await Promise.all(
    event.Records?.map(async (record) => {
      console.log('record: ', record);

      const bucket = record.s3.bucket.name;
      const srcKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
      const target = prefixes.find((p) => srcKey.startsWith(p.key));
      if (!target) {
        console.log(`${srcKey} is not in target prefixes`);
        return;
      }
      const { size } = target;
      const resultKey = generateResizedKey(srcKey);

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
        const resizeSize: [number, number] =
          typeof size === 'number' ? [size, size] : [size.x, size.y];
        let buffer: Buffer | null = null;
        try {
          buffer = await sharp(image.Body as Buffer)
            .resize(...resizeSize, { fit: 'fill' })
            .toBuffer();
          console.log('sharped buffer: ', buffer);
        } catch (e) {
          console.log('err occurred during resizing image - ', e);
          return;
        }

        if (!buffer) {
          console.log('err occurred during resizing image');
          return;
        }

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
        // eslint-disable-next-line consistent-return
        return {
          statusCode: 500,
          body: err,
        };
      }
    }),
  );

  return { statusCode: 200, body: JSON.stringify(result) };
};
