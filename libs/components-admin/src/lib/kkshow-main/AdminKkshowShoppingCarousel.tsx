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
import { ImageInput } from '@project-lc/components-core/ImageInput';
import { KkshowShoppingTabResData } from '@project-lc/shared-types';
import { memo } from 'react';
import { useFormContext } from 'react-hook-form';

export interface AdminKkshowShoppingCarouselProps {
  index: number;
}
export function AdminKkshowShoppingCarousel({
  index,
}: AdminKkshowShoppingCarouselProps): JSX.Element {
  const { register, watch } = useFormContext<KkshowShoppingTabResData>();
  const editMode = useDisclosure();

  const FieldHeader = memo(
    ({ header }: { header: string }): JSX.Element => (
      <Heading
        fontSize="lg"
        fontWeight="bold"
        color={editMode.isOpen ? 'green' : 'unset'}
      >
        {header}
      </Heading>
    ),
  );

  return (
    <Box>
      <Button
        variant="outline"
        colorScheme={editMode.isOpen ? 'green' : undefined}
        size="sm"
        onClick={editMode.onToggle}
      >
        {!editMode.isOpen ? '수정모드OFF' : '수정모드ON'}
      </Button>
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
          <Box>
            <FieldHeader header="이미지" />
            <Text fontSize="xs" color="GrayText">
              이미지를 클릭해 더 큰화면으로 확인할 수 있습니다.
            </Text>
          </Box>
          {/* <Image width={200} src={watch(`carousel.${index}.imageUrl`)} /> */}
        </Stack>
        <Stack minW={300}>
          <Box>
            <FieldHeader header="이미지 주소" />

            <Text fontSize="xs" color="GrayText">
              이미지 주소를 입력하거나 이미지를 업로드할 수 있습니다.
            </Text>
          </Box>
          <Input
            minW={200}
            readOnly={!editMode.isOpen}
            {...register(`carousel.${index}.imageUrl` as const)}
          />
          <ImageInput
            handleError={() => {
              alert('image error');
            }}
            handleSuccess={(image, file) => {
              alert(`image upload success: ${image}`);
              // s3 업로드
              // 미리보기
            }}
            variant="chakra"
            title="이미지 업로드"
            isDisabled={!editMode.isOpen}
          />
        </Stack>
        <Stack minW={300}>
          <Box>
            <FieldHeader header="이동링크주소" />

            <Text fontSize="xs" color="GrayText">
              이미지 클릭시 이동될 링크 주소를 입력하세요.
            </Text>
          </Box>
          <Input
            readOnly={!editMode.isOpen}
            {...register(`carousel.${index}.linkUrl` as const)}
          />
        </Stack>
      </Flex>
    </Box>
  );
}

export default AdminKkshowShoppingCarousel;
