import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  FormControl,
  FormLabel,
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
import {
  KkshowShoppingTabBannerData,
  KkshowShoppingTabResData,
} from '@project-lc/shared-types';
import { parseJsonToGenericType } from '@project-lc/utils';
import { s3 } from '@project-lc/utils-s3';
import path from 'path';
import { useMemo, useCallback, useEffect } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { ShoppingBannerLayout } from '@project-lc/components-web-kkshow/shopping/section-layout/ShoppingBannerLayout';

export function AdminKkshowShoppingBanner(): JSX.Element {
  const dialog = useDisclosure();
  const { register, setValue, watch } = useFormContext<RatingDataManipulateFormData>();

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
    setValue(`data.imageUrl`, objectUrl, { shouldDirty: true });
  };

  return (
    <Flex flexWrap="wrap" gap={4}>
      <Stack maxW={600} w="100%">
        <FormControl>
          <FormLabel fontWeight="bold">배너명</FormLabel>
          <FormLabel fontSize="xs" color="GrayText">
            사용자에게 표시되지 않습니다. 관리자가 배너를 식별하기 위해 사용하는
            이름입니다.
          </FormLabel>
          <Input width="auto" {...register('title')} />
        </FormControl>

        <Divider />

        <FormControl>
          <FormLabel fontWeight="bold">메시지</FormLabel>
          <FormLabel fontSize="xs" color="GrayText">
            배너에 보여질 메시지로, 메시지가 긴 경우 짤리거나 이상하게 보일 수 있습니다
          </FormLabel>
          <Input {...register('data.message')} />
        </FormControl>

        <FormControl>
          <FormLabel fontWeight="bold">링크</FormLabel>
          <FormLabel fontSize="xs" color="GrayText">
            배너 클릭시 이동할 링크를 입력하세요. 크크쇼 내부로 이동될 경우 /where-to-go
            와 같은 형식으로 작성할 수 있습니다.
          </FormLabel>
          <Input {...register('link')} />
        </FormControl>

        <FormControl>
          <FormLabel fontWeight="bold">우측 꾸밈 이미지</FormLabel>
          <FormLabel fontSize="xs" color="GrayText">
            이미 업로드된 이미지 주소를 입력하거나 새로운 이미지를 등록하세요
          </FormLabel>
          <Input {...register('data.imageUrl')} />
        </FormControl>
        <Image w={150} src={watch('data.imageUrl')} />
        <Button onClick={dialog.onOpen}>이미지 등록</Button>

        <Divider />

        <FormControl>
          <Stack direction="row">
            <FormLabel fontWeight="bold">메시지 글자색</FormLabel>
            <FormLabel fontSize="xs" color="GrayText">
              메시지 글자색 (입력안하면 기본 흰색), CSS font-color 값을 입력합니다
            </FormLabel>
          </Stack>
          <Input width="auto" {...register('data.fontColor')} />
        </FormControl>

        <FormControl>
          <Stack direction="row">
            <FormLabel fontWeight="bold">배너 배경색</FormLabel>
            <FormLabel fontSize="xs" color="GrayText">
              배너 배경색 (입력안하면 기본 파란색), CSS background-color 값을 입력합니다
            </FormLabel>
          </Stack>
          <Input width="auto" {...register('data.backgroundColor')} />
        </FormControl>

        <FormControl>
          <Stack direction="row">
            <FormLabel fontWeight="bold">이미지 반복</FormLabel>
            <FormLabel fontSize="xs" color="GrayText">
              이미지는 background-url로 들어갑니다. 이미지를 반복하여 표시할 경우 값을
              입력합니다 (입력안하면 기본 반복 안함), CSS background-repeat 값을
              입력합니다
            </FormLabel>
          </Stack>
          <Input width="auto" {...register('data.backgroundRepeat')} />
        </FormControl>

        <FormControl>
          <Stack direction="row">
            <FormLabel fontWeight="bold">이미지 위치</FormLabel>
            <FormLabel fontSize="xs" color="GrayText">
              이미지는 background-url로 들어갑니다. 이미지가 표시될 위치를 입력합니다. CSS
              background-position 값을 입력합니다
            </FormLabel>
          </Stack>
          <Input width="auto" {...register('data.backgroundPosition')} />
        </FormControl>

        <FormControl>
          <Stack direction="row">
            <FormLabel fontWeight="bold">이미지 크기</FormLabel>
            <FormLabel fontSize="xs" color="GrayText">
              이미지는 background-url로 들어갑니다. 이미지가 표시될 크기를 입력합니다. CSS
              background-size 값을 입력합니다
            </FormLabel>
          </Stack>
          <Input width="auto" {...register('data.backgroundSize')} />
        </FormControl>
      </Stack>

      <ImageInputDialog
        isOpen={dialog.isOpen}
        onClose={dialog.onClose}
        onConfirm={handleImageRegister}
      />
    </Flex>
  );
}

export interface BannerDataManipulateContainerProps {
  item: KkshowShoppingSectionItem;
  buttonLabel?: string;
  onSuccess?: () => void;
}

export type RatingDataManipulateFormData = Omit<KkshowShoppingSectionItem, 'data'> & {
  data: KkshowShoppingTabBannerData;
};
export function BannerDataManipulateContainer(
  props: BannerDataManipulateContainerProps,
): JSX.Element {
  const toast = useToast();
  const { item, onSuccess } = props;
  const { data, title } = item;
  const typedData = parseJsonToGenericType<KkshowShoppingTabBannerData>(data);
  const methods = useForm<RatingDataManipulateFormData>({
    defaultValues: { ...item, data: typedData },
  });

  const { formState, reset, watch } = methods;
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
      data: parseJsonToGenericType<KkshowShoppingTabBannerData>(data),
    });
  }, [data, item, reset]);

  useEffect(() => {
    if (!item) return;
    restoreData();
  }, [item, restoreData]);

  return (
    <FormProvider {...methods}>
      <Box as="form" onSubmit={methods.handleSubmit(onSubmit)}>
        <Stack minWidth="6xl" w="100%">
          <Text fontWeight="bold">{title}</Text>
          {saveButton}
          <Button onClick={restoreData}>저장하지 않은 수정사항 모두 되돌리기</Button>

          <Stack>
            <AdminKkshowShoppingBanner />
          </Stack>

          <Divider />
          <Stack>
            <Text>배너 미리보기</Text>
            <ShoppingBannerLayout {...watch('data')} link={watch('link') || ''} />
          </Stack>

          {saveButton}
        </Stack>
      </Box>
    </FormProvider>
  );
}
