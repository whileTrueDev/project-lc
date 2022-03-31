import {
  DeleteObjectsCommand,
  DeleteObjectsRequest,
  GetObjectCommand,
  GetObjectCommandInput,
  ListObjectsCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
  ListObjectsCommandInput,
  ListObjectsOutput,
  ObjectIdentifier,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3Client,
  _Object,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { UserType } from '@project-lc/shared-types';
import { generateS3Key, s3KeyType } from './generateS3Key';

export type s3TaggingKeys = 'overlayImageType'; // s3 object 태그 객체 키
export interface S3UploadImageOptions
  extends Partial<Omit<PutObjectCommandInput, 'Bucket'>> {
  filename: string | null;
  userMail: string | undefined;
  type: s3KeyType;
  file: File | Buffer | null;
  companyName?: string;
  liveShoppingId?: number;
  isPublic?: boolean; // 공개 이미지로 업로드 할 경우 true 전달 필요
}

// 클로저를 통한 모듈 생성
export const s3 = (() => {
  // 해당 네임 스페이스에서의 객체선언
  // bucket 이름
  const S3_BUCKET_NAME = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;
  const S3_BUCKET_REGION = 'ap-northeast-2';
  const S3_DOMAIN = `https://${S3_BUCKET_NAME}.s3.ap-northeast-2.amazonaws.com/`;
  const s3Client = new S3Client({
    region: S3_BUCKET_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_SECRET!,
    },
  });

  /**
   * 객체 url 조회
   * 해당 key 가진 객체가 public-read인 경우에만 이 url로 접근이 가능함
   * private 객체는 getPresignedUrl 함수 사용
   * @param key s3에 저장된 객체 키 (prefix + 파일명 형태)
   * @returns 객체 url
   */
  function getSavedObjectUrl(key: string): string {
    return S3_DOMAIN + key;
  }

  /** 파일 업로드
   *  Bucket 제외한 Key, Body, ContentType, ACL 등 putObjectCommandInput 기입하여 사용
   *
   * @return output : PutObjectCommandOutput
   * @return savedKey : 객체 키 (prefix + 파일명)
   * @return objectUrl : 객체 url (s3도메인 + 객체키)
   */
  async function sendPutObjectCommand(
    commandInput: Omit<PutObjectCommandInput, 'Bucket'>,
  ): Promise<{
    output: PutObjectCommandOutput;
    savedKey: string;
    objectUrl: string;
  }> {
    const command = new PutObjectCommand({
      ...commandInput,
      Bucket: S3_BUCKET_NAME,
    });
    return {
      output: await s3Client.send(command),
      savedKey: commandInput.Key,
      objectUrl: getSavedObjectUrl(commandInput.Key),
    };
  }

  /**
   * s3KeyType에 따라 s3 특정 경로에 이미지를 저장하는 함수
   * public 이미지로 업로드할 경우 isPublic: true 전달해야함
   * 
   * 해당 함수 내부에서 사용하는 generateS3Key에서 userMail 값을 필요로 하므로
   * 특정 유저와 관계없는 이미지 저장 시(객체 prefix에 유저메일을 포함하지 않는 경우)에는 
   * sendPutObjectCommand 함수 사용을 권함
   * 
   * @param type: s3KeyType;
   * @param file: 저장할 이미지 파일 File | Buffer | null;
   * @param filename: 저장할 이미지의 이름, 주로 확장자 추출을 위함
   * @param userMail: 업로드할 사용자의 이메일 string | undefined;
   * @param companyName? (optional) 사업자 등록증에 등록하는 사업자명
   * @param liveShoppingId?: (optional) 라이브쇼핑 id
   * @param isPublic?: public-read 이미지의 경우 true를 전달해야함. 기본값 false
   * @param 기타 Tagging, ContentType, ACL 등 putObjectCommandInput props 전달 가능

   * @returns 파일명(privater 객체인 경우) 혹은 객체url(public-read 객체인 경우)
              file 이 없는경우 빈 문자열 '' 리턴,         
   * 
   */
  async function s3UploadImage({
    filename,
    userMail,
    type,
    file,
    companyName,
    liveShoppingId,
    isPublic = false,
    ...putObjectCommandInput
  }: S3UploadImageOptions): Promise<string> {
    if (!userMail || !file) throw new Error('file and userMail should have value');

    try {
      const { key, fileName } = generateS3Key({
        userMail,
        type,
        filename,
        companyName,
        liveShoppingId,
      });

      const { objectUrl } = await sendPutObjectCommand({
        ACL: isPublic ? 'public-read' : undefined,
        ...putObjectCommandInput,
        Key: key,
        Body: file,
      });

      if (isPublic) {
        // public 인 경우 객체 url을 리턴함
        return objectUrl;
      }
      // public 이 아닌 경우 객체 url로 접근하지 못하므로 그냥 파일명만 리턴함
      return fileName;
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  /** 프로필 이미지 업로드 */
  async function uploadProfileImage({
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
    await s3Client.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: avatarPath,
        Body: file,
        ACL: 'public-read',
      }),
    );
    const avatar = `https://${S3_BUCKET_NAME}.s3.ap-northeast-2.amazonaws.com/${avatarPath}`;
    return avatar;
  }

  /**
   * 버킷 내 객체목록 조회
   * @param commandInput {Prefix: s3에 저장된 폴더경로}
   * @return response: ListObjectsCommandOutput,
   * @return contents: 해당 경로 내 저장된 객체 목록 | null
   */
  async function sendListObjectCommand(
    commandInput: Omit<ListObjectsCommandInput, 'Bucket'>,
  ): Promise<{
    response: ListObjectsOutput;
    contents: _Object[] | null;
  }> {
    const command = new ListObjectsCommand({
      ...commandInput,
      Bucket: S3_BUCKET_NAME,
    });

    const response = await s3Client.send(command);

    return { response, contents: response.Contents || null };
  }

  /**
   * 여러 객체 삭제
   * @param deleteObjects : { Key: string | undefined , VersionId?: string}[] 형태의 객체키 목록
   * @param quite?: boolean
   * @returns 성공시 true, 에러발생시 false
   */
  async function sendDeleteObjectsCommand(
    input: {
      deleteObjects: ObjectIdentifier[];
      quite?: boolean;
    } & Omit<DeleteObjectsRequest, 'Bucket' | 'Delete'>,
  ): Promise<boolean> {
    const { deleteObjects, quite, ...rest } = input;
    try {
      const command = new DeleteObjectsCommand({
        ...rest,
        Delete: {
          Objects: deleteObjects,
          Quiet: quite,
        },
        Bucket: S3_BUCKET_NAME,
      });

      await s3Client.send(command);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  /**
   * 객체 url 조회
   * private인 객체 조회 위해 expiresIn 으로 넘어온 시간동안 유효한 url 리턴
   * @param getObjectCommandInput {Key: 객체 key 입력}
   * @param options? {expiresIn: 3600} url 유효시간 입력(초), 기본 15분
   * */
  async function getPresignedUrl(
    getObjectCommandInput: Omit<GetObjectCommandInput, 'Bucket'>,
    options?: { expiresIn: number },
  ): Promise<string> {
    const command = new GetObjectCommand({
      ...getObjectCommandInput,
      Bucket: S3_BUCKET_NAME,
    });
    const imageUrl = await getSignedUrl(s3Client, command, {
      ...options,
    });
    return imageUrl;
  }

  /** 폴더 이름 전달 받아서 이동시키는 함수 */
  async function moveObjects(
    rootFolder: string,
    destinationFolder: string,
    userEmail: string,
  ): Promise<void> {
    const prefix = `${rootFolder}/${userEmail}`;

    const targetObjects = await s3Client.send(
      new ListObjectsCommand({
        Bucket: S3_BUCKET_NAME,
        Prefix: prefix,
      }),
    );

    if (targetObjects.Contents) {
      Promise.all([
        targetObjects.Contents.map(async (fileInfo) => {
          await s3Client.send(
            new CopyObjectCommand({
              Bucket: S3_BUCKET_NAME,
              CopySource: encodeURI(`${S3_BUCKET_NAME}/${fileInfo.Key}`),
              Key: `${destinationFolder}/${userEmail}/${fileInfo.Key.split('/').pop()}`,
            }),
          );
          await s3Client.send(
            new DeleteObjectCommand({
              Bucket: S3_BUCKET_NAME,
              Key: `${rootFolder}/${userEmail}/${fileInfo.Key.split('/').pop()}`,
            }),
          );
        }),
      ]);
    } else {
      console.log(`${userEmail}: 삭제할 ${rootFolder}이 없습니다.`);
    }
  }

  function getGoodsImageS3KeyListFromImgSrcList(srcList: string[]): string[] {
    const GOODS_DIRECTORY = 'goods/';
    const GOODS_IMAGE_URL_DOMAIN = `${S3_DOMAIN}${GOODS_DIRECTORY}`;

    return srcList
      .filter((src) => src.startsWith(GOODS_IMAGE_URL_DOMAIN))
      .map((src) => src.replace(S3_DOMAIN, ''));
  }

  return {
    s3UploadImage,
    moveObjects,
    getPresignedUrl,
    getSavedObjectUrl,
    sendPutObjectCommand,
    sendListObjectCommand,
    sendDeleteObjectsCommand,
    uploadProfileImage,
    getGoodsImageS3KeyListFromImgSrcList,
  };
})();
