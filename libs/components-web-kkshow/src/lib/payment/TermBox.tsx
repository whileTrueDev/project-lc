import {
  Box,
  Flex,
  HStack,
  ListItem,
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList,
} from '@chakra-ui/react';

/** 개인정보 제공동의 내용 -> 노션 "크크쇼 수정해야 할 문구" 문서 참고 */
function PrivacyTerm1({ shopNames }: { shopNames: string[] }): JSX.Element {
  return (
    <UnorderedList spacing={2} fontSize="xs">
      <ListItem>
        고객님께서는 아래 내용에 대하여 동의를 거부하실 수 있으며, 거부시 상품 배송, CS가
        제한됩니다.
      </ListItem>
      <ListItem>
        <Text>
          개인정보를 제공받는 자 :
          {shopNames.map((name) => (
            <Text as="span" color="blue.500" fontWeight="bold" key={name}>
              {name}
            </Text>
          ))}
        </Text>
      </ListItem>
      <ListItem>
        <Text>
          개인정보를 제공받는 자의 개인정보 이용 목적 :
          <Text as="span" fontWeight="bold">
            주문상품의 배송, 고객상담 및 불만처리.
          </Text>
        </Text>
      </ListItem>
      <ListItem>
        제공하는 개인정보의 항목 : 아이디(ID), 성명, 주소, 연락처,
        개인통관고유부호(선택시) ※ 구매자와 수취인이 다른 경우에는 입력하신 수취인의
        정보가 제공될 수 있습니다.
      </ListItem>
      <ListItem>
        <Text>
          개인정보를 제공받는 자의 개인정보 보유 및 이용기간 :
          <Text as="span" fontWeight="bold">
            구매확정 후 3개월까지(e쿠폰 상품의 경우 유효기간 연장, CS 등을 위해 1년까지)
          </Text>
        </Text>
      </ListItem>
    </UnorderedList>
  );
}

/** 개인정보 수집 및 이용 동의 내용 -> 노션 "크크쇼 수정해야 할 문구" 문서 참고 */
function PrivacyTerm2(): JSX.Element {
  return (
    <Stack fontSize="xs">
      <Text>
        고객님께서는 아래 내용에 대하여 동의를 거부하실 수 있으며, 거부 시 상품배송, 구매
        및 결제, 일부 포인트 적립이 제한됩니다.
      </Text>
      <TableContainer whiteSpace="pre-wrap">
        <Table size="xs">
          <Thead>
            <Tr>
              <Th>수집이용목적</Th>
              <Th>수집항목</Th>
              <Th>보유기간</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                대금 결제/환불 서비스 제공, 주문/배송/거래 내역 조회 서비스 제공,
                전자상거래법 준수 등
              </Td>
              <Td>신용카드 정보, 계좌 정보, 주문/배송/거래 내역</Td>
              <Td>
                고객님의 개인정보는 서비스를 제공하는 기간 동안 보유 및 이용하며,
                개인정보의 수집 및 이용목적이 달성되면 지체없이 파기합니다. 다만,
                관계법령의 규정 및 내부지침에 의하여 고객님의 개인정보를 보관할 필요성이
                있는 경우에는 아래와 같이 고객님의 개인정보를 보관할 수 있으며, 이 경우
                해당 개인정보는 보관의 목적으로만 이용합니다.가. 개별적으로 고객님의
                동의를 받은 경우에는 약속한 보유기간나. 통신사실확인자료 제공 시 필요한
                로그기록자료, IP주소 등 : 3개월 (통신비밀보호법)다. 계약 또는 청약철회
                등에 관한 기록 : 5년 (전자상거래법)라. 대금결제 및 재화 등의 공급에 관한
                기록 : 5년 (전자상거래법)마. 소비자의 불만 또는 분쟁처리에 관한 기록 : 3년
                (전자상거래법)바. 서비스제공과 관련된 문의사항 응대를 위해
                서비스사용로그는 서비스 종료 후 1개월간 회사방침에 의해 보존
              </Td>
            </Tr>
            <Tr>
              <Td>현금영수증 발급(현금영수증 신청 시)</Td>
              <Td>현금영수증 신청정보(현금영수증카드번호, 휴대전화번호)</Td>
              <Td />
            </Tr>
            <Tr>
              <Td>
                상품 및 경품(포인트, 쿠폰 포함) 배송(반품/환불/취소등), 배송지 확인, 최초
                입력 후 불러오기 기능 제공
              </Td>
              <Td>
                아이디, 배송지 정보 (수령인,전화번호,주소), 공동현관
                출입번호(입력,저장선택시)
              </Td>
              <Td />
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
      <Text>
        이용계약(이용약관)이 존속중인 탈퇴하지 않은 회원의 경우 보유기간은 보존의무기간
        이상 보관할 수 있으며 이 기간이 경과된 기록에 대해서 파기요청이 있는 경우
        파기합니다.
      </Text>
      <Text>결제수단에 따른 개인정보 수집.이용 항목이 상이할 수 있습니다.</Text>
    </Stack>
  );
}

export function TermBox({ shopNames }: { shopNames: string[] }): JSX.Element {
  const terms = [
    {
      title: '개인정보 제공 동의',
      component: <PrivacyTerm1 shopNames={shopNames} />,
    },
    {
      title: '개인정보 수집 및 이용 동의',
      component: <PrivacyTerm2 />,
    },
    {
      title: '주문상품정보 동의',
      component: (
        <Text fontSize="xs">주문 상품의 상품명, 가격, 배송정보에 동의합니다.</Text>
      ),
    },
  ];

  return (
    <Flex direction="column">
      {terms.map((item) => (
        <Popover key={item.title}>
          <HStack>
            <PopoverAnchor>
              <Text fontSize="xs">{item.title}</Text>
            </PopoverAnchor>
            <PopoverTrigger>
              <Text as="u" fontSize="xs" color="gray.500">
                보기
              </Text>
            </PopoverTrigger>
          </HStack>

          <PopoverContent maxW={260}>
            <PopoverArrow />
            <PopoverHeader>
              <Text>개인정보 제공 동의</Text>
              <PopoverCloseButton />
            </PopoverHeader>
            <PopoverBody>
              <Box
                overflow="scroll"
                minH="100px"
                maxH="140px"
                mb={3}
                border="1px solid"
                borderColor="gray.300"
                rounded="md"
                p={2}
              >
                {item.component}
              </Box>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      ))}
    </Flex>
  );
}
