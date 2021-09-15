import { Text } from '@chakra-ui/react';
import { ImageInput, ImageInputErrorTypes } from './ImageInput';
import SectionWithTitle from './SectionWithTitle';

export function GoodsRegistPictures(): JSX.Element {
  const handleSuccess = (fileName: string, file: File) => {
    console.log({ fileName, file });
    // setValue() -> regist 시 s3.s3UploadImage
  };
  const handleError = (errorType?: ImageInputErrorTypes) => {
    console.log({ errorType });
  };
  return (
    <SectionWithTitle title="상품사진">
      <Text>사진</Text>
      <ImageInput handleSuccess={handleSuccess} handleError={handleError} />
    </SectionWithTitle>
  );
}

export default GoodsRegistPictures;
