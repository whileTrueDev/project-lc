import {
  MypageLayout,
  SettlementStateBox,
  BusinessRegistrationBox,
  SettlementAccountBox,
  SettlementListBox,
} from '@project-lc/components';
import { Heading, VStack, Divider, Container, Grid, GridItem } from '@chakra-ui/react';
// 정산 페이지 컴포넌트
export function Index(): JSX.Element {
  return (
    <MypageLayout>
      <Container maxW="7xl" p={[1, 6, 6, 6]}>
        <VStack spacing={1} alignItems="stretch">
          <Heading mb={4}>정산</Heading>
          <Grid p={3} gap={3} templateColumns="repeat(5, 1fr)">
            <GridItem colSpan={[5, 2, 2, 2]} rowSpan={2}>
              {/* 정산 상태 BOX */}
              <SettlementStateBox />
            </GridItem>
            <GridItem colSpan={[5, 3, 3, 3]} rowSpan={2} alignItems="stretch">
              {/* 정산 목록 BOX */}
              <SettlementListBox />
            </GridItem>
          </Grid>

          <Grid p={3} pt={0} gap={3} templateColumns="repeat(6, 1fr)">
            <GridItem colSpan={[6, 3, 3, 3]} rowSpan={2}>
              {/* 사업자 등록증 BOX */}
              <BusinessRegistrationBox />
            </GridItem>
            <GridItem colSpan={[6, 3, 3, 3]} rowSpan={2} alignItems="stretch">
              {/* 계좌번호 BOX */}
              <SettlementAccountBox />
            </GridItem>
          </Grid>
          <Divider />
        </VStack>
      </Container>
    </MypageLayout>
  );
}

export default Index;
