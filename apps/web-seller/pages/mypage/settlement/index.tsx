import { Container, Divider, Grid, GridItem, Heading, VStack } from '@chakra-ui/react';
import { MypageLayout } from '@project-lc/components-shared/MypageLayout';
import { BusinessRegistrationBox } from '@project-lc/components-seller/BusinessRegistrationBox';
import { SettlementAccountBox } from '@project-lc/components-seller/SettlementAccountBox';
import { SettlementList } from '@project-lc/components-seller/SettlementList';
import { SettlementRoundHistory } from '@project-lc/components-seller/SettlementRoundHistory';
import { SettlementStateBox } from '@project-lc/components-seller/SettlementStateBox';
import { useSettlementInfo } from '@project-lc/hooks';
import { BusinessRegistrationStatus } from '@project-lc/shared-types';
import React, { useMemo } from 'react';

// 정산 페이지 컴포넌트
export function Index(): JSX.Element {
  const { data: settlementData, refetch } = useSettlementInfo();

  const hasAccount = useMemo<boolean>(() => {
    return settlementData?.sellerSettlementAccount.length > 0;
  }, [settlementData?.sellerSettlementAccount]);

  const hasRegistration = useMemo<boolean>(() => {
    if (settlementData?.sellerBusinessRegistration.length > 0) {
      const { status } =
        settlementData?.sellerBusinessRegistration[0].BusinessRegistrationConfirmation;
      if (status === BusinessRegistrationStatus.CONFIRMED) {
        return true;
      }
    }
    return false;
  }, [settlementData?.sellerBusinessRegistration]);

  return (
    <MypageLayout>
      <Container maxW="7xl" p={6}>
        <Heading as="h6" size="md" mb={4}>
          정산 정보
        </Heading>

        <VStack spacing={1} alignItems="stretch">
          <Grid gap={3} templateColumns="repeat(6, 1fr)">
            <GridItem colSpan={[6, 6, 6, 3]} rowSpan={1} alignItems="stretch">
              {/* 정산 상태 BOX */}
              <SettlementStateBox
                hasAccount={hasAccount}
                hasRegistration={hasRegistration}
                sellerBusinessRegistration={settlementData?.sellerBusinessRegistration[0]}
              />
            </GridItem>
            <GridItem colSpan={[6, 6, 6, 3]} rowSpan={2} alignItems="stretch">
              {/* 계좌번호 BOX */}
              <SettlementAccountBox
                settlementAccount={settlementData?.sellerSettlementAccount[0]}
                refetch={refetch}
              />
            </GridItem>
            <GridItem colSpan={[6, 6, 6, 3]} rowSpan={2} alignItems="stretch">
              {/* 사업자 등록증 BOX */}
              <BusinessRegistrationBox
                sellerBusinessRegistration={settlementData?.sellerBusinessRegistration[0]}
                refetch={refetch}
              />
            </GridItem>
          </Grid>
          <Divider />
        </VStack>
      </Container>

      <Container maxW="7xl" p={6}>
        <Heading as="h6" size="md" mb={4}>
          정산 내역
        </Heading>
        <SettlementRoundHistory />
      </Container>

      <VStack alignItems="stretch">
        {/* 정산 목록 BOX */}
        <SettlementList />
      </VStack>
    </MypageLayout>
  );
}

export default Index;
