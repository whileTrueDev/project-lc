import {
  Button,
  Divider,
  Heading,
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import { ImageInput } from '@project-lc/components-core/ImageInput';
import { Preview, readAsDataURL } from '@project-lc/components-core/ImageInputDialog';
import { GoodsPreviewItem } from '@project-lc/components-seller/GoodsRegistPictures';
import { OverlayImageTypes } from '@project-lc/shared-types';
import { s3 } from '@project-lc/utils-s3';
import { useEffect, useState } from 'react';

type ImageUploadType = {
  isOpen: boolean;
  onClose: () => void;
};

export interface AdminOverlayImageUpload extends ImageUploadType {
  broadcasterEmail: string;
  liveShoppingId: number;
}

// 여러 상품 이미지를 s3에 업로드 후 imageDto로 변경
// 상품사진은 file 로 들어옴
export async function imageFileListToImageDto(
  imageFileList: { file: File; filename: string; id: number }[],
  userMail: string,
  liveShoppingId: number,
  type: OverlayImageTypes,
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

export async function uploadImageToS3(
  imageFile: { file: File | Buffer; filename: string; id: number; contentType: string },
  userMail: string,
  liveShoppingId: number,
  type: OverlayImageTypes,
): Promise<string> {
  const { file, filename, contentType } = imageFile;
  let imageType:
    | 'vertical-banner'
    | 'donation-images'
    | 'overlay-logo'
    | 'horizontal-banner' = 'vertical-banner';
  const tagging: {
    overlayImageType:
      | 'vertical-banner-tag'
      | 'donation-images-tag'
      | 'overlay-logo-tag'
      | 'horizontal-banner-tag';
  } = { overlayImageType: 'vertical-banner-tag' };
  if (type === 'donation-images-1' || type === 'donation-images-2') {
    imageType = 'donation-images';
    tagging.overlayImageType = 'donation-images-tag';
  } else if (type === 'overlay-logo') {
    imageType = 'overlay-logo';
    tagging.overlayImageType = 'overlay-logo-tag';
  } else if (type === 'horizontal-banner') {
    imageType = 'horizontal-banner';
    tagging.overlayImageType = 'horizontal-banner-tag';
  }

  return s3.s3uploadFile({
    file,
    filename,
    contentType,
    userMail,
    type: imageType,
    liveShoppingId,
    tagging,
  });
}

export async function getSavedImages(
  broadcasterId: string,
  liveShoppingId: number,
  type: 'vertical-banner' | 'donation-images' | 'overlay-logo' | 'horizontal-banner',
): Promise<(string | undefined)[]> {
  const imageList = await s3.getOverlayImagesFromS3(broadcasterId, liveShoppingId, type);
  return imageList;
}

export function AdminOverlayImageUploadDialog(
  props: AdminOverlayImageUpload,
): JSX.Element {
  const { isOpen, onClose, broadcasterEmail, liveShoppingId } = props;
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const S3_IMAGE_PREFIX = `https://lc-project.s3.ap-northeast-2.amazonaws.com`;
  const toast = useToast();
  const [verticalPreviews, setVerticalPreviews] = useState<Preview[]>([]);
  const [horizontalPreviews, setHorizontalPreviews] = useState<Preview[]>([]);
  const [firstDonationPreviews, setFirstDonationPreviews] = useState<Preview[]>([]);
  const [secondDonationPreviews, setSecondDonationPreviews] = useState<Preview[]>([]);
  const [logoPreviews, setLogoPreviews] = useState<Preview[]>([]);
  const goBackAlertDialog = useDisclosure();
  const [savedVerticalImages, setSavedVerticalImages] = useState<(string | undefined)[]>(
    [],
  );
  const [savedHorizontalImages, setSavedHorizontalImages] = useState<
    (string | undefined)[]
  >([]);
  const [savedFirstDonationImages, setSavedFirstDonationImages] = useState<
    string | undefined
  >('');
  const [savedSecondDonationImages, setSavedSecondDonationImages] = useState<
    string | undefined
  >('');
  const [savedLogoImages, setSavedLogoImages] = useState<string | undefined>('');
  const [selectedBannerType, setSelectedBannerType] =
    useState<OverlayImageTypes>('vertical-banner');

  const numberOfSavedVerticalImages = savedVerticalImages.length;
  const numberOfSavedHorizontalImages = savedHorizontalImages.length;
  const numberOfSavedFirstDonationImages = savedFirstDonationImages ? 1 : 0;
  const numberOfSavedSecondDonationImages = savedSecondDonationImages ? 1 : 0;
  const numberOfSavedLogoImages = savedLogoImages ? 1 : 0;
  // 사진 등록하기 다이얼로그 - 파일업로드 인풋 성공 핸들러 -> 미리보기 previews에 이미지 추가
  const handleSuccess = (
    fileName: string,
    file: File,
    type?: OverlayImageTypes,
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
        case 'horizontal-banner':
          setHorizontalPreviews((list) => {
            const id =
              list.length === 0
                ? numberOfSavedHorizontalImages + 1
                : list[list.length - 1].id + 1;
            const newList = [
              ...list,
              { id, url: data, filename: `horizontal-banner-${id}`, file },
            ];
            return newList;
          });
          break;
        case 'donation-images-1':
          setFirstDonationPreviews((list) => {
            const id = list.length === 0 ? 1 : list[list.length - 1].id + 1;
            const newList = [...list, { id, url: data, filename: 'donation-1', file }];
            return newList;
          });
          break;
        case 'donation-images-2':
          setSecondDonationPreviews((list) => {
            const id = list.length === 0 ? 1 : list[list.length - 1].id + 1;
            const newList = [...list, { id, url: data, filename: 'donation-2', file }];
            return newList;
          });
          break;
        case 'overlay-logo':
          setLogoPreviews((list) => {
            const id = list.length === 0 ? 1 : list[list.length - 1].id + 1;
            const newList = [
              ...list,
              { id, url: data, filename: 'kks-special-logo', file },
            ];
            return newList;
          });
          break;
        default:
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
      if (numberOfSavedHorizontalImages + horizontalPreviews.length > 15) {
        throw new Error('가로배너 이미지는 15개까지 등록가능합니다.');
      }
      if (numberOfSavedFirstDonationImages + firstDonationPreviews.length > 1) {
        throw new Error('응원메세지 이미지는 단계별 1개까지 등록가능합니다.');
      }
      if (numberOfSavedSecondDonationImages + secondDonationPreviews.length > 1) {
        throw new Error('응원메세지 이미지는 단계별 1개까지 등록가능합니다.');
      }
      if (numberOfSavedLogoImages + logoPreviews.length > 1) {
        throw new Error('로고는 1개까지 등록가능합니다.');
      }

      if (
        !(
          verticalPreviews.length +
          horizontalPreviews.length +
          firstDonationPreviews.length +
          secondDonationPreviews.length +
          logoPreviews.length
        )
      ) {
        throw new Error('등록된 이미지가 없습니다');
      }

      setIsDisabled(true);

      await imageFileListToImageDto(
        verticalPreviews,
        broadcasterEmail,
        liveShoppingId,
        'vertical-banner',
      );

      await imageFileListToImageDto(
        horizontalPreviews,
        broadcasterEmail,
        liveShoppingId,
        'horizontal-banner',
      );

      await imageFileListToImageDto(
        firstDonationPreviews,
        broadcasterEmail,
        liveShoppingId,
        'donation-images-1',
      );

      await imageFileListToImageDto(
        secondDonationPreviews,
        broadcasterEmail,
        liveShoppingId,
        'donation-images-2',
      );

      await imageFileListToImageDto(
        logoPreviews,
        broadcasterEmail,
        liveShoppingId,
        'overlay-logo',
      );

      toast({ title: '이미지가 저장되었습니다', status: 'success' });

      handleClose();
    } catch (error: any) {
      if (error?.response && error?.response?.status === 400) {
        setIsDisabled(false);
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
  const deletePreview = (id: number, type: OverlayImageTypes): void => {
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
      case 'horizontal-banner':
        setHorizontalPreviews((list) => {
          const filtered = list.filter((item) => item.id !== id);
          const idReassignImages = filtered.map((item, index) => {
            const newImageList = {
              ...item,
              id: index + numberOfSavedHorizontalImages + 1,
              filename: `horizontal-banner-${index + numberOfSavedHorizontalImages + 1}`,
            };
            return newImageList;
          });
          return idReassignImages;
        });
        break;
      case 'donation-images-1':
        setFirstDonationPreviews((list) => {
          const filtered = list.filter((item) => item.id !== id);
          const idReassignImages = filtered.map((item, index) => {
            const newImageList = {
              ...item,
              id: index,
              filename: 'donation-1',
            };
            return newImageList;
          });
          return idReassignImages;
        });
        break;
      case 'donation-images-2':
        setSecondDonationPreviews((list) => {
          const filtered = list.filter((item) => item.id !== id);
          const idReassignImages = filtered.map((item, index) => {
            const newImageList = {
              ...item,
              id: index,
              filename: 'donation-2',
            };
            return newImageList;
          });
          return idReassignImages;
        });
        break;
      case 'overlay-logo':
        setLogoPreviews((list) => {
          const filtered = list.filter((item) => item.id !== id);
          const idReassignImages = filtered.map((item, index) => {
            const newImageList = {
              ...item,
              id: index,
              filename: 'kks-special-logo',
            };
            return newImageList;
          });
          return idReassignImages;
        });
        break;
      default:
        break;
    }
  };

  // 사진 등록하기 다일얼로그 - 닫기 핸들러
  const handleClose = (): void => {
    setIsDisabled(false);
    setVerticalPreviews([]);
    setHorizontalPreviews([]);
    setFirstDonationPreviews([]);
    setSecondDonationPreviews([]);
    setLogoPreviews([]);
    onClose();
  };

  useEffect(() => {
    const getVerticalImageName = async (): Promise<void> => {
      const verticalImages = await getSavedImages(
        broadcasterEmail,
        liveShoppingId,
        'vertical-banner',
      );
      setSavedVerticalImages(verticalImages);
    };

    const getHorizontalImageName = async (): Promise<void> => {
      const horizontalImages = await getSavedImages(
        broadcasterEmail,
        liveShoppingId,
        'horizontal-banner',
      );
      setSavedHorizontalImages(horizontalImages);
    };

    const getDonationImageName = async (): Promise<void> => {
      const donationImage = await getSavedImages(
        broadcasterEmail,
        liveShoppingId,
        'donation-images',
      );
      const firstDonationImage = donationImage.find((element) =>
        element?.includes('donation-1'),
      );
      const secondDonationImage = donationImage.find((element) =>
        element?.includes('donation-2'),
      );
      setSavedFirstDonationImages(firstDonationImage);
      setSavedSecondDonationImages(secondDonationImage);
    };

    const getLogoImageName = async (): Promise<void> => {
      const logoImage = await getSavedImages(
        broadcasterEmail,
        liveShoppingId,
        'overlay-logo',
      );
      setSavedLogoImages(logoImage.pop());
    };
    getVerticalImageName();
    getHorizontalImageName();
    getDonationImageName();
    getLogoImageName();
  }, [
    broadcasterEmail,
    liveShoppingId,
    setSavedVerticalImages,
    setSavedHorizontalImages,
    setSavedFirstDonationImages,
    setSavedSecondDonationImages,
    isOpen,
  ]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>이미지 등록</ModalHeader>
          <ModalBody>
            <Text color="tomato">
              미리보기 이미지는 바로 변하지 않을 수 있습니다. <br /> 이미지 변경 후에
              미리보기가 변하지 않는다면 이미지를 클릭하여 확인하거나 새로고침 해보세요
            </Text>
            <Heading size="md">등록된 세로배너</Heading>
            <Stack>
              <HStack mr={2} mb={2}>
                {savedVerticalImages.length === 0 && (
                  <Text>등록된 이미지가 없습니다</Text>
                )}
                {savedVerticalImages.length !== 0 &&
                  savedVerticalImages.map((result) => {
                    return (
                      <VStack key={`saved-${result}`}>
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
                  세로배너 모두 삭제
                </Button>
              )}
            </Stack>
            <Divider mt={3} mb={3} />
            <Stack direction="row">
              {[savedFirstDonationImages, savedSecondDonationImages].map(
                (donationImage, index) => {
                  return (
                    <Stack key={donationImage}>
                      <Heading size="md">{`등록된 ${
                        index + 1
                      }단계 응원메세지 이미지`}</Heading>
                      <HStack mr={2} mb={2}>
                        {!donationImage && <Text>등록된 이미지가 없습니다</Text>}
                        {donationImage && (
                          <VStack>
                            <Link
                              isTruncated
                              href={`${S3_IMAGE_PREFIX}/${donationImage}`}
                              fontWeight="bold"
                              colorScheme="blue"
                              textDecoration="underline"
                              isExternal
                            >
                              <ChakraNextImage
                                layout="intrinsic"
                                src={`${S3_IMAGE_PREFIX}/${donationImage}`}
                                width={120}
                                height={70}
                              />
                            </Link>
                          </VStack>
                        )}
                      </HStack>
                      {donationImage && (
                        <Button
                          onClick={() => {
                            goBackAlertDialog.onOpen();
                            setSelectedBannerType(
                              index === 0 ? 'donation-images-1' : 'donation-images-2',
                            );
                          }}
                        >
                          {`${index + 1}단계 이미지 삭제`}
                        </Button>
                      )}
                    </Stack>
                  );
                },
              )}
            </Stack>
            <Divider mt={10} mb={10} />
            <Stack>
              <Heading size="md">등록된 로고이미지</Heading>
              <HStack mr={2} mb={2}>
                {!savedLogoImages && <Text>등록된 이미지가 없습니다</Text>}
                {savedLogoImages && (
                  <VStack>
                    <Link
                      isTruncated
                      href={`${S3_IMAGE_PREFIX}/${savedLogoImages}`}
                      fontWeight="bold"
                      colorScheme="blue"
                      textDecoration="underline"
                      isExternal
                    >
                      <ChakraNextImage
                        layout="intrinsic"
                        src={`${S3_IMAGE_PREFIX}/${savedLogoImages}`}
                        width={130}
                        height={54}
                      />
                    </Link>
                  </VStack>
                )}
              </HStack>
              {savedLogoImages && (
                <Button
                  onClick={() => {
                    goBackAlertDialog.onOpen();
                    setSelectedBannerType('overlay-logo');
                  }}
                >
                  로고 모두 삭제
                </Button>
              )}
            </Stack>
            <Divider mt={10} mb={10} />
            <Heading size="md">등록된 가로배너</Heading>
            <Stack>
              <HStack mr={2} mb={2}>
                {savedHorizontalImages.length === 0 && (
                  <Text>등록된 이미지가 없습니다</Text>
                )}
                {savedHorizontalImages.length !== 0 &&
                  savedHorizontalImages.map((result) => {
                    return (
                      <VStack key={`saved-${result}`}>
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
                            width={156}
                            height={56}
                          />
                        </Link>
                      </VStack>
                    );
                  })}
              </HStack>
              {savedHorizontalImages.length !== 0 && (
                <Button
                  onClick={() => {
                    goBackAlertDialog.onOpen();
                    setSelectedBannerType('horizontal-banner');
                  }}
                >
                  가로배너 모두 삭제
                </Button>
              )}
            </Stack>
            <Divider mt={3} mb={3} />
            <Stack>
              <Heading size="md">세로 배너 첨부</Heading>
              <Text>세로배너는 15장까지 등록가능합니다.</Text>
              <ImageInput
                multiple
                handleSuccess={(fileName, file) =>
                  handleSuccess(fileName, file, 'vertical-banner')
                }
                handleError={handleError}
                variant="chakra"
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
              <Stack direction="row">
                <Stack>
                  <Text>1단계 이미지</Text>
                  <ImageInput
                    multiple
                    handleSuccess={(fileName, file) =>
                      handleSuccess(fileName, file, 'donation-images-1')
                    }
                    handleError={handleError}
                    imageSizeLimit={20 * 1024 * 1024}
                    variant="chakra"
                  />
                  <Divider />
                  {/* 이미지 미리보기 목록 */}
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    {firstDonationPreviews.length !== 0 &&
                      firstDonationPreviews.map((preview) => {
                        const { id, filename, url } = preview;
                        return (
                          <GoodsPreviewItem
                            key={id}
                            id={id}
                            filename={filename}
                            url={(url as string) || ''}
                            width={60}
                            height={35}
                            onDelete={() => deletePreview(id, 'donation-images-1')}
                          />
                        );
                      })}
                  </Stack>
                </Stack>
                <Stack>
                  <Text>2단계 이미지</Text>
                  <ImageInput
                    multiple
                    handleSuccess={(fileName, file) =>
                      handleSuccess(fileName, file, 'donation-images-2')
                    }
                    handleError={handleError}
                    imageSizeLimit={20 * 1024 * 1024}
                    variant="chakra"
                  />
                  <Divider />
                  {/* 이미지 미리보기 목록 */}
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    {secondDonationPreviews.length !== 0 &&
                      secondDonationPreviews.map((preview) => {
                        const { id, filename, url } = preview;
                        return (
                          <GoodsPreviewItem
                            key={id}
                            id={id}
                            filename={filename}
                            url={(url as string) || ''}
                            width={60}
                            height={35}
                            onDelete={() => deletePreview(id, 'donation-images-2')}
                          />
                        );
                      })}
                  </Stack>
                </Stack>
              </Stack>
              <Stack>
                <Heading size="md">로고 첨부</Heading>
                <Text>로고는 1장까지 등록가능합니다.</Text>
                <ImageInput
                  multiple
                  handleSuccess={(fileName, file) =>
                    handleSuccess(fileName, file, 'overlay-logo')
                  }
                  handleError={handleError}
                  imageSizeLimit={20 * 1024 * 1024}
                  variant="chakra"
                />
                <Divider />
                {/* 이미지 미리보기 목록 */}
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  {logoPreviews.length !== 0 &&
                    logoPreviews.map((preview) => {
                      const { id, filename, url } = preview;
                      return (
                        <GoodsPreviewItem
                          key={id}
                          id={id}
                          filename={filename}
                          url={(url as string) || ''}
                          width={130}
                          height={54}
                          onDelete={() => deletePreview(id, 'overlay-logo')}
                        />
                      );
                    })}
                </Stack>
              </Stack>
              <Stack>
                <Heading size="md">가로 배너 첨부</Heading>
                <Text>가로배너는 15장까지 등록가능합니다.</Text>
                <ImageInput
                  multiple
                  handleSuccess={(fileName, file) =>
                    handleSuccess(fileName, file, 'horizontal-banner')
                  }
                  handleError={handleError}
                  variant="chakra"
                />
                <Divider />
                {/* 이미지 미리보기 목록 */}
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  {horizontalPreviews.length !== 0 &&
                    horizontalPreviews.map((preview) => {
                      const { id, filename, url } = preview;
                      return (
                        <GoodsPreviewItem
                          key={id}
                          id={id}
                          filename={filename}
                          url={(url as string) || ''}
                          width={156}
                          height={56}
                          onDelete={() => deletePreview(id, 'horizontal-banner')}
                        />
                      );
                    })}
                </Stack>
              </Stack>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={handleClose}>
              닫기
            </Button>
            <Button colorScheme="blue" onClick={uploadImage} isDisabled={isDisabled}>
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
            if (selectedBannerType === 'horizontal-banner') {
              await s3.s3DeleteImages(savedHorizontalImages);
              setSavedHorizontalImages([]);
            }
            if (selectedBannerType === 'donation-images-1') {
              await s3.s3DeleteImages([savedFirstDonationImages]);
              setSavedFirstDonationImages('');
            }
            if (selectedBannerType === 'donation-images-2') {
              await s3.s3DeleteImages([savedSecondDonationImages]);
              setSavedSecondDonationImages('');
            }
            if (selectedBannerType === 'overlay-logo') {
              await s3.s3DeleteImages([savedLogoImages]);
              setSavedLogoImages('');
            }
          }}
        >
          <Text mt={3}>이미지들을 삭제하시겠습니까?</Text>
        </ConfirmDialog>
      </Modal>
    </>
  );
}
