import { Box, Image, Stack, Text, VStack } from '@chakra-ui/react';
import { useDisplaySize } from '@project-lc/hooks';
import { BROADCASTER_GUIDE_IMAGE_KEY } from '@project-lc/shared-types';
import { guideConditionStore } from '@project-lc/stores';
import { s3 } from '@project-lc/utils-s3';
import { useEffect, useState } from 'react';

export function LiveShoppingMonitorSection(): JSX.Element {
  const { isMobileSize } = useDisplaySize();
  const [src, setSrc] = useState<string>('');
  const { completeStep } = guideConditionStore();

  const s3ImageKey = BROADCASTER_GUIDE_IMAGE_KEY;
  const expiresIn = 3600; // 이미지 url 유효 시간

  useEffect(() => {
    completeStep();
    const setImageSrc = async (): Promise<void> => {
      const imageString = await s3.getPresignedUrl({ Key: s3ImageKey }, { expiresIn });
      setSrc(imageString);
    };
    setImageSrc();
  }, [completeStep, s3ImageKey]);

  return (
    <Stack spacing={5}>
      <VStack>
        <Box
          key="banner-guide"
          flexBasis={0}
          flexGrow={0}
          whiteSpace="nowrap"
          textAlign="center"
        >
          <Text fontWeight="bold">라이브 쇼핑 화면 예시</Text>
          <Image
            width={isMobileSize ? 260 : '2xl'}
            height={isMobileSize ? 260 : 'lg'}
            rounded="md"
            alt="feature image"
            src={src}
          />
        </Box>
      </VStack>

      <Stack spacing={4}>
        <Text fontSize="md" fontWeight="semibold" whiteSpace="break-spaces">
          {`1. 구매랭킹 : 가장 많은 금액을 구매한 상위 시청자 4명의 닉네임\n2. 세로배너 : 상품 정보 기재\n3. 구매알림 : 구매 금액과 응원 메시지\n4. 타이머 : 라이브 커머스 종료까지 남은 시간`}
        </Text>
        <Text color="GrayText" textAlign="center">
          아래의 다음 버튼을 클릭하여 다음단계를 진행해주세요.
        </Text>
      </Stack>
    </Stack>
  );
}
