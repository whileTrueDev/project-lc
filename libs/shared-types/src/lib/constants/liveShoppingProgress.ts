import { LiveShopppingProgressType } from '@prisma/client';

// 한글로 접근하여 DB의 값으로 변환
export const LIVE_SHOPPING_PROGRESS: Record<string, LiveShopppingProgressType> = {
  등록됨: 'registered',
  조율중: 'adjusting',
  확정됨: 'confirmed',
  취소됨: 'canceled',
};

function getTimeValue(date: Date | undefined): number | null {
  return date ? new Date(date).valueOf() : null;
}

export interface LiveShoppingProgressParams {
  progress: LiveShopppingProgressType;
  broadcastStartDate?: Date | null;
  broadcastEndDate?: Date | null;
  sellEndDate?: Date | null;
}

/**
 * 라이브쇼핑의 조건에 따라 현재 절차를 반환하는 함수
 * @param params LiveShoppingProgressParams 라이브쇼핑의 상태에 필요한 파라미터들을 제공
 * @returns string 라이브 쇼핑의 상태
 */
export function getLiveShoppingProgress(params: LiveShoppingProgressParams): string {
  const { progress } = params;

  const 현재시각 = new Date().valueOf();
  const 방송시작시각 = getTimeValue(params?.broadcastStartDate);
  const 방송종료시각 = getTimeValue(params?.broadcastEndDate);
  const 판매종료시각 = getTimeValue(params?.sellEndDate);
  switch (progress) {
    case LIVE_SHOPPING_PROGRESS.조율중:
      return '조율중';
    case LIVE_SHOPPING_PROGRESS.취소됨:
      return '취소됨';
    case LIVE_SHOPPING_PROGRESS.확정됨:
      if (방송시작시각 && 방송종료시각) {
        if (판매종료시각 && 방송종료시각 < 현재시각 && 판매종료시각 < 현재시각) {
          return '판매종료';
        }
        if (방송시작시각 < 현재시각 && 현재시각 < 방송종료시각) {
          return '방송진행중';
        }
        if (방송종료시각 < 현재시각) {
          return '방송종료';
        }
      }
      return '확정됨';
    default:
      return '등록됨';
  }
}
