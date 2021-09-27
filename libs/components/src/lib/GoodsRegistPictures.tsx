/* eslint-disable react/jsx-props-no-spreading */
import {
  HStack,
  CloseButton,
  Text,
  Stack,
  useToast,
  ImageProps,
  Box,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ChakraNextImage } from './ChakraNextImage';
import { GoodsFormValues } from './GoodsRegistForm';
import { ImageInput, ImageInputErrorTypes } from './ImageInput';
import SectionWithTitle from './SectionWithTitle';

export type FileReaderResultType = string | ArrayBuffer | null;

export type Preview = {
  id: number;
  fileName: string;
  url: FileReaderResultType;
};

export function GoodsPreviewItem(
  props: Preview & { onDelete: () => void; width: number; height: number },
) {
  const { id, fileName, url, onDelete, ...rest } = props;

  return (
    <HStack>
      <ChakraNextImage layout="intrinsic" alt={fileName} src={url as string} {...rest} />
      <CloseButton onClick={onDelete} />
    </HStack>
  );
}

const MAX_PICTURE_COUNT = 8;
const PREVIEW_SIZE = {
  width: 60,
  height: 60,
};

export function readAsDataURL(file: File): Promise<{
  data: FileReaderResultType;
  name: string;
  size: number;
  type: string;
}> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = function () {
      return resolve({
        data: fileReader.result,
        name: file.name,
        size: file.size,
        type: file.type,
      });
    };
    fileReader.readAsDataURL(file);
  });
}

export function GoodsRegistPictures(): JSX.Element {
  const toast = useToast();
  const { setValue, getValues } = useFormContext<GoodsFormValues>();
  const [previews, setPreviews] = useState<Preview[]>([]);

  const deletePreview = (id: number) => {
    setPreviews((list) => {
      const filtered = list.filter((item) => item.id !== id);
      const prevImages = getValues('image');
      setValue(
        'image',
        prevImages?.filter((item) => item.id !== id),
      );
      return [...filtered];
    });
  };

  const handleSuccess = (fileName: string, file: File) => {
    // 이미지 최대 8개 등록 가능
    if (previews.length >= MAX_PICTURE_COUNT) {
      toast({
        title: `이미지는 최대 ${MAX_PICTURE_COUNT}개 등록 가능`,
        status: 'warning',
      });
      return;
    }

    readAsDataURL(file).then(({ data }) => {
      setPreviews((list) => {
        const id = list.length === 0 ? 0 : list[list.length - 1].id + 1;
        const newList = [...list, { id, url: data, fileName }];

        const prevImages = getValues('image');
        setValue(
          'image',
          prevImages ? [...prevImages, { id, file, filename: fileName }] : [],
        );

        return newList;
      });
    });
  };

  const handleError = (errorType?: ImageInputErrorTypes) => {
    console.error({ errorType });
  };

  return (
    <SectionWithTitle title="상품사진 *">
      <Stack spacing={4}>
        {/* //TODO: ImageInput multiselect & 사이즈 제한 변경 */}
        <ImageInput
          handleSuccess={handleSuccess}
          handleError={handleError}
          variant="chakra"
        />

        {/* 선택한 이미지 프리뷰 목록 */}
        <Stack direction="row" spacing={2} flexWrap="wrap">
          {previews.length !== 0 &&
            previews.map((preview) => {
              const { id } = preview;
              return (
                <GoodsPreviewItem
                  key={id}
                  {...preview}
                  {...PREVIEW_SIZE}
                  onDelete={() => deletePreview(id)}
                />
              );
            })}
        </Stack>
      </Stack>
    </SectionWithTitle>
  );
}

export default GoodsRegistPictures;
