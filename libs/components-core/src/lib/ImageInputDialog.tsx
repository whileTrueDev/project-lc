import {
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
export function ImageInputDialog(props: ImageInputDialogProps): JSX.Element {
  const { modalTitle, isOpen, onClose, onConfirm, onError, ...restProps } = props;

  const [imagePreview, setImagePreview] = useState<ImageInputFileReadData | null>(null);

  const handleSuccess = async (fileName: string, file: File): Promise<void> => {
    readAsDataURL(file).then(async ({ data }) => {
      const imageData = { url: data, filename: fileName, file };
      setImagePreview(imageData);
    });
  };

  const handleRegist = (): void => {
    if (!imagePreview) return;
    onConfirm(imagePreview).then(() => {
      setImagePreview(null);
      onClose();
    });
  };

  const handleClose = (): void => {
    setImagePreview(null);
    onClose();
  };

  const handleError = (error: ImageInputErrorTypes): void => {
    if (onError) onError(error);
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
            />
            {imagePreview ? (
              <img src={imagePreview.url as string} alt={imagePreview.filename} />
            ) : (
              <Text>이미지 파일을 선택하여 등록할 이미지를 확인하세요</Text>
            )}
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleRegist}>
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

export default ImageInputDialog;
