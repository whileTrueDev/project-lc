import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { useGoodsImageOrderMutation } from '@project-lc/hooks';
import { GoodsImageDto } from '@project-lc/shared-types';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { GoodsFormValues } from './GoodsRegistForm';
import { PREVIEW_SIZE } from './GoodsRegistPictures';

export function GoodsRegistPictureOrderChangeDialog({
  isOpen,
  onClose,
  savedImages,
}: {
  isOpen: boolean;
  onClose: () => void;
  savedImages: GoodsImageDto[];
}): JSX.Element {
  const toast = useToast();
  const { setValue } = useFormContext<GoodsFormValues>();
  const [imageListCopy, setImageListCopy] = useState<GoodsImageDto[]>([]);

  useEffect(() => {
    setImageListCopy([...savedImages]);
  }, [savedImages]);

  const moveDraggingItemFromTo = (
    draggingItemIndex: number,
    dropPositionIndex: number,
  ): void => {
    const _imageList = [...imageListCopy];
    const _moving = _imageList.splice(draggingItemIndex, 1)[0];
    _imageList.splice(dropPositionIndex, 0, _moving);
    // 이미지 순서(cut_number)를 index 값으로 수정한다
    setImageListCopy(
      _imageList.map((_image, index) => ({ ..._image, cut_number: index })),
    );
  };

  const handleClose = (): void => {
    onClose();
  };

  const { mutateAsync, isLoading } = useGoodsImageOrderMutation();
  const saveChangedOrder = (): void => {
    if (!imageListCopy.length) return;
    // 이미지 순서(cut_number) 변경 요청
    mutateAsync(imageListCopy)
      .then(() => {
        toast({ title: '상품 사진 순서 변경 적용 성공', status: 'success' });
        console.log('image order change success');
        handleClose();
        setValue('image', imageListCopy);
      })
      .catch((error) => {
        console.error(error);
        toast({ title: '상품 사진 순서 변경 적용 실패', status: 'error' });
      });
  };

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
              <Stack
                direction="row"
                key={i.id}
                position="relative"
                data-image-index={index}
              >
                <ChakraNextImage
                  layout="intrinsic"
                  alt={i.image}
                  src={i.image || ''}
                  {...PREVIEW_SIZE}
                />
                <Stack justifyContent="center">
                  <IconButton
                    icon={<ChevronUpIcon />}
                    size="xs"
                    disabled={index === 0}
                    onClick={() => {
                      moveDraggingItemFromTo(index, index - 1);
                    }}
                    aria-label="위"
                  />
                  <IconButton
                    icon={<ChevronDownIcon />}
                    size="xs"
                    disabled={index >= imageListCopy.length - 1}
                    onClick={() => {
                      moveDraggingItemFromTo(index, index + 1);
                    }}
                    aria-label="아래"
                  />
                </Stack>
              </Stack>
            ))}
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={saveChangedOrder}
            isLoading={isLoading}
          >
            변경하기
          </Button>
          <Button variant="ghost" onClick={handleClose}>
            닫기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
