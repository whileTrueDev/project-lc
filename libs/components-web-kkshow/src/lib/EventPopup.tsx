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
import { useKkshowEventPopup, useProfile } from '@project-lc/hooks';
import { getKkshowWebHost } from '@project-lc/utils';
import { deleteCookie, getCookie, setCookie } from '@project-lc/utils-frontend';
import { s3 } from '@project-lc/utils-s3';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';

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

  const imageSrc = useMemo(() => {
    if (s3ImageKey.startsWith(s3.bucketDomain)) {
      return s3ImageKey;
    }
    return s3.getSavedObjectUrl(s3ImageKey);
  }, [s3ImageKey]);

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
                      src={imageSrc}
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
                  src={imageSrc}
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

export function KkshowEventPopupsSection(): JSX.Element {
  const router = useRouter();
  const { data } = useKkshowEventPopup();

  const popupListToDisplay = useMemo(() => {
    const currentPath = router.pathname;
    if (!data || !currentPath) return [];

    // 현재 메인페이지('/')인 경우 => displayPath에 '/'가 포함되어 있는지 확인
    if (currentPath === '/') {
      return data
        .filter((popup) => JSON.parse(JSON.stringify(popup.displayPath)).includes('/'))
        .reverse();
    }

    // 현재 메인페이지가 아닌경우, 현재 pathname이 '/' 를 제외한 나머지 displayPath로 시작하는지 확인
    return data
      .filter((popup) =>
        JSON.parse(JSON.stringify(popup.displayPath))
          .filter((path: string) => path !== '/')
          .some((path: string) => currentPath.startsWith(path)),
      )
      .reverse();
  }, [data, router.pathname]);

  return (
    <>
      {popupListToDisplay.map((popup) => (
        <EventPopup
          key={popup.id}
          s3ImageKey={popup.imageUrl}
          cookieKey={popup.key}
          href={popup.linkUrl || undefined}
        />
      ))}
    </>
  );
}
