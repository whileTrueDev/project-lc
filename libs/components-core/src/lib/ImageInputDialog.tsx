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
  ModalProps,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ImageInput, ImageInputErrorTypes, ImageInputProps } from './ImageInput';

export type FileReaderResultType = string | ArrayBuffer | null;

export type Preview = {
  id: number;
  filename: string;
  url: FileReaderResultType;
  file: File;
};
/** File 데이터를 FileReader.readAsDataUrl로 변환 */
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

export type ImageInputFileReadData = {
  url: FileReaderResultType;
  filename: string;
  file: File;
};
/** 단일 이미지파일 등록 인풋 컴포넌트 및 미리보기 */
export interface ImageInputDialogProps
  extends Omit<ImageInputProps, 'handleSuccess' | 'handleError'>,
    Pick<ModalProps, 'isOpen' | 'onClose'> {
  onConfirm: (data: ImageInputFileReadData) => Promise<any>;
  onError?: (error: ImageInputErrorTypes) => any;
  modalTitle?: string;
}
export function ImageInputDialog({
  modalTitle,
  isOpen,
  onClose,
  onConfirm,
  onError,
  imageSizeLimit = 10,
  ...restProps
}: ImageInputDialogProps): JSX.Element {
  const toast = useToast();
  const imagePreviewBgColor = useColorModeValue('gray.200', 'gray.700');
  const [errMsg, setErrMsg] = useState('');
  const [imagePreview, setImagePreview] = useState<ImageInputFileReadData | null>(null);
  const handleSuccess = async (fileName: string, file: File): Promise<void> => {
    setErrMsg('');
    readAsDataURL(file).then(async ({ data }) => {
      const imageData = { url: data, filename: fileName, file };
      setImagePreview(imageData);
    });
  };

  const [loading, setLoading] = useState<boolean>(false);
  const handleRegist = (): void => {
    if (!imagePreview) return;
    setLoading(true);
    onConfirm(imagePreview)
      .then(() => {
        setLoading(false);
        setImagePreview(null);
        onClose();
      })
      .catch(() => {
        setLoading(false);
        toast({ status: 'error', description: '이미지 등록 중 오류가 발생했습니다.' });
      });
  };

  const handleClose = (): void => {
    setImagePreview(null);
    onClose();
  };

  const handleError = (error: ImageInputErrorTypes): void => {
    if (onError) onError(error);
    else {
      if (error === 'over-size') {
        setErrMsg(`최대크기(${imageSizeLimit}MB)를 초과하는 이미지입니다.`);
      }
      if (error === 'invalid-format') setErrMsg('올바른 형식의 이미지를 업로드해주세요.');
    }
    console.log(error);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        {modalTitle && <ModalHeader>{modalTitle}</ModalHeader>}

        <ModalCloseButton />
        <ModalBody>
          <Stack>
            <ImageInput
              {...restProps}
              handleSuccess={handleSuccess}
              handleError={handleError}
              imageSizeLimit={imageSizeLimit}
            />
            <Box
              mt={4}
              p={imagePreview ? 0 : 4}
              rounded="md"
              background={imagePreview ? 'transparent' : imagePreviewBgColor}
            >
              {imagePreview ? (
                <img src={imagePreview.url as string} alt={imagePreview.filename} />
              ) : (
                <Text>이미지 파일을 선택하여 등록할 이미지를 확인하세요.</Text>
              )}
              {errMsg ? <Text color="red">{errMsg}</Text> : null}
            </Box>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button
            isDisabled={!imagePreview}
            isLoading={loading}
            colorScheme="blue"
            mr={3}
            onClick={handleRegist}
          >
            등록하기
          </Button>
          <Button onClick={handleClose}>닫기</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ImageInputDialog;
