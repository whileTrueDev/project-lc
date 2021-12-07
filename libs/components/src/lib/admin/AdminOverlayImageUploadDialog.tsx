import { useState, useEffect } from 'react';
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
  VStack,
  Heading,
  useDisclosure,
  Text,
  Link,
} from '@chakra-ui/react';
import { s3 } from '@project-lc/hooks';
import { ChakraNextImage } from '../ChakraNextImage';
import { ConfirmDialog } from '../ConfirmDialog';
import { ImageInput } from '../ImageInput';
import { GoodsPreviewItem, readAsDataURL, Preview } from '../GoodsRegistPictures';

type ImageUploadType = {
  isOpen: boolean;
  onClose: () => void;
};

export interface AdminOverlayImageUpload extends ImageUploadType {
  broadcasterId: string;
  liveShoppingId: number;
}

// 여러 상품 이미지를 s3에 업로드 후 imageDto로 변경
// 상품사진은 file 로 들어옴
export async function imageFileListToImageDto(
  imageFileList: { file: File; filename: string; id: number }[],
  userMail: string,
  liveShoppingId: number,
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
        liveShoppingId,
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
  liveShoppingId: number,
  type: 'vertical-banner' | 'donation-images',
): Promise<string> {
  const { file, filename, contentType } = imageFile;

  return s3.s3uploadFile({
    file,
    filename,
    contentType,
    userMail,
    type,
    liveShoppingId,
  });
}

export async function getSavedImages(
  broadcasterId: string,
  liveShoppingId: number,
  type: 'vertical-banner' | 'donation-images',
): Promise<(string | undefined)[]> {
  const imageList = await s3.getVerticalImagesFromS3(broadcasterId, liveShoppingId, type);
  return imageList;
}

export function AdminOverlayImageUploadDialog(
  props: AdminOverlayImageUpload,
): JSX.Element {
  const { isOpen, onClose, broadcasterId, liveShoppingId } = props;
  const S3_IMAGE_PREFIX = `https://lc-project.s3.ap-northeast-2.amazonaws.com`;
  const toast = useToast();
  const [verticalPreviews, setVerticalPreviews] = useState<Preview[]>([]);
  const [donationPreviews, setDonationPreviews] = useState<Preview[]>([]);
  const goBackAlertDialog = useDisclosure();
  const [savedVerticalImages, setSavedVerticalImages] = useState<(string | undefined)[]>(
    [],
  );
  const [savedDonationImages, setSavedDonationImages] = useState<(string | undefined)[]>(
    [],
  );
  const [selectedBannerType, setSelectedBannerType] = useState<
    'vertical-banner' | 'donation-images'
  >('vertical-banner');

  const numberOfSavedVerticalImages = savedVerticalImages.length;
  const numberOfSavedDonationImages = savedDonationImages.length;
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
            const id =
              list.length === 0
                ? numberOfSavedVerticalImages + 1
                : list[list.length - 1].id + 1;
            const newList = [
              ...list,
              { id, url: data, filename: `vertical-banner-${id}`, file },
            ];
            return newList;
          });
          break;
        default:
          setDonationPreviews((list) => {
            const id =
              list.length === 0
                ? numberOfSavedDonationImages + 1
                : list[list.length - 1].id + 1;
            const newList = [
              ...list,
              { id, url: data, filename: `donation-${id}`, file },
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
      if (numberOfSavedVerticalImages + verticalPreviews.length > 15) {
        throw new Error('세로배너 이미지는 15개까지 등록가능합니다.');
      }
      if (numberOfSavedDonationImages + donationPreviews.length > 2) {
        throw new Error('응원메세지 이미지는 2개까지 등록가능합니다.');
      }

      await imageFileListToImageDto(
        verticalPreviews,
        broadcasterId,
        liveShoppingId,
        'vertical-banner',
      );

      await imageFileListToImageDto(
        donationPreviews,
        broadcasterId,
        liveShoppingId,
        'donation-images',
      );

      toast({ title: '이미지가 저장되었습니다', status: 'success' });

      handleClose();
    } catch (error: any) {
      if (error?.response && error?.response?.status === 400) {
        // 파일명 너무 길어서 url 이 db  컬럼제한에 걸린 경우
        toast({
          title: '이미지 저장 중 오류가 발생했습니다',
          status: 'error',
          description: error?.response?.data.message,
        });
      } else {
        toast({ title: error.message, status: 'error' });
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
              id: index + numberOfSavedVerticalImages + 1,
              filename: `vertical-banner-${index + numberOfSavedVerticalImages + 1}`,
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
              id: index + numberOfSavedDonationImages + 1,
              filename: `donation-${index + numberOfSavedDonationImages + 1}`,
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

  useEffect(() => {
    const getVerticalImageName = async (): Promise<void> => {
      const verticalImages = await getSavedImages(
        broadcasterId,
        liveShoppingId,
        'vertical-banner',
      );
      setSavedVerticalImages(verticalImages);
    };

    const getDonationImageName = async (): Promise<void> => {
      const verticalImages = await getSavedImages(
        broadcasterId,
        liveShoppingId,
        'donation-images',
      );
      setSavedDonationImages(verticalImages);
    };
    getVerticalImageName();
    getDonationImageName();
  }, [
    broadcasterId,
    liveShoppingId,
    setSavedVerticalImages,
    setSavedDonationImages,
    isOpen,
  ]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>이미지 등록</ModalHeader>
          <ModalBody>
            <Heading size="md">등록된 세로배너</Heading>
            <Stack>
              <HStack mr={2} mb={2}>
                {savedVerticalImages.length === 0 && (
                  <Text>등록된 이미지가 없습니다</Text>
                )}
                {savedVerticalImages.length !== 0 &&
                  savedVerticalImages.map((result) => {
                    return (
                      <VStack key={result}>
                        <Link
                          isTruncated
                          href={`${S3_IMAGE_PREFIX}/${result}`}
                          fontWeight="bold"
                          colorScheme="blue"
                          textDecoration="underline"
                          isExternal
                        >
                          <ChakraNextImage
                            layout="intrinsic"
                            src={`${S3_IMAGE_PREFIX}/${result}`}
                            width={80}
                            height={160}
                          />
                        </Link>
                      </VStack>
                    );
                  })}
              </HStack>
              {savedVerticalImages.length !== 0 && (
                <Button
                  onClick={() => {
                    goBackAlertDialog.onOpen();
                    setSelectedBannerType('vertical-banner');
                  }}
                >
                  이미지 모두 삭제
                </Button>
              )}
            </Stack>
            <Divider mt={3} mb={3} />
            <Heading size="md">등록된 응원메세지 이미지</Heading>
            <Stack>
              <HStack mr={2} mb={2}>
                {savedDonationImages.length === 0 && (
                  <Text>등록된 이미지가 없습니다</Text>
                )}
                {savedDonationImages.length !== 0 &&
                  savedDonationImages.map((result) => {
                    return (
                      <VStack key={result}>
                        <Link
                          isTruncated
                          href={`${S3_IMAGE_PREFIX}/${result}`}
                          fontWeight="bold"
                          colorScheme="blue"
                          textDecoration="underline"
                          isExternal
                        >
                          <ChakraNextImage
                            layout="intrinsic"
                            src={`${S3_IMAGE_PREFIX}/${result}`}
                            width={120}
                            height={70}
                          />
                        </Link>
                      </VStack>
                    );
                  })}
              </HStack>
              {savedDonationImages.length !== 0 && (
                <Button
                  onClick={() => {
                    goBackAlertDialog.onOpen();
                    setSelectedBannerType('donation-images');
                  }}
                >
                  이미지 모두 삭제
                </Button>
              )}
            </Stack>
            <Divider mt={10} mb={10} />
            <Stack>
              <Heading size="md">세로 배너 첨부</Heading>
              <Text>세로배너는 15장까지 등록가능합니다.</Text>
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
                      <GoodsPreviewItem
                        key={id}
                        id={id}
                        filename={filename}
                        url={(url as string) || ''}
                        width={40}
                        height={65}
                        onDelete={() => deletePreview(id, 'vertical-banner')}
                      />
                    );
                  })}
              </Stack>
            </Stack>
            <Stack>
              <Heading size="md">응원메세지 이미지 첨부</Heading>
              <Text>응원메세지 이미지는 2장까지 등록가능합니다.</Text>
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
                      <GoodsPreviewItem
                        key={id}
                        id={id}
                        filename={filename}
                        url={(url as string) || ''}
                        width={60}
                        height={35}
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

        <ConfirmDialog
          title="이미지 삭제하기"
          isOpen={goBackAlertDialog.isOpen}
          onClose={goBackAlertDialog.onClose}
          onConfirm={async () => {
            if (selectedBannerType === 'vertical-banner') {
              await s3.s3DeleteImages(savedVerticalImages);
              setSavedVerticalImages([]);
            }
            if (selectedBannerType === 'donation-images') {
              await s3.s3DeleteImages(savedDonationImages);
              setSavedDonationImages([]);
            }
          }}
        >
          <Text mt={3}>이미지들을 삭제하시겠습니까?</Text>
        </ConfirmDialog>
      </Modal>
    </>
  );
}
