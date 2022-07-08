import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { ChakraAutoComplete } from '@project-lc/components-core/ChakraAutoComplete';
import {
  useAdminCategoryCreateMutation,
  useGoodsInformationSubject,
} from '@project-lc/hooks';
import { CategoryWithGoodsCount, CreateGoodsCategoryDto } from '@project-lc/shared-types';
import { useForm } from 'react-hook-form';

export interface FormData {
  name: string;
  categoryCode?: string;
  parentCategoryId?: number;
  mainCategoryFlag?: boolean;
  informationSubjectId: number;
}

export interface CategoryCreateFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  parentCategory?: CategoryWithGoodsCount;
}
/** 카테고리 생성 다이얼로그 */
export function CategoryCreateFormDialog(
  props: CategoryCreateFormDialogProps,
): JSX.Element {
  const { data: subjectList } = useGoodsInformationSubject();
  const { isOpen, onClose, parentCategory } = props;
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      mainCategoryFlag: true,
      parentCategoryId: undefined,
    },
  });
  const { mutateAsync } = useAdminCategoryCreateMutation();
  const onSubmit = async (data: FormData): Promise<void> => {
    const dto: CreateGoodsCategoryDto = {
      name: data.name,
      mainCategoryFlag: !parentCategory,
      parentCategoryId: parentCategory?.id,
      informationSubjectId: data.informationSubjectId,
    };
    mutateAsync(dto)
      .then(() => {
        toast({ status: 'success', title: '카테고리를 생성하였습니다' });
        handleClose();
      })
      .catch((e) => {
        console.error(e);
        toast({
          status: 'error',
          title: '카테고리를 생성하지 못했습니다',
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
        <ModalHeader>
          {parentCategory && `"${parentCategory.name}"의 하위 `}카테고리 생성
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack as="form" onSubmit={handleSubmit(onSubmit)} w="400px">
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>카테고리 명</FormLabel>
              <Input
                {...register('name', { required: '카테고리 명을 입력해주세요.' })}
                size="sm"
              />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.informationSubjectId}>
              <FormLabel>카테고리 품목</FormLabel>
              <Stack>
                <Input
                  maxW={65}
                  isReadOnly
                  {...register('informationSubjectId', {
                    required: '카테고리 품목을 입력해주세요.',
                  })}
                  size="sm"
                />
                <FormHelperText fontSize="xs">
                  아래 자동완성창을 통해 선택해주세요
                </FormHelperText>
                <ChakraAutoComplete
                  options={subjectList || []}
                  getOptionLabel={(o) => o?.subject || ''}
                  onChange={(newV) => {
                    if (newV && newV.id) {
                      setValue('informationSubjectId', newV.id);
                    }
                  }}
                />
              </Stack>
              <FormErrorMessage>{errors.informationSubjectId?.message}</FormErrorMessage>
            </FormControl>

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
