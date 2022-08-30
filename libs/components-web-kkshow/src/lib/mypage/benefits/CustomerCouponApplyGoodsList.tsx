import { Grid, GridItem, Image, Link } from '@chakra-ui/react';
import { Goods, GoodsImages } from '@prisma/client';
import { CustomerCouponRes } from '@project-lc/shared-types';
import NextLink from 'next/link';

export interface CouponApplicableGoodsListProps {
  goodsList: CustomerCouponRes['coupon']['goods'];
}
export function CouponApplicableGoodsList({
  goodsList,
}: CouponApplicableGoodsListProps): JSX.Element {
  return (
    <Grid
      gridTemplateColumns="repeat(6, 1fr)"
      fontSize={{ base: 'sm', md: 'md' }}
      rowGap={1}
      maxHeight="120px"
      overflowY="auto"
    >
      {goodsList.map((goods) => (
        <ApplicableGoodsLink key={goods.id} {...goods} />
      ))}
    </Grid>
  );
}

export default CouponApplicableGoodsList;

function ApplicableGoodsLink({
  id,
  goods_name,
  image,
}: {
  id: Goods['id'];
  goods_name: Goods['goods_name'];
  image: GoodsImages[];
}): JSX.Element {
  return (
    <>
      <GridItem display="flex" alignItems="center">
        <Image
          boxSize="35px"
          objectFit="cover"
          src={image[0] ? image[0].image : undefined}
        />
      </GridItem>
      <GridItem colSpan={5}>
        <NextLink passHref href={`/goods/${id}`}>
          <Link fontSize="sm">{goods_name}</Link>
        </NextLink>
      </GridItem>
    </>
  );
}
