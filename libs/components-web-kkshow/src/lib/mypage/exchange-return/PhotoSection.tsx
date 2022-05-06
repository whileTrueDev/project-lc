import { Box, CloseButton, Stack, Text, useToast } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { Preview, readAsDataURL } from '@project-lc/components-core/ImageInputDialog';
import { ImageInput, ImageInputErrorTypes } from '@project-lc/components-core/ImageInput';
import { useFormContext } from 'react-hook-form';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';

const MAX_PICTURE_COUNT = 5;
type FormType = {
  previews: Preview[];
} & Record<string, any>;
export function PhotoSection(): JSX.Element {
  const toast = useToast();
  const { setValue, watch, getValues } = useFormContext<FormType>();
  // const [previews, setPreviews] = useState<Preview[]>([]);

  // 사진 등록하기 다이얼로그 - 파일업로드 인풋 성공 핸들러 -> 미리보기 previews에 이미지 추가
  const handleSuccess = (fileName: string, file: File): void => {
    // 이미지 최대 8개 등록 가능
    if (previews.length >= MAX_PICTURE_COUNT) {
      toast({
        title: `이미지는 최대 ${MAX_PICTURE_COUNT}개 등록 가능`,
        status: 'warning',
      });
      return;
    }

    readAsDataURL(file).then(({ data }) => {
      const list: Preview[] = getValues('previews') || [];
      const id = list.length === 0 ? 0 : list[list.length - 1].id + 1;
      const newList = [...list, { id, url: data, filename: fileName, file }];
      setValue('previews', newList);
    });
  };

  // 사진 등록하기 다일얼로그 - 파일업로드 인풋 에러 핸들러
  const handleError = (errorType?: ImageInputErrorTypes): void => {
    switch (errorType) {
      case 'invalid-format': {
        toast({
          title: `이미지 파일을 선택해주세요`,
          status: 'warning',
        });
        return;
      }
      case 'over-size': {
        toast({
          title: `이미지 파일은 10MB 이하여야 합니다`,
          status: 'warning',
        });
        return;
      }
      default: {
        toast({
          title: `이미지 파일을 선택해주세요`,
          status: 'warning',
        });
      }
    }
  };

  const removePreview = useCallback(
    (previewId: number) => {
      const list: Preview[] = getValues('previews') || [];
      const newList = list.filter((preview) => preview.id !== previewId);
      setValue('previews', newList);
    },
    [getValues, setValue],
  );

  const previews = watch('previews') || [];
  return (
    <Stack>
      <Text fontWeight="bold">사진 첨부(최대5장)</Text>
      {/* <Stack direction="row"> */}
      <ImageInput
        multiple
        handleSuccess={handleSuccess}
        handleError={handleError}
        variant="chakra"
      />
      {/* </Stack> */}
      <Stack>
        {previews.map((preview, idx) => (
          // eslint-disable-next-line react/no-array-index-key
          <Stack direction="row" key={idx}>
            <CloseButton onClick={() => removePreview(preview.id)} />
            <ChakraNextImage
              layout="intrinsic"
              alt={preview.filename}
              src={preview.url as string}
              width={40}
              height={40}
            />
            <Text>{preview.filename}</Text>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

export default PhotoSection;
