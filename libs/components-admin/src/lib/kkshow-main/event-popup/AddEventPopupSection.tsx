import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { ErrorText } from '@project-lc/components-core/ErrorText';
import { ImageInput, ImageInputErrorTypes } from '@project-lc/components-core/ImageInput';
import {
  ImageInputFileReadData,
  readAsDataURL,
} from '@project-lc/components-core/ImageInputDialog';
import { useAdminCreateEventPopupMutation } from '@project-lc/hooks';
import { getExtension } from '@project-lc/utils';
import { s3 } from '@project-lc/utils-s3';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function AddEventPopupSection(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box>
      <Button onClick={onOpen}>이벤트팝업 등록하기</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>이벤트팝업 등록</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddEventPopupForm onSubmitSuccess={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default AddEventPopupSection;

export const pathNames: Record<string, string> = {
  '/': '메인',
  '/bc/': '방송인 홍보페이지',
  '/shopping': '크크마켓(쇼핑탭)',
};

type CreateEventPopupFormData = {
  key: string;
  name: string;
  priority: number;
  linkUrl?: string; // 클릭시 이동할 url. 없으면 일반 이미지 팝업
  imageUrl: string; // s3에 저장된 팝업에 표시될 이미지 url
  displayPath: string[]; // 팝업이 표시될 크크쇼 페이지 경로 ['/bc','goods'] 이런형태
};

function AddEventPopupForm({
  onSubmitSuccess,
}: {
  onSubmitSuccess: () => void;
}): JSX.Element {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<CreateEventPopupFormData>({
    defaultValues: {
      key: nanoid(),
      name: '',
      priority: 1,
      imageUrl: '',
      displayPath: ['/'],
    },
  });

  const [imagePreview, setImagePreview] = useState<ImageInputFileReadData | null>(null);

  const { mutateAsync, isLoading } = useAdminCreateEventPopupMutation();

  const onSubmit = async (formData: CreateEventPopupFormData): Promise<void> => {
    // 입력값 확인 (이름, 순서, 키, 페이지)
    if (!formData.key || !imagePreview) return;
    if (formData.displayPath.length <= 0) {
      toast({ title: '팝업이 표시될 페이지를 1개이상 선택해주세요', status: 'warning' });
      return;
    }

    let imageUrl = '';
    // 이미지 s3에 업로드 => imageUrl 받기
    try {
      const extension = getExtension(imagePreview.file.name);
      const key = `event-popup/${formData.key}${extension}`;
      const { objectUrl } = await s3.sendPutObjectCommand({
        Key: key,
        Body: imagePreview.file,
        ContentType: imagePreview.file.type,
        ACL: 'public-read',
      });
      if (!objectUrl) throw new Error('image upload failed');
      imageUrl = objectUrl;
    } catch (s3UploadError) {
      console.error(s3UploadError);
      toast({ title: '이미지 업로드 에러', status: 'error' });
    }

    // 생성요청
    try {
      const dto = {
        key: formData.key,
        name: formData.name,
        priority: formData.priority,
        imageUrl,
        displayPath: formData.displayPath,
        linkUrl: formData.linkUrl,
      };
      await mutateAsync(dto);
      toast({ title: '팝업 생성 성공', status: 'success' });
      onSubmitSuccess(); // 팝업 닫기
    } catch (createPopupError) {
      console.error(createPopupError);
      toast({ title: '팝업 생성 에러', status: 'error' });
    }
  };

  const handleSuccess = async (fileName: string, file: File): Promise<void> => {
    readAsDataURL(file).then(async ({ data }) => {
      const imageData = { url: data, filename: fileName, file };
      setImagePreview(imageData);
    });
  };
  const handleError = (error: ImageInputErrorTypes): void => {
    console.log(error);
  };
  return (
    <Stack as="form" onSubmit={handleSubmit(onSubmit)} spacing={4}>
      <Box>
        <Text fontWeight="bold">
          * 이벤트 팝업 이름(관리자가 이벤트팝업 식별용으로 사용)
        </Text>
        <Input {...register('name', { required: '이름을 입력해주세요' })} />
        {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
      </Box>

      <Box>
        <Text fontWeight="bold">
          * 우선 순위 (등록된 팝업이 여러개인 경우, 우선순위 순으로 표시됩니다)
        </Text>
        <Input
          type="number"
          {...register('priority', {
            required: '우선순위를 입력해주세요',
            valueAsNumber: true,
          })}
        />
        {errors.priority && <ErrorText>{errors.priority.message}</ErrorText>}
      </Box>

      <Box>
        <Text fontWeight="bold">* 이벤트팝업 이미지 등록</Text>
        <ImageInput handleSuccess={handleSuccess} handleError={handleError} />
        {imagePreview && <Avatar src={imagePreview.url as string} />}
      </Box>

      <Divider />

      <Box>
        <Text fontWeight="bold">* 이벤트팝업이 표시될 페이지 설정</Text>
        <CheckboxGroup
          colorScheme="green"
          defaultValue={['/']}
          onChange={(values) =>
            setValue(
              'displayPath',
              values.map((v) => v.toString()),
            )
          }
        >
          <Stack spacing={[1, 5]} direction={['column', 'row']}>
            {Object.keys(pathNames).map((p) => (
              <Checkbox key={p} value={p}>
                {pathNames[p]}
              </Checkbox>
            ))}
          </Stack>
        </CheckboxGroup>
      </Box>

      <Divider />

      <Box>
        <Text>링크 url (선택입력)</Text>
        <Text fontSize="sm" color="GrayText">
          입력하지 않으면 일반 이미지 팝업으로 생성됩니다
        </Text>
        <Input {...register('linkUrl')} />
      </Box>

      <Button type="submit" isLoading={isLoading}>
        생성하기
      </Button>
    </Stack>
  );
}
