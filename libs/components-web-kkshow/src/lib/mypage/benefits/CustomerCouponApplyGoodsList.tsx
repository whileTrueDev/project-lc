import {
  Button,
  Grid,
  GridItem,
  GridProps,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { Goods, GoodsImages } from '@prisma/client';
import { DiscountApplyTypeBadge } from '@project-lc/components-shared/CouponBadge';
import { CustomerCouponRes } from '@project-lc/shared-types';
import { getKkshowWebHost } from '@project-lc/utils';

export interface CouponApplicableGoodsListProps {
  goodsList: CustomerCouponRes['coupon']['goods'];
  maxHeight?: GridProps['maxHeight'];
}
export function CouponApplicableGoodsList({
  goodsList,
  maxHeight,
}: CouponApplicableGoodsListProps): JSX.Element {
  return (
    <Grid
      gridTemplateColumns="repeat(6, 1fr)"
      fontSize={{ base: 'sm', md: 'md' }}
      rowGap={1}
      maxHeight={maxHeight}
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
        <Link fontSize="sm" href={`${getKkshowWebHost()}/goods/${id}`} isExternal>
          {goods_name}
        </Link>
      </GridItem>
    </>
  );
}

export function CouponApplicableGoodsListDialog({
  coupon,
}: {
  coupon: CustomerCouponRes['coupon'];
}): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <Button variant="unstyled" onClick={onOpen}>
        {DiscountApplyTypeBadge(coupon.applyType)}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="md">{coupon.name} - 적용 가능한 상품 목록</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CouponApplicableGoodsList goodsList={coupon.goods} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
