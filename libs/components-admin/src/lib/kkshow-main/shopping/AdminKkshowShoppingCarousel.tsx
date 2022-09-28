import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Image,
  Input,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { KkshowShoppingSectionItem } from '@prisma/client';
import ImageInputDialog, {
  ImageInputFileReadData,
} from '@project-lc/components-core/ImageInputDialog';
import { useAdminUpdateKkshowShoppingSectionData } from '@project-lc/hooks';
import { KkshowShoppingTabCarouselItem } from '@project-lc/shared-types';
import { parseJsonToGenericType } from '@project-lc/utils';
import { s3 } from '@project-lc/utils-s3';
import path from 'path';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { FormProvider, useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { PageManagerFieldItem } from './PageManagerFieldItem';

export interface AdminKkshowShoppingCarouselProps {
  index: number;
}
export type CarouselDataManipulateFormData = Omit<KkshowShoppingSectionItem, 'data'> & {
  data: KkshowShoppingTabCarouselItem[];
};
export function AdminKkshowShoppingCarousel({
  index,
}: AdminKkshowShoppingCarouselProps): JSX.Element {
  const imageUploadDialog = useDisclosure();
  const { register, watch, setValue } = useFormContext<CarouselDataManipulateFormData>();

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
    setValue(`data.${index}.imageUrl`, objectUrl, { shouldDirty: true });
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
          <Image width={200} src={watch(`data.${index}.imageUrl`)} />
        </Stack>
        <Stack minW={300}>
          <Box>
            <FieldHeader header="이미지 주소" />
            <Text fontSize="xs" color="GrayText">
              이미지 주소를 입력하거나 새로운 이미지를 업로드할 수 있습니다.
            </Text>
          </Box>
          <Input minW={200} {...register(`data.${index}.imageUrl` as const)} />
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
          <Input {...register(`data.${index}.linkUrl` as const)} />
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

export interface CarouselDataManipulateContainerProps {
  item: KkshowShoppingSectionItem;
  onSuccess?: () => void;
}
export function CarouselDataManipulateContainer(
  props: CarouselDataManipulateContainerProps,
): JSX.Element {
  const toast = useToast();
  const { item, onSuccess } = props;
  const { data, title } = item;
  const typedData = parseJsonToGenericType<KkshowShoppingTabCarouselItem[]>(data);
  const methods = useForm<CarouselDataManipulateFormData>({
    defaultValues: { ...item, data: typedData },
  });

  const { control, formState, reset } = methods;
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
  const onSubmit = async (formData: CarouselDataManipulateFormData): Promise<void> => {
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
      data: parseJsonToGenericType<KkshowShoppingTabCarouselItem[]>(data),
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
      label: '캐러셀 이미지 추가',
      icon: <AddIcon />,
      onClick: () => append({ description: '', imageUrl: '', linkUrl: '' }),
    },
  ];
  return (
    <FormProvider {...methods}>
      <Box as="form" onSubmit={methods.handleSubmit(onSubmit)}>
        <Stack minWidth="6xl" w="100%">
          <Text fontWeight="bold">{title}</Text>
          {saveButton}
          <Button onClick={restoreData}>저장하지 않은 수정사항 모두 되돌리기</Button>

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
                  <AdminKkshowShoppingCarousel index={index} />
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
