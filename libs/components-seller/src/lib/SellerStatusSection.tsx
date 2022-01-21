// 현재의 검수상태를 보여주는 컴포넌트
import { useSettlementInfo } from '@project-lc/hooks';
import { useMemo } from 'react';
import { Grid, Flex } from '@chakra-ui/react';
import { BusinessRegistrationStatus } from '@project-lc/shared-types';
import { GridTableItem } from '@project-lc/components-layout/GridTableItem';

export function SellerStatusSection(): JSX.Element {
  // 사업자등록정보 조회
  const { data: settlementData } = useSettlementInfo();

  const sellerStatus = useMemo<string>(() => {
    if (
      settlementData?.sellerBusinessRegistration &&
      settlementData?.sellerBusinessRegistration.length > 0
    ) {
      const { BusinessRegistrationConfirmation } =
        settlementData?.sellerBusinessRegistration[0];
      const result =
        BusinessRegistrationConfirmation?.status === BusinessRegistrationStatus.CONFIRMED
          ? '정상'
          : '판매중지';
      return result;
    }
    return '판매중지';
  }, [settlementData?.sellerBusinessRegistration]);

  return (
    <Flex direction="row" maxW="600" m={2}>
      <Grid templateColumns="2fr 3fr" borderTopWidth={1.5} width={['100%']}>
        <GridTableItem title="검수 상태" value={sellerStatus} />
      </Grid>
      <Grid templateColumns="2fr 3fr" borderTopWidth={1.5} width={['100%']}>
        <GridTableItem title="정산 주기" value="월 2회" />
      </Grid>
    </Flex>
  );
}

export default SellerStatusSection;
