import {
  Box,
  Button,
  CloseButton,
  Divider,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import {
  useDeleteGoodsImageMutation,
  useGoodsImageMutation,
  useProfile,
} from '@project-lc/hooks';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ChakraNextImage } from '../chakra-extended/ChakraNextImage';
import { GoodsFormValues, uploadGoodsImageToS3 } from './GoodsRegistForm';
import { ImageInput, ImageInputErrorTypes } from './ImageInput';
import SectionWithTitle from './SectionWithTitle';

// 여러 상품 이미지를 s3에 업로드 후 imageDto로 변경
// 상품사진은 file 로 들어옴
export async function imageFileListToImageDto(
  imageFileList: { file: File; filename: string; id: number }[],
  userMail: string,
): Promise<
  Array<{
    cut_number: number;
    image: string;
  }>
> {
  const savedImages = await Promise.all(
    imageFileList.map((item) => {
      const { file } = item;
      return uploadGoodsImageToS3({ ...item, contentType: file.type }, userMail);
    }),
  );
  return savedImages.map((img, index) => ({
    cut_number: index,
    image: img,
  }));
}

export type FileReaderResultType = string | ArrayBuffer | null;

export type Preview = {
  id: number;
  filename: string;
  url: FileReaderResultType;
  file: File;
};

export function GoodsPreviewItem(
  props: Pick<Preview, 'id' | 'filename'> & {
    onDelete: () => void;
    width: number;
    height: number;
    url: string;
  },
): JSX.Element {
  const { id, filename: fileName, url, onDelete, ...rest } = props;

  return (
    <HStack mr={2} mb={2}>
      <ChakraNextImage layout="intrinsic" alt={fileName} src={url} {...rest} />
      <CloseButton onClick={onDelete} />
    </HStack>
  );
}

/** 상품 사진 등록 개수 제한 */
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

/** 상품사진 섹션 컨테이너 */
export function GoodsRegistPictures(): JSX.Element {
  const toast = useToast();
  const { data: profileData } = useProfile();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { setValue, getValues, watch } = useFormContext<GoodsFormValues>();
  const [previews, setPreviews] = useState<Preview[]>([]);

  // 사진 등록하기 다이얼로그 - 미리보기 이미지 삭제 핸들러
  const deletePreview = (id: number): void => {
    setPreviews((list) => {
      const filtered = list.filter((item) => item.id !== id);
      return [...filtered];
    });
  };

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
      setPreviews((list) => {
        const id = list.length === 0 ? 0 : list[list.length - 1].id + 1;
        const newList = [...list, { id, url: data, filename: fileName, file }];
        return newList;
      });
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

  // 사진 등록하기 다일얼로그 - 닫기 핸들러
  const handleClose = (): void => {
    setPreviews([]);
    onClose();
  };

  /** 사진 등록 다이얼로그에서 저장 눌렀을때 - 이미지 저장하는 핸들러 */
  const registImage = useGoodsImageMutation();
  const savePictures = async (): Promise<void> => {
    if (!profileData) return;

    // 사진 개수 제한 - 저장된 이미지 + 등록할 이미지 개수가 8개 넘어가면 저장 안되도록
    const prevImages = getValues('image');
    if (prevImages.length + previews.length > MAX_PICTURE_COUNT) {
      toast({
        title: `이미지는 최대 ${MAX_PICTURE_COUNT}개 등록 가능`,
        status: 'warning',
      });
      return;
    }

    try {
      const lastCutNumber =
        prevImages.length > 0 ? prevImages[prevImages.length - 1].cut_number : -1;

      // s3에 업로드, images에는 image(url)과 cut_number(previews에서 인덱스값) 이 들어있다
      const imageUrls = await imageFileListToImageDto(previews, profileData.email);

      // 이미지record 생성
      const result = await registImage.mutateAsync(
        imageUrls.map((item, index) => ({
          ...item,
          cut_number: index + (lastCutNumber + 1),
        })),
      );

      // formState에 image에 저장
      setValue('image', prevImages ? [...prevImages, ...result] : [...result]);

      toast({ title: '이미지가 저장되었습니다', status: 'success' });

      handleClose();
    } catch (error: any) {
      console.error(error);
      if (error?.response && error?.response?.status === 400) {
        // 파일명 너무 길어서 url 이 db  컬럼제한에 걸린 경우
        toast({
          title: '이미지 저장 중 오류가 발생했습니다',
          status: 'error',
          description: error?.response?.data.message,
        });
      } else {
        toast({ title: '이미지 저장 중 오류가 발생했습니다', status: 'error' });
      }
    }
  };

  // formState에 연결된 imageDto[]
  const savedImages = watch('image');

  // 등록된 이미지 목록에서 이미지 삭제 핸들러 - db 에서 goodsImage 삭제
  const deleteImage = useDeleteGoodsImageMutation();
  const deletePicture = async (imageId: number): Promise<void> => {
    try {
      const prevImages = getValues('image');
      const newImages = prevImages ? prevImages.filter((img) => img.id !== imageId) : [];

      await deleteImage.mutateAsync(imageId);
      setValue('image', newImages);

      toast({ title: '이미지가 삭제되었습니다', status: 'success' });
    } catch (error) {
      console.error(error);
      toast({ title: '이미지 삭제 중 오류가 발생했습니다', status: 'error' });
    }
  };

  const goodsId = watch('id');

  return (
    <SectionWithTitle title="상품사진 *" variant="outlined">
      <Stack spacing={4}>
        <Text>썸네일 이미지로 사용됩니다. 가로세로 1:1 비율인 이미지를 추천합니다.</Text>
        <Box>
          <Button onClick={onOpen}>사진 등록하기</Button>
        </Box>

        {!!goodsId && (
          <Text>
            등록된 이미지 (등록된 이미지 삭제시 &apos;수정&apos; 버튼을 누르지 않아도 바로
            상품에 반영됩니다)
          </Text>
        )}

        {/* 등록된 이미지 목록 */}
        <Stack direction="row" flexWrap="wrap" spacing={2}>
          {savedImages &&
            savedImages.map((i) => (
              <GoodsPreviewItem
                key={i.id}
                id={i.id as number}
                filename={i.image}
                url={i.image || ''}
                {...PREVIEW_SIZE}
                onDelete={() => deletePicture(i.id as number)}
              />
            ))}
        </Stack>
      </Stack>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>등록할 상품 사진을 선택해주세요</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <Text>사진첨부</Text>
              <ImageInput
                multiple
                handleSuccess={handleSuccess}
                handleError={handleError}
                variant="chakra"
              />
              <Divider />
              <Text>등록할 상품 사진 미리보기</Text>
              {/* 이미지 미리보기 목록 */}
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {previews.length !== 0 &&
                  previews.map((preview) => {
                    const { id, filename, url } = preview;
                    return (
                      <GoodsPreviewItem
                        key={id}
                        id={id}
                        filename={filename}
                        url={(url as string) || ''}
                        {...PREVIEW_SIZE}
                        onDelete={() => deletePreview(id)}
                      />
                    );
                  })}
              </Stack>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={savePictures} isLoading={registImage.isLoading}>
              저장
            </Button>
            <Button onClick={handleClose}>취소</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </SectionWithTitle>
  );
}

export default GoodsRegistPictures;
