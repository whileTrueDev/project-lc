import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Stack,
  Text,
} from '@chakra-ui/react';
import SectionWithTitle from '@project-lc/components-layout/SectionWithTitle';
import { RegistGoodsDto } from '@project-lc/shared-types';
import { useFieldArray, useFormContext } from 'react-hook-form';

/** 한 상품에 설정 가능한 키워드 최대 개수 */
const MAX_GOODS_KEYWORD = 10;
export function GoodsRegistKeywords(): JSX.Element {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<RegistGoodsDto>();
  const { fields, append, remove } = useFieldArray({ control, name: 'searchKeywords' });

  return (
    <SectionWithTitle title="키워드" variant="outlined">
      <Stack alignItems="flex-start">
        <Button
          size="sm"
          leftIcon={<AddIcon />}
          isDisabled={fields.length >= MAX_GOODS_KEYWORD}
          onClick={() => append({ keyword: '' })}
        >
          키워드 추가
        </Button>
        <Box fontSize="sm" color="GrayText">
          <Text>키워드는 최대 {MAX_GOODS_KEYWORD}개까지 설정 가능합니다.</Text>
        </Box>

        {fields.map((field, index) => (
          <Box key={field.id}>
            <FormControl isInvalid={!!errors.searchKeywords?.[index]?.keyword}>
              <InputGroup size="sm" maxW={220}>
                <InputLeftAddon>
                  <Text fontSize="sm">{index + 1}.</Text>
                </InputLeftAddon>
                <Input
                  {...register(`searchKeywords.${index}.keyword`, {
                    required: `키워드를 입력해주세요.`,
                    maxLength: {
                      value: 10,
                      message: '키워드는 10자를 초과할 수 없습니다',
                    },
                  })}
                  placeholder="키워드를 입력해주세요."
                />
                <InputRightAddon>
                  <IconButton
                    onClick={() => remove(index)}
                    size="sm"
                    aria-label="remove-keyword-btn"
                    icon={<DeleteIcon />}
                  />
                </InputRightAddon>
              </InputGroup>
              <FormErrorMessage fontSize="xs">
                {errors.searchKeywords?.[index].keyword?.message}
              </FormErrorMessage>
            </FormControl>
          </Box>
        ))}
      </Stack>
    </SectionWithTitle>
  );
}

export default GoodsRegistKeywords;
