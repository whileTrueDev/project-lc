import { KkshowShoppingDto, KkshowShoppingTabResData } from '@project-lc/shared-types';

/** 크크쇼메인데이터(js 객체형태)를 KkshowMain dto 형태로 변환 */
export const kkshowShoppingToDto = (
  data: KkshowShoppingTabResData,
): KkshowShoppingDto => {
  return {
    carousel: data.carousel.map((c) => JSON.parse(JSON.stringify(c))),
    goodsOfTheWeek: data.goodsOfTheWeek.map((c) => JSON.parse(JSON.stringify(c))),
    keywords: data.keywords.map((c) => JSON.parse(JSON.stringify(c))),
    newLineUp: data.newLineUp.map((c) => JSON.parse(JSON.stringify(c))),
    popularGoods: data.popularGoods.map((c) => JSON.parse(JSON.stringify(c))),
    recommendations: data.recommendations.map((c) => JSON.parse(JSON.stringify(c))),
    reviews: data.reviews.map((c) => JSON.parse(JSON.stringify(c))),
    banner: JSON.parse(JSON.stringify(data.banner)),
  };
};
