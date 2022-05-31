import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { useReviewCommentUpdateMutationDto } from '@project-lc/hooks';
import { SubmitHandler, useForm } from 'react-hook-form';

export interface ReviewCommentCreateOrUpdateFormProps {
  defaultValues?: useReviewCommentUpdateMutationDto;
  onSubmit?: SubmitHandler<useReviewCommentUpdateMutationDto>;
}
export function ReviewCommentCreateOrUpdateForm({
  defaultValues,
  onSubmit: propsOnSubmit,
}: ReviewCommentCreateOrUpdateFormProps): JSX.Element {
  const reviewCommentCreateOrUpdateId = 'reviewCommentCreateOrUpdate';
  const methods = useForm<useReviewCommentUpdateMutationDto>({ defaultValues });
  const onSubmit: SubmitHandler<useReviewCommentUpdateMutationDto> = (formData) => {
    if (propsOnSubmit) propsOnSubmit(formData);
  };

  return (
    <Box
      as="form"
      id={reviewCommentCreateOrUpdateId}
      onSubmit={methods.handleSubmit(onSubmit)}
    >
      <Stack>
        <FormControl isInvalid={!!methods.formState.errors.content}>
          <FormLabel>후기 댓글 내용</FormLabel>
          <Textarea
            {...methods.register('content', {
              required: '댓글 내용을 작성해주세요.',
              maxLength: {
                value: 500,
                message: '댓글을 최대 500자까지 작성 가능합니다.',
              },
            })}
            minH={100}
            maxH={200}
          />
          <FormErrorMessage fontSize="xs">
            {methods.formState.errors.content?.message}
          </FormErrorMessage>
        </FormControl>
      </Stack>
    </Box>
  );
}
