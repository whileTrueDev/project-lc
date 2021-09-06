import { BusinessRegistrationFormProps } from './BusinessRegistrationForm';

const MB = 1024 * 1024; // 1Mbytes
const IMAGE_SIZE_LIMIT = 5 * MB;

export function FileInput(
  props: Pick<BusinessRegistrationFormProps, 'seterror' | 'setvalue' | 'clearErrors'>,
): JSX.Element {
  const { seterror, setvalue, clearErrors } = props;

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
          setvalue('businessRegistrationImage', myImage);
          setvalue('imageName', imageName);
          clearErrors(['businessRegistrationImage', 'imageName']);
        } else {
          // 사이즈 제한보다 큰 경우
          seterror('businessRegistrationImage', {
            type: 'validate',
            message: '10MB 이하의 이미지를 업로드해주세요.',
          });
        }
      } else {
        seterror('businessRegistrationImage', {
          type: 'error',
          message: '파일의 형식이 올바르지 않습니다.',
        });
      }
    } else {
      // only chrome
      setvalue('businessRegistrationImage', null);
      setvalue('imageName', null);
      clearErrors(['businessRegistrationImage', 'imageName']);
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
