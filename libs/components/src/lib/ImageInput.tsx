import { BusinessRegistrationFormProps } from './BusinessRegistrationForm';

export const MB = 1024 * 1024; // 1Mbytes
const IMAGE_SIZE_LIMIT = 5 * MB;

export type ImageInputErrorTypes = 'over-size' | 'invalid-format' | undefined;

type ImageInputProps = {
  handleSuccess: (fileName: string, file: File) => void;
  handleError: (errorType?: ImageInputErrorTypes) => void;
};

export function ImageInput(props: ImageInputProps): JSX.Element {
  const { handleSuccess, handleError } = props;

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

  return (
    <input
      style={{ margin: '15px' }}
      accept="image/*"
      type="file"
      required
      onChange={(e): void => {
        readImage(e);
      }}
    />
  );
}
