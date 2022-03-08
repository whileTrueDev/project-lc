import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
  DeleteObjectsCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  GetObjectCommandInput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getExtension } from '@project-lc/utils';
import dayjs from 'dayjs';
import path from 'path';

// 추후에 S3에 저장할 데이터 종류가 더해지는 경우 추가
export type s3KeyType =
  | 'avatar' // 프로필 이미지 avatar/:userType/:email/:filename.ext
  | 'broadcaster-account-image' // 방송인 통장사본 broadcaster-account-image/:email/:filename.ext
  | 'broadcaster-id-card' // 방송인 신분증 broadcaster-id-card/:email/:filename.ext
  | 'business-registration' // 사업자등록증 business-registration/:email/:filename.ext
  | 'donation-images' // 도네이션 이미지
  | 'goods' // 상품 이미지 goods/:email/:filename.ext
  | 'horizontal-banner' // 가로배너
  // | 'inactive-broadcaster-account-image' // 비활성 방송인 통장사본
  // | 'inactive-broadcaster-id-card' // 비활성 방송인 신분증
  // | 'inactive-business-registration' // 비활성 판매자 사업자등록증
  // | 'inactive-mail-order' // 비활성 판매자 통신판매업신고증
  // | 'inactive-settlement-account' // 비활성 판매자 통장사본
  | 'kkshow-main-carousel-images' // 크크쇼 메인 캐러셀 배너이미지 kkshow-main-carousel-images/:filename.ext
  | 'live-shopping-images' // 크크쇼 메인 라이브 쇼핑 섬네일 이미지 live-shopping-images/:liveShoppingId/:type/:filename.ext
  | 'mail-order' // 판매자 통신판매업신고증 mail-order/:email/:filename.ext
  | 'overlay-logo'
  | 'public' // 예시이미지, 가이드이미지 등 공개이미지
  | 'settlement-account' // 판매자 통장사본 settlement-account/:email/:filename.ext
  | 'vertical-banner' // 세로배너
;
export type s3TaggingKeys = 'overlayImageType'; // s3 object 태그 객체 키
export interface S3UploadImageOptions {
  filename: string | null;
  userMail: string | undefined;
  type: s3KeyType;
  file: File | Buffer | null;
  companyName?: string;
  liveShoppingId?: number;
  tagging?: { [k in s3TaggingKeys]: string }; // s3 object 태그 key와 value
}

export type s3FileNameParams = {
  userMail: string;
  type: s3KeyType;
  filename: string | null;
  companyName?: string;
  liveShoppingId?: number;
};

// 클로저를 통한 모듈 생성
export const s3 = (() => {
  // 해당 네임 스페이스에서의 객체선언
  // bucket 이름
  const S3_BUCKET_NAME = process.env.NEXT_PUBLIC_S3_BUCKET_NAME!;
  const S3_BUCKET_REGION = 'ap-northeast-2';
  const S3_DOMIAN = 'https://lc-project.s3.ap-northeast-2.amazonaws.com/';

  const s3Client = new S3Client({
    region: S3_BUCKET_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_SECRET!,
    },
  });

  function getS3Key({
    userMail,
    type,
    filename,
    companyName,
    liveShoppingId,
  }: s3FileNameParams): {
    key: string;
    fileName: string;
  } {
    const extension = getExtension(filename);

    // 등록된 파일 구별을 위한 등록시간을 통한 접두사 추가
    const prefix = dayjs().format('YYMMDDHHmmss').toString();

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
      case 'settlement-account': {
        fileFullName = `${prefix}_통장사본${extension}`;
        break;
      }
      case 'goods': {
        fileFullName = `${prefix}_${filename}`;
        break;
      }
      case 'broadcaster-id-card': {
        // 방송인 신분증
        fileFullName = `${prefix}_신분증${extension}`;
        break;
      }
      case 'broadcaster-account-image': {
        // 방송인 통장사본
        fileFullName = `${prefix}_통장사본${extension}`;
        break;
      }

      default: {
        fileFullName = `${filename}`;
      }
    }
    const pathList = liveShoppingId
      ? [type, userMail, String(liveShoppingId), fileFullName]
      : [type, userMail, fileFullName];
    return {
      key: path.join(...pathList),
      fileName: fileFullName,
    };
  }

  /** public-read 로 s3 업로드 */
  async function s3publicUploadFile({
    file,
    contentType,
    filename,
    type,
    userMail,
    liveShoppingId,
    tagging,
  }: S3UploadImageOptions & {
    contentType: string;
  }): Promise<string> {
    if (!userMail || !file) throw new Error('file should be not null');
    const { key } = getS3Key({ userMail, type, filename, liveShoppingId });
    const objectTagKey = tagging ? Object.keys(tagging).pop() : '';
    const objectTagValue = tagging ? Object.values(tagging).pop() : '';

    if (objectTagKey && !objectTagValue) {
      throw new Error('No value Error');
    }

    try {
      const command = new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: key,
        Body: file,
        Tagging: tagging ? `${objectTagKey}=${objectTagValue}` : '',
        ContentType: contentType,
        ACL: 'public-read',
      });
      await s3Client.send(command);
      return S3_DOMIAN + key;
    } catch (error) {
      throw new Error('error in s3publicUploadFile');
    }
  }

  /** s3.send(putObjectCommand) 래핑함수. 버킷 제외한 Key, Body, ContentType, ACL등 기입할것
   * @return output : PutObjectCommandOutput
   * @return savedKey : S3 도메인과 key 합친것으로 이미지의 경우 저장된 url
   */
  async function sendPutObjectCommand(
    commandInput: Omit<PutObjectCommandInput, 'Bucket'>,
  ): Promise<{ output: PutObjectCommandOutput; savedKey: string }> {
    const command = new PutObjectCommand({
      ...commandInput,
      Bucket: S3_BUCKET_NAME,
    });
    return {
      output: await s3Client.send(command),
      savedKey: S3_DOMIAN + commandInput.Key,
    };
  }

  /**
   * S3에 이미지를 저장하는 함수
   *
   * @param file        저장할 이미지 파일
   * @param filename    저장할 이미지의 이름, 주로 확장자 추출을 위함
   * @param type         'business-registration' | 'mail-order'
   * @param userMail     업로드할 사용자의 이메일
   * @param companyName? (optional) 사업자 등록증에 등록하는 사업자명
   * @returns null 또는 파일명
   */
  async function s3UploadImage({
    file,
    filename,
    type,
    userMail,
    companyName,
    liveShoppingId,
  }: S3UploadImageOptions): Promise<string | null> {
    if (!userMail || !file) {
      return null;
    }
    const { key, fileName } = getS3Key({
      userMail,
      type,
      filename,
      companyName,
      liveShoppingId,
    });

    try {
      const command = new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: key,
        Body: file,
      });
      await s3Client.send(command);
      return fileName;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  /**
   * S3에서 사업자등록증 또는 통신판매업신고증 다운로드
   *
   * @param fileName     다운로드할 이미지의 이름
   * @param sellerEmail  다운로드할 사용자의 이메일
   * @param type         'business-registration' | 'mail-order'
   * @returns 해당 이미지 파일을 다운받을 수 있는 URL
   */
  async function s3DownloadImageUrl(
    fileName: string,
    sellerEmail: string,
    type: s3KeyType,
  ): Promise<string> {
    const signedUrlExpireSeconds = 60;
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: `${type}/${sellerEmail}/${fileName}`,
    });

    const imageUrl = await getSignedUrl(s3Client, command, {
      expiresIn: signedUrlExpireSeconds,
    });
    return imageUrl;
  }

  async function getOverlayImagesFromS3(
    broadcasterId: string,
    liveShoppingId: number,
    type: 'vertical-banner' | 'donation-images' | 'overlay-logo' | 'horizontal-banner',
  ): Promise<(string | undefined)[]> {
    const command = new ListObjectsCommand({
      Bucket: S3_BUCKET_NAME,
      Prefix: `${type}/${broadcasterId}/${liveShoppingId}`,
    });
    const response = await s3Client.send(command);
    const imagesLength = response.Contents || null;
    const imagesKey = imagesLength?.map((item) => {
      return item.Key;
    });
    return imagesKey || [];
  }

  async function s3DeleteImages(
    toDeleteImages: (string | undefined)[],
  ): Promise<boolean> {
    const toDeleteObject: { Key: string }[] = [];
    toDeleteImages.forEach((imageName) => {
      toDeleteObject.push({ Key: `${imageName}` });
    });
    const command = new DeleteObjectsCommand({
      Bucket: S3_BUCKET_NAME,
      Delete: { Objects: toDeleteObject },
    });

    try {
      await s3Client.send(command);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }


  /**
   *  private 객체 url 조회
   * @param getObjectCommandInput {Key: 객체 key 입력}
   * @param options? {expiresIn: 3600} url 유효시간 입력(초), 기본 15분
   * */ 
  async function getPresignedUrl(
    getObjectCommandInput:Omit<GetObjectCommandInput,'Bucket'>,
    options?:{expiresIn: number}): Promise<string> {
    const command = new GetObjectCommand({
      ...getObjectCommandInput,
      Bucket: S3_BUCKET_NAME,
    });
    const imageUrl = await getSignedUrl(s3Client, command, {
      ...options
    });
    return imageUrl;
  }

  return {
    s3UploadImage,
    getS3Key,
    s3DownloadImageUrl,
    s3uploadFile: s3publicUploadFile,
    getOverlayImagesFromS3,
    s3DeleteImages,
    sendPutObjectCommand,
    getPresignedUrl
  };
})();
