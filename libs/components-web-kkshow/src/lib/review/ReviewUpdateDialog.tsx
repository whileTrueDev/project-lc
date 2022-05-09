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
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { GoodsReview } from '@prisma/client';
import {
  ImageInputDialog,
  ImageInputFileReadData,
} from '@project-lc/components-core/ImageInputDialog';
import {
  useReviewImageDeleteMutation,
  useReviewUpdateMutation,
  useReviewUpdateMutationDto,
} from '@project-lc/hooks';
import { GoodsReviewImageUpdateDto, GoodsReviewItem } from '@project-lc/shared-types';
import { s3 } from '@project-lc/utils-s3';
import path from 'path';
import {
  SubmitHandler,
  useFieldArray,
  UseFieldArrayRemove,
  useForm,
} from 'react-hook-form';
import { BsStarFill } from 'react-icons/bs';

export interface ReviewUpdateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reviewId: GoodsReview['id'];
  review: GoodsReviewItem;
}
export function ReviewUpdateDialog({
  isOpen,
  onClose,
  reviewId,
  review,
}: ReviewUpdateDialogProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>리뷰 {reviewId} 수정하기</ModalHeader>
        <ModalBody>
          <ReviewUpdateForm review={review} onCancel={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ReviewUpdateDialog;

export interface ReviewUpdateFormProps {
  review: GoodsReviewItem;
  onCancel: () => void;
}
export function ReviewUpdateForm({
  review,
  onCancel,
}: ReviewUpdateFormProps): JSX.Element {
  const toast = useToast();
  const ratings = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
  const methods = useForm<useReviewUpdateMutationDto>({
    defaultValues: {
      content: review.content,
      rating: review.rating,
      images: review.images,
    },
  });

  const reviewUpdate = useReviewUpdateMutation();
  const onSubmit: SubmitHandler<useReviewUpdateMutationDto> = async (data) => {
    return reviewUpdate
      .mutateAsync({
        reviewId: review.id,
        content: data.content,
        images: data.images,
        rating: data.rating,
      })
      .catch((err) => {
        console.log(err);
        toast({ description: '리뷰 수정 중 오류가 발생했습니다.', status: 'error' });
      })
      .then(() => {
        onCancel();
        toast({ description: '리뷰가 수정되었습니다.', status: 'success' });
      });
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
    const s3KeyType = `goods-review-images/${review.id}/${imageType}`;
    const key = path.join(s3KeyType, `${timestamp}_${imageData.filename}`);

    const { objectUrl } = await s3.sendPutObjectCommand({
      Key: key,
      Body: imageData.file,
      ContentType: imageData.file.type,
      ACL: 'public-read',
    });

    append({ imageUrl: objectUrl });
  };

  return (
    <Box as="form" onSubmit={methods.handleSubmit(onSubmit)}>
      <Stack>
        {/* 리뷰 평점 */}
        <FormControl isInvalid={!!methods.formState.errors.rating} mb={2}>
          <FormLabel>리뷰 평점</FormLabel>
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

        {/* 리뷰 이미지 */}
        <FormControl isInvalid={!!methods.formState.errors.content} mb={2}>
          <FormLabel>리뷰 이미지</FormLabel>
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
              modalTitle="리뷰 이미지 등록"
              variant="chakra"
              isOpen={isOpen}
              onClose={onClose}
              onConfirm={onImageUpload}
            />
          </Box>

          <Flex flexWrap="wrap" gap={1}>
            {fields.map((field, idx) => (
              <ReviewImageControl
                key={field.id}
                idx={idx}
                imageUrl={field.imageUrl}
                remove={remove}
              />
            ))}
          </Flex>
        </FormControl>
        <Divider />

        {/* 리뷰 내용 */}
        <FormControl isInvalid={!!methods.formState.errors.content} mb={2}>
          <FormLabel>리뷰 내용</FormLabel>
          <Textarea
            {...methods.register('content', {
              required: '리뷰 내용을 작성해주세요.',
              maxLength: { value: 1500, message: '리뷰는 최대 1500자까지 가능합니다.' },
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
          <Button onClick={onCancel}>취소</Button>
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
  idx: number;
  remove: UseFieldArrayRemove;
}
function ReviewImageControl({
  imageUrl,
  idx,
  remove,
}: ReviewImageControlProps): JSX.Element {
  const { mutateAsync: deleteImage, isLoading: deleteImageLoading } =
    useReviewImageDeleteMutation();
  // 이미지 제거 핸들링
  const onImageDelete = async (
    _idx: number,
    image: GoodsReviewImageUpdateDto,
  ): Promise<void> => {
    // 등록된 이미지의 경우 제거 요청
    const result = await deleteImage(image);
    // s3에만 업로드된 경우
    if (!result && image.imageUrl.includes(s3.fullDomain)) {
      const Key = image.imageUrl.replace(s3.fullDomain, '');
      await s3.sendDeleteObjectsCommand({ deleteObjects: [{ Key }] });
    }
    remove(_idx);
  };

  return (
    <Flex gap={0.5}>
      <Image src={imageUrl} w="50px" h="50px" objectFit="cover" />
      <Stack spacing={0.5}>
        <IconButton
          isLoading={deleteImageLoading}
          icon={<DeleteIcon />}
          aria-label="delete-review-image"
          size="xs"
          onClick={() => onImageDelete(idx, { imageUrl })}
        />
      </Stack>
    </Flex>
  );
}
