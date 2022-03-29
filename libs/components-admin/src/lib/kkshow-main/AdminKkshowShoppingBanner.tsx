import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Stack,
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
    const s3KeyType = 'kkshow-shopping-banner-iamges';
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
          <Input {...register('banner.message')} />
        </FormControl>

        <FormControl>
          <FormLabel fontWeight="bold">링크</FormLabel>
          <Input {...register('banner.linkUrl')} />
        </FormControl>

        <FormControl>
          <FormLabel fontWeight="bold">우측 꾸밈 이미지</FormLabel>
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
