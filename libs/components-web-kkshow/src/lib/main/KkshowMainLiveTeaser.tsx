import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react';
import BorderedAvatar from '@project-lc/components-core/BorderedAvatar';
import MotionBox from '@project-lc/components-core/MotionBox';
import RedLinedText from '@project-lc/components-core/RedLinedText';
import { useKkshowMain } from '@project-lc/hooks';
import { openKakaoChannel } from '@project-lc/utils-frontend';
import dayjs from 'dayjs';
import { MdOutlineNotificationsActive } from 'react-icons/md';
import KkshowMainTitle from './KkshowMainTitle';

export function KkshowLiveTeaser(): JSX.Element | null {
  const { data } = useKkshowMain();

  if (!data) return null;

  const discountRate = (
    ((data.trailer.normalPrice - data.trailer.discountedPrice) /
      data.trailer.normalPrice) *
    100
  ).toFixed(0);

  return (
    <Box pt={20} overflow="hidden" pos="relative">
      <KkshowMainTitle color="red">라이브 예고</KkshowMainTitle>

      <Container
        as={Flex}
        minH={{ base: 400 }}
        justify="center"
        maxW="5xl"
        py={6}
        gap={4}
        flexDirection={{ base: 'column', md: 'row' }}
      >
        <MotionBox
          as={Flex}
          gap={2}
          justifyContent="center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
          viewport={{ once: true }}
        >
          <Flex w={300} h={300} boxShadow="xl" borderRadius="2xl" position="relative">
            <Image borderRadius="2xl" w="100%" h="100%" src={data.trailer.imageUrl} />
            <BorderedAvatar
              display={{ base: 'flex', lg: 'none' }}
              position="absolute"
              top="-25px"
              right="-25px"
              size="xl"
              src={data.trailer.broadcasterProfileImageUrl}
            />
          </Flex>

          <Stack
            display={{ base: 'none', lg: 'flex' }}
            p={2}
            w={250}
            h={300}
            borderRadius="2xl"
            backgroundColor="gray.200"
            justify="space-evenly"
            alignItems="center"
            boxShadow="lg"
            color="blackAlpha.900"
          >
            <Flex flexDir="column" align="center" justify="center" gap={2}>
              <BorderedAvatar size="xl" src={data.trailer.broadcasterProfileImageUrl} />
              <Box textAlign="center">
                <Heading fontSize="md" fontWeight="medium">
                  방송인
                </Heading>
                <Heading fontSize="2xl">{data.trailer.broadcasterNickname}</Heading>
              </Box>
            </Flex>
            <Box>
              <Heading fontSize="md" fontWeight="medium" whiteSpace="break-spaces">
                {data.trailer.broadcasterDescription
                  .split(',')
                  .slice(0, 4)
                  .map((tag, idx) => {
                    const _tag = tag.startsWith('#') ? tag : `#${tag}`;
                    return (
                      <span key={_tag}>
                        {_tag}
                        {idx === 1 ? '\n' : ' '}
                      </span>
                    );
                  })}
              </Heading>
            </Box>
          </Stack>
        </MotionBox>

        <MotionBox
          as={Stack}
          justifyContent="space-around"
          h={{ base: 200, md: 300 }}
          ml={4}
          textAlign={{ base: 'center', lg: 'unset' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
          viewport={{ once: true }}
        >
          <Box>
            <Heading color="blue.500" fontSize={{ base: 'lg', md: '2xl' }}>
              {data.trailer.liveShoppingName}
            </Heading>
            <Heading fontSize={{ base: 'md', lg: '2xl' }} fontWeight="medium">
              {dayjs(data.trailer.broadcastStartDate).format('YYYY. MM. DD (dd) a h시')}
            </Heading>
          </Box>

          <Stack spacing={4}>
            <Box>
              <Heading fontSize={{ base: 'lg', md: '2xl' }} fontWeight="medium">
                라이브 특가
              </Heading>
              <Heading fontSize={{ base: 'lg', md: '2xl' }}>
                <Text as="span" color="red">
                  {discountRate}%
                </Text>{' '}
                {data.trailer.discountedPrice.toLocaleString()}원
                <RedLinedText fontSize="md" as="span" fontWeight="normal">
                  {' '}
                  ({data.trailer.normalPrice.toLocaleString()}원)
                </RedLinedText>
              </Heading>
            </Box>
            {/* // TODO 알림 기능 추가 이후 알림 추가로 변경 */}
            <Box>
              <Button
                onClick={openKakaoChannel}
                borderColor="red"
                color="red"
                variant="outline"
                rounded="3xl"
                leftIcon={<MdOutlineNotificationsActive fontSize="24px" />}
              >
                알림받기
              </Button>
            </Box>
          </Stack>
        </MotionBox>
      </Container>
    </Box>
  );
}

export default KkshowLiveTeaser;
