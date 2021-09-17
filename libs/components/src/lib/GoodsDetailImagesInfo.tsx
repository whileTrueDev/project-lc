import {
  Box,
  Button,
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
import React from 'react';
import { HorizontalImageGallery } from './HorizontalImageGallery';
import ShowMoreTextButton from './ShowMoreTextButton';

const dummyText = `
  <img src="https://picsum.photos/900/330"></img>

<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.

Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
when an unknown printer took a galley of type and scrambled it to make a type
specimen book.</p>

<br/>

<p>It has survived not only five centuries, but also the leap into
electronic typesetting, remaining essentially unchanged. It was popularised in
the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
and more recently with desktop publishing software like Aldus PageMaker
including versions of Lorem Ipsum</p>

<div style="display:flex;justify-content:center;align-items:center;">
  <img src="https://picsum.photos/305/305"></img>
</div>`;

export interface GoodsDetailImagesInfoProps {
  goods: GoodsByIdRes;
}
export function GoodsDetailImagesInfo({ goods }: GoodsDetailImagesInfoProps) {
  const detailDialog = useDisclosure();

  return (
    <Stack spacing={10}>
      {/* 상품이미지 */}
      <Stack spacing={2}>
        <Text fontWeight="bold">상품 사진</Text>
        <Text>총 {goods.image.length} 장</Text>

        {/* 임시 이미지. s3 업로드된 이미지 필요 */}
        <HorizontalImageGallery
          images={[
            'https://picsum.photos/300/300',
            'https://picsum.photos/301/300',
            'https://picsum.photos/300/301',
            'https://picsum.photos/301/301',
            'https://picsum.photos/302/301',
            'https://picsum.photos/302/302',
            'https://picsum.photos/301/302',
          ]}
        />
      </Stack>

      {/* 상품상세설명 */}
      <Stack>
        <Text fontWeight="bold">상세설명 (상품 등록 작업 이후 에디터 UI작업 진행)</Text>
        <Box maxH={350} noOfLines={dummyText.includes('<img ') ? 1 : 6}>
          {/* {goods.contents || '없음'} */}
          <div dangerouslySetInnerHTML={{ __html: dummyText }} />
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
            {goods.contents}
            {/* // TODO 텍스트에디터 작업 이후 변경 필요 */}
            <div dangerouslySetInnerHTML={{ __html: dummyText }} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Stack>
  );
}
