import AWS from 'aws-sdk';
import path from 'path';
import moment from 'moment';

// 전역 namespace에 대한 이해
export const s3 = (() => {
  // 해당 네임 스페이스에서의 객체선언
  // bucket 이름
  const S3_BUCKET_NAME = process.env.NEXT_PUBLIC_S3_BUCKET_NAME!;
  const S3_BUCKET_REGION = 'ap-northeast-2';

  AWS.config.update({
    region: S3_BUCKET_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_SECRET!,
    },
  });

  // 추후에 S3에 저장할 데이터 종류가 더해지는 경우 추가
  type s3KeyType = 'business-registration' | 'goods';

  interface S3UploadImageOptions {
    filename: string | null;
    userMail: string | undefined;
    type: s3KeyType;
    file: File | null;
  }

  // 해당 이미지의 타입에 따라서 경로를 파일이름과 함께 생성
  function getS3Key({
    userMail,
    type,
    filename,
  }: {
    userMail: string;
    type: string;
    filename: string | null;
  }) {
    // email으로 사용한다.
    // fileName의 경우, 해당 날짜의 데이터를 추가한다.
    const prefix = moment().format('YYMMDDHHmmss').toString();
    const fileFullName = `${prefix}_${filename}`;
    const pathList = [type, userMail, fileFullName];
    return {
      key: path.join(...pathList),
      fileName: fileFullName,
    };
  }
  async function s3UploadImage({ filename, userMail, type, file }: S3UploadImageOptions) {
    // key 만들기
    if (!userMail || !file) {
      return null;
    }
    const { key, fileName } = getS3Key({ userMail, type, filename });
    try {
      await new AWS.S3.ManagedUpload({
        params: {
          // 저장 영역
          Bucket: S3_BUCKET_NAME,
          // 저장하는 루트 + 파일이름
          Key: key,
          // 저장될 파일
          Body: file,
        },
      }).promise();
      return fileName;
    } catch (error) {
      return null;
    }
  }

  return {
    s3UploadImage,
    getS3Key,
  };
})();
