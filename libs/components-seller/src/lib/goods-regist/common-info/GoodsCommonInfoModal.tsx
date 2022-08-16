import {
  Button,
  ButtonProps,
  Center,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { MB } from '@project-lc/components-core/ImageInput';
import { GoodsFormValues } from '@project-lc/shared-types';
import dynamic from 'next/dynamic';
import { useFormContext } from 'react-hook-form';
import 'suneditor/dist/css/suneditor.min.css';
import SunEditorCore from 'suneditor/src/lib/core';

export const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
  loading: () => (
    <Center>
      <Spinner />
    </Center>
  ),
});

export interface GoodsCommonInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  buttonProps: ButtonProps;
  getSunEditorInstance: (sunEditor: SunEditorCore) => void;
}
export function GoodsCommonInfoModal({
  isOpen,
  onClose,
  buttonProps,
  getSunEditorInstance,
}: GoodsCommonInfoModalProps): JSX.Element {
  const { watch, register } = useFormContext<GoodsFormValues>();

  const isEditMode = watch('common_contents_type') === 'load';

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>상품 공통 정보 {isEditMode ? '수정' : '작성'}하기</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Stack direction="row">
            <Text wordBreak="keep-all">상품 공통 정보명</Text>
            <Input {...register('common_contents_name')} />
          </Stack>

          <Stack alignItems="flex-start">
            <SunEditor
              getSunEditorInstance={getSunEditorInstance}
              lang="ko"
              setOptions={{
                height: '500px',
                imageUploadSizeLimit: 20 * MB, // 퍼스트몰 최대 20mb
                buttonList: [['font', 'fontSize', 'align', 'list'], ['image']],
              }}
              defaultValue={watch('common_contents')}
            />
            <Button {...buttonProps}>{isEditMode ? '수정' : '등록'}</Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default GoodsCommonInfoModal;
