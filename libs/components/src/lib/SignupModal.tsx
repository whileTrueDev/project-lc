import {
  AspectRatio,
  Box,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  SimpleGrid,
  useBreakpoint,
  useBreakpointValue,
  VisuallyHidden,
} from '@chakra-ui/react';
import { SignupForm } from './SignupForm';

interface SignupModalProps {
  isOpen: boolean;
  onClose?: () => void;
}
export function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const isImageOpen = useBreakpointValue({ base: false, md: true });

  return (
    <Modal
      isOpen={isOpen}
      isCentered
      onClose={() => {
        if (onClose) onClose();
      }}
      size="4xl"
    >
      <ModalContent>
        <ModalBody>
          <SimpleGrid alignItems="center" columns={{ base: 1, md: 2 }}>
            <Box flex={1}>
              <SignupForm />
            </Box>
            {isImageOpen && (
              <Box flex={1}>
                <AspectRatio ratio={1 / 1}>
                  <Image
                    objectFit="cover"
                    src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80"
                  />
                </AspectRatio>
              </Box>
            )}
          </SimpleGrid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
