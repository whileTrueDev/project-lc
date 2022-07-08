import { Button, Grid, GridItem, Text, useDisclosure } from '@chakra-ui/react';
import { useGoodsById } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import { Fragment } from 'react';

export function GoodsViewInformationNotice(): JSX.Element | null {
  const router = useRouter();
  const goodsId = router.query.goodsId as string;
  const goods = useGoodsById(goodsId);

  const detailOpen = useDisclosure();

  if (!goods.data) return null;
  if (!goods.data.informationNotice) return null;

  return (
    <Grid
      templateColumns="1fr 2fr"
      mt={6}
      mb={1}
      gap={2}
      fontSize={{ base: 'sm', md: 'md' }}
    >
      <GridItem>
        <Text>상품필수정보</Text>
      </GridItem>
      <GridItem>
        <Button size="xs" onClick={detailOpen.onToggle}>
          확인하기
        </Button>
      </GridItem>

      {detailOpen.isOpen && (
        <>
          {Object.entries(goods.data.informationNotice.contents).map(([key, value]) => (
            <Fragment key={key}>
              <GridItem>
                <Text fontSize="xs">{key}</Text>
              </GridItem>
              <GridItem fontSize="xs">
                <Text>{value}</Text>
              </GridItem>
            </Fragment>
          ))}
        </>
      )}
    </Grid>
  );
}

export default GoodsViewInformationNotice;
