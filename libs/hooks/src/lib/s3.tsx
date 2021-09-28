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
    file: File | Buffer | null;
    companyName: string;
  }

  // 파일명에서 확장자를 추출하는 과정
  function getExtension(fileName: string | null) {
    if (!fileName) {
      return '';
    }
    const location = fileName.lastIndexOf('.');
    const result = fileName.substring(location);
    return result;
  }

  // 해당 이미지의 타입에 따라서 경로를 파일이름과 함께 생성
  // 파일이름을 그대로 사용하지 않도록함.
  function getS3Key({
    userMail,
    type,
    filename,
    companyName,
  }: {
    userMail: string;
    type: string;
    filename: string | null;
    companyName: string;
  }) {
    // 확장자 추출
    const extension = getExtension(filename);
    const prefix = moment().format('YYMMDDHHmmss').toString();
    const fileFullName = `${prefix}_${companyName}_사업자등록증${extension}`;
    const pathList = [type, userMail, fileFullName];
    return {
      key: path.join(...pathList),
      fileName: fileFullName,
    };
  }

  async function s3uploadFile({
    key,
    file,
    contentType,
  }: Pick<S3UploadImageOptions, 'file'> & { key: string; contentType: string }) {
    if (!file) throw new Error('file should be not null');
    return new AWS.S3.ManagedUpload({
      params: {
        Bucket: S3_BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: contentType,
        ACL: 'public-read',
      },
    }).promise();
  }

  async function s3UploadImage({
    filename,
    userMail,
    type,
    file,
    companyName,
  }: S3UploadImageOptions) {
    // key 만들기
    if (!userMail || !file) {
      return null;
    }
    const { key, fileName } = getS3Key({ userMail, type, filename, companyName });
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
      console.log(error);
      return null;
    }
  }

  // s3 bucket에서 다운로드 하기
  function s3DownloadImageUrl(fileName: string, sellerEmail: string): string {
    const signedUrlExpireSeconds = 60;
    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: `business-registration/${sellerEmail}/${fileName}`,
      Expires: signedUrlExpireSeconds,
    };
    const imageUrl = new AWS.S3().getSignedUrl('getObject', params);
    return imageUrl;
  }

  return {
    s3UploadImage,
    getS3Key,
    s3DownloadImageUrl,
    s3uploadFile,
  };
})();
