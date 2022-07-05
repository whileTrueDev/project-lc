/* eslint-disable react/no-array-index-key */
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  IconButton,
  Image,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
import {
  ImageInputDialog,
  ImageInputFileReadData,
} from '@project-lc/components-core/ImageInputDialog';
import { useReviewUpdateMutationDto } from '@project-lc/hooks';
import { GoodsReviewImageUpdateDto } from '@project-lc/shared-types';
import { s3 } from '@project-lc/utils-s3';
import path from 'path';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { BsStarFill } from 'react-icons/bs';

export interface ReviewCreateOrUpdateFormProps {
  onSubmit: (data: useReviewUpdateMutationDto) => void;
  onCancel: () => void;
  defaultValues?: Partial<useReviewUpdateMutationDto>;
}
export function ReviewCreateOrUpdateForm({
  onSubmit: propsOnSubmit,
  onCancel,
  defaultValues,
}: ReviewCreateOrUpdateFormProps): JSX.Element {
  const ratings = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
  const methods = useForm<useReviewUpdateMutationDto>({ defaultValues });

  const onSubmit: SubmitHandler<useReviewUpdateMutationDto> = async (data) => {
    return propsOnSubmit(data);
  };

  // 이미지 배열 조작
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'images',
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  // 이미지 등록 핸들링
  const onImageUpload = async (imageData: ImageInputFileReadData): Promise<void> => {
    if (fields.length >= 5) return;
    const timestamp = new Date().getTime();
    const imageType = 'goods-review';
    const s3KeyType = `goods-review-images/${imageType}`;
    const key = path.join(s3KeyType, `${timestamp}_${imageData.filename}`);

    const { objectUrl } = await s3.sendPutObjectCommand({
      Key: key,
      Body: imageData.file,
      ContentType: imageData.file.type,
      ACL: 'public-read',
    });

    // react-hook-form 에  이미지 등록
    append({ imageUrl: objectUrl });
  };

  // 이미지 제거 핸들링
  const onImageDelete = async (imageUrl: string, idx: number): Promise<void> => {
    // 신규이미지를 삭제하는 경우 (이미지가 S3에만 업로드 된 경우)
    let uploadedImages: GoodsReviewImageUpdateDto[] = [];
    if (defaultValues) {
      uploadedImages = defaultValues.images || [];
    }
    const uploadedImageIds = uploadedImages.map((image) => image.imageUrl);
    const isNewImageDelete = !uploadedImageIds.includes(imageUrl);
    if (isNewImageDelete) {
      // s3에서 이미지 삭제
      const s3Key = imageUrl.includes(s3.bucketDomain)
        ? imageUrl.replace(s3.bucketDomain, '')
        : imageUrl;
      s3.sendDeleteObjectsCommand({ deleteObjects: [{ Key: s3Key }] });
    }

    // react-hook-form 에 등록된 이미지 제거
    remove(idx);
  };

  // 등록 취소 핸들링
  const handleCancel = async (): Promise<void> => {
    // 이미지 업로드하여 s3에 이미지 등록했지만 submit 안하고 취소한 경우,
    // s3에서 등록된 이미지 삭제
    let uploadedImages: GoodsReviewImageUpdateDto[] = [];
    if (defaultValues) {
      uploadedImages = defaultValues.images || [];
    }
    const imageUrls = uploadedImages.map((image) => image.imageUrl);
    const notCommittedImages = fields.filter(
      (imageField) => !imageUrls.includes(imageField.imageUrl),
    );
    if (notCommittedImages.length > 0) {
      const deleteObjects = notCommittedImages.map((i) => {
        const imageKey = i.imageUrl.includes(s3.bucketDomain)
          ? i.imageUrl.replace(s3.bucketDomain, '')
          : i.imageUrl;
        return { Key: imageKey };
      });
      await s3.sendDeleteObjectsCommand({ deleteObjects });
    }
    // props로 받아온 캔슬 핸들러
    onCancel();
  };

  return (
    <Box as="form" onSubmit={methods.handleSubmit(onSubmit)}>
      <Stack>
        {/* 후기 평점 */}
        <FormControl isInvalid={!!methods.formState.errors.rating} mb={2}>
          <FormLabel>후기 평점</FormLabel>
          <Slider
            {...methods.register('rating')}
            onChange={(num) => methods.setValue('rating', num, { shouldDirty: true })}
            min={0}
            max={5}
            defaultValue={5}
            step={0.5}
          >
            {ratings.map((rating) => (
              <SliderMark key={rating} value={rating} mt="2" ml="-1" fontSize="sm">
                {rating}
              </SliderMark>
            ))}
            <SliderTrack bg="gray.300">
              <Box position="relative" right={10} />
              <SliderFilledTrack bg="orange.200" />
            </SliderTrack>
            <SliderThumb boxSize={6}>
              <Icon as={BsStarFill} color="orange.300" />
            </SliderThumb>
          </Slider>
          <FormErrorMessage fontSize="xs">
            {methods.formState.errors.rating?.message}
          </FormErrorMessage>
        </FormControl>
        <Divider />

        {/* 후기 이미지 */}
        <FormControl isInvalid={!!methods.formState.errors.content} mb={2}>
          <FormLabel>후기 이미지</FormLabel>
          <Box mb={1}>
            <Button
              size="sm"
              leftIcon={<AddIcon />}
              onClick={onOpen}
              isDisabled={fields.length >= 5}
            >
              이미지 등록하기
            </Button>
            {fields.length >= 5 ? (
              <Text color="GrayText" fontSize="xs">
                이미지는 최대 5장 까지 등록 가능합니다.
              </Text>
            ) : null}
            <ImageInputDialog
              modalTitle="후기 이미지 등록"
              variant="chakra"
              isOpen={isOpen}
              onClose={onClose}
              onConfirm={onImageUpload}
              imageSizeLimit={10}
            />
          </Box>

          <Flex flexWrap="wrap" gap={1}>
            {fields.map((field, idx) => (
              <ReviewImageControl
                key={field.id}
                imageUrl={field.imageUrl}
                onImageDelete={() => onImageDelete(field.imageUrl, idx)}
              />
            ))}
          </Flex>
        </FormControl>
        <Divider />

        {/* 후기 내용 */}
        <FormControl isInvalid={!!methods.formState.errors.content} mb={2}>
          <FormLabel>후기 내용</FormLabel>
          <Textarea
            {...methods.register('content', {
              required: '후기 내용을 작성해주세요.',
              maxLength: { value: 1500, message: '후기는 최대 1500자까지 가능합니다.' },
            })}
            minH={300}
            maxH={450}
          />
          <FormErrorMessage fontSize="xs">
            {methods.formState.errors.content?.message}
          </FormErrorMessage>
        </FormControl>
      </Stack>

      <Box mt={4} textAlign="right">
        <ButtonGroup>
          <Button onClick={handleCancel}>취소</Button>
          <Button
            colorScheme="blue"
            type="submit"
            isDisabled={!methods.formState.isDirty}
          >
            확인
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
}

interface ReviewImageControlProps {
  imageUrl: string;
  onImageDelete: () => void;
}
function ReviewImageControl({
  imageUrl,
  onImageDelete,
}: ReviewImageControlProps): JSX.Element {
  return (
    <Flex gap={0.5}>
      <Image src={imageUrl} w="50px" h="50px" objectFit="cover" />
      <Stack spacing={0.5}>
        <IconButton
          icon={<DeleteIcon />}
          aria-label="delete-review-image"
          size="xs"
          onClick={onImageDelete}
        />
      </Stack>
    </Flex>
  );
}
