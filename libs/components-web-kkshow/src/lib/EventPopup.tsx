import {
  Box,
  Button,
  Checkbox,
  LinkBox,
  LinkOverlay,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  useBoolean,
  useDisclosure,
} from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { useProfile } from '@project-lc/hooks';
import { getKkshowWebHost } from '@project-lc/utils';
import { deleteCookie, getCookie, setCookie } from '@project-lc/utils-frontend';
import { s3 } from '@project-lc/utils-s3';
import NextLink from 'next/link';
import { useEffect } from 'react';

// s3에 저장된 배너이미지
const KKSHOW_OPEN_EVENT_IMAGE_KEY = 'public/kks_open_event.jpeg';

const EVENT_POPUP_COOKIE = 'kkshow-event-popup';

export function EventPopup(): JSX.Element {
  const { data: profile, isLoading } = useProfile();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [checked, { toggle }] = useBoolean(false);

  const onCheckBoxChange = (): void => {
    if (!checked) {
      const maxAge = 24 * 60 * 60; // 1일, 초(second)단위
      setCookie(EVENT_POPUP_COOKIE, 'Y', { maxAge });
    } else {
      deleteCookie(EVENT_POPUP_COOKIE);
    }
    toggle();
  };

  useEffect(() => {
    if (isLoading) return;
    if (profile?.id) return;
    const cookieExist = getCookie(EVENT_POPUP_COOKIE);
    if (!cookieExist) {
      onOpen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id, isLoading]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      blockScrollOnMount={false}
      closeOnOverlayClick={false}
      isCentered
      size="lg"
    >
      <ModalOverlay bg="blackAlpha.400" />
      <ModalContent>
        <ModalBody pt={0} px={0}>
          {/* 이미지배너 링크 */}
          <LinkBox>
            <NextLink href={`${getKkshowWebHost()}/signup`} passHref>
              <LinkOverlay>
                <Box h={[300, 400, 500]} pos="relative">
                  <ChakraNextImage
                    layout="fill"
                    quality={100}
                    objectFit="fill"
                    priority
                    src={s3.getSavedObjectUrl(KKSHOW_OPEN_EVENT_IMAGE_KEY)}
                    borderTopRadius="md"
                  />
                </Box>
              </LinkOverlay>
            </NextLink>
          </LinkBox>

          <Stack
            pt={2}
            px={1}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            {/* 체크박스 */}
            <Checkbox isChecked={checked} onChange={onCheckBoxChange}>
              오늘 하루동안 안보기
            </Checkbox>
            <Button size="sm" colorScheme="blue" mr={3} onClick={onClose}>
              닫기
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default EventPopup;
