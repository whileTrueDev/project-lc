import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { KkshowShoppingSectionItem } from '@prisma/client';
import {
  useAdminKkshowShoppingSections,
  useAdminShoppingSectionOrder,
} from '@project-lc/hooks';
import {
  layoutDesc,
  LAYOUT_AUTO_SLIDE,
  LAYOUT_BANNER,
  LAYOUT_BIG_SQUARE_LIST,
  LAYOUT_CAROUSEL,
  LAYOUT_RATING_DETAIL,
  LAYOUT_RECT_GRID,
  LAYOUT_SMALL_SQUARE_LIST,
} from '@project-lc/shared-types';
import { BannerDataManipulateContainer } from './AdminKkshowShoppingBanner';
import { CarouselDataManipulateContainer } from './AdminKkshowShoppingCarousel';
import { GoodsDataManipulateContainer } from './AdminKkshowShoppingGoods';
import { RatingDataManipulateContainer } from './AdminKkshowShoppingReviews';

export function AdminKkshowShoppingSectionOrderManage(): JSX.Element {
  const { data } = useAdminKkshowShoppingSections();
  const { data: order } = useAdminShoppingSectionOrder();
  if (!data || !data.length) return <Text>섹션이 없습니다</Text>;
  return (
    <Stack>
      {order && <Text>{order.toString()}</Text>}
      {data.map((item) => (
        <ShoppingSectionItemSimple key={item.id} section={item} />
      ))}
    </Stack>
  );
}

export default AdminKkshowShoppingSectionOrderManage;

function ShoppingSectionItemSimple({
  section,
}: {
  section: KkshowShoppingSectionItem;
}): JSX.Element {
  const { id, title, layoutType } = section;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Stack direction="row">
      <Text>
        {id} {title} {layoutType}
      </Text>
      <Box>
        <Button onClick={onOpen} size="xs">
          데이터 수정
        </Button>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {layoutType} : {title}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {layoutType === LAYOUT_CAROUSEL && (
              <CarouselDataManipulateContainer item={section} onSuccess={onClose} />
            )}
            {(layoutType === LAYOUT_AUTO_SLIDE ||
              layoutType === LAYOUT_SMALL_SQUARE_LIST ||
              layoutType === LAYOUT_BIG_SQUARE_LIST ||
              layoutType === LAYOUT_RECT_GRID) && (
              <GoodsDataManipulateContainer
                item={section}
                onSuccess={onClose}
                buttonLabel={layoutDesc[layoutType].buttonLabel}
              />
            )}
            {layoutType === LAYOUT_RATING_DETAIL && (
              <RatingDataManipulateContainer
                item={section}
                onSuccess={onClose}
                buttonLabel={layoutDesc[layoutType].buttonLabel}
              />
            )}
            {layoutType === LAYOUT_BANNER && (
              <BannerDataManipulateContainer item={section} onSuccess={onClose} />
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
}
