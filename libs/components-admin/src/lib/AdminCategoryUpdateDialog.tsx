import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Image,
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
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { ImageInput, ImageInputErrorTypes } from '@project-lc/components-core/ImageInput';
import { readAsDataURL } from '@project-lc/components-core/ImageInputDialog';
import { useAdminCategoryUpdateMutation } from '@project-lc/hooks';
import { CategoryWithGoodsCount, UpdateGoodsCategoryDto } from '@project-lc/shared-types';
import { s3 } from '@project-lc/utils-s3';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export interface CategoryUpdateFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryWithGoodsCount;
}

const resolver = classValidatorResolver(UpdateGoodsCategoryDto);
/** 카테고리 수정 다이얼로그 */
export function CategoryUpdateFormDialog(
  props: CategoryUpdateFormDialogProps,
): JSX.Element {
  const { isOpen, onClose, category } = props;
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdateGoodsCategoryDto>({
    defaultValues: {
      name: props.category.name,
      imageSrc: props.category.imageSrc || undefined,
    },
    resolver,
  });

  const [imagePreview, setImagePreview] = useState(category.imageSrc || '');
  const handleImagePreviewReset = (): void => {
    setImagePreview(category.imageSrc || '');
    setValue('imageSrc', category.imageSrc || '');
  };

  /** 카테고리 이미지 업로드 핸들러 */
  const [pendingImageFile, setImageFile] = useState<File | null>(null);
  const handleImageUpload = async (_fileName: string, file: File): Promise<void> => {
    setImageFile(file);
    const data = await readAsDataURL(file);
    if (data.data) setImagePreview(data.data as string);
  };
  /** 카테고리 이미지 업로드 실패 핸들러 */
  const handleImageUploadErr = (err: ImageInputErrorTypes): void => {
    let errMsg = '이미지 업로드 실패';
    if (err === 'invalid-format') errMsg = '처리할 수 없는 확장자';
    if (err === 'over-size') errMsg = '이미지 크기가 너무 큼';
    toast({ title: '이미지 업로드 에러', description: errMsg });
  };

  const { mutateAsync, isLoading } = useAdminCategoryUpdateMutation(category.id);
  const onSubmit = async (formData: UpdateGoodsCategoryDto): Promise<void> => {
    const { name, imageSrc } = formData;
    let realImageSrc = imageSrc;
    // * 신규 카테고리 이미지 S3 업로드
    if (pendingImageFile) {
      const key =
        `goods-category/` +
        `${category.categoryCode}/${dayjs().format('YYMMDDHHmmss').toString()}`;
      const { objectUrl } = await s3.sendPutObjectCommand({
        ACL: 'public-read',
        Key: key,
        Body: pendingImageFile,
        ContentType: pendingImageFile.type,
      });
      realImageSrc = objectUrl;
    }

    // 카테고리 대표 이미지가 교체되는 경우
    if (
      category.imageSrc &&
      (imageSrc || pendingImageFile) &&
      realImageSrc !== category.imageSrc
    ) {
      // * 기존 카테고리 이미지 삭제
      await s3.sendDeleteObjectsCommand({
        deleteObjects: [{ Key: category.imageSrc }],
      });
    }
    // 카테고리 정보 수정 API 요청
    mutateAsync({ name, imageSrc: realImageSrc })
      .then(() => {
        toast({ status: 'success', title: '카테고리를 수정하였습니다' });
        handleClose();
        setImageFile(null);
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
    onClose();
    reset();
  };
  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>&quot;{category.name}&quot; 카테고리 수정</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack as="form" onSubmit={handleSubmit(onSubmit)} w="400px">
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>카테고리 명</FormLabel>
              <Input
                {...register('name', { required: '이름을 입력해주세요.' })}
                size="sm"
              />
              <FormErrorMessage>{errors.imageSrc?.message}</FormErrorMessage>
            </FormControl>

            <Stack>
              <FormControl isInvalid={!!errors.imageSrc}>
                <FormLabel>카테고리 이미지</FormLabel>
                <Input
                  {...register('imageSrc')}
                  size="sm"
                  placeholder="이미지 주소를 입력하거나 아래 버튼으로 이미지 업로드"
                />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                <FormHelperText>
                  이미지 주소URL을 입력하거나 아래 버튼으로 이미지 업로드할 수 있습니다.
                </FormHelperText>
              </FormControl>
              <ImageInput
                variant="chakra"
                handleSuccess={handleImageUpload}
                handleError={handleImageUploadErr}
              />
              <Box>
                <Text fontWeight="bold">미리보기</Text>
                {imagePreview || watch('imageSrc') ? (
                  <Stack direction="row" align="center">
                    <Image
                      src={imagePreview || watch('imageSrc')}
                      rounded="full"
                      objectFit="cover"
                      width={100}
                      height={100}
                    />
                    <Button onClick={handleImagePreviewReset}>미리보기 초기화</Button>
                  </Stack>
                ) : (
                  '이미지 업로드 대기중'
                )}
              </Box>
            </Stack>
            <Stack direction="row" justifyContent="flex-end" py={4}>
              <Button
                colorScheme="blue"
                type="submit"
                isLoading={isSubmitting || isLoading}
              >
                수정
              </Button>
              <Button onClick={handleClose}>닫기</Button>
            </Stack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
