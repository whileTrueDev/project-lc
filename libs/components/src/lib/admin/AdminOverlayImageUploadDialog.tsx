import { useState } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Divider,
  Stack,
  useToast,
  HStack,
  CloseButton,
  Heading,
} from '@chakra-ui/react';
import { s3 } from '@project-lc/hooks';
import { ChakraNextImage } from '../ChakraNextImage';

import { ImageInput } from '../ImageInput';

type ImageUploadType = {
  isOpen: boolean;
  onClose: () => void;
};

export interface AdminOverlayImageUpload extends ImageUploadType {
  broadcasterId: string;
  streamId: string;
}

export type FileReaderResultType = string | ArrayBuffer | null;

export type Preview = {
  id: number;
  filename: string;
  url: FileReaderResultType;
  file: File;
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

// 여러 상품 이미지를 s3에 업로드 후 imageDto로 변경
// 상품사진은 file 로 들어옴
export async function imageFileListToImageDto(
  imageFileList: { file: File; filename: string; id: number }[],
  userMail: string,
  streamId: string,
  type: 'vertical-banner' | 'donation-images',
): Promise<
  Array<{
    cut_number: number;
    image: string;
  }>
> {
  const savedImages = await Promise.all(
    imageFileList.map((item) => {
      const { file } = item;
      return uploadImageToS3(
        { ...item, contentType: file.type },
        userMail,
        streamId,
        type,
      );
    }),
  );
  return savedImages.map((img, index) => ({
    cut_number: index,
    image: img,
  }));
}

// 상품 사진, 상세설명 이미지를 s3에 업로드 -> url 리턴
export async function uploadImageToS3(
  imageFile: { file: File | Buffer; filename: string; id: number; contentType: string },
  userMail: string,
  streamId: string,
  type: 'vertical-banner' | 'donation-images',
): Promise<string> {
  const { file, filename, contentType } = imageFile;

  return s3.s3uploadFile({
    file,
    filename,
    contentType,
    userMail,
    type,
    streamId,
  });
}

export function PreviewItem(
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

export function AdminOverlayImageUploadDialog(
  props: AdminOverlayImageUpload,
): JSX.Element {
  const { isOpen, onClose, broadcasterId, streamId } = props;
  const toast = useToast();
  const [verticalPreviews, setVerticalPreviews] = useState<Preview[]>([]);
  const [donationPreviews, setDonationPreviews] = useState<Preview[]>([]);

  const PREVIEW_SIZE = {
    width: 60,
    height: 60,
  };

  // 사진 등록하기 다이얼로그 - 파일업로드 인풋 성공 핸들러 -> 미리보기 previews에 이미지 추가
  const handleSuccess = (
    fileName: string,
    file: File,
    type?: 'vertical-banner' | 'donation-images',
  ): void => {
    readAsDataURL(file).then(({ data }) => {
      switch (type) {
        case 'vertical-banner':
          setVerticalPreviews((list) => {
            const id = list.length === 0 ? 1 : list[list.length - 1].id + 1;
            const newList = [
              ...list,
              { id, url: data, filename: `vertical-banner-${id}`, file },
            ];
            return newList;
          });
          break;
        default:
          setDonationPreviews((list) => {
            const id = list.length === 0 ? 1 : list[list.length - 1].id + 1;
            const newList = [
              ...list,
              { id, url: data, filename: `donation-images-${id}`, file },
            ];
            return newList;
          });
          break;
      }
    });
  };

  // 사진 등록하기 다일얼로그 - 파일업로드 인풋 에러 핸들러
  const handleError = (): void => {
    toast({
      title: `이미지 파일을 선택해주세요`,
      status: 'warning',
    });
  };

  const uploadImage = async (): Promise<void> => {
    try {
      if (donationPreviews.length > 2) {
        throw new Error('도네이션 이미지는 2개까지 등록가능합니다.');
      }
      if (verticalPreviews.length > 15) {
        throw new Error('세로배너 이미지는 15개까지 등록가능합니다.');
      }
      await imageFileListToImageDto(
        verticalPreviews,
        broadcasterId,
        streamId,
        'vertical-banner',
      );
      await imageFileListToImageDto(
        donationPreviews,
        broadcasterId,
        streamId,
        'donation-images',
      );

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
  // 사진 등록하기 다이얼로그 - 미리보기 이미지 삭제 핸들러
  const deletePreview = (
    id: number,
    type: 'vertical-banner' | 'donation-images',
  ): void => {
    switch (type) {
      case 'vertical-banner':
        setVerticalPreviews((list) => {
          const filtered = list.filter((item) => item.id !== id);
          const idReassignImages = filtered.map((item, index) => {
            const newImageList = {
              ...item,
              id: index + 1,
              filename: `vertical-banner-${index + 1}`,
            };
            return newImageList;
          });
          return idReassignImages;
        });
        break;
      default:
        setDonationPreviews((list) => {
          const filtered = list.filter((item) => item.id !== id);
          const idReassignImages = filtered.map((item, index) => {
            const newImageList = {
              ...item,
              id: index + 1,
              filename: `vertical-banner-${index + 1}`,
            };
            return newImageList;
          });
          return idReassignImages;
        });
        break;
    }
  };

  // 사진 등록하기 다일얼로그 - 닫기 핸들러
  const handleClose = (): void => {
    setVerticalPreviews([]);
    setDonationPreviews([]);
    onClose();
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>이미지 등록</ModalHeader>
          <ModalBody>
            <Stack>
              <Heading size="md">세로 배너 첨부</Heading>
              <ImageInput
                multiple
                handleSuccess={handleSuccess}
                handleError={handleError}
                variant="chakra"
                type="vertical-banner"
              />
              <Divider />
              {/* 이미지 미리보기 목록 */}
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {verticalPreviews.length !== 0 &&
                  verticalPreviews.map((preview) => {
                    const { id, filename, url } = preview;
                    return (
                      <PreviewItem
                        key={id}
                        id={id}
                        filename={filename}
                        url={(url as string) || ''}
                        {...PREVIEW_SIZE}
                        onDelete={() => deletePreview(id, 'vertical-banner')}
                      />
                    );
                  })}
              </Stack>
            </Stack>

            <Stack>
              <Heading size="md">응원메세지 이미지 첨부</Heading>
              <ImageInput
                multiple
                handleSuccess={handleSuccess}
                handleError={handleError}
                variant="chakra"
                type="donation-images"
              />
              <Divider />
              {/* 이미지 미리보기 목록 */}
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {donationPreviews.length !== 0 &&
                  donationPreviews.map((preview) => {
                    const { id, filename, url } = preview;
                    return (
                      <PreviewItem
                        key={id}
                        id={id}
                        filename={filename}
                        url={(url as string) || ''}
                        {...PREVIEW_SIZE}
                        onDelete={() => deletePreview(id, 'donation-images')}
                      />
                    );
                  })}
              </Stack>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={handleClose}>
              닫기
            </Button>
            <Button colorScheme="blue" onClick={uploadImage}>
              등록
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
