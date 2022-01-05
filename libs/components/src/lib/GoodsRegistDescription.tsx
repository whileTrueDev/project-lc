/* eslint-disable @typescript-eslint/ban-types */
import { EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { boxStyle } from '@project-lc/components-constants/commonStyleProps';
import { MB } from '@project-lc/components-core/ImageInput';
import SectionWithTitle from '@project-lc/components-layout/SectionWithTitle'; // Import Sun Editor's CSS File
import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import 'suneditor/dist/css/suneditor.min.css';
import SunEditorCore from 'suneditor/src/lib/core';
import { GoodsFormValues } from './GoodsRegistForm';

const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
  loading: () => (
    <Center>
      <Spinner />
    </Center>
  ),
});

export function GoodsRegistDescription(): JSX.Element {
  const editor = useRef<SunEditorCore>();
  const { watch, setValue } = useFormContext<GoodsFormValues>();
  const viewer = useRef<any>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // The sunEditor parameter will be set to the core suneditor instance when this function is called
  const getSunEditorInstance = (sunEditor: SunEditorCore): void => {
    editor.current = sunEditor;
  };

  const onClick = async (): Promise<void> => {
    if (!editor.current) return;
    const textWithImages = editor.current.getContents(false);

    setValue('contents', textWithImages);
    onClose();
  };

  const detailContents = watch('contents');

  useEffect(() => {
    if (viewer.current && !!detailContents) {
      viewer.current.innerHTML = detailContents;
    }
  }, [detailContents]);

  return (
    <SectionWithTitle title="상세설명 *" variant="outlined">
      <Stack>
        <Text>제품 상세 내용이 담긴 대형 이미지는 이곳에 첨부해주세요.</Text>
        <Box>
          <Button rightIcon={<EditIcon />} onClick={onOpen}>
            설명 쓰기
          </Button>
        </Box>

        {/* 작성한 상세설명 미리보기 */}
        <Box
          ref={viewer}
          className="sun-editor-editable"
          minH="100px"
          maxHeight="300px"
          overflowY="auto"
          {...boxStyle}
        />
      </Stack>
      {/* 상세설명 작성 에디터 모달창 */}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>상세설명 작성하기</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <SunEditor
              getSunEditorInstance={getSunEditorInstance}
              lang="ko"
              setOptions={{
                height: '500px',
                imageUploadSizeLimit: 20 * MB, // 퍼스트몰 최대 20mb
                buttonList: [['font', 'fontSize', 'align', 'list'], ['image']],
              }}
              defaultValue={watch('contents')}
            />
            <Button onClick={onClick}>등록</Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </SectionWithTitle>
  );
}

export default GoodsRegistDescription;
