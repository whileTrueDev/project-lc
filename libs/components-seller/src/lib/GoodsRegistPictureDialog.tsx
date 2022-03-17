import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Button,
  Divider,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { ImageInput, ImageInputErrorTypes } from '@project-lc/components-core/ImageInput';
import { Preview, readAsDataURL } from '@project-lc/components-core/ImageInputDialog';
import { drawImageOnCanvas } from '@project-lc/components-shared/AvatarChangeButton';
import { useEffect, useRef, useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import { GoodsPreviewItem, MAX_PICTURE_COUNT, PREVIEW_SIZE } from './GoodsRegistPictures';

// * 상품사진 등록 모달 다이얼로그

export function GoodsRegistPictureDialog({
  isOpen,
  onClose,
  onSave,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (previews: Preview[], onSuccess?: () => void) => Promise<void>;
  isLoading: boolean;
}): JSX.Element {
  const toast = useToast();
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [currentPreview, setCurrentPreview] = useState<Preview | null>(
    previews[0] || null,
  );

  // 잘린 이미지
  const [croppedImageBase64Url, setCroppedImageBase64Url] = useState<string>('');

  // 사진 등록하기 다이얼로그 - 미리보기 이미지 삭제 핸들러
  const deletePreview = (id: number): void => {
    if (id === currentPreview?.id) {
      setCurrentPreview(null);
    }
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

  // 사진 등록 다이얼로그 - 닫기 핸들러
  const handleClose = (): void => {
    setPreviews([]);
    setCurrentPreview(null);
    onClose();
  };

  // previews array에서 posA, posB 인덱스에 있는 데이터를 바꿈
  const swap = (posA: number, posB: number): void => {
    const _previews = [...previews];
    [_previews[posA], _previews[posB]] = [_previews[posB], _previews[posA]];
    setPreviews(_previews);
  };

  // 이미지 크롭 영역 state
  const [crop, setCrop] = useState<Partial<Crop>>({
    unit: '%',
    width: 100,
    aspect: 1,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (document) {
      // 마운트 된 후 (document 존재할 때) 1회만 진행
      canvasRef.current = document.createElement('canvas');
    }
  }, []);

  const imageRef = useRef<HTMLImageElement | null>(null);
  // 이미지파일 불러왔을때 핸들러
  const onImageLoadedHandler = (imgElem: HTMLImageElement): void => {
    imageRef.current = imgElem;
  };

  // 크롭영역 선택 핸들러 -> 크롭된 이미지 state에 저장
  const onCropComplete = (_crop: Crop): void => {
    if (imageRef.current && canvasRef.current && _crop.width && _crop.height) {
      setCrop((exCrop) => ({ ...exCrop, height: _crop.height, width: _crop.width }));

      // 캔버스 요소에 크롭된 영역 이미지를 저장
      drawImageOnCanvas({ canvas: canvasRef.current, image: imageRef.current, _crop });

      // 크롭된 이미지를 dataURL형태로 저장
      const url = canvasRef.current.toDataURL();
      setCroppedImageBase64Url(url);
    }
  };

  const saveCroppedCurrentPreview = (): void => {
    if (!currentPreview || !croppedImageBase64Url || !canvasRef.current) return;

    // 크롭된 영역 이미지를 파일로 저장하기 위해 blob으로 변경
    canvasRef.current.toBlob((blob) => {
      if (!blob) {
        console.error('canvas empty');
        return;
      }
      setPreviews((list) => {
        return list.map((item) =>
          item.id === currentPreview.id
            ? {
                ...item,
                url: croppedImageBase64Url,
                file: new File([blob], item.filename, {
                  lastModified: new Date().getTime(),
                  type: blob.type,
                }), // s3에 저장할때는 잘린 이미지의 파일이 필요
              }
            : item,
        );
      });
    });
  };

  const revertCurrentPreview = (): void => {
    if (!currentPreview || !croppedImageBase64Url) return;
    setPreviews((list) => {
      return list.map((item) => {
        if (item.id === currentPreview.id) {
          return { ...item, url: currentPreview.url };
        }
        return item;
      });
    });
  };

  const onImageClick = (preview: Preview): void => {
    setCurrentPreview(preview);
    setCrop({ unit: '%', width: 100, aspect: 1, x: 0, y: 0 });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>등록할 상품 사진을 선택해주세요</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack>
            <Stack direction="row">
              <ImageInput
                multiple
                handleSuccess={handleSuccess}
                handleError={handleError}
                variant="chakra"
              />
            </Stack>

            <Divider />

            {/* 미리보기 영역 */}
            <Stack spacing={2} minH="150px">
              <Stack direction="row" alignItems="center">
                <Text>등록할 상품 사진 미리보기</Text>
                {previews.length > 0 && (
                  <Button
                    mr={3}
                    onClick={() => onSave(previews, handleClose)}
                    isLoading={isLoading}
                    colorScheme="blue"
                  >
                    모두 등록하기
                  </Button>
                )}
              </Stack>

              {/* 미리보기 영역 - 이미지 목록 */}
              <Stack direction="row" overflowX="auto" p={1}>
                {previews.length !== 0 &&
                  previews.map((preview, index) => {
                    const { id, filename, url } = preview;
                    return (
                      <GoodsPreviewItem
                        key={id}
                        id={id}
                        filename={filename}
                        url={(url as string) || ''}
                        {...PREVIEW_SIZE}
                        onDelete={() => deletePreview(id)}
                        onImageClick={() => onImageClick(preview)}
                        selected={currentPreview?.id === preview.id}
                        actionButtons={
                          <>
                            <IconButton
                              icon={<ChevronLeftIcon />}
                              size="xs"
                              disabled={index === 0}
                              onClick={() => {
                                swap(index - 1, index);
                              }}
                              aria-label="위"
                            />
                            <IconButton
                              icon={<ChevronRightIcon />}
                              size="xs"
                              disabled={index >= previews.length - 1}
                              onClick={() => {
                                swap(index + 1, index);
                              }}
                              aria-label="아래"
                            />
                          </>
                        }
                      />
                    );
                  })}
              </Stack>

              {previews.length > 0 && (
                <Text>이미지를 클릭하여 1:1비율로 자를 수 있습니다</Text>
              )}
            </Stack>

            <Divider />

            {/* 크롭 영역 */}

            {currentPreview && (
              <Stack alignItems="center">
                <Text textAlign="center">
                  원하는 부분을 선택한 후 적용하기 버튼을 누르면 미리보기 영역에
                  반영됩니다
                </Text>
                <Stack direction="row">
                  <Button
                    disabled={!croppedImageBase64Url}
                    onClick={saveCroppedCurrentPreview}
                  >
                    적용하기
                  </Button>
                  <Button onClick={revertCurrentPreview}>원래 이미지로 되돌리기</Button>
                </Stack>
                <ReactCrop
                  src={currentPreview.url as string}
                  crop={crop}
                  onChange={(newCrop) => setCrop(newCrop)}
                  onImageLoaded={onImageLoadedHandler}
                  onComplete={onCropComplete}
                />
              </Stack>
            )}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
