import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Stack,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { KkshowShoppingSectionItem } from '@prisma/client';
import { useAdminUpdateKkshowShoppingSectionData } from '@project-lc/hooks';
import { KkshowShoppingTabReviewData } from '@project-lc/shared-types';
import { parseJsonToGenericType } from '@project-lc/utils';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { FormProvider, useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { PageManagerFieldItem } from './PageManagerFieldItem';

export interface AdminKkshowShoppingReviewsProps {
  index: number;
}

export function AdminKkshowShoppingReviews({
  index,
}: AdminKkshowShoppingReviewsProps): JSX.Element {
  const fieldWidth = 55;
  const { register, watch } = useFormContext<RatingDataManipulateFormData>();

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
          <Image maxW={150} src={watch(`data.${index}.imageUrl`)} rounded="2xl" />
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
            {...register(`data.${index}.imageUrl`, { required: true })}
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
          <Input {...register(`data.${index}.linkUrl`, { required: true })} isRequired />
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
            <Input {...register(`data.${index}.title`, { required: true })} />
          </FormControl>
          <FormControl as={Flex} align="center" isRequired>
            <FormLabel minW={fieldWidth} m={0} htmlFor="후기 내용" fontSize="xs">
              후기 내용
            </FormLabel>
            <Textarea {...register(`data.${index}.contents`, { required: true })} />
          </FormControl>
          <FormControl as={Flex} align="center" isRequired>
            <FormLabel minW={fieldWidth} m={0} htmlFor="날짜" fontSize="xs">
              날짜
            </FormLabel>
            <Input
              {...register(`data.${index}.createDate`, { required: true })}
              type="date"
            />
          </FormControl>
          <FormControl as={Flex} align="center" isRequired>
            <FormLabel minW={fieldWidth} m={0} htmlFor="별점" fontSize="xs">
              별점
            </FormLabel>
            <Input
              {...register(`data.${index}.rating`, { required: true })}
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

export interface RatingDataManipulateContainerProps {
  item: KkshowShoppingSectionItem;
  buttonLabel?: string;
  onSuccess?: () => void;
}
export type RatingDataManipulateFormData = Omit<KkshowShoppingSectionItem, 'data'> & {
  data: KkshowShoppingTabReviewData[];
};
export function RatingDataManipulateContainer(
  props: RatingDataManipulateContainerProps,
): JSX.Element {
  const toast = useToast();
  const { item, onSuccess, buttonLabel } = props;
  const { data, title } = item;
  const typedData = parseJsonToGenericType<KkshowShoppingTabReviewData[]>(data);
  const methods = useForm<RatingDataManipulateFormData>({
    defaultValues: { ...item, data: typedData },
  });

  const { control, formState, reset, register } = methods;
  const saveButton = useMemo(() => {
    return (
      <Stack>
        <Button
          width="100%"
          type="submit"
          colorScheme={formState.isDirty ? 'red' : 'blue'}
        >
          저장
        </Button>
        {formState.isDirty && (
          <Text as="span" color="red">
            데이터 변경사항이 있습니다. 저장버튼을 눌러주세요!!!!
          </Text>
        )}
      </Stack>
    );
  }, [formState.isDirty]);

  const { mutateAsync } = useAdminUpdateKkshowShoppingSectionData();
  const onSubmit = async (formData: RatingDataManipulateFormData): Promise<void> => {
    const { id, ...rest } = formData;
    mutateAsync({ id, dto: { ...rest, data: JSON.stringify(rest.data) } })
      .then((res) => {
        toast({ title: '데이터를 수정하였습니다', status: 'success' });
        if (onSuccess) onSuccess();
      })
      .catch((e) => {
        toast({ title: '오류발생으로 수정 실패', status: 'error' });
        console.error(e);
      });
  };

  const restoreData = useCallback(() => {
    if (!item) return;
    reset({
      ...item,
      data: parseJsonToGenericType<KkshowShoppingTabReviewData[]>(data),
    });
  }, [data, item, reset]);

  useEffect(() => {
    if (!item) return;
    restoreData();
  }, [item, restoreData]);

  const { fields, append, remove, move } = useFieldArray({ control, name: 'data' });
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
  const buttons = [
    {
      label: buttonLabel || '추가',
      icon: <AddIcon />,
      onClick: () => append({}),
    },
  ];
  return (
    <FormProvider {...methods}>
      <Box as="form" onSubmit={methods.handleSubmit(onSubmit)}>
        <Stack minWidth="6xl" w="100%">
          <Text fontWeight="bold">{title}</Text>
          {saveButton}
          <Button onClick={restoreData}>저장하지 않은 수정사항 모두 되돌리기</Button>

          <Stack direction="row" alignItems="center">
            <Text>섹션명 : </Text>
            <Input {...register('title')} width="auto" />
          </Stack>

          <Stack>
            <ButtonGroup>
              {buttons.map((btn) => (
                <Button key={btn.label} leftIcon={btn.icon} onClick={() => btn.onClick()}>
                  {btn.label}
                </Button>
              ))}
            </ButtonGroup>

            {fields.map((field, index) => (
              <Stack key={field.id} w="100%" minH={150}>
                <PageManagerFieldItem
                  isMoveUpDisabled={index === 0}
                  isMoveDownDisabled={index === fields.length - 1}
                  moveUp={() => moveUp(index)}
                  moveDown={() => moveDown(index)}
                  removeHandler={() => remove(index)}
                >
                  <AdminKkshowShoppingReviews index={index} />
                </PageManagerFieldItem>
              </Stack>
            ))}
          </Stack>

          {saveButton}
        </Stack>
      </Box>
    </FormProvider>
  );
}
