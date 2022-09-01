import {
  Box,
  Button,
  Divider,
  Grid,
  GridItem,
  Input,
  Link,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { ImageInput, ImageInputErrorTypes } from '@project-lc/components-core/ImageInput';
import { readAsDataURL } from '@project-lc/components-core/ImageInputDialog';
import { useAdminOverlayThemeCreateMutation } from '@project-lc/hooks';
import { CreateOverlayThemeDto, OverlayThemeFormData } from '@project-lc/shared-types';
import { getExtension } from '@project-lc/utils';
import { s3 } from '@project-lc/utils-s3';
import { nanoid } from 'nanoid';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import OverlayDisplayPreview from './OverlayDisplayPreview';

export function AddOverlayThemeSection(): JSX.Element {
  return (
    <Box>
      <NextLink passHref href="/overlay-theme">
        <Button as={Link}>돌아가기</Button>
      </NextLink>
      <AddOverlayThemeForm />
    </Box>
  );
}

export default AddOverlayThemeSection;

export function AddOverlayThemeForm(): JSX.Element {
  const router = useRouter();
  const toast = useToast();
  const methods = useForm<OverlayThemeFormData>({
    defaultValues: {
      name: '',
      style: {},
      imageFile: {},
    },
  });

  const style = methods.watch('style');

  const handleMutateSuccess = (): void => {
    toast({ title: '테마 생성 성공', status: 'success' });
    methods.reset();
    router.push('/overlay-theme');
  };
  const handleMutateError = (e: any): void => {
    toast({ title: '테마 생성 중 에러', status: 'error' });
    console.error(e);
  };

  const { mutateAsync, isLoading } = useAdminOverlayThemeCreateMutation();
  const onSubmit = async (formData: OverlayThemeFormData): Promise<void> => {
    const themeKey = nanoid(); // OverlayTheme에 저장되는 key이자 s3경로 폴더명

    const styleData: OverlayThemeFormData['style'] = {
      backgroundColor: formData.style?.backgroundColor,
      color: formData.style?.color,
      titleColor: formData.style?.titleColor,
      textShadow: formData.style?.textShadow,
    };

    if (formData.imageFile.backgroundImage) {
      styleData.backgroundImage = await uploadThemeImageToS3({
        key: `${themeKey}/background`,
        imageFile: formData.imageFile.backgroundImage,
      });
    }
    if (formData.imageFile.podiumImage) {
      styleData.podiumImage = await uploadThemeImageToS3({
        key: `${themeKey}/podium`,
        imageFile: formData.imageFile.podiumImage,
      });
    }
    if (formData.imageFile.timerImage) {
      styleData.timerImage = await uploadThemeImageToS3({
        key: `${themeKey}/timer`,
        imageFile: formData.imageFile.timerImage,
      });
    }

    const realDto: CreateOverlayThemeDto = {
      name: formData.name,
      key: themeKey,
      category: formData.category,
      data: JSON.stringify(styleData),
    };

    mutateAsync(realDto).then(handleMutateSuccess).catch(handleMutateError);
  };
  return (
    <FormProvider {...methods}>
      <Stack as="form" onSubmit={methods.handleSubmit(onSubmit)}>
        <Box>
          <Text>이름 *</Text>
          <Input
            placeholder="여름, 봄 ..."
            {...methods.register('name', { required: true })}
          />
        </Box>

        <Box>
          <Text>분류</Text>
          <Input placeholder="계절, 음식 ..." {...methods.register('category')} />
        </Box>

        <Divider />

        <OverlayDisplayPreview
          _backgroundImage={style.backgroundImage}
          _podiumImage={style.podiumImage}
          _timerImage={style.timerImage}
          _backgroundColor={style.backgroundColor}
          _color={style.color}
          _titleColor={style.titleColor}
          _textShadow={style.textShadow}
        />

        <OverlayThemeImageInput
          styleKey="backgroundImage"
          label="우상단 크크쇼 로고가 포함된 전체 배경 이미지(1920 x 1080 사이즈 .png 투명배경)"
        />

        <Box>
          <Text>랭킹, 타이머 영역 스타일</Text>
          <Grid templateColumns="repeat(2, 1fr)" width="lg" pl={4}>
            <GridItem>영역 상자 배경색</GridItem>
            <GridItem>
              <Input
                width="auto"
                placeholder="rgba(0, 0, 0, 0.5)"
                {...methods.register('style.backgroundColor')}
              />
            </GridItem>

            <GridItem>글자색</GridItem>
            <GridItem>
              <Input
                width="auto"
                placeholder="#ffffff"
                {...methods.register('style.color')}
              />
            </GridItem>

            <GridItem>Top구매자 글자색</GridItem>
            <GridItem>
              <Input placeholder="#ffff00" {...methods.register('style.titleColor')} />
            </GridItem>

            <GridItem>Top구매자 글자 테두리색(text-shadow 값)</GridItem>
            <GridItem>
              <Input
                placeholder="-2px -2px 0 rgb(85, 83, 83), 0 -2px 0 rgb(85, 83, 83)"
                {...methods.register('style.textShadow')}
              />
            </GridItem>
          </Grid>
        </Box>

        <OverlayThemeImageInput
          styleKey="podiumImage"
          label="top 구매자 아래 표시되는 아이콘(.png 투명배경)"
        />

        <OverlayThemeImageInput
          styleKey="timerImage"
          label="타이머 영역 표시되는 아이콘(.png 투명배경)"
        />

        <Button type="submit" isLoading={methods.formState.isSubmitting || isLoading}>
          생성
        </Button>
      </Stack>
    </FormProvider>
  );
}

async function uploadThemeImageToS3({
  key,
  imageFile,
}: {
  key: string;
  imageFile: File;
}): Promise<string> {
  const extension = getExtension(imageFile.name);
  const s3Key = `overlay-theme-images/${key}${extension}`;
  const { objectUrl } = await s3.sendPutObjectCommand({
    ACL: 'public-read',
    Key: s3Key,
    Body: imageFile,
    ContentType: imageFile.type,
  });
  return objectUrl;
}

function OverlayThemeImageInput({
  styleKey,
  label,
}: {
  styleKey: keyof OverlayThemeFormData['style'];
  label: string;
}): JSX.Element {
  const { setValue } = useFormContext<OverlayThemeFormData>();
  const handleImageLoadSuccess = async (_fileName: string, file: File): Promise<void> => {
    setValue(`imageFile.${styleKey}`, file);
    const data = await readAsDataURL(file);
    if (data.data) setValue(`style.${styleKey}`, data.data as string);
  };
  const handleError = (errorType?: ImageInputErrorTypes): void => {
    console.error('이미지 불러오기 에러', errorType);
  };

  return (
    <Stack direction="row">
      <Text>{label}</Text>
      <ImageInput
        handleSuccess={handleImageLoadSuccess}
        handleError={handleError}
        required={false}
      />
    </Stack>
  );
}
