import { Box, Center, Divider, Grid, Image, Stack, Text, VStack } from '@chakra-ui/react';
import { useDisplaySize } from '@project-lc/hooks';
import { s3 } from '@project-lc/utils-s3';
import { useEffect, useState } from 'react';
import { guideConditionStore } from '@project-lc/stores';
import { BROADCASTER_GUIDE_IMAGE_KEY } from '@project-lc/shared-types';

export function LiveShoppingMonitorSection(): JSX.Element {
  const { isMobileSize } = useDisplaySize();
  const [src, setSrc] = useState<string>('');
  const { completeStep } = guideConditionStore();

  const s3ImageKey = BROADCASTER_GUIDE_IMAGE_KEY;
  const expiresIn = 3600; // 이미지 url 유효 시간

  useEffect(() => {
    completeStep();
    const setImageSrc = async (): Promise<void> => {

      const imageString = await s3.getPresignedUrl({Key: s3ImageKey},{expiresIn});
      setSrc(imageString);
    };
    setImageSrc();
  }, [completeStep]);

  return (
    <Stack pt={3} pb={3} spacing={5}>
      <Center>
        <VStack spacing={0}>
          <Divider mb={3} borderWidth={0.5} />
          <Text>라이브 쇼핑 화면 예시</Text>
        </VStack>
      </Center>
      <VStack>
        <Box key="banner-guide" flexBasis={0} flexGrow={0} whiteSpace="nowrap">
          <Image
            width={isMobileSize ? 260 : '2xl'}
            height={isMobileSize ? 260 : 'lg'}
            rounded="md"
            alt="feature image"
            src={src}
          />
        </Box>
      </VStack>
      <VStack>
        <Grid width="xl" direction="row" gap={3}>
          <Text fontSize="md" fontWeight="semibold">
            1. 구매랭킹 : 가장 많은 금액을 구매한 상위 닉네임 4개 박제
          </Text>
          <Text fontSize="md" fontWeight="semibold">
            2. 세로배너 : 상품 정보 기재
          </Text>
          <Text fontSize="md" fontWeight="semibold">
            3. 도네 : 구매 금액과 응원 메시지
          </Text>
          <Text fontSize="md" fontWeight="semibold">
            4. 타이머 : 라이브 커머스 종료까지 남은 시간
          </Text>
        </Grid>
      </VStack>
      <Center>
        <Text colorScheme="gray" fontWeight="thin">
          화면 구성을 숙지하셨다면 아래의 다음 버튼을 클릭하여 다음단계를 진행해주세요.
        </Text>
      </Center>
    </Stack>
  );
}
