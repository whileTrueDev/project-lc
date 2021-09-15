/* eslint-disable react/jsx-props-no-spreading */
import { Box, CloseButton, Text, Stack, useToast, ImageProps } from '@chakra-ui/react';
import { RegistGoodsDto } from '@project-lc/shared-types';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ChakraNextImage } from './ChakraNextImage';
import { ImageInput, ImageInputErrorTypes } from './ImageInput';
import SectionWithTitle from './SectionWithTitle';

type FileReaderResultType = string | ArrayBuffer | null;

type Preview = {
  id: number;
  fileName: string;
  url: FileReaderResultType;
};

export function GoodsPreviewItem(
  props: Preview & { onDelete: () => void; width: number; height: number },
) {
  const { id, fileName, url, onDelete, ...rest } = props;

  return (
    <Box>
      <CloseButton onClick={onDelete} />
      {id}
      <ChakraNextImage layout="intrinsic" alt={fileName} src={url as string} {...rest} />
    </Box>
  );
}

const MAX_PICTURE_COUNT = 8;
const PREVIEW_SIZE = {
  width: 60,
  height: 60,
};
export const divider = '나눔';

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
  const { setValue } = useFormContext<RegistGoodsDto>();
  const [previews, setPreviews] = useState<Preview[]>([]);

  const deletePreview = (id: number) => {
    setPreviews((list) => {
      const filtered = list.filter((item) => item.id !== id);
      // TODO: 사진 삭제처리
      setValue('image', filtered.map((item) => item.url).join(divider));
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

        // TODO: GoodsImage테이블 생성 & Goods 테이블 image 컬럼 타입 수정(GoodsImage[]로)
        setValue('image', newList.map((item) => item.url?.slice(0, 20)).join(divider));

        return newList;
      });
    });
  };

  const handleError = (errorType?: ImageInputErrorTypes) => {
    console.log({ errorType });
  };

  return (
    <SectionWithTitle title="상품사진">
      <Text>사진</Text>
      {/* //TODO: ImageInput multiselect & 사이즈 제한 변경 */}
      <ImageInput handleSuccess={handleSuccess} handleError={handleError} />

      {/* 선택한 이미지 프리뷰 목록
       */}
      <Stack direction="row" spacing={2}>
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
    </SectionWithTitle>
  );
}

export default GoodsRegistPictures;
