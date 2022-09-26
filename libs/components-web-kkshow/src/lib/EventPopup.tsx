import {
  AspectRatio,
  Button,
  Checkbox,
  Link,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalProps,
  Stack,
  useBoolean,
  useDisclosure,
} from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { useKkshowEventPopup, useProfile } from '@project-lc/hooks';
import { deleteCookie, getCookie, setCookie } from '@project-lc/utils-frontend';
import { s3 } from '@project-lc/utils-s3';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';

export interface EventPopupProps {
  s3ImageKey: string;
  cookieKey: string;
  /** 이미지 클릭시 이동할 링크 */
  href?: string;
  modalSize?: ModalProps['size']; // 이미지 layout=fill 이므로 이미지 가로사이즈 대신 modalSize로 가로길이 지정
  imageWidth?: number | null;
  imageHeight?: number | null;
}

export function EventPopup({
  s3ImageKey,
  cookieKey,
  href,
  modalSize = 'xl',
  imageWidth,
  imageHeight,
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

  const ratio = useMemo(() => {
    if (!imageWidth || !imageHeight) return 1;
    return imageWidth / imageHeight;
  }, [imageWidth, imageHeight]);

  const popupImageComponent = useMemo(() => {
    return (
      <AspectRatio maxW={modalSize} ratio={ratio}>
        <ChakraNextImage
          layout="fill"
          quality={100}
          objectFit="scale-down"
          priority
          src={imageSrc}
        />
      </AspectRatio>
    );
  }, [imageSrc, modalSize, ratio]);

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
      <ModalContent borderRadius="md" overflow="hidden">
        {/* 이미지배너 링크 */}
        {href ? (
          <Link href={href} isExternal={href.startsWith('http')}>
            {popupImageComponent}
          </Link>
        ) : (
          <>{popupImageComponent}</>
        )}

        <Stack
          py={1}
          direction="row"
          alignItems="center"
          justifyContent="center"
          background="white"
        >
          {/* 체크박스 */}
          <Checkbox isChecked={checked} onChange={onCheckBoxChange}>
            오늘 하루동안 안보기
          </Checkbox>
          <Button size="sm" colorScheme="blue" mr={3} onClick={onClose}>
            닫기
          </Button>
        </Stack>
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
          imageWidth={popup.width}
          imageHeight={popup.height}
        />
      ))}
    </>
  );
}
