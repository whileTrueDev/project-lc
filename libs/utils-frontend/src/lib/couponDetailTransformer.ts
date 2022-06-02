export const DiscountUnitTransformer = (value): string => {
  switch (value) {
    case 'P':
      return '퍼센트';
    case 'W':
      return '원';
    default:
      return '';
  }
};

export const DiscountApplyFieldTransformer = (value): string => {
  switch (value) {
    case 'goods':
      return '상품할인';
    case 'shipping':
      return '배송비할인';
    default:
      return '';
  }
};

export const DiscountApplyTypeTransformer = (value): string => {
  switch (value) {
    case 'allGoods':
      return '모든상품할인';
    case 'exceptSelectedGoods':
      return '선택상품제외';
    case 'selectedGoods':
      return '선택상품';
    default:
      return '';
  }
};
