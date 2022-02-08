import { QuestionIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  useColorModeValue,
  useToast,
  Text,
} from '@chakra-ui/react';
import { useProfile } from '@project-lc/hooks';
import { useState } from 'react';
import { UrlCard } from './OverlayUrlCard';

/** useProfile 에서 "상품홍보페이지url" 값을 가져와서 표시하고, 클립보드에 복사하는 컴포넌트
 * profileData.BroadcasterPromotionPage 값이 없는경우 아무것도 표시되지 않는다
 */
export function PromotionPageUrlCard(): JSX.Element {
  const toast = useToast();
  const { data: profileData } = useProfile();

  // 오버레이 주소 10초간만 보여주기 위한 기본값
  const DEFAULT_URL = '[URL복사] 버튼을 눌러주세요.';
  const [urlValue, setUrlValue] = useState<string>(DEFAULT_URL);

  // 10초간 overlayUrl을 보여주는 함수
  const handleShowUrl = (): void => {
    if (
      !profileData?.BroadcasterPromotionPage ||
      profileData?.BroadcasterPromotionPage.url === urlValue
    ) {
      return;
    }

    const { url } = profileData.BroadcasterPromotionPage;
    if (!url) return;
    setUrlValue(url);

    // 클립보드 복사
    navigator.clipboard.writeText(url);

    toast({ title: '복사되었습니다.', status: 'success' });

    setTimeout(() => {
      setUrlValue(DEFAULT_URL);
    }, 8 * 1000);
  };

  if (!profileData?.BroadcasterPromotionPage) return <></>;

  return (
    <UrlCard
      label={
        <>
          <Text fontWeight="bold">상품 홍보 페이지 URL</Text>
          <PromotionPageUrlPopover />
        </>
      }
      inputValue={!profileData?.agreementFlag ? '이용 동의가 필요합니다.' : urlValue}
      inputDisabled={!urlValue}
      buttonDisabled={!profileData?.agreementFlag}
      buttonHandler={handleShowUrl}
    />
  );
}

/** 도움말 정보 받기 전 임시로 만든 팝오버 */
export function PromotionPageUrlPopover(): JSX.Element {
  return (
    <Popover placement="bottom" closeOnBlur={false}>
      <PopoverTrigger>
        <IconButton variant="ghost" aria-label="도움말" icon={<QuestionIcon />} />
      </PopoverTrigger>
      <PopoverContent
        bg={useColorModeValue('gray.200', 'blue.800')}
        borderColor={useColorModeValue('gray.300', 'blue.800')}
      >
        <PopoverHeader pt={4} fontWeight="bold" border="0">
          Manage Your Channels
        </PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
          incididunt ut labore et dolore.
        </PopoverBody>
        <PopoverFooter
          border="0"
          d="flex"
          alignItems="center"
          justifyContent="space-between"
          pb={4}
        >
          <Box fontSize="sm">Step 2 of 4</Box>
          <ButtonGroup size="sm">
            <Button colorScheme="green">Setup Email</Button>
            <Button colorScheme="blue">Next</Button>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}
