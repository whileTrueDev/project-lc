import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { GoodsByIdRes } from '@project-lc/shared-types';
import { useMemo } from 'react';
import { HorizontalImageGallery } from './HorizontalImageGallery';
import ShowMoreTextButton from './ShowMoreTextButton';

export interface GoodsDetailImagesInfoProps {
  goods: GoodsByIdRes;
}
export function GoodsDetailImagesInfo({ goods }: GoodsDetailImagesInfoProps) {
  const detailDialog = useDisclosure();

  const contents = useMemo(() => goods.contents ?? '', [goods.contents]);
  const images = useMemo(
    () => goods.image.sort((a, b) => a.cut_number - b.cut_number).map((x) => x.image),
    [goods.image],
  );
  return (
    <Stack spacing={10}>
      {/* 상품이미지 */}
      <Stack spacing={2}>
        <Text fontWeight="bold">상품 사진</Text>
        {goods.image.length > 0 ? (
          <>
            <Text>총 {goods.image.length} 장</Text>

            {/* 임시 이미지. s3 업로드된 이미지 필요 */}
            <HorizontalImageGallery images={images} />
          </>
        ) : (
          <Text>사진이 없는 상품입니다.</Text>
        )}
      </Stack>

      {/* 상품상세설명 */}
      <Stack>
        <Text fontWeight="bold">상세설명</Text>
        <Box maxH={350} noOfLines={goods.contents?.startsWith('<img ') ? 1 : 6}>
          <div dangerouslySetInnerHTML={{ __html: contents }} />
        </Box>
        <Box>
          <ShowMoreTextButton onClick={detailDialog.onOpen} />
        </Box>
      </Stack>

      <Modal
        isOpen={detailDialog.isOpen}
        onClose={detailDialog.onClose}
        scrollBehavior="outside"
        size="2xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>{goods.goods_name} 상세설명</ModalHeader>
          <ModalBody>
            <Box minH="200px">
              <div dangerouslySetInnerHTML={{ __html: contents }} />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Stack>
  );
}
