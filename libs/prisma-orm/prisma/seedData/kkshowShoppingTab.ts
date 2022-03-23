const dummyGoodsData1 = {
  imageUrl: 'https://k-kmarket.com/data/goods/1/2021/12/_temp_16385092718881large.jpg',
  linkUrl: 'https://k-kmarket.com/goods/view?no=97',
  name: '백종원의 3대천왕 출연 속초 닭강정 (반반)',
  normalPrice: 17000,
  discountedPrice: 10000,
};

const dummyGoodsData2 = {
  imageUrl: 'https://k-kmarket.com/data/goods/1/2021/12/_temp_16385091815609large.jpg',
  linkUrl: 'https://k-kmarket.com/goods/view?no=96',
  name: '백종원의 3대천왕 속초 닭강정 (블랙)',
  normalPrice: 18000,
  discountedPrice: 14000,
};

const dummyReview1 = {
  title: '양도 많고 맛있어요',
  contents:
    '굴림만두를 처음 먹어본건데 신기하고 맛도 졸네요. 어쩌고 저쩌고 이러쿵 저러쿵 리뷰 씁니다.',
  createDate: new Date(),
  rating: 5,
  imageUrl: 'https://k-kmarket.com/data/goods/1/2022/01/163_temp_16426580203194large.png',
  linkUrl: 'https://k-kmarket.com/board/view?id=goods_review&seq=9',
};

const dummyReview2 = {
  title: '맛있어요 리뷰',
  contents:
    '어쩌고 저쩌고 이러쿵 저러쿵 리뷰 씁니다.어쩌고 저쩌고 이러쿵 저러쿵 리뷰 씁니다.어쩌고 저쩌고 이러쿵 저러쿵 리뷰 씁니다.어쩌고 저쩌고 이러쿵 저러쿵 리뷰 씁니다.어쩌고 저쩌고 이러쿵 저러쿵 리뷰 씁니다.어쩌고 저쩌고 이러쿵 저러쿵 리뷰 씁니다.',
  createDate: new Date(),
  rating: 4,
  imageUrl: 'https://k-kmarket.com/data/goods/1/2022/01/163_temp_16426580203194large.png',
  linkUrl: 'https://k-kmarket.com/board/view?id=goods_review&seq=8',
};

const dummyKeyword1 = {
  keyword: '순두부찌개',
  linkUrl: 'https://k-kmarket.com/goods/view?no=179',
};

const dummyKeyword2 = {
  keyword: '파스타',
  linkUrl: 'https://k-kmarket.com/goods/view?no=178',
};

export const kkshowShoppingTabDummyData = {
  // carousel ; 캐러셀
  carousel: [
    {
      imageUrl:
        'https://k-kmarket.com/data/skin/a_sy01/images/banner/5/images_1.jpg?1646377063',
      linkUrl: 'https://k-kmarket.com/',
      description: '',
    },
    {
      imageUrl:
        'https://k-kmarket.com/data/skin/a_sy01/images/banner/5/images_5.jpg?1646377063',
      linkUrl: 'https://k-kmarket.com/',
      description: '',
    },
  ],
  // goodsOfTheWeek ; 금주의 상품
  goodsOfTheWeek: [dummyGoodsData1, dummyGoodsData2, dummyGoodsData1, dummyGoodsData2],
  // newLineUp ; 신상 라인업
  newLineUp: [
    dummyGoodsData1,
    dummyGoodsData2,
    dummyGoodsData1,
    dummyGoodsData2,
    dummyGoodsData1,
  ],
  // popularGoods ; 많이 찾는 상품
  popularGoods: [
    dummyGoodsData1,
    dummyGoodsData2,
    dummyGoodsData1,
    dummyGoodsData2,
    dummyGoodsData1,
  ],
  // recommendations; 크크마켓 추천상품
  recommendations: [dummyGoodsData1, dummyGoodsData2, dummyGoodsData1],
  // reviews; 생생후기
  reviews: [dummyReview1, dummyReview2, dummyReview1, dummyReview2],
  // keywords; 테마별 키워드
  keywords: [
    {
      theme: '한식',
      keywords: [
        dummyKeyword1,
        dummyKeyword2,
        dummyKeyword1,
        dummyKeyword2,
        dummyKeyword1,
        dummyKeyword2,
      ],
      imageUrl:
        'https://k-kmarket.com/data/goods/1/2021/12/_temp_16385083964786large.png',
    },
    {
      theme: '양식',
      keywords: [
        dummyKeyword2,
        dummyKeyword1,
        dummyKeyword2,
        dummyKeyword1,
        dummyKeyword2,
        dummyKeyword1,
      ],
      imageUrl:
        'https://k-kmarket.com/data/goods/1/2021/12/_temp_16385033431082large.png',
    },
  ],
};
