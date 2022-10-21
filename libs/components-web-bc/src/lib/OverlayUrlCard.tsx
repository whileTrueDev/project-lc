import { Button, Flex, Input, Text, useToast } from '@chakra-ui/react';
import { useProfile } from '@project-lc/hooks';
import { getOverlayHost } from '@project-lc/utils';
import { useState } from 'react';

export interface UrlCardProps {
  inputValue: string;
  inputDisabled: boolean;
  buttonDisabled: boolean;
  buttonHandler: () => void;
  label: string | JSX.Element;
}

/** url 표시, url 복사 컴포넌트
 * 실제로 표시되는 label, input value, button onClick 핸들러 모두 props로 받아온다 */
export function UrlCard(props: UrlCardProps): JSX.Element {
  const { inputValue, inputDisabled, buttonDisabled, buttonHandler, label } = props;

  return (
    <Flex
      borderRadius="md"
      borderWidth="1px"
      flexDir="column"
      alignItems="center"
      justifyContent="space-between"
      p={3}
      h={150}
    >
      {typeof label === 'string' ? <Text fontWeight="bold">{label}</Text> : label}

      <Input
        textAlign="center"
        maxW={300}
        size="sm"
        id="overlayUrl"
        value={inputValue}
        isReadOnly
        variant="flushed"
        disabled={inputDisabled}
      />

      <Button variant="solid" disabled={buttonDisabled} onClick={buttonHandler}>
        URL복사
      </Button>
    </Flex>
  );
}

/** useProfile 에서 "오버레이url" 값을 가져와서 표시하고, 클립보드에 복사하는 컴포넌트 */
export function OverlayUrlCard(): JSX.Element {
  const toast = useToast();
  const { data: profileData } = useProfile();

  // 오버레이 주소 10초간만 보여주기 위한 기본값
  const DEFAULT_OVERLAY_URL = '[URL복사] 버튼을 눌러주세요.';
  const [overlayUrlValue, setOverlayUrlValue] = useState<string>(DEFAULT_OVERLAY_URL);

  // 10초간 overlayUrl을 보여주는 함수
  const handleShowOverlayUrl = (): void => {
    const overlayUrl = `${getOverlayHost()}${profileData?.overlayUrl}` || '';
    setOverlayUrlValue(overlayUrl);

    // 클립보드 복사
    navigator.clipboard.writeText(overlayUrl);

    toast({ title: '복사되었습니다.', status: 'success' });

    setTimeout(() => {
      setOverlayUrlValue(DEFAULT_OVERLAY_URL);
    }, 8 * 1000);
  };

  return (
    <UrlCard
      label="라이브 쇼핑 오버레이 화면 URL"
      inputValue={
        profileData?.agreementFlag ? overlayUrlValue : '이용 동의가 필요합니다.'
      }
      inputDisabled={!overlayUrlValue}
      buttonDisabled={!profileData?.agreementFlag}
      buttonHandler={(): void => {
        if (!(profileData?.overlayUrl === overlayUrlValue)) {
          handleShowOverlayUrl();
        }
      }}
    />
  );
}
