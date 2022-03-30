/* eslint-disable react/no-array-index-key */
import { DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import ImageInputDialog, {
  ImageInputFileReadData,
} from '@project-lc/components-core/ImageInputDialog';
import { KkshowShoppingTabResData } from '@project-lc/shared-types';
import { s3 } from '@project-lc/utils-s3';
import path from 'path';
import { memo, useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import PageManagerContainerButtonSet from './PageManagerContainerButtonSet';

export interface AdminKkshowShoppingKeywordsProps {
  index: number;
}

export function AdminKkshowShoppingKeywords({
  index,
}: AdminKkshowShoppingKeywordsProps): JSX.Element {
  const dialog = useDisclosure();
  const fieldWidth = 55;
  const { register, watch, setValue } = useFormContext<KkshowShoppingTabResData>();

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

  const handleConfirm = async (imageData: ImageInputFileReadData): Promise<void> => {
    const timestamp = new Date().getTime();
    const s3KeyType = 'kkshow-shopping-keywords-theme-images';
    const key = path.join(s3KeyType, `${timestamp}_${imageData.filename}`);

    const { objectUrl } = await s3.sendPutObjectCommand({
      Key: key,
      Body: imageData.file,
      ContentType: imageData.file.type,
      ACL: 'public-read',
    });
    setValue(`keywords.${index}.imageUrl`, objectUrl, { shouldDirty: true });
  };

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
          <Image maxW={150} src={watch(`keywords.${index}.imageUrl`)} rounded="2xl" />
        </Stack>
        <Stack maxW={300}>
          <Box>
            <FieldHeader header="이미지 주소" isRequired />
            <Text fontSize="xs" color="GrayText">
              이미지 주소를 입력하거나 새로운 이미지를 업로드할 수 있습니다.
            </Text>
          </Box>
          <Input
            minW={200}
            {...register(`keywords.${index}.imageUrl`, { required: true })}
            isRequired
          />
          <Button onClick={dialog.onOpen}>이미지 등록</Button>
        </Stack>

        <Stack minW={150} maxW={200} w="100%">
          <Box>
            <FieldHeader header="테마정보" isRequired />
            <Text fontSize="xs" color="GrayText">
              테마를 입력 ex)한식, 양식, ...
            </Text>
          </Box>
          <FormControl as={Flex} align="center" isRequired>
            <FormLabel minW={fieldWidth} m={0} htmlFor="후기 제목" fontSize="xs">
              테마명
            </FormLabel>
            <Input {...register(`keywords.${index}.theme`, { required: true })} />
          </FormControl>
        </Stack>

        <Stack maxW={600} w="100%">
          <Box>
            <FieldHeader header="키워드 정보" isRequired />
            <Text fontSize="xs" color="GrayText">
              검색 키워드를 등록하세요.
            </Text>
          </Box>

          <AdminKkshowShoppingKeywordTable index={index} />
        </Stack>
      </Flex>

      <ImageInputDialog
        isOpen={dialog.isOpen}
        onClose={dialog.onClose}
        onConfirm={handleConfirm}
      />
    </Box>
  );
}

type AdminKkshowShoppingKeywordTableProps = AdminKkshowShoppingKeywordsProps;
function AdminKkshowShoppingKeywordTable({
  index,
}: AdminKkshowShoppingKeywordTableProps): JSX.Element {
  const { register, control } = useFormContext<KkshowShoppingTabResData>();

  const { fields, append, move, remove } = useFieldArray({
    control,
    name: `keywords.${index}.keywords`,
  });

  const moveUp = useCallback(
    (idx: number): void => {
      if (idx > 0) move(idx, idx - 1);
    },
    [move],
  );
  const moveDown = useCallback(
    (idx: number): void => {
      if (idx < fields.length - 1) move(idx, idx + 1);
    },
    [fields.length, move],
  );

  return (
    <Box>
      <Button onClick={() => append({ keyword: '', linkUrl: '' })}>키워드 추가</Button>
      <Table w={600} size="sm">
        <Thead>
          <Tr>
            <Th flex={1}>
              키워드명
              <Text as="span" color="red">
                *
              </Text>
            </Th>
            <Th flex={2}>
              키워드 링크
              <Text as="span" color="red">
                *
              </Text>
            </Th>
            <Th flex={1} />
          </Tr>
        </Thead>

        <Tbody>
          {fields.map((keyword, keywordIdx) => {
            return (
              <Tr key={keyword.id}>
                <Td>
                  <Input
                    m={0}
                    p={0}
                    {...register(`keywords.${index}.keywords.${keywordIdx}.keyword`, {
                      required: true,
                    })}
                  />
                </Td>
                <Td>
                  <Input
                    m={0}
                    p={0}
                    {...register(`keywords.${index}.keywords.${keywordIdx}.linkUrl`, {
                      required: true,
                    })}
                  />
                </Td>
                <Td>
                  <PageManagerContainerButtonSet
                    variant="only-icon"
                    buttonSize="xs"
                    isMoveUpDisabled={keywordIdx === 0}
                    isMoveDownDisabled={keywordIdx === fields.length - 1}
                    removeHandler={() => remove(keywordIdx)}
                    moveUp={() => moveUp(keywordIdx)}
                    moveDown={() => moveDown(keywordIdx)}
                  />
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
}

export default AdminKkshowShoppingKeywords;
