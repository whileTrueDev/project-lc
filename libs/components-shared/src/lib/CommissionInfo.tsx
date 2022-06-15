import { Box, Text } from '@chakra-ui/react';
import { Prisma } from '@prisma/client';

interface CommissionInfoProps {
  totalPrice: number;
  broadcasterCommissionRate?: string | Prisma.Decimal;
  whiletrueCommissionRate?: string | Prisma.Decimal;
}
export function CommissionInfo({
  totalPrice,
  broadcasterCommissionRate,
  whiletrueCommissionRate,
}: CommissionInfoProps): JSX.Element {
  const bcCommissionRate = Number(broadcasterCommissionRate);
  const wtCommissionRate = Number(whiletrueCommissionRate);
  return (
    <Box>
      {bcCommissionRate ? (
        <Text>
          방송인 {broadcasterCommissionRate}% (
          {Math.floor(bcCommissionRate * 0.01 * totalPrice)}) 원
        </Text>
      ) : null}

      {wtCommissionRate ? (
        <Text>
          크크쇼 {whiletrueCommissionRate}% (
          {Math.floor(wtCommissionRate * 0.01 * totalPrice)}) 원
        </Text>
      ) : null}
    </Box>
  );
}

export default CommissionInfo;
