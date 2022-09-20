import { QuestionIcon } from '@chakra-ui/icons';
import {
  Box,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { useProfile } from '@project-lc/hooks';
import { s3 } from '@project-lc/utils-s3';
import { useState } from 'react';
import { UrlCard } from './OverlayUrlCard';

/** useProfile 에서 "상품홍보페이지url" 값을 가져와서 표시하고, 클립보드에 복사하는 컴포넌트
 * profileData.broadcasterPromotionPage 값이 없는경우 아무것도 표시되지 않는다
 */
export function PromotionPageUrlCard(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();
  const { data: profileData } = useProfile();

  // 상품홍보페이지url 10초간만 보여주기 위한 기본값
  const DEFAULT_URL = '[URL복사] 버튼을 눌러주세요.';
  const [urlValue, setUrlValue] = useState<string>(DEFAULT_URL);

  // 10초간 상품홍보페이지url을 보여주는 함수
  const handleShowUrl = (): void => {
    if (
      !profileData?.broadcasterPromotionPage ||
      profileData?.broadcasterPromotionPage.url === urlValue
    ) {
      return;
    }

    const { url } = profileData.broadcasterPromotionPage;
    if (!url) return;
    setUrlValue(url);

    // 클립보드 복사
    navigator.clipboard.writeText(url);

    toast({ title: '복사되었습니다.', status: 'success' });

    setTimeout(() => {
      setUrlValue(DEFAULT_URL);
    }, 8 * 1000);
  };

  if (!profileData?.broadcasterPromotionPage) return <></>;

  return (
    <UrlCard
      label={
        <>
          <Text fontWeight="bold">
            상품 홍보 페이지 URL
            <IconButton
              variant="ghost"
              aria-label="도움말"
              icon={<QuestionIcon />}
              onClick={onOpen}
            />
          </Text>
          <PromotionPageUrlInformationModal isOpen={isOpen} onClose={onClose} />
        </>
      }
      inputValue={!profileData?.agreementFlag ? '이용 동의가 필요합니다.' : urlValue}
      inputDisabled={!urlValue}
      buttonDisabled={!profileData?.agreementFlag}
      buttonHandler={handleShowUrl}
    />
  );
}

const BASE_BANNER_IMAGE_S3_PATH = `${s3.bucketDomain}public/`;
const baseBannerImages = [
  {
    key: 'promotion-page-banner-twitch.png',
    name: '트위치 기본 배너',
    desc: '트위치 패널에 등록하세요!',
    width: 320,
    height: 96,
  },
  {
    key: 'promotion-page-banner-afreeca-floating.png',
    desc: '아프리카 방송국 플로팅 배너에 등록하세요!',
    name: '아프리카 플로팅 기본 배너',
    width: 126,
    height: 329,
  },
  {
    key: 'promotion-page-banner-afreeca-bottom.png',
    desc: '아프리카 방송국 하단 배너에 등록하세요!',
    name: '아프리카 방송국 하단 기본 배너',
    width: 750,
    height: 150,
  },
];

/** 도움말 정보 모달 */
export function PromotionPageUrlInformationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="3xl" blockScrollOnMount>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>상품 홍보 페이지란?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={10}>
              <Text>
                해당 페이지에서 판매가 발생하면 일정 수수료가 지급됩니다. <br />팬
                여러분들이 볼 수 있는 공간 (방송국 정보란, 개인 SNS 등)에 해당 URL을
                게시하고 상품을 홍보해보세요!
              </Text>
              <Box pos="relative" w="100%" h="600px">
                <ChakraNextImage
                  layout="fill"
                  objectFit="contain"
                  src={`${BASE_BANNER_IMAGE_S3_PATH}promotion-page-example.png`}
                />
              </Box>

              <Box>
                <Text fontWeight="bold" mb={4}>
                  기본 이미지(사용할 이미지가 없으시면 사용해주세요)
                </Text>
                <Stack spacing={4}>
                  {baseBannerImages.map((img) => {
                    const { key, desc, width, height, name } = img;
                    return (
                      <Box key={key}>
                        <Box
                          display="inline-block"
                          cursor="pointer"
                          onClick={() => {
                            const url = `${BASE_BANNER_IMAGE_S3_PATH}${key}`;

                            fetch(url)
                              .then((response) => response.blob())
                              .then((blob) => {
                                const blobUrl = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = blobUrl;
                                a.download = name;
                                a.click();
                                a.remove();
                              });
                          }}
                        >
                          <ChakraNextImage
                            width={width}
                            height={height}
                            src={`${BASE_BANNER_IMAGE_S3_PATH}${key}`}
                          />
                        </Box>
                        <Text>{desc}</Text>
                      </Box>
                    );
                  })}
                </Stack>
              </Box>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
