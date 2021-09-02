import {
  MypageLayout,
  SettlementStateBox,
  BusinessRegistrationBox,
  SettlementAccountBox,
  SettlementListBox,
} from '@project-lc/components';
import { useSettlementInfo } from '@project-lc/hooks';
import { Heading, VStack, Divider, Container, Grid, GridItem } from '@chakra-ui/react';
import { useMemo } from 'react';
// 정산 페이지 컴포넌트
export function Index(props): JSX.Element {
  const { data: settlementData, refetch } = useSettlementInfo();

  const hasAccount = useMemo(() => {
    return settlementData?.sellerSettlementAccount.length > 0;
  }, [settlementData?.sellerSettlementAccount]);

  const hasRegistration = useMemo(() => {
    return settlementData?.businessRegistration.length > 0;
  }, [settlementData?.businessRegistration]);

  return (
    <MypageLayout>
      <Container maxW="7xl" p={[1, 6, 6, 6]}>
        <VStack spacing={1} alignItems="stretch">
          <Heading mb={4}>정산</Heading>
          <Grid p={3} gap={3} templateColumns="repeat(5, 1fr)">
            <GridItem colSpan={[5, 2, 2, 2]} rowSpan={2}>
              {/* 정산 상태 BOX */}
              <SettlementStateBox
                hasAccount={hasAccount}
                hasRegistration={hasRegistration}
              />
            </GridItem>
            <GridItem colSpan={[5, 3, 3, 3]} rowSpan={2} alignItems="stretch">
              {/* 정산 목록 BOX */}
              <SettlementListBox sellerSettlements={settlementData?.sellerSettlements} />
            </GridItem>
          </Grid>

          <Grid p={3} pt={0} gap={3} templateColumns="repeat(6, 1fr)">
            <GridItem colSpan={[6, 3, 3, 3]} rowSpan={2}>
              {/* 사업자 등록증 BOX */}
              <BusinessRegistrationBox
                businessRegistration={settlementData?.businessRegistration[0]}
                refetch={refetch}
              />
            </GridItem>
            <GridItem colSpan={[6, 3, 3, 3]} rowSpan={2} alignItems="stretch">
              {/* 계좌번호 BOX */}
              <SettlementAccountBox
                settlementAccount={settlementData?.sellerSettlementAccount[0]}
                refetch={refetch}
              />
            </GridItem>
          </Grid>
          <Divider />
        </VStack>
      </Container>
    </MypageLayout>
  );
}

export default Index;
