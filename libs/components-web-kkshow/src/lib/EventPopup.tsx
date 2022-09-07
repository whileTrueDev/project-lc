import {
  Box,
  BoxProps,
  Button,
  Checkbox,
  ImageProps,
  LinkBox,
  LinkOverlay,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalProps,
  Stack,
  useBoolean,
  useDisclosure,
} from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { useProfile } from '@project-lc/hooks';
import { getKkshowWebHost } from '@project-lc/utils';
import { deleteCookie, getCookie, setCookie } from '@project-lc/utils-frontend';
import { s3 } from '@project-lc/utils-s3';
import dayjs from 'dayjs';
import NextLink from 'next/link';
import { useEffect } from 'react';

// s3에 저장된 배너이미지
const KKSHOW_OPEN_EVENT_IMAGE_KEY = 'public/kks_open_event.jpeg';
const EVENT_POPUP_COOKIE = 'kkshow-event-popup';
/** 신규 회원가입 이벤트 팝업 */
export function SignupEventPopup(): JSX.Element {
  return (
    <EventPopup
      s3ImageKey={KKSHOW_OPEN_EVENT_IMAGE_KEY}
      cookieKey={EVENT_POPUP_COOKIE}
      href={`${getKkshowWebHost()}/signup`}
    />
  );
}

const DELIVERY_IMAGE_KEY = 'public/delivery_popup.jpg';
const DELIVERY_POPUP_COOKIE = 'kkshow-dv';
/** 추석배송 이벤트 팝업 */
export function ChuseokDeliveryPopup(): React.ReactNode {
  const endDateOfChuseokHoliday = '2022-9-12';
  const todayIsAfterChuseokHoliday = dayjs().isAfter(endDateOfChuseokHoliday, 'day');
  if (todayIsAfterChuseokHoliday) {
    // 9월 13일부터 안뜸
    return null;
  }
  return (
    <EventPopup
      s3ImageKey={DELIVERY_IMAGE_KEY}
      cookieKey={DELIVERY_POPUP_COOKIE}
      modalSize="5xl"
      imageHeight={483}
      imageFit={{ base: 'cover', md: 'fill' }}
    />
  );
}

export interface EventPopupProps {
  s3ImageKey: string;
  cookieKey: string;
  imageHeight?: BoxProps['h'];
  /** 이미지 클릭시 이동할 링크 */
  href?: string;
  modalSize?: ModalProps['size']; // 이미지 layout=fill 이므로 이미지 가로사이즈 대신 modalSize로 가로길이 지정
  imageFit?: ImageProps['objectFit']; // 이미지 objectFit 기본값 : fill
}

export function EventPopup({
  s3ImageKey,
  cookieKey,
  href,
  imageHeight = [300, 400, 500],
  imageFit = 'fill',
  modalSize = 'lg',
}: EventPopupProps): JSX.Element {
  const { data: profile, isLoading } = useProfile();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [checked, { toggle }] = useBoolean(false);

  const onCheckBoxChange = (): void => {
    if (!checked) {
      const maxAge = 24 * 60 * 60; // 1일, 초(second)단위
      setCookie(cookieKey, 'Y', { maxAge });
    } else {
      deleteCookie(cookieKey);
    }
    toggle();
  };

  useEffect(() => {
    if (isLoading) return;
    if (profile?.id) return;
    const cookieExist = getCookie(cookieKey);
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
      size={modalSize}
    >
      <ModalOverlay bg="blackAlpha.400" />
      <ModalContent>
        <ModalBody pt={0} px={0}>
          {/* 이미지배너 링크 */}
          <LinkBox>
            {href ? (
              <NextLink href={href} passHref>
                <LinkOverlay>
                  <Box h={imageHeight} pos="relative">
                    <ChakraNextImage
                      layout="fill"
                      quality={100}
                      objectFit={imageFit}
                      priority
                      src={s3.getSavedObjectUrl(s3ImageKey)}
                      borderTopRadius="md"
                    />
                  </Box>
                </LinkOverlay>
              </NextLink>
            ) : (
              <Box h={imageHeight} pos="relative">
                <ChakraNextImage
                  layout="fill"
                  quality={100}
                  objectFit={imageFit}
                  priority
                  src={s3.getSavedObjectUrl(s3ImageKey)}
                  borderTopRadius="md"
                />
              </Box>
            )}
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
