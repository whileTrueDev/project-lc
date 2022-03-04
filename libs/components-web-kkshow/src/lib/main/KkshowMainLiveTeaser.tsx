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
import { MdOutlineNotificationsActive } from 'react-icons/md';
import KkshowMainTitle from './KkshowMainTitle';

export function KkshowLiveTeaser(): JSX.Element {
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
            <Image borderRadius="2xl" w="100%" h="100%" src="images/main/th-3.png" />
            <BorderedAvatar
              display={{ base: 'flex', lg: 'none' }}
              position="absolute"
              top="-25px"
              right="-25px"
              size="xl"
              src="https://static-cdn.jtvnw.net/jtv_user_pictures/04ace7cf-1f09-439a-af6f-dc8d878d814b-profile_image-300x300.png"
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
              <BorderedAvatar
                size="xl"
                src="https://static-cdn.jtvnw.net/jtv_user_pictures/04ace7cf-1f09-439a-af6f-dc8d878d814b-profile_image-300x300.png"
              />
              <Box textAlign="center">
                <Heading fontSize="md" fontWeight="medium">
                  방송인
                </Heading>
                <Heading fontSize="2xl">민결희</Heading>
              </Box>
            </Flex>
            <Box>
              <Heading fontSize="md" fontWeight="medium">
                #버츄얼 #라방
              </Heading>
              <Heading fontSize="md" fontWeight="medium">
                #트위치 #유튜브
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
              민결희 X 예스 예스 예스 X3 닭강정
            </Heading>
            <Heading fontSize={{ base: 'md', lg: '2xl' }} fontWeight="medium">
              2022. 02. 20 (일) 오후 1시
            </Heading>
          </Box>

          <Stack spacing={4}>
            <Box>
              <Heading fontSize={{ base: 'lg', md: '2xl' }} fontWeight="medium">
                라이브 특가
              </Heading>
              <Heading fontSize={{ base: 'lg', md: '2xl' }}>
                <Text as="span" color="red">
                  20%
                </Text>{' '}
                14,900원
              </Heading>
            </Box>
            <Box>
              <Button
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
