import {
  Box,
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
import { ShowMoreTextButton } from '..';

export interface TextViewerWithDetailModalProps {
  contents: string;
  title: string;
}
export function TextViewerWithDetailModal({
  contents,
  title,
}: TextViewerWithDetailModalProps) {
  const detailDialog = useDisclosure();
  return (
    <>
      <Stack>
        <Box maxH={350} noOfLines={contents?.startsWith('<img ') ? 1 : 6}>
          <div dangerouslySetInnerHTML={{ __html: contents }} />
        </Box>

        <Box>
          <ShowMoreTextButton onClick={detailDialog.onOpen} />
        </Box>
      </Stack>

      <Modal
        isOpen={detailDialog.isOpen}
        onClose={detailDialog.onClose}
        scrollBehavior="outside"
        size="2xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>{title || '자세히보기'}</ModalHeader>
          <ModalBody>
            <Box minH="200px">
              <div dangerouslySetInnerHTML={{ __html: contents }} />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
