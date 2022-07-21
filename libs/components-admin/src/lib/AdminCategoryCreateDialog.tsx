import {
  Box,
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
  Text,
  Image,
  useToast,
  Alert,
} from '@chakra-ui/react';
import { ChakraAutoComplete } from '@project-lc/components-core/ChakraAutoComplete';
import { ImageInput, ImageInputErrorTypes } from '@project-lc/components-core/ImageInput';
import { readAsDataURL } from '@project-lc/components-core/ImageInputDialog';
import {
  useAdminCategoryCreateMutation,
  useGoodsInformationSubject,
} from '@project-lc/hooks';
import { CategoryWithGoodsCount, CreateGoodsCategoryDto } from '@project-lc/shared-types';
import { s3 } from '@project-lc/utils-s3';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

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
    setError,
    watch,
    formState: { errors },
  } = useForm<CreateGoodsCategoryDto>({
    defaultValues: {
      name: '',
      mainCategoryFlag: true,
      parentCategoryId: undefined,
      informationSubjectId: 1,
    },
  });

  const [imagePreview, setImagePreview] = useState('');
  const handleImagePreviewReset = (): void => {
    setImagePreview('');
    setValue('imageSrc', '');
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

  // 등록 Submit 핸들러
  const { mutateAsync } = useAdminCategoryCreateMutation();
  const onSubmit = async (formData: CreateGoodsCategoryDto): Promise<void> => {
    const categoryCode = nanoid();
    const dto: CreateGoodsCategoryDto = {
      categoryCode,
      name: formData.name,
      mainCategoryFlag: !parentCategory,
      parentCategoryId: parentCategory?.id,
      informationSubjectId: formData.informationSubjectId,
    };
    if (!parentCategory) {
      // 최상위 카테고리 생성인 경우, 이미지를 등록하지 않으면 안됨
      if (!(pendingImageFile || formData.imageSrc)) {
        const errMsg = '메인카테고리의 경우 이미지등록이 필요합니다.';
        toast({ status: 'error', description: errMsg });
        setError('imageSrc', { message: errMsg, type: 'required' });
        return;
      }
    }
    // * 신규 카테고리 이미지 S3 업로드
    if (pendingImageFile) {
      const key =
        `goods-category/` +
        `${categoryCode}/${dayjs().format('YYMMDDHHmmss').toString()}`;
      const { objectUrl } = await s3.sendPutObjectCommand({
        ACL: 'public-read',
        Key: key,
        Body: pendingImageFile,
        ContentType: pendingImageFile.type,
      });
      dto.imageSrc = objectUrl;
    }
    mutateAsync(dto)
      .then(() => {
        toast({ status: 'success', title: '카테고리를 생성하였습니다' });
        handleClose();
        setImageFile(null);
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
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {parentCategory && `"${parentCategory.name}"의 하위 `}카테고리 생성
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack as="form" onSubmit={handleSubmit(onSubmit)} w="400px">
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>카테고리 명*</FormLabel>
              <Input
                {...register('name', { required: '카테고리 명을 입력해주세요.' })}
                size="sm"
              />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.informationSubjectId}>
              <FormLabel>카테고리 품목*</FormLabel>
              <Stack direction="row">
                <Box>
                  <Input
                    isReadOnly
                    {...register('informationSubjectId', {
                      required: '카테고리 품목을 입력해주세요.',
                      valueAsNumber: true,
                    })}
                    size="sm"
                  />
                  <FormHelperText fontSize="xs">
                    우측 자동완성창을 통해 선택해주세요
                  </FormHelperText>
                </Box>
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

            <Stack>
              <FormControl isInvalid={!!errors.imageSrc}>
                <FormLabel>카테고리 이미지{!parentCategory && '*'}</FormLabel>
                {parentCategory && (
                  <FormHelperText>
                    하위 카테고리의 경우 개별적으로 등록된 이미지가 없으면 상위카테고리
                    이미지를 참조하므로 필수 입력사항은 아닙니다.
                  </FormHelperText>
                )}
                <Input
                  {...register('imageSrc')}
                  size="sm"
                  placeholder="이미지 주소를 입력하거나 아래 버튼으로 이미지 업로드"
                />
                <FormErrorMessage>{errors.imageSrc?.message}</FormErrorMessage>
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
