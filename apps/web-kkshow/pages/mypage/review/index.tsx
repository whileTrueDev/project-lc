import { Box } from '@chakra-ui/react';
import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';

export function ReviewIndex(): JSX.Element {
  return (
    <CustomerMypageLayout>
      <Box h="400px" bgColor="red.100" p={4}>
        리뷰 관리 페이지
        <Box>리뷰 생성하기</Box>
        <Box>리뷰 목록</Box>
        <Box>리뷰 개별조회</Box>
        <Box>리뷰 수정</Box>
        <Box>리뷰 삭제</Box>
      </Box>
    </CustomerMypageLayout>
  );
}

export default ReviewIndex;
