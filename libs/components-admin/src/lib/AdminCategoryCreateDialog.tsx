import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import { CategoryWithGoodsCount } from '@project-lc/shared-types';
import { useForm } from 'react-hook-form';

export type FormData = {
  name: string;
  categoryCode?: string;
  parentCategoryId?: number;
  mainCategoryFlag?: boolean;
};
export interface CategoryCreateFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  parentCategory?: CategoryWithGoodsCount;
}

/** 카테고리 생성 다이얼로그 */
export function CategoryCreateFormDialog(
  props: CategoryCreateFormDialogProps,
): JSX.Element {
  const { isOpen, onClose, parentCategory } = props;

  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      name: '',
      mainCategoryFlag: true,
      parentCategoryId: undefined,
    },
  });
  const onSubmit = async (data: FormData): Promise<void> => {
    console.log({
      name: data.name,
      mainCategoryFlag: !parentCategory,
      parentCategoryId: parentCategory?.id,
    });
  };
  const handleClose = (): void => {
    reset();
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {parentCategory && `"${parentCategory.name}"의 하위 `}카테고리 생성
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack as="form" onSubmit={handleSubmit(onSubmit)} w="400px">
            <Stack>
              <Text>카테고리 명 :</Text>
              <Input {...register('name', { required: true })} size="sm" />
            </Stack>
            <Stack direction="row" justifyContent="flex-end" spacing={1} py={4}>
              <Button colorScheme="blue" mr={3} type="submit">
                생성
              </Button>
              <Button variant="ghost" onClick={handleClose}>
                닫기
              </Button>
            </Stack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
