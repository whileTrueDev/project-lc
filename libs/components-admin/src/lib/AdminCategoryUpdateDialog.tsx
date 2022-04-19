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
  useToast,
} from '@chakra-ui/react';
import { useAdminCategoryUpdateMutation } from '@project-lc/hooks';
import { CategoryWithGoodsCount } from '@project-lc/shared-types';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

export type FormData = {
  name: string;
};
export interface CategoryUpdateFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryWithGoodsCount;
}

/** 카테고리 수정 다이얼로그 */
export function CategoryUpdateFormDialog(
  props: CategoryUpdateFormDialogProps,
): JSX.Element {
  const { isOpen, onClose, category } = props;
  const toast = useToast();

  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      name: useMemo(() => props.category.name, [props]),
    },
  });
  useEffect(() => {
    reset({ name: props.category.name });
  }, [props.category, reset]);

  const { mutateAsync } = useAdminCategoryUpdateMutation(category.id);
  const onSubmit = async (data: FormData): Promise<void> => {
    const dto = {
      name: data.name,
    };
    mutateAsync(dto)
      .then((res) => {
        toast({
          status: 'success',
          title: '카테고리를 수정하였습니다',
        });
        handleClose();
      })
      .catch((e) => {
        console.error(e);
        toast({
          status: 'error',
          title: '카테고리를 수정하지 못했습니다',
          description: e,
        });
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
        <ModalHeader>&quot;{category.name}&quot; 카테고리 수정</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack as="form" onSubmit={handleSubmit(onSubmit)} w="400px">
            <Stack>
              <Text>카테고리 명 :</Text>
              <Input {...register('name', { required: true })} size="sm" />
            </Stack>
            <Stack direction="row" justifyContent="flex-end" spacing={1} py={4}>
              <Button colorScheme="blue" mr={3} type="submit">
                수정
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
