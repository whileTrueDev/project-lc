import {
  Box,
  Button,
  Flex,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { TextDotConnector } from '@project-lc/components-core/TextDotConnector';
import { FmReturnStatusBadge } from '@project-lc/components-shared/FmReturnStatusBadge';
import {
  convertFmReturnMethodToString,
  convertFmReturnTypesToString,
  FmOrderReturn,
} from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { OrderReturnStatusDialog } from './OrderReturnStatusDialog';

/** 주문 반품 정보 */
export function OrderDetailReturnInfo({
  returns,
}: {
  returns: FmOrderReturn;
}): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Stack direction="row" alignItems="center" my={2} spacing={1.5}>
        <Link isTruncated fontWeight="bold" textDecoration="underline">
          {returns.return_code}
        </Link>
        <FmReturnStatusBadge returnStatus={returns.status} />
        <TextDotConnector />
        <Text isTruncated>{returns.ea} 개</Text>
      </Stack>

      <Stack>
        <Text>반품 유형: {convertFmReturnTypesToString(returns.return_type)}</Text>
        <Text>
          (반품요청일) {dayjs(returns.regist_date).format('YYYY년 MM월 DD일 HH:mm:ss')}
        </Text>
        {returns.return_date && (
          <Text>
            (반품완료일) {dayjs(returns.return_date).format('YYYY년 MM월 DD일 HH:mm:ss')}
          </Text>
        )}
        <Box>
          <Button size="sm" onClick={onOpen}>
            반품 상태 관리
          </Button>
        </Box>
      </Stack>

      <Stack my={2}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
          <Stack spacing={1} my={2}>
            <Box mb={2}>
              <Text fontWeight="bold">반품 상세 정보</Text>
            </Box>
            <Text>회수 방법: {convertFmReturnMethodToString(returns.return_method)}</Text>
            <Text>상세 사유</Text>
            <Textarea
              isReadOnly
              variant="outline"
              p={1}
              maxW={300}
              value={returns.return_reason}
            />
          </Stack>
          <Stack spacing={1} my={2}>
            <Box mb={2}>
              <Text fontWeight="bold">회수지 정보</Text>
            </Box>
            <Text>(우편번호) {returns.sender_zipcode}</Text>
            <Text>
              (지번) {returns.sender_address} {returns.sender_address_detail}
            </Text>
            <Text>
              (도로명) {returns.sender_address_street} {returns.sender_address_detail}
            </Text>
            {returns.cellphone && <Text>{returns.cellphone}</Text>}
            {returns.phone && <Text>{returns.phone}</Text>}
          </Stack>
        </SimpleGrid>
      </Stack>

      {/* 이 반품에 포함된 상품(옵션) 목록 */}
      {returns.items.length > 0 && (
        <Box my={2}>
          <Text fontWeight="bold">반품 상품</Text>
          {returns.items.map((i) => (
            <Flex mb={2} key={i.item_option_seq}>
              {i.image && (
                <ChakraNextImage
                  layout="intrinsic"
                  width={30}
                  height={30}
                  alt=""
                  src={`http://whiletrue.firstmall.kr${i.image || ''}`}
                />
              )}

              <Stack
                ml={i.image ? 2 : 0}
                key={i.return_item_seq}
                direction="row"
                alignItems="center"
              >
                <Text isTruncated>{i.goods_name}</Text>

                {i.title1 && i.option1 && (
                  <>
                    <TextDotConnector />
                    <Text isTruncated>
                      {i.title1}: {i.option1}
                    </Text>
                  </>
                )}
                <TextDotConnector />
                <Text isTruncated>{i.ea} 개</Text>
                <TextDotConnector />
                <Text isTruncated>{i.reason_desc}</Text>
              </Stack>
            </Flex>
          ))}
        </Box>
      )}
      <OrderReturnStatusDialog isOpen={isOpen} onClose={onClose} data={returns} />
    </Box>
  );
}

export default OrderDetailReturnInfo;
