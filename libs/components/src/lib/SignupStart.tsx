import { CheckIcon } from '@chakra-ui/icons';
import {
  useColorModeValue,
  List,
  ListIcon,
  ListItem,
  Button,
  Stack,
  Text,
  Link,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import CenterBox from './CenterBox';
import SocialButtonGroup from './SocialButtonGroup';

export function SignupStart({
  moveToSignupForm,
}: {
  moveToSignupForm?: () => void;
}): JSX.Element {
  return (
    <CenterBox
      enableShadow
      header={{
        title: '크크쇼 시작하기',
        desc: '',
      }}
    >
      <VStack mt={4} spacing={8} align="stretch">
        <List spacing={3}>
          <ListItem>
            <ListIcon as={CheckIcon} color="green.500" />
            라이브커머스를 통해 발생한 판매 관리
          </ListItem>
          <ListItem>
            <ListIcon as={CheckIcon} color="green.500" />
            상품에 맞는 크리에이터 매칭
          </ListItem>
          <ListItem>
            <ListIcon as={CheckIcon} color="green.500" />
            라이브 커머스 기획, 진행, 결제까지 한번에 해결
          </ListItem>
        </List>
        <Stack spacing={2}>
          <Button
            bg="blue.400"
            color="white"
            _hover={{ bg: 'blue.500' }}
            isFullWidth
            onClick={moveToSignupForm}
            mb={4}
          >
            이메일 계정으로 가입
          </Button>
          <SocialButtonGroup />

          <Text fontSize="sm" pt={2}>
            이미 가입하셨나요?
            <NextLink href="/login" passHref>
              <Link
                ml={2}
                color={useColorModeValue('blue.500', 'blue.400')}
                textDecoration="underline"
              >
                로그인
              </Link>
            </NextLink>
          </Text>
        </Stack>
      </VStack>
    </CenterBox>
  );
}

export default SignupStart;
