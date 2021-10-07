import AWS from 'aws-sdk';
import path from 'path';
import moment from 'moment';

// 클로저를 통한 모듈 생성
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
  type s3KeyType = 'business-registration' | 'goods' | 'mail-order';

  interface S3UploadImageOptions {
    filename: string | null;
    userMail: string | undefined;
    type: s3KeyType;
    file: File | Buffer | null;
    companyName?: string;
  }

  type s3FileNameParams = {
    userMail: string;
    type: s3KeyType;
    filename: string | null;
    companyName?: string;
  };

  // 파일명에서 확장자를 추출하는 과정
  function getExtension(fileName: string | null): string {
    if (!fileName) {
      return '';
    }
    const location = fileName.lastIndexOf('.');
    const result = fileName.substring(location);
    return result;
  }

  function getS3Key({ userMail, type, filename, companyName }: s3FileNameParams): {
    key: string;
    fileName: string;
  } {
    const extension = getExtension(filename);

    // 등록된 파일 구별을 위한 등록시간을 통한 접두사 추가
    const prefix = moment().format('YYMMDDHHmmss').toString();

    let fileFullName;
    switch (type) {
      case 'business-registration': {
        fileFullName = `${prefix}_${companyName}_사업자등록증${extension}`;
        break;
      }
      case 'mail-order': {
        fileFullName = `${prefix}_${companyName}_통신판매업신고증${extension}`;
        break;
      }
      default: {
        fileFullName = `${filename}`;
      }
    }
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
  }: Pick<S3UploadImageOptions, 'file'> & {
    key: string;
    contentType: string;
  }): Promise<AWS.S3.ManagedUpload.SendData> {
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

  /**
   * S3를 저장하는 함수
   *
   * @param file        저장할 이미지 파일
   * @param filename    저장할 이미지의 이름, 주로 확장자 추출을 위함
   * @param type         'business-registration' | 'mail-order'
   * @param userMail     업로드할 사용자의 이메일
   * @param companyName? (optional) 사업자 등록증에 등록하는 사업자명
   * @returns
   */
  async function s3UploadImage({
    file,
    filename,
    type,
    userMail,
    companyName,
  }: S3UploadImageOptions): Promise<string | null> {
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
