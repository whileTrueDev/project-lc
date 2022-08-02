import {
  Button,
  Checkbox,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  Stack,
  useBoolean,
  useDisclosure,
} from '@chakra-ui/react';
import { s3 } from '@project-lc/utils-s3';
import { setCookie, getCookie, deleteCookie } from '@project-lc/utils-frontend';
import { useEffect } from 'react';

// s3에 저장된 배너이미지
const KKSHOW_OPEN_EVENT_IMAGE_KEY = 'public/kks_open_event.jpeg';

const EVENT_POPUP_COOKIE = 'kkshow-event-popup';

export function EventPopup(): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [checked, { toggle }] = useBoolean(false);

  useEffect(() => {
    const cookieExist = getCookie(EVENT_POPUP_COOKIE);
    if (!cookieExist) {
      onOpen();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      blockScrollOnMount={false}
      closeOnOverlayClick={false}
      size="lg"
    >
      <ModalContent>
        <ModalCloseButton />
        <ModalBody pt={10} px={0}>
          <Image src={s3.getSavedObjectUrl(KKSHOW_OPEN_EVENT_IMAGE_KEY)} />
          <Stack
            pt={2}
            px={1}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Checkbox
              isChecked={checked}
              onChange={(e) => {
                if (!checked) {
                  const maxAge = 24 * 60 * 60; // 1일, 초(second)단위
                  setCookie(EVENT_POPUP_COOKIE, 'Y', { maxAge });
                } else {
                  deleteCookie(EVENT_POPUP_COOKIE);
                }
                toggle();
              }}
            >
              오늘 하루동안 안보기
            </Checkbox>
            <Button size="xs" colorScheme="blue" mr={3} onClick={onClose}>
              닫기
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default EventPopup;
