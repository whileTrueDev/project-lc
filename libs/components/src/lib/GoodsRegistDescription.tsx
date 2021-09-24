/* eslint-disable @typescript-eslint/ban-types */
import {
  Text,
  Button,
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  HStack,
  useDisclosure,
  ModalHeader,
  ModalFooter,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import SunEditorCore from 'suneditor/src/lib/core';
import 'suneditor/dist/css/suneditor.min.css';

import { useFormContext } from 'react-hook-form';
import SectionWithTitle from './SectionWithTitle'; // Import Sun Editor's CSS File
import { MB } from './ImageInput';
import { GoodsFormValues, uploadGoodsImageToS3 } from './GoodsRegistForm';

const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
});

export function GoodsRegistDescription(): JSX.Element {
  const editor = useRef<SunEditorCore>();
  const { watch, setValue } = useFormContext<GoodsFormValues>();
  const viewer = useRef<any>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // The sunEditor parameter will be set to the core suneditor instance when this function is called
  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  };
  const onClick = async () => {
    if (!editor.current) return;
    const textWithImages = editor.current.getContents(false);

    if (viewer.current) {
      viewer.current.innerHTML = textWithImages;
    }
    setValue('contents', textWithImages);
    onClose();
  };

  return (
    <SectionWithTitle title="상세설명">
      <HStack>
        <Text>상품설명</Text>
        <Button onClick={onOpen}>설명 쓰기</Button>
      </HStack>

      {/* 작성한 상세설명 미리보기 */}
      <Box ref={viewer} className="sun-editor-editable" height="300px" overflowY="auto" />

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
                buttonList: [['font', 'fontSize', 'align'], ['image']],
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
