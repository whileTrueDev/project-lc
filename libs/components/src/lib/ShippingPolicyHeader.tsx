import { Grid, ButtonGroup, Button, Heading } from '@chakra-ui/react';

/** 배송비 정책 생성 모달 상단 헤더 */
export function ShippingPolicyHeader(): JSX.Element {
  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={2} mb={4}>
      <ButtonGroup flexWrap="wrap">
        <Button size="sm">리스트 바로가기</Button>
        <Button size="sm">복사</Button>
      </ButtonGroup>
      <Heading as="h3" size="lg" textAlign="center">
        배송비 정책
      </Heading>
      <ButtonGroup justifyContent="flex-end">
        <Button size="sm">저장</Button>
      </ButtonGroup>
    </Grid>
  );
}

export default ShippingPolicyHeader;
