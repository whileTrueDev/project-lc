declare global {
  interface Window {
    dataLayer?: any[];
  }
}

// TODO : 이벤트 별 타입 설정하기 혹은 타입 모듈 있는지 확인하기
// https://developers.google.com/analytics/devguides/collection/ga4/reference/events#view_item
// 이벤트별로 필수, 옵션 파라미터 값이 다 다르다
// 타입정의 되어 있는 게 있을거같다 react-gtm-module ?
export const pushDataLayer = ({
  event,
  ...rest
}: {
  event: string;
} & Record<string, any>): void => {
  if (window && window.dataLayer) {
    if (event === 'ecommerce') {
      window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
    }
    window.dataLayer.push({
      event,
      ...rest,
    });
  }
};
