import { EditIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Center,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { boxStyle } from '@project-lc/components-constants/commonStyleProps';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import CustomAvatar from '@project-lc/components-core/CustomAvatar';
import { ImageInput, ImageInputErrorTypes } from '@project-lc/components-core/ImageInput';
import {
  useAvatarMutation,
  useAvatarRemoveMutation,
  useProfile,
} from '@project-lc/hooks';
import { getCroppedImage } from '@project-lc/utils-frontend';
import { useRef, useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface AvatarChangeButtonProps {
  onClick?: () => void;
}
export function AvatarChangeButton({ onClick }: AvatarChangeButtonProps): JSX.Element {
  const { data: profileData } = useProfile();
  const avatarDialog = useDisclosure();
  const confirmDialog = useDisclosure();
  const toast = useToast();

  const imageRef = useRef<HTMLImageElement | null>(null);

  // 아바타 마우스hover 시 백드롭 표시
  const [backdropShow, setBackdropShow] = useState<boolean>(false);

  // 이미지 크롭 영역 설정
  const [crop, setCrop] = useState<Partial<Crop>>({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25,
    aspect: 1,
  });

  // 자르기 전 이미지(input으로 받아온 이미지)
  const [src, setSrc] = useState<string | null>(null);

  // 잘린 블롭 -> formData로 post 요청시 사용
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  // 잘린 이미지 -> 잘린 프로필사진 미리보기 src로 사용 && revokeObjectURL 에 사용
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>('');

  // <input> 이미지 파일 선택시 크롭 다이얼로그 열기
  const handleSuccess = async (fileName: string, file: File): Promise<void> => {
    const reader = new FileReader();
    reader.addEventListener('load', () => setSrc(reader.result as string));
    reader.readAsDataURL(file);
    avatarDialog.onOpen();
  };

  // 잘라낸 이미지(blob 형태로) 처리
  const blobCallback: BlobCallback = (blob) => {
    if (!blob) {
      console.error('canvas is empty');
      return;
    }
    // 이전 이미지 url 메모리 해제
    if (croppedImageUrl) URL.revokeObjectURL(croppedImageUrl);
    // 크롭된 이미지 blob, url 저장
    setCroppedBlob(blob);
    const url = URL.createObjectURL(blob);
    setCroppedImageUrl(url);
  };

  // crop 종료시 -> 크롭된 이미지 state에 저장
  const onCropComplete = (_crop: Crop): void => {
    if (imageRef.current && _crop.width && _crop.height) {
      getCroppedImage(imageRef.current, _crop, blobCallback);
    }
  };

  // 잘린 아바타 이미지 post 요청
  const uploadAvatar = useAvatarMutation();
  const removeAvatar = useAvatarRemoveMutation();

  const submitSuccessHandler = (): void => {
    toast({ title: '프로필 사진을 변경했습니다.', status: 'success' });
    avatarDialog.onClose();
  };
  const submitErrorHandler = (err: any): void => {
    toast({ title: '프로필 사진을 변경하지 못했습니다.', status: 'error' });
    console.error(err);
  };

  // 프로필 사진 변경 다이얼로그 저장하기 핸들러
  const onSubmit = async (): Promise<void> => {
    if (!croppedImageUrl || !croppedBlob) {
      return;
    }

    const formData = new FormData();
    const filename = `${Date.now()}.jpeg`; // 파일명이 동일하면 s3에서 파일은 바뀌지만 queryClient invalidate 해도 표시되는 사진은 바뀌지 않음..
    formData.append('file', croppedBlob, filename);
    uploadAvatar
      .mutateAsync(formData)
      .then(submitSuccessHandler)
      .catch(submitErrorHandler);
  };

  const resetSuccessHandler = (): void => {
    toast({ title: '기본 프로필 사진으로 변경했습니다.', status: 'success' });
    avatarDialog.onClose();
  };
  const resetErrorHandler = submitErrorHandler;

  const reset = async (): Promise<void> => {
    if (croppedImageUrl) URL.revokeObjectURL(croppedImageUrl);
    setSrc(null);
    setCroppedImageUrl('');
    removeAvatar.mutateAsync().then(resetSuccessHandler).catch(resetErrorHandler);
  };

  const handleClick = (): void => {
    avatarDialog.onOpen();
    if (onClick) onClick();
  };

  const handleUploadError = (errortype: ImageInputErrorTypes): void => {
    if (errortype === 'over-size')
      toast({
        status: 'error',
        title: '이미지 업로드 실패',
        description: '이미지 크기가 올바르지 않습니다.',
      });

    if (errortype === 'invalid-format') {
      toast({
        status: 'error',
        title: '이미지 업로드 실패',
        description: '이미지 형식이 올바르지 않습니다.',
      });
    }
  };

  return (
    <>
      <Button
        height="100%"
        variant="unstyled"
        cursor="pointer"
        position="relative"
        onClick={handleClick}
        onMouseEnter={() => setBackdropShow(true)}
        onMouseLeave={() => setBackdropShow(false)}
      >
        <CustomAvatar src={profileData?.avatar} />
        {backdropShow && (
          <Center position="absolute" width="100%" height="100%" left="0" top="0">
            <Avatar
              bg="rgba(0,0,0,0.5)"
              icon={<Icon as={FaCamera} color="gray.200" fontSize="1.5rem" />}
            />
          </Center>
        )}
      </Button>

      {/* 프로필 사진 변경하기 다이얼로그 */}
      <Modal isOpen={avatarDialog.isOpen} onClose={avatarDialog.onClose} isCentered>
        <ModalOverlay />
        <ModalContent as="form" encType="multipart/form-data">
          <ModalHeader>프로필 사진 변경하기</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={2}>
              {/* 사진 선택 input */}
              <ImageInput
                variant="chakra"
                handleSuccess={handleSuccess}
                handleError={handleUploadError}
              />
              <Stack direction="row" flexWrap="wrap" alignItems="center" {...boxStyle}>
                {!src && (
                  <Text>사진 업로드 버튼을 눌러 프로필로 사용할 사진을 선택해주세요</Text>
                )}
                {/* 크롭할 부분 선택영역 */}
                {src && (
                  <Box mt={2}>
                    <ReactCrop
                      src={src}
                      crop={crop}
                      onChange={(newCrop) => {
                        setCrop(newCrop);
                      }}
                      onImageLoaded={(image) => {
                        imageRef.current = image;
                      }}
                      onComplete={onCropComplete}
                      circularCrop
                    />
                  </Box>
                )}

                {/* 크롭된 부분 아바타 컴포넌트로 미리보기 */}
                {croppedImageUrl && (
                  <Box flex="1" textAlign="center">
                    <Text mb="2">미리보기</Text>
                    <Avatar src={croppedImageUrl} />
                  </Box>
                )}
              </Stack>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              mr={3}
              onClick={confirmDialog.onOpen}
              isDisabled={!profileData?.avatar}
            >
              기본으로 변경
            </Button>
            <Button
              type="button"
              colorScheme="blue"
              onClick={onSubmit}
              isDisabled={!croppedImageUrl || !croppedBlob}
              leftIcon={<EditIcon />}
            >
              변경하기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 기본으로 변경 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={confirmDialog.onClose}
        title="프로필 사진 기본으로 변경하기"
        onConfirm={reset}
      >
        <Text textAlign="center">프로필 사진을 기본 이미지로 변경하시겠습니까?</Text>
      </ConfirmDialog>
    </>
  );
}
