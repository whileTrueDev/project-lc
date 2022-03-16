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

  const dragStartHandler = (event: React.DragEvent<HTMLDivElement>): void => {
    const dragTarget = event.currentTarget;
    const imageIndex = dragTarget.dataset.imageIndex;
    console.log('drag start', {imageIndex});
    setDraggingItem(dragTarget);
    event.dataTransfer.setData('imageIndex', imageIndex || '');
    event.dataTransfer.dropEffect = 'move';
  }

  // This function will be triggered when dropping
  const dropHandler = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    if (!draggingItem) return;
    const dropTarget = event.currentTarget;
    const dropY = event.clientY; // 드롭할 y 포지션
    const draggingItemY = draggingItem.getBoundingClientRect().y; // 드래그하고 있는 ㄴ아이템의 기존 y위치
    console.log({dropY, draggingItemY}); 
    const dropTargetImageIndex = dropTarget.dataset.imageIndex;
    const dragTargetImageIndex = event.dataTransfer.getData('imageIndex');

    if (dropY > draggingItemY) {

    }
    if (dropY < draggingItemY) {

    }
    // dropY < draggingItemY 이면 위로 드래그한거 -> 드래깅 아이템을 dropTargetIndex -1 으로 위치
    // dropY > draggingItemY 이면 아래로 드래그한거 -> 드래깅 아이템을 dropTargetIndex + 1 으로 위치
    // set
    
    console.log('drop', { dropTargetImageIndex, dragTargetImageIndex, draggingItemY, dropY });

    // setContent(data);
  };

  // This makes the third box become droppable
  const allowDrop = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
  };

  const dragEndHandler = (event: React.DragEvent<HTMLDivElement>): void => {
    setDraggingItem(null);
    console.log('drag end!!');
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>등록된 상품 사진 순서 변경</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>이미지 순서를 변경해주세요</Text>
          <Stack>
            {imageList.map((i, index) => (
              <Box
                key={i.id}
                position="relative"
                draggable
                data-image-index={index}
                onDragStart={dragStartHandler}
                onDragOver={allowDrop}
                onDrop={dropHandler}
                onDragEnd={dragEndHandler}
              >
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
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="ghost">Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
