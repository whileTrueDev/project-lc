import { Container, Grid, GridItem, Heading, VStack } from '@chakra-ui/layout';
import {
  BcSettlementHistory,
  broadcasterCenterMypageNavLinks,
  BroadcasterSettlementInfoRegistBox,
  MypageLayout,
} from '@project-lc/components';
import React from 'react';

export function SettlementIndex(): JSX.Element {
  return (
    <MypageLayout appType="broadcaster" navLinks={broadcasterCenterMypageNavLinks}>
      <Container maxW="7xl" p={6}>
        <Heading mb={4}>정산</Heading>
        <VStack spacing={1} alignItems="stretch">
          <Grid gap={3} templateColumns="repeat(6, 1fr)">
            <GridItem colSpan={[6, 3, 3, 3]} rowSpan={1} alignItems="stretch">
              {/* 정산정보 BOX */}
              <BroadcasterSettlementInfoRegistBox />
            </GridItem>
          </Grid>
        </VStack>

        <BcSettlementHistory />
      </Container>
    </MypageLayout>
  );
}

export default SettlementIndex;
