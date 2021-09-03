import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  IconButton,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  UnorderedList,
  useDisclosure,
  Text,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Theme,
} from '@chakra-ui/react';
import { useGoodsStock } from '@project-lc/hooks';
import { useState } from 'react';

export function StockInfoButton({
  goodsId,
  confirmedGoodsId,
  goodsName,
  iconColor,
}: {
  goodsId: number;
  confirmedGoodsId?: number;
  goodsName?: string;
  iconColor?: keyof Theme['colors'];
}): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [enabled, setEnabled] = useState<boolean>(false);
  const { data, isLoading } = useGoodsStock(goodsId, confirmedGoodsId, {
    enabled,
    onSuccess: onOpen,
  });
  return (
    <>
      <IconButton
        color={iconColor}
        position="absolute"
        right={0}
        top="50%"
        variant="ghost"
        aria-label="옵션별 재고 상세보기"
        size="xs"
        isLoading={isLoading}
        onClick={() => {
          if (enabled) {
            onOpen();
          } else {
            setEnabled(true);
          }
        }}
        icon={<ExternalLinkIcon />}
      />
      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{goodsName} 옵션별 재고</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>기본옵션여부</Th>
                  <Th>옵션명</Th>
                  <Th>옵션값</Th>
                  <Th>소비자가</Th>
                  <Th>정가</Th>
                  <Th>옵션노출여부</Th>
                  <Th>총 재고</Th>
                  <Th>불량재고</Th>
                  <Th>가용재고</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data &&
                  data.map((option) => (
                    <Tr key={option.id}>
                      <Td>{option.default_option === 'y' ? '예' : '아니오'}</Td>
                      <Td>{option.option_title}</Td>
                      <Td>{option.option1}</Td>
                      <Td>{Number(option.consumer_price).toLocaleString()}</Td>
                      <Td>{Number(option.price).toLocaleString()}</Td>
                      <Td>{option.option_view === 'Y' ? '노출' : '미노출'}</Td>
                      <Td>{option.stock}</Td>
                      <Td>{option.badstock}</Td>
                      <Td>{option.rstock}</Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              닫기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default StockInfoButton;

// 상품 목록 재고/가용 헤더에서 사용되는 재고 설명 예시
export function ExampleStockDescription() {
  return (
    <Stack spacing={1.5} fontSize="sm">
      <Text>재고/가용 설명</Text>
      <Box fontWeight="bold">
        <Text height="20px" color="blue.500">
          [2] 10 / 0
        </Text>
        <Text color="red.500">[0] 0 / 0</Text>
      </Box>
      <UnorderedList spacing={1}>
        <ListItem color="blue.500">
          가용 재고가 1개 이상인&nbsp;
          <Text as="strong">옵션의 개수</Text>는 <Text as="strong">[2]</Text>
          개이며
          <br />
          해당 옵션의&nbsp;
          <Text as="strong">재고 합계 10</Text> /&nbsp;
          <Text as="strong">가용 재고 합계 0</Text>
        </ListItem>
        <ListItem color="red.500">
          가용 재고가 0개 이하인&nbsp;
          <Text as="strong">옵션의 개수</Text>는 <Text as="strong">[0]</Text>
          개이며
          <br />
          해당 옵션의&nbsp;
          <Text as="strong">재고 합계 0</Text> /&nbsp;
          <Text as="strong">가용 재고 합계 0</Text>
        </ListItem>
        <ListItem>( 가용재고 = 재고 - 불량재고 )</ListItem>
      </UnorderedList>
    </Stack>
  );
}
