import { CheckIcon } from '@chakra-ui/icons';
import {
  Heading,
  Box,
  useColorModeValue,
  List,
  ListIcon,
  ListItem,
  Grid,
  Button,
  VStack,
} from '@chakra-ui/react';
import GoogleLoginButton from './GoogleLoginButton';
import KakaoLoginButton from './KakaoLoginButton';
import NaverLoginButton from './NaverLoginButton';

export function SignupStart({
  moveToSignupForm,
}: {
  moveToSignupForm?: () => void;
}): JSX.Element {
  return (
    <Box rounded="lg" bg={useColorModeValue('white', 'gray.700')} boxShadow="md" p={8}>
      <Grid templateColumns="minmax(0, 1fr)" gap={4}>
        <Heading fontSize="3xl">[라이브커머스] 시작하기</Heading>

        <List spacing={3}>
          <ListItem>
            <ListIcon as={CheckIcon} color="green.500" />
            라이브커머스 상품판매
          </ListItem>
          <ListItem>
            <ListIcon as={CheckIcon} color="green.500" />
            쉽고 빠른 크리에이터 매칭
          </ListItem>
          <ListItem>
            <ListIcon as={CheckIcon} color="green.500" />
            쉽고 빠른 크리에이터 매칭
          </ListItem>
        </List>

        <VStack spacing={2}>
          <GoogleLoginButton />
          <NaverLoginButton />
          <KakaoLoginButton />
          <Button isFullWidth onClick={moveToSignupForm}>
            이메일 계정으로 가입
          </Button>
        </VStack>
      </Grid>
    </Box>
  );
}

export default SignupStart;
