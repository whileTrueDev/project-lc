import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Heading,
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
import { memo } from 'react';
import { useFormContext } from 'react-hook-form';

export interface AdminKkshowShoppingCarouselProps {
  index: number;
}
export function AdminKkshowShoppingCarousel({
  index,
}: AdminKkshowShoppingCarouselProps): JSX.Element {
  const imageUploadDialog = useDisclosure();
  const { register, watch, setValue } = useFormContext<KkshowShoppingTabResData>();

  const FieldHeader = memo(
    ({ header }: { header: string }): JSX.Element => (
      <Heading fontSize="lg" fontWeight="bold">
        {header}
      </Heading>
    ),
  );

  const handleConfirm = async (imageData: ImageInputFileReadData): Promise<void> => {
    const timestamp = new Date().getTime();
    const s3KeyType = 'kkshow-shopping-carousel-images';
    const key = path.join(s3KeyType, `${timestamp}_${imageData.filename}`);

    const { objectUrl } = await s3.sendPutObjectCommand({
      Key: key,
      Body: imageData.file,
      ContentType: imageData.file.type,
      ACL: 'public-read',
    });
    setValue(`carousel.${index}.imageUrl`, objectUrl, { shouldDirty: true });
  };

  return (
    <Box>
      <Text>
        Tip. 캐러셀 이미지의 크기는 가로 1000px, 세로 500px 으로 구성하는 것이
        바람직합니다.
      </Text>
      <Flex gap={3} mt={3}>
        <Box textAlign="center">
          <FieldHeader header="순서" />
          <Heading
            p={1}
            rounded="lg"
            as="p"
            fontSize="md"
            bgColor="blue.500"
            color="white"
          >
            {index + 1}
          </Heading>
        </Box>
        <Stack>
          <FieldHeader header="이미지" />
          <Image width={200} src={watch(`carousel.${index}.imageUrl`)} />
        </Stack>
        <Stack minW={300}>
          <Box>
            <FieldHeader header="이미지 주소" />
            <Text fontSize="xs" color="GrayText">
              이미지 주소를 입력하거나 새로운 이미지를 업로드할 수 있습니다.
            </Text>
          </Box>
          <Input minW={200} {...register(`carousel.${index}.imageUrl` as const)} />
          <Button leftIcon={<AddIcon />} onClick={imageUploadDialog.onOpen}>
            이미지 업로드
          </Button>
        </Stack>
        <Stack minW={300}>
          <Box>
            <FieldHeader header="이동링크주소" />

            <Text fontSize="xs" color="GrayText">
              이미지 클릭시 이동될 링크 주소를 입력하세요.
            </Text>
          </Box>
          <Input {...register(`carousel.${index}.linkUrl` as const)} />
        </Stack>
      </Flex>

      <ImageInputDialog
        isOpen={imageUploadDialog.isOpen}
        onClose={imageUploadDialog.onClose}
        onConfirm={handleConfirm}
      />
    </Box>
  );
}

export default AdminKkshowShoppingCarousel;
