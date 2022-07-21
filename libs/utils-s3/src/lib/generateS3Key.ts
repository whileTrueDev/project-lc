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
  | 'goods-category'; // 상품 카테고리 대표이미지

export type s3FileNameParams = {
  userMail: string;
  type: s3KeyType;
  filename: string | null;
  companyName?: string;
  liveShoppingId?: number;
};

/**
 * type에 따라 project-lc 버킷에 저장할 객체키(prefix + 파일명)를 생성
 * @param
 * @returns
 */
export function generateS3Key({
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
