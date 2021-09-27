import { Button, ButtonProps, InputGroup } from '@chakra-ui/react';
import { useRef } from 'react';
import { FiFile } from 'react-icons/fi';

export const MB = 1024 * 1024; // 1Mbytes
const IMAGE_SIZE_LIMIT = 5 * MB;

export type ImageInputErrorTypes = 'over-size' | 'invalid-format' | undefined;

type ImageInputProps = {
  handleSuccess: (fileName: string, file: File) => void;
  handleError: (errorType?: ImageInputErrorTypes) => void;
  required?: boolean;
  variant?: 'unstype' | 'chakra';
  size?: ButtonProps['size'];
};

export function ImageInput({
  handleSuccess,
  handleError,
  required = true,
  variant = 'unstype',
  size,
}: ImageInputProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const readImage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    if (files.length !== 0) {
      const fileRegx = /^image\/[a-z]*$/;
      const myImage = files[0];
      const imageName = myImage.name;
      // image 확장자 검사
      if (fileRegx.test(myImage.type)) {
        // 이미지 사이즈 검사
        if (myImage.size < IMAGE_SIZE_LIMIT) {
          handleSuccess(imageName, myImage);
        } else {
          // 사이즈 제한보다 큰 경우
          handleError('over-size');
        }
      } else {
        handleError('invalid-format');
      }
    } else {
      // only chrome
      handleError();
    }
  };

  if (variant === 'chakra') {
    return (
      <InputGroup>
        <input
          ref={inputRef}
          type="file"
          name="project-lc-image-upload"
          accept="image/*"
          onChange={(e) => readImage(e)}
          style={{ display: 'none' }}
        />
        <Button
          size={size}
          rightIcon={<FiFile />}
          onClick={() => inputRef.current?.click()}
        >
          파일 업로드
        </Button>
      </InputGroup>
    );
  }

  return (
    <input
      style={{ maxWidth: 300 }}
      accept="image/*"
      type="file"
      required={required}
      onChange={(e): void => {
        readImage(e);
      }}
    />
  );
}
