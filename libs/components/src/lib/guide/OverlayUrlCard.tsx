import React, { useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useToast, Text, Box, Button, Input } from '@chakra-ui/react';
import { UserProfileRes } from '@project-lc/shared-types';

interface UrlCardProps {
  profileData: UserProfileRes;
}

export function UrlCard({ profileData }: UrlCardProps): JSX.Element {
  const toast = useToast();

  // 오버레이 주소 10초간만 보여주기 위한 기본값
  const DEFAULT_OVERLAY_URL = '[URL복사] 버튼을 눌러주세요.';
  const [overlayUrlValue, setOverlayUrlValue] = useState<string>(DEFAULT_OVERLAY_URL);

  // 10초간 overlayUrl을 보여주는 함수
  const handleShowOverlayUrl = (): void => {
    const overlayUrl = `https://live.크크쇼.com${profileData.overlayUrl}` || '';
    setOverlayUrlValue(overlayUrl);

    // 클립보드 복사
    navigator.clipboard.writeText(overlayUrl);

    toast({ title: '복사되었습니다.', status: 'success' });

    setTimeout(() => {
      setOverlayUrlValue(DEFAULT_OVERLAY_URL);
    }, 8 * 1000);
  };

  return (
    <Box
      borderRadius="md"
      borderWidth="1px"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={3}
      width="100%"
    >
      <Text fontWeight="bold"> 라이브 쇼핑 화면 URL</Text>
      <Input
        maxW={300}
        size="sm"
        id="overlayUrl"
        value={profileData?.agreementFlag ? overlayUrlValue : '이용 동의가 필요합니다.'}
        isReadOnly
        isFullWidth
        variant="flushed"
        disabled={!overlayUrlValue}
      />

      <Button
        variant="solid"
        size="sm"
        disabled={!profileData?.agreementFlag}
        onClick={(): void => {
          if (!(profileData?.overlayUrl === overlayUrlValue)) {
            handleShowOverlayUrl();
          }
        }}
      >
        URL복사
      </Button>
    </Box>
  );
}
