const MB = 1024 * 1024; // 1Mbytes
const IMAGE_SIZE_LIMIT = 5 * MB;

export function FileInput(props: any): JSX.Element {
  const { setError, setValue } = props;

  const readImage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    if (files.length !== 0) {
      const fileRegx = /^image\/[a-z]*$/;
      const myImage = files[0];
      // image 확장자 검사
      if (fileRegx.test(myImage.type)) {
        // 이미지 사이즈 검사
        if (myImage.size < IMAGE_SIZE_LIMIT) {
          // 사이즈 제한보다 작은 경우
          const reader = new FileReader();
          reader.readAsDataURL(myImage);
          reader.onload = (): void => {
            setValue('businessRegistrationImage', reader.result);
            setError('businessRegistrationImage', null);
          };
        } else {
          // 사이즈 제한보다 큰 경우
          setError('businessRegistrationImage', {
            type: 'validate',
            message: '10MB 이하의 이미지를 업로드해주세요.',
          });
        }
      } else {
        setError('businessRegistrationImage', {
          type: 'error',
          message: '파일의 형식이 올바르지 않습니다.',
        });
      }
    } else {
      setValue('businessRegistrationImage', null);
      setError('businessRegistrationImage', {
        type: 'error',
        message: '사업자 등록증 이미지는 반드시 제출해야합니다.',
      });
    }
  };

  return (
    <input
      style={{ margin: '15px' }}
      required
      accept="image/*"
      type="file"
      onChange={(e): void => {
        readImage(e);
      }}
      {...props}
    />
  );
}
