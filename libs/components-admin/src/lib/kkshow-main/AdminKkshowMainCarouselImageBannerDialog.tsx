import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import { ImageInput, ImageInputErrorTypes } from '@project-lc/components-core/ImageInput';
import {
  ImageInputDialogProps,
  ImageInputFileReadData,
  readAsDataURL,
} from '@project-lc/components-core/ImageInputDialog';
import { getCroppedImage } from '@project-lc/utils-frontend';
import { useRef, useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export type ImageBannerDialogProps = ImageInputDialogProps;

type cropType = 'default' | 'recommend';
// 크롭영역
// aspect(비율) 값이 있으면 비율 고정
// unit : px 인경우 wight: 100 = 100px 로 계산, % 인 경우  width : 100 => 100%로 계산됨
const CROP: Record<cropType, Partial<Crop>> = {
  default: { unit: '%' as const, width: 100, height: 56 }, // 기본값 -> 관리자에서 캐러셀 이미지 16/9 비율로만 입력할 수 있도록 고정하기 위해 지금은 사용안함
  recommend: { aspect: 16 / 9, unit: '%' as const, width: 100 }, // 권장값
};

const RECOMMEND_IMAGE_SIZE = {
  width: 720,
  height: 400,
};

/** 크크쇼 메인 캐러셀에 표시될 단일 이미지 등록 컴포넌트
 * 이미지 크롭기능
 */
export function AdminKkshowMainCarouselImageBannerDialog(
  props: ImageBannerDialogProps,
): JSX.Element {
  const { modalTitle, isOpen, onClose, onConfirm, onError, ...restProps } = props;

  const [imagePreview, setImagePreview] = useState<ImageInputFileReadData | null>(null);

  // 이미지 크롭 영역 state
  const [crop, setCrop] = useState<Partial<Crop>>(CROP.recommend);

  const imageRef = useRef<HTMLImageElement | null>(null);

  // 잘린 블롭 데이터
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);

  // 이미지파일 불러왔을때 핸들러
  const onImageLoadedHandler = (_image: HTMLImageElement): void => {
    imageRef.current = _image;
  };

  // ImageInput 이미지 불러오기 성공시 핸들러
  const handleSuccess = async (fileName: string, file: File): Promise<void> => {
    readAsDataURL(file).then(async ({ data }) => {
      const imageData = { url: data, filename: fileName, file };
      setImagePreview(imageData);
    });
  };

  // ImageInput 이미지 불러오기 에러 핸들러
  const handleError = (error: ImageInputErrorTypes): void => {
    if (onError) onError(error);
    console.log(error);
  };

  // 크롭영역 선택 핸들러 -> 크롭된 이미지 state에 저장
  const onCropComplete = (_crop: Crop): void => {
    if (imageRef.current && _crop.width && _crop.height) {
      getCroppedImage(imageRef.current, _crop, (blob) => {
        if (!blob) {
          console.error('canvas is empty');
          return;
        }
        // 크롭된 이미지 blob저장
        setCroppedBlob(blob);
      });
    }
  };

  // 모달 - 등록 핸들러
  const handleRegist = (): void => {
    if (!croppedBlob || !imagePreview) return;

    // 잘린 이미지 blob을 파일로 만듦
    const croppedImageFile = new File([croppedBlob], imagePreview.filename);

    const croppedImage: ImageInputFileReadData = {
      url: null, // onConfirm에서 안씀
      filename: imagePreview.filename,
      file: croppedImageFile,
    };

    onConfirm(croppedImage).then(() => {
      handleClose();
    });
  };

  // 모달 - 닫기 핸들러
  const handleClose = (): void => {
    setCroppedBlob(null);
    setImagePreview(null);
    setCrop(CROP.recommend);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        {modalTitle && <ModalHeader>{modalTitle}</ModalHeader>}

        <ModalCloseButton />
        <ModalBody>
          <Stack>
            <Text color="blue.500" fontWeight="bold">
              권장 사이즈를 벗어나면 이미지가 잘리거나 작게 표시됩니다!
            </Text>
            <Text color="blue.500" fontWeight="bold">
              권장 사이즈: 가로 {RECOMMEND_IMAGE_SIZE.width}px, 세로{' '}
              {RECOMMEND_IMAGE_SIZE.height}px
            </Text>
            <ImageInput
              {...restProps}
              handleSuccess={handleSuccess}
              handleError={handleError}
            />
            {imagePreview ? (
              <Stack>
                {imageRef.current && (
                  <Box>
                    <Text>선택 영역 이미지 크기</Text>
                    <Text fontWeight="bold">
                      가로 : {crop.width?.toFixed(2)}px, 세로 : {crop.height?.toFixed(2)}
                      px
                    </Text>
                  </Box>
                )}

                <Stack direction="row">
                  <Text>
                    이미지를 드래그하여 배너 이미지로 사용할 영역을 선택해주세요
                  </Text>
                </Stack>

                <Box>
                  <ReactCrop
                    src={imagePreview.url as string}
                    crop={crop}
                    onChange={(newCrop) => {
                      setCrop(newCrop);
                    }}
                    onImageLoaded={onImageLoadedHandler}
                    onComplete={onCropComplete}
                  />
                </Box>
              </Stack>
            ) : (
              <Text>캐러셀에 들어갈 배너 이미지를 선택해주세요</Text>
            )}
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleRegist}
            disabled={!croppedBlob}
          >
            등록하기
          </Button>
          <Button variant="ghost" onClick={handleClose}>
            닫기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AdminKkshowMainCarouselImageBannerDialog;
