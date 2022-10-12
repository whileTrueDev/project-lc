import { ObjectIdentifier } from '@aws-sdk/client-s3';
import {
  useToast,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Heading,
  Stack,
  HStack,
  VStack,
  ModalFooter,
  Text,
  Modal,
  Link,
  Button,
  Divider,
} from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import { ImageInput } from '@project-lc/components-core/ImageInput';
import { Preview, readAsDataURL } from '@project-lc/components-core/ImageInputDialog';
import { GoodsPreviewItem } from '@project-lc/components-seller/goods-regist/GoodsRegistPictures';
import { s3 } from '@project-lc/utils-s3';
import { useState, useEffect, useRef } from 'react';

async function getSavedImages(liveShoppingId: number): Promise<(string | undefined)[]> {
  // 오버레이 이미지 저장된 폴더
  const overlayImagePrefix = `sales-guide-image/${liveShoppingId}`;
  const { contents } = await s3.sendListObjectCommand({ Prefix: overlayImagePrefix });
  const imagesKeyList = contents?.map((item) => {
    return item.Key;
  });

  return imagesKeyList || [];
}

async function uploadImageToS3(
  imageFile: { file: File | Buffer; filename: string; id: number; contentType: string },
  liveShoppingId: number,
): Promise<string> {
  const { file, filename, contentType } = imageFile;

  const objectTagKey = 'overlayImageType';
  const objectTagValue = 'sales-guide-image';

  if (objectTagKey && !objectTagValue) {
    throw new Error('No value Error');
  }
  const key = `sales-guide-image/${liveShoppingId}/${filename}`;
  const { objectUrl } = await s3.sendPutObjectCommand({
    ACL: 'public-read',
    Key: key,
    Body: file,
    ContentType: contentType,
    Tagging: `${objectTagKey}=${objectTagValue}`,
  });
  return objectUrl;
}

export interface AdminLiveShoppingSalesGuideImageUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  liveShoppingId: number;
}
export function AdminLiveShoppingSalesGuideImageUploadDialog({
  isOpen,
  onClose,
  liveShoppingId,
}: AdminLiveShoppingSalesGuideImageUploadDialogProps): JSX.Element {
  const toast = useToast();
  const maxCount = useRef<number>(5);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [savedImages, setSavedImages] = useState<(string | undefined)[]>([]);
  const goBackAlertDialog = useDisclosure();

  const numberOfSavedImages = savedImages.length;
  // 사진 등록하기 다이얼로그 - 파일업로드 인풋 성공 핸들러 -> 미리보기 previews에 이미지 추가
  const handleSuccess = (fileName: string, file: File): void => {
    readAsDataURL(file).then(({ data }) => {
      setPreviews((list) => {
        const id =
          list.length === 0 ? numberOfSavedImages + 1 : list[list.length - 1].id + 1;
        const newList = [
          ...list,
          { id, url: data, filename: `sales-guide-image-${id}`, file },
        ];
        return newList;
      });
    });
  };

  const uploadImage = async (): Promise<void> => {
    try {
      if (numberOfSavedImages + previews.length > maxCount.current) {
        throw new Error(`판매가이드 이미지는 ${maxCount.current}개까지 등록가능합니다.`);
      }
      if (!previews.length) {
        throw new Error('등록된 이미지가 없습니다');
      }

      setIsDisabled(true);

      await Promise.all(
        previews.map((item) => {
          const { file } = item;
          return uploadImageToS3({ ...item, contentType: file.type }, liveShoppingId);
        }),
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

  // 사진 등록하기 다일얼로그 - 파일업로드 인풋 에러 핸들러
  const handleError = (): void => {
    toast({
      title: `이미지 파일을 선택해주세요`,
      status: 'warning',
    });
  };

  // 사진 등록하기 다이얼로그 - 미리보기 이미지 삭제 핸들러
  const deletePreview = (id: number): void => {
    setPreviews((list) => {
      const filtered = list.filter((item) => item.id !== id);
      const idReassignImages = filtered.map((item, index) => {
        const nextIndex = index + numberOfSavedImages + 1;
        const newImageList = {
          ...item,
          id: nextIndex,
          filename: `sales-guide-image-${nextIndex}`,
        };
        return newImageList;
      });
      return idReassignImages;
    });
  };

  // 사진 등록하기 다일얼로그 - 닫기 핸들러
  const handleClose = (): void => {
    setIsDisabled(false);
    setPreviews([]);
    onClose();
  };

  useEffect(() => {
    const getImageName = async (): Promise<void> => {
      const existImages = await getSavedImages(liveShoppingId);
      setSavedImages(existImages);
    };

    getImageName();
  }, [liveShoppingId, isOpen]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>판매가이드 이미지 등록</ModalHeader>
          <ModalBody>
            <Stack spacing={4}>
              <Text color="tomato">
                미리보기 이미지는 바로 변하지 않을 수 있습니다. <br /> 이미지 변경 후에
                미리보기가 변하지 않는다면 이미지를 클릭하여 확인하거나 새로고침 해보세요
              </Text>
              <Divider />
              <Stack>
                <Heading size="md">등록된 판매가이드</Heading>
                <HStack mr={2} mb={2}>
                  {savedImages.length === 0 && <Text>등록된 이미지가 없습니다</Text>}
                  {savedImages.length !== 0 &&
                    savedImages.map((result) => {
                      return (
                        <VStack key={`saved-${result}`}>
                          <Link
                            isTruncated
                            href={`${s3.bucketDomain}${result}`}
                            fontWeight="bold"
                            colorScheme="blue"
                            textDecoration="underline"
                            isExternal
                          >
                            <ChakraNextImage
                              layout="intrinsic"
                              src={`${s3.bucketDomain}${result}`}
                              width={100}
                              height={90}
                            />
                          </Link>
                        </VStack>
                      );
                    })}
                </HStack>
                {savedImages.length !== 0 && (
                  <Button onClick={goBackAlertDialog.onOpen}>
                    판매가이드 이미지 모두 삭제
                  </Button>
                )}
              </Stack>
              <Divider />
              <Stack>
                <Heading size="md">판매가이드 이미지 첨부</Heading>
                <Text>판매가이드는 {maxCount.current}장까지 등록가능합니다.</Text>
                <Text color="tomato">
                  판매가이드 이미지 크기는 가로 600px, 세로 550px 입니다
                </Text>
                <ImageInput
                  multiple
                  handleSuccess={(fileName, file) => handleSuccess(fileName, file)}
                  handleError={handleError}
                  variant="chakra"
                />

                {/* 이미지 미리보기 목록 */}
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Text>미리보기</Text>
                  {previews.length !== 0 &&
                    previews.map((preview) => {
                      const { id, filename, url } = preview;
                      return (
                        <GoodsPreviewItem
                          key={id}
                          id={id}
                          filename={filename}
                          url={(url as string) || ''}
                          width={50}
                          height={45}
                          onDelete={() => deletePreview(id)}
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
            const deleteObjectIdentifiers: ObjectIdentifier[] = savedImages.map((i) => {
              return { Key: i };
            });
            await s3.sendDeleteObjectsCommand({
              deleteObjects: deleteObjectIdentifiers,
            });
            setSavedImages([]);
          }}
        >
          <Text mt={3}>이미지들을 삭제하시겠습니까?</Text>
        </ConfirmDialog>
      </Modal>
    </>
  );
}

export default AdminLiveShoppingSalesGuideImageUploadDialog;
