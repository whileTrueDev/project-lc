import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { KkshowShoppingTabResData } from '@project-lc/shared-types';
import { memo } from 'react';
import { useFormContext } from 'react-hook-form';

export interface AdminKkshowShoppingReviewsProps {
  index: number;
}

export function AdminKkshowShoppingReviews({
  index,
}: AdminKkshowShoppingReviewsProps): JSX.Element {
  const fieldWidth = 55;
  const { register, watch } = useFormContext<KkshowShoppingTabResData>();

  const FieldHeader = memo(
    ({ header, isRequired }: { header: string; isRequired?: boolean }): JSX.Element => (
      <Heading fontSize="lg" fontWeight="bold">
        {header}
        {isRequired && (
          <Text as="span" color="red">
            *
          </Text>
        )}
      </Heading>
    ),
  );

  return (
    <Box>
      <Flex w="100%" gap={3} mt={3}>
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
          <Image maxW={150} src={watch(`reviews.${index}.imageUrl`)} rounded="2xl" />
        </Stack>
        <Stack minW={300}>
          <Box>
            <FieldHeader header="이미지 주소" isRequired />
            <Text fontSize="xs" color="GrayText">
              이미지 주소를 입력하거나 새로운 이미지를 업로드할 수 있습니다.
            </Text>
          </Box>
          <Input
            minW={200}
            {...register(`reviews.${index}.imageUrl`, { required: true })}
            isRequired
          />
        </Stack>
        <Stack minW={300}>
          <Box>
            <FieldHeader header="이동링크주소" isRequired />

            <Text fontSize="xs" color="GrayText">
              이미지 클릭시 이동될 링크 주소를 입력하세요.
            </Text>
          </Box>
          <Input
            {...register(`reviews.${index}.linkUrl`, { required: true })}
            isRequired
          />
        </Stack>
        <Stack maxW={400} w="100%">
          <Box>
            <FieldHeader header="후기정보" isRequired />
            <Text fontSize="xs" color="GrayText">
              후기 정보를 입력해주세요
            </Text>
          </Box>
          <FormControl as={Flex} align="center" isRequired>
            <FormLabel minW={fieldWidth} m={0} htmlFor="후기 제목" fontSize="xs">
              후기 제목
            </FormLabel>
            <Input {...register(`reviews.${index}.title`, { required: true })} />
          </FormControl>
          <FormControl as={Flex} align="center" isRequired>
            <FormLabel minW={fieldWidth} m={0} htmlFor="후기 내용" fontSize="xs">
              후기 내용
            </FormLabel>
            <Textarea {...register(`reviews.${index}.contents`, { required: true })} />
          </FormControl>
          <FormControl as={Flex} align="center" isRequired>
            <FormLabel minW={fieldWidth} m={0} htmlFor="날짜" fontSize="xs">
              날짜
            </FormLabel>
            <Input
              {...register(`reviews.${index}.createDate`, { required: true })}
              type="date"
            />
          </FormControl>
          <FormControl as={Flex} align="center" isRequired>
            <FormLabel minW={fieldWidth} m={0} htmlFor="별점" fontSize="xs">
              별점
            </FormLabel>
            <Input
              {...register(`reviews.${index}.rating`, { required: true })}
              type="number"
              min={0}
              max={5}
              step={0.5}
            />
          </FormControl>
        </Stack>
      </Flex>
    </Box>
  );
}

export default AdminKkshowShoppingReviews;
