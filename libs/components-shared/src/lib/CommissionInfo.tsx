import { Box, Text } from '@chakra-ui/react';
import { Prisma } from '@prisma/client';

interface CommissionInfoProps {
  totalPrice: number;
  broadcasterCommissionRate: string | Prisma.Decimal;
  whiletrueCommissionRate: string | Prisma.Decimal;
}
export function CommissionInfo({
  totalPrice,
  broadcasterCommissionRate,
  whiletrueCommissionRate,
}: CommissionInfoProps): JSX.Element {
  return (
    <Box>
      <Text>
        방송인 {broadcasterCommissionRate}% (
        {Math.floor(Number(broadcasterCommissionRate) * 0.01 * totalPrice)}) 원
      </Text>
      <Text>
        크크쇼 {whiletrueCommissionRate}% (
        {Math.floor(Number(whiletrueCommissionRate) * 0.01 * totalPrice)}) 원
      </Text>
    </Box>
  );
}

export default CommissionInfo;
