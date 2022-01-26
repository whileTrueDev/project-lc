import { Button, ButtonProps, InputGroup } from '@chakra-ui/react';
import { useRef } from 'react';
import { FiFile } from 'react-icons/fi';

export const MB = 1024 * 1024; // 1Mbytes

export type ImageInputErrorTypes = 'over-size' | 'invalid-format' | undefined;

type ImageInputProps = {
  handleSuccess: (
    fileName: string,
    file: File,
    type?:
      | 'vertical-banner'
      | 'donation-images-1'
      | 'donation-images-2'
      | 'overlay-logo'
      | 'horizontal-banner',
  ) => void;
  handleError: (errorType?: ImageInputErrorTypes) => void;
  variant?: 'unstyle' | 'chakra';
  size?: ButtonProps['size'];
  imageSizeLimit?: number; // 업로드 파일 용량 제한
  type?:
    | 'vertical-banner'
    | 'donation-images-1'
    | 'donation-images-2'
    | 'overlay-logo'
    | 'horizontal-banner';
} & Pick<React.HTMLProps<HTMLButtonElement>, 'required' | 'multiple'>;

export function ImageInput({
  handleSuccess,
  handleError,
  required = true,
  variant = 'unstyle',
  multiple = false,
  imageSizeLimit = 10 * MB, // 이미지 파일 크기 제한 기본 10mb
  size,
  type,
}: ImageInputProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  const fileRegx = /^image\/[a-z]*$/;
  const handleImageFile = (myImage: File): void => {
    const { name: imageName } = myImage;
    // image 확장자 검사
    if (fileRegx.test(myImage.type) === false) {
      handleError('invalid-format');
      return;
    }
    // 사이즈 제한보다 큰 경우
    if (myImage.size > imageSizeLimit) {
      handleError('over-size');
      return;
    }

    // 확장자, 이미지 사이즈 검사 통과한 경우
    handleSuccess(imageName, myImage, type);
  };

  const readImage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;

    if (files.length === 0) {
      // only chrome
      handleError();
      return;
    }

    // 사진 1개씩만 선택 가능한 경우
    if (!multiple) {
      handleImageFile(files[0]);
    } else {
      // 사진 여러개 선택 가능한 경우
      for (let i = 0; i < files.length; i++) {
        const imgFile = files.item(i);
        if (imgFile) handleImageFile(imgFile);
      }
    }
  };

  if (variant === 'chakra') {
    return (
      <InputGroup>
        <input
          ref={inputRef}
          multiple={multiple}
          type="file"
          name="project-lc-image-upload"
          accept="image/*"
          onChange={(e) => readImage(e)}
          style={{ display: 'none' }}
        />
        <Button
          size={size}
          leftIcon={<FiFile />}
          onClick={() => inputRef.current?.click()}
        >
          사진 업로드
        </Button>
      </InputGroup>
    );
  }

  return (
    <input
      style={{ maxWidth: 300 }}
      accept="image/*"
      multiple={multiple}
      type="file"
      required={required}
      onChange={(e): void => {
        readImage(e);
      }}
    />
  );
}
