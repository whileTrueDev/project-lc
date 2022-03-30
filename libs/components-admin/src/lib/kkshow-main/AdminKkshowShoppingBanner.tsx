import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import ImageInputDialog, {
  ImageInputFileReadData,
} from '@project-lc/components-core/ImageInputDialog';
import { KkshowShoppingTabResData } from '@project-lc/shared-types';
import { s3 } from '@project-lc/utils-s3';
import path from 'path';
import { useFormContext } from 'react-hook-form';

export function AdminKkshowShoppingBanner(): JSX.Element {
  const dialog = useDisclosure();
  const { register, setValue, watch } = useFormContext<KkshowShoppingTabResData>();

  const handleImageRegister = async (
    imageData: ImageInputFileReadData,
  ): Promise<void> => {
    const timestamp = new Date().getTime();
    const s3KeyType = 'kkshow-shopping-banner-images';
    const key = path.join(s3KeyType, `${timestamp}_${imageData.filename}`);

    const { objectUrl } = await s3.sendPutObjectCommand({
      Key: key,
      Body: imageData.file,
      ContentType: imageData.file.type,
      ACL: 'public-read',
    });
    setValue(`banner.imageUrl`, objectUrl, { shouldDirty: true });
  };

  return (
    <Flex flexWrap="wrap" gap={4}>
      <Stack maxW={600} w="100%">
        <FormControl>
          <FormLabel fontWeight="bold">메시지</FormLabel>
          <FormLabel fontSize="xs" color="GrayText">
            배너에 보여질 메시지로, 메시지가 긴 경우 짤리거나 이상하게 보일 수 있습니다
          </FormLabel>
          <Input {...register('banner.message')} />
        </FormControl>

        <FormControl>
          <FormLabel fontWeight="bold">링크</FormLabel>
          <FormLabel fontSize="xs" color="GrayText">
            배너 클릭시 이동할 링크를 입력하세요. 크크쇼 내부로 이동될 경우 /where-to-go
            와 같은 형식으로 작성할 수 있습니다.
          </FormLabel>
          <Input {...register('banner.linkUrl')} />
        </FormControl>

        <FormControl>
          <FormLabel fontWeight="bold">우측 꾸밈 이미지</FormLabel>
          <FormLabel fontSize="xs" color="GrayText">
            이미 업로드된 이미지 주소를 입력하거나 새로운 이미지를 등록하세요
          </FormLabel>
          <Input {...register('banner.imageUrl')} />
        </FormControl>
        <Image w={150} src={watch('banner.imageUrl')} />
        <Button onClick={dialog.onOpen}>이미지 등록</Button>
      </Stack>

      <ImageInputDialog
        isOpen={dialog.isOpen}
        onClose={dialog.onClose}
        onConfirm={handleImageRegister}
      />
    </Flex>
  );
}
