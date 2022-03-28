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
} from '@chakra-ui/react';
import { KkshowShoppingTabResData } from '@project-lc/shared-types';
import { memo } from 'react';
import { useFormContext } from 'react-hook-form';

export interface AdminKkshowShoppingGoodsProps {
  index: number;
  type: Exclude<keyof KkshowShoppingTabResData, 'carousel' | 'reviews' | 'keywords'>;
}

export function AdminKkshowShoppingGoods({
  index,
  type,
}: AdminKkshowShoppingGoodsProps): JSX.Element {
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
          <Image maxW={150} src={watch(`${type}.${index}.imageUrl`)} rounded="2xl" />
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
            {...register(`${type}.${index}.imageUrl`, { required: true })}
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
            {...register(`${type}.${index}.linkUrl`, { required: true })}
            isRequired
          />
        </Stack>
        <Stack minW={300}>
          <Box>
            <FieldHeader header="상품정보" isRequired />
            <Text fontSize="xs" color="GrayText">
              전시될 상품의 정보를 입력해주세요. 할인율은 자동 계산됩니다.
            </Text>
          </Box>
          <FormControl as={Flex} align="center" isRequired>
            <FormLabel minW={42} m={0} htmlFor="이름" fontSize="xs">
              이름
            </FormLabel>
            <Input {...register(`${type}.${index}.name`, { required: true })} />
          </FormControl>
          <FormControl as={Flex} align="center" isRequired>
            <FormLabel minW={42} m={0} htmlFor="정가" fontSize="xs">
              정가
            </FormLabel>
            <Input
              {...register(`${type}.${index}.normalPrice`, { required: true })}
              type="number"
            />
          </FormControl>
          <FormControl as={Flex} align="center">
            <FormLabel minW={42} m={0} htmlFor="할인가" fontSize="xs">
              할인가
            </FormLabel>
            <Input {...register(`${type}.${index}.discountedPrice`)} type="number" />
          </FormControl>
        </Stack>
      </Flex>
    </Box>
  );
}

export default AdminKkshowShoppingGoods;
