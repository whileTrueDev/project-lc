import { CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  CloseButton,
  Divider,
  IconButton,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import { Preview } from '@project-lc/components-core/ImageInputDialog';
import SectionWithTitle from '@project-lc/components-layout/SectionWithTitle';
import {
  useDeleteGoodsImageMutation,
  useGoodsImageMutation,
  useProfile,
} from '@project-lc/hooks';
import { GoodsImageDto } from '@project-lc/shared-types';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { GoodsFormValues, uploadGoodsImageToS3 } from './GoodsRegistForm';
import { GoodsRegistPictureDialog } from './GoodsRegistPictureDialog';
import { GoodsRegistPictureOrderChangeDialog } from './GoodsRegistPictureOrderChangeDialog';

// 여러 상품 이미지를 s3에 업로드 후 imageDto로 변경
// 상품사진은 file 로 들어옴
export async function saveImageFileListToS3AndReturnImageDto(
  imageFileList: { file: File; filename: string; id: number }[],
  userMail: string,
): Promise<GoodsImageDto[]> {
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

export function GoodsPreviewItem(
  props: Pick<Preview, 'id' | 'filename'> & {
    onDelete: () => void;
    width: number;
    height: number;
    url: string;
    onImageClick?: () => void;
    actionButtons?: React.ReactNode;
    selected?: boolean;
  },
): JSX.Element {
  const {
    id,
    filename: fileName,
    url,
    onDelete,
    onImageClick,
    actionButtons,
    selected,
    width,
    height,
  } = props;

  return (
    <Stack
      direction="row"
      alignItems="center"
      borderWidth={selected ? '3px' : '1px'}
      borderRadius="lg"
      p={1}
    >
      <Box
        onClick={onImageClick}
        cursor={onImageClick ? 'pointer' : undefined}
        minW={`${width}px`}
        minH={`${height}px`}
      >
        <ChakraNextImage
          layout="intrinsic"
          alt={fileName}
          src={url}
          width={width}
          height={height}
        />
      </Box>

      <Stack m={0}>
        <CloseButton onClick={onDelete} m={0} size="sm" />
        {actionButtons}
      </Stack>
    </Stack>
  );
}

/** 상품 사진 등록 개수 제한 */
export const MAX_PICTURE_COUNT = 8;
export const PREVIEW_SIZE = {
  width: 80,
  height: 80,
};

/** 상품사진 섹션 컨테이너 */
export function GoodsRegistPictures(): JSX.Element {
  const toast = useToast();
  const { data: profileData } = useProfile();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const imageOrderChangeDialog = useDisclosure();
  const imageDeleteConfirmDialog = useDisclosure();
  const { setValue, getValues, watch } = useFormContext<GoodsFormValues>();

  /** 사진 등록 다이얼로그에서 저장 눌렀을때 - 이미지 저장하는 핸들러 */
  const registImage = useGoodsImageMutation();
  const savePictures = async (
    previews: Preview[],
    onSuccess?: () => void,
  ): Promise<void> => {
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
      const imageUrls = await saveImageFileListToS3AndReturnImageDto(
        previews,
        profileData.email,
      );

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
      if (onSuccess) onSuccess();
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

  // * 삭제 다이얼로그에서
  // 등록된 이미지 목록에서 이미지 삭제 핸들러 - db 에서 goodsImage 삭제
  const [deleteImageId, setDeleteImageId] = useState<number | null>(null);
  const deleteImage = useDeleteGoodsImageMutation();
  const deletePicture = async (): Promise<void> => {
    if (deleteImageId) {
      try {
        const prevImages = getValues('image');
        const newImages = prevImages
          ? prevImages.filter((img) => img.id !== deleteImageId)
          : [];

        await deleteImage.mutateAsync(deleteImageId);
        setValue('image', newImages);
        setDeleteImageId(null);

        toast({ title: '이미지가 삭제되었습니다', status: 'success' });
      } catch (error) {
        console.error(error);
        toast({ title: '이미지 삭제 중 오류가 발생했습니다', status: 'error' });
      }
    }
  };

  const goodsId = watch('id');

  return (
    <SectionWithTitle title="상품사진 *" variant="outlined">
      <Stack spacing={4}>
        <Text>
          썸네일 이미지로 사용됩니다. 가로세로 1:1 비율인 이미지를 추천합니다. (최대 8개
          등록 가능)
        </Text>
        <Box>
          <Button onClick={onOpen}>사진 등록하기</Button>
        </Box>
        <Divider />

        {/* 등록된 이미지 목록 */}
        <Stack>
          <Stack direction="row" alignItems="center">
            <Text>등록된 이미지</Text>
            {savedImages.length > 0 && (
              <Button size="sm" onClick={imageOrderChangeDialog.onOpen}>
                순서 변경하기
              </Button>
            )}
          </Stack>

          {savedImages.length > 0 ? (
            <Stack direction="row" flexWrap="wrap" spacing={2}>
              {savedImages.map((i) => (
                <Box key={i.id} position="relative">
                  <ChakraNextImage
                    layout="intrinsic"
                    alt={i.image}
                    src={i.image || ''}
                    {...PREVIEW_SIZE}
                  />
                  <Box
                    bg="rgba(0,0,0,0.3)"
                    width="100%"
                    height={`${PREVIEW_SIZE.height / 3}px`}
                    position="absolute"
                    left={0}
                    top={0}
                  />
                  <IconButton
                    aria-label="등록된 이미지 삭제"
                    icon={<CloseIcon />}
                    size="xs"
                    position="absolute"
                    right={0}
                    top={0}
                    onClick={() => {
                      setDeleteImageId(i.id || null);
                      imageDeleteConfirmDialog.onOpen();
                    }}
                  />
                </Box>
              ))}
            </Stack>
          ) : (
            <Text>없음</Text>
          )}
        </Stack>
      </Stack>

      <GoodsRegistPictureDialog
        isOpen={isOpen}
        onClose={onClose}
        onSave={savePictures}
        isLoading={registImage.isLoading}
      />

      <GoodsRegistPictureOrderChangeDialog
        savedImages={savedImages}
        isOpen={imageOrderChangeDialog.isOpen}
        onClose={imageOrderChangeDialog.onClose}
      />

      <ConfirmDialog
        isOpen={imageDeleteConfirmDialog.isOpen}
        onClose={imageDeleteConfirmDialog.onClose}
        title="이미지 삭제"
        onConfirm={deletePicture}
      >
        <Text>해당 이미지를 삭제하시겠습니까?</Text>
      </ConfirmDialog>
    </SectionWithTitle>
  );
}

export default GoodsRegistPictures;
