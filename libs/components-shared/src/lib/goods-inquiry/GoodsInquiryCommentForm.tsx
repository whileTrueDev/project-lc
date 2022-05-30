/* eslint-disable react/no-array-index-key */
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea,
} from '@chakra-ui/react';
import { GoodsInquiryCommentDto } from '@project-lc/shared-types';
import { SubmitHandler, useForm } from 'react-hook-form';

export interface GoodsInquiryCommentFormProps {
  formId: string;
  onSubmit: SubmitHandler<GoodsInquiryCommentDto>;
  defaultValues?: Partial<GoodsInquiryCommentDto>;
}
export function GoodsInquiryCommentForm({
  formId,
  onSubmit,
  defaultValues,
}: GoodsInquiryCommentFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GoodsInquiryCommentDto>({ defaultValues });
  return (
    <Box as="form" id={formId} onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={!!errors.content}>
        <FormLabel>문의 답변 내용</FormLabel>
        <Textarea
          size="sm"
          {...register('content', {
            required: '문의 답변 내용을 작성해주세요.',
            maxLength: {
              value: 500,
              message: '문의 답변은 최대 500자까지 작성 가능합니다.',
            },
          })}
        />
        <FormErrorMessage>{errors.content?.message}</FormErrorMessage>
      </FormControl>
    </Box>
  );
}

export default GoodsInquiryCommentForm;
