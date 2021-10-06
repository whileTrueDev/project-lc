/* eslint-disable @typescript-eslint/ban-types */
import { EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import 'suneditor/dist/css/suneditor.min.css';
import SunEditorCore from 'suneditor/src/lib/core';
import { boxStyle } from '../constants/commonStyleProps';
import { GoodsFormValues } from './GoodsRegistForm';
import { MB } from './ImageInput';
import SectionWithTitle from './SectionWithTitle'; // Import Sun Editor's CSS File

const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
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

    if (viewer.current) {
      viewer.current.innerHTML = textWithImages;
    }
    setValue('contents', textWithImages);
    onClose();
  };

  return (
    <SectionWithTitle title="상세설명 *">
      <Stack>
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
