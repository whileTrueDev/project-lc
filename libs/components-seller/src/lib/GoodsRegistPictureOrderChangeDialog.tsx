import {
  Text,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Box,
  Stack,
} from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { GoodsImageDto } from '@project-lc/shared-types';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { GoodsFormValues } from './GoodsRegistForm';
import { PREVIEW_SIZE } from './GoodsRegistPictures';

export function GoodsRegistPictureOrderChangeDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element {
  const { setValue, getValues } = useFormContext<GoodsFormValues>();
  const imageList = getValues('image');
  const [draggingItem, setDraggingItem] = useState<null | HTMLElement>(null);
  const [imageListCopy, setImageListCopy] = useState<GoodsImageDto[]>(imageList);

  const onDragStart = (event: React.DragEvent<HTMLDivElement>): void => {
    const dragTarget = event.currentTarget;
    const imageIndex = dragTarget.dataset.imageIndex;
    setDraggingItem(dragTarget);
    event.dataTransfer.setData('imageIndex', imageIndex || '');
    event.dataTransfer.dropEffect = 'move';
  }

  const moveDraggingItemFromTo = (draggingItemIndex: number, dropPositionIndex: number): void => {
    const _imageList = [...imageListCopy];
    const _moving = _imageList.splice(draggingItemIndex, 1)[0];
    _imageList.splice(dropPositionIndex, 0, _moving);
    setImageListCopy(_imageList);
  }

  const onDrop = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    if (!draggingItem) return;
    const dropTarget = event.currentTarget;

    const dropTargetImageIndex = Number(dropTarget.dataset.imageIndex);
    const dragTargetImageIndex = Number(event.dataTransfer.getData('imageIndex'));

    if (dropTargetImageIndex === dragTargetImageIndex) {return;} // 동일 위치에 둔거면 종료

    moveDraggingItemFromTo(dragTargetImageIndex, dropTargetImageIndex);

  };

  // This makes the third box become droppable
  const onDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
  };

  const onDragEnd = (event: React.DragEvent<HTMLDivElement>): void => {
    setDraggingItem(null);
  }

  const handleClose = (): void => {
    onClose();
  }

  const saveChangedOrder = (): void => {

    // 이미지 
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>등록된 상품 사진 순서 변경</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>이미지 순서를 변경해주세요</Text>
          <Stack>
            {imageListCopy.map((i, index) => (
              <Box
                key={i.id}
                position="relative"
                draggable
                data-image-index={index}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onDragEnd={onDragEnd}
              >
                <Text direction="row">
                  {index}
                </Text>
                <ChakraNextImage
                  layout="intrinsic"
                  alt={i.image}
                  src={i.image || ''}
                  {...PREVIEW_SIZE}
                />
                
              </Box>
            ))}
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={saveChangedOrder}>
            변경하기
          </Button>
          <Button variant="ghost" onClick={handleClose}>닫기</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
