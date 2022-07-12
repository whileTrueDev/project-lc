import { CheckIcon } from '@chakra-ui/icons';
import {
  Button,
  Link,
  List,
  ListIcon,
  ListItem,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import CenterBox from '@project-lc/components-layout/CenterBox';
import { nanoid } from 'nanoid';
import NextLink from 'next/link';
import SocialButtonGroup from '../SocialButtonGroup';

const SELLER_DISPLAY_TEXT_LIST = [
  '라이브커머스를 통해 발생한 판매 관리',
  '상품에 맞는 크리에이터 매칭',
  '라이브 커머스 기획, 진행, 결제까지 한번에 해결',
];

const BROADCASTER_DISPLAY_TEXT_LIST = [
  '내 방송에서도 라이브로 상품 판매를!',
  `'오늘은 내가 쇼호스트!' 시청자에게 좋은 상품을 소개해 보세요.`,
  '누구나 쉽게 할 수 있는 화면 세팅으로 시작해 보세요.',
];

const CUSTOMER_DISPLAY_TEXT_LIST = [
  '영양가 있는 간편식',
  '간단한 조리로도 맛있는 식탁',
  '크리에이터와 함께하는 쇼핑!',
];

const DISPLAY_TEXT: Record<SignupProcessItemProps['userType'], string[]> = {
  seller: SELLER_DISPLAY_TEXT_LIST,
  broadcaster: BROADCASTER_DISPLAY_TEXT_LIST,
  customer: CUSTOMER_DISPLAY_TEXT_LIST,
};

export interface SignupProcessItemProps {
  userType: 'seller' | 'broadcaster' | 'customer';
  moveToNext?: () => void;
  moveToPrev?: () => void;
}
type SignupStartProps = SignupProcessItemProps;

export function SignupStart({
  userType = 'seller',
  moveToNext,
}: SignupStartProps): JSX.Element {
  const displayTextList = DISPLAY_TEXT[userType];
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
          {displayTextList.map((text) => (
            <ListItem key={nanoid()}>
              <ListIcon as={CheckIcon} color="green.500" verticalAlign="middle" />
              {text}
            </ListItem>
          ))}
        </List>
        <Stack spacing={2}>
          <Button
            bg="blue.400"
            color="white"
            _hover={{ bg: 'blue.500' }}
            isFullWidth
            onClick={moveToNext}
            mb={4}
          >
            이메일 계정으로 가입
          </Button>
          <SocialButtonGroup userType={userType} />

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
