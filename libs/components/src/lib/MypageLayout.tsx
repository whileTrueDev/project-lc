import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Center,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';
import { useProfile } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import React from 'react';
import MypageFooter from './MypageFooter';
import { MypageNavbar } from './MypageNavbar';
import { Navbar } from './Navbar';

interface MypageLayoutProps {
  children: React.ReactNode;
}

export function MypageLayout({ children }: MypageLayoutProps): JSX.Element {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  // getServerSideprops 내에서는 훅, react-query 못씀
  // TODO: 로그인한 유저정보를 여기서 가져오는 게 맞을지 다시 고려해보기
  const { data, isFetching, error } = useProfile();

  return (
    <Box position="relative" pointerEvents={!data || isFetching ? 'none' : 'auto'}>
      <Navbar />

      <MypageNavbar />

      <Box as="main" minH="calc(100vh - 60px - 60px - 60px)">
        {children}
      </Box>

      <MypageFooter />

      {/* 전체화면 로딩 */}
      {(!data || isFetching) && (
        <Center
          position="fixed"
          left="0"
          top="0"
          width="100vw"
          height="100vh"
          opacity="0.5"
          bg="gray"
        >
          <Spinner />
        </Center>
      )}

      {/* 로그인 필요 다이얼로그 */}
      <AlertDialog isOpen={!!error} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              로그인이 필요합니다
            </AlertDialogHeader>

            <AlertDialogBody>메인페이지로 이동합니다</AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={() => router.push('/')} ml={3}>
                확인
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}

export default MypageLayout;
