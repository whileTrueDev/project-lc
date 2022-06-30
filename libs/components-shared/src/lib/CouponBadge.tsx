import { Box, Badge } from '@chakra-ui/react';
import {
  DiscountApplyType,
  DiscountApplyField,
  AmountUnit,
  CouponLogType,
} from '@prisma/client';

export const DiscountUnitBage = (value: AmountUnit): JSX.Element => {
  switch (value) {
    case 'P':
      return (
        <Box lineHeight={2}>
          <Badge variant="outline" colorScheme="blue">
            퍼센트
          </Badge>
        </Box>
      );
    case 'W':
      return (
        <Box lineHeight={2}>
          <Badge variant="outline" colorScheme="green">
            원
          </Badge>
        </Box>
      );
    default:
      return <Box />;
  }
};

export const DiscountApplyFieldBadge = (value: DiscountApplyField): JSX.Element => {
  switch (value) {
    case 'goods':
      return (
        <Box lineHeight={2}>
          <Badge variant="outline" colorScheme="blue">
            상품할인
          </Badge>
        </Box>
      );
    case 'shipping':
      return (
        <Box lineHeight={2}>
          <Badge variant="outline" colorScheme="green">
            배송비할인
          </Badge>
        </Box>
      );
    default:
      return <Box />;
  }
};

export const DiscountApplyTypeBadge = (value: DiscountApplyType): JSX.Element => {
  switch (value) {
    case 'allGoods':
      return (
        <Box lineHeight={2}>
          <Badge variant="outline" colorScheme="blue">
            모든상품할인
          </Badge>
        </Box>
      );
    case 'exceptSelectedGoods':
      return (
        <Box lineHeight={2}>
          <Badge variant="outline" colorScheme="green">
            선택상품제외
          </Badge>
        </Box>
      );
    case 'selectedGoods':
      return (
        <Box lineHeight={2}>
          <Badge variant="outline" colorScheme="yellow">
            선택상품
          </Badge>
        </Box>
      );
    default:
      return <Box />;
  }
};

export function ActionTypeBadge(value: CouponLogType): JSX.Element {
  switch (value) {
    case 'issue':
      return (
        <Box lineHeight={2}>
          <Badge variant="outline" colorScheme="blue">
            적립
          </Badge>
        </Box>
      );
    case 'use':
      return (
        <Box lineHeight={2}>
          <Badge variant="outline" colorScheme="red">
            사용
          </Badge>
        </Box>
      );
    case 'restore':
      return (
        <Box lineHeight={2}>
          <Badge variant="outline" colorScheme="green">
            복구
          </Badge>
        </Box>
      );
    default:
      return <Box />;
  }
}
