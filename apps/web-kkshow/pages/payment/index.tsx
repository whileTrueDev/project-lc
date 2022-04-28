import { Box, Grid, GridItem, Flex } from '@chakra-ui/react';
import { PaymentBox } from '@project-lc/components-web-kkshow/payment/PaymentButton';
import { KkshowLayout } from '@project-lc/components-web-kkshow/KkshowLayout';
import { BuyerInfoSection } from '@project-lc/components-web-kkshow/payment/BuyerInfoSection';
import { DestinationInfo } from '@project-lc/components-web-kkshow/payment/DestinationInfo';
import { OrderItemInfo } from '@project-lc/components-web-kkshow/payment/OrderItemInfo';
import { useDisplaySize } from '@project-lc/hooks';

export function Payment(): JSX.Element {
  const { isDesktopSize } = useDisplaySize();
  return (
    <Box>
      <KkshowLayout>
        {isDesktopSize ? (
          <Flex m="auto" p={6} alignItems="center" justifyContent="center">
            <Grid templateColumns="repeat(7, 4fr)" gap={6} w="70%">
              <GridItem colSpan={5}>
                <BuyerInfoSection />
              </GridItem>
              <GridItem rowSpan={4} colSpan={2} border="solid">
                <PaymentBox />
              </GridItem>
              <GridItem colSpan={5}>
                <DestinationInfo />
              </GridItem>
              <GridItem colSpan={5}>
                <OrderItemInfo />
              </GridItem>
            </Grid>
          </Flex>
        ) : (
          <Flex m="auto" p={6} alignItems="center" justifyContent="center">
            <Grid templateColumns="repeat(7, 4fr)" gap={6} w="70%">
              <GridItem colSpan={5}>
                <BuyerInfoSection />
              </GridItem>
              <GridItem
                rowSpan={4}
                colSpan={2}
                border="solid"
                display={{ base: 'none', md: 'block' }}
              >
                <PaymentBox />
              </GridItem>
              <GridItem colSpan={5}>
                <DestinationInfo />
              </GridItem>
              <GridItem colSpan={5}>
                <OrderItemInfo />
              </GridItem>
            </Grid>
          </Flex>
        )}
      </KkshowLayout>
    </Box>
  );
}

export default Payment;
