import {
  Box,
  Text,
  Grid,
  GridItem,
  Button,
  Flex,
  Divider,
  Center,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { Fragment } from 'react';
import { SettlementInfoRefetchType } from '@project-lc/hooks';
import { SellerBusinessRegistration } from '@prisma/client';
import { BusinessRegistrationDialog } from './BusinessRegistrationDialog';

interface SellerBusinessRegistrationInterface extends SellerBusinessRegistration {
  [index: string]: string | number;
}

// grid 내에서 동일한 포맷팅을 수행하는 테이블 구현
export function makeTable({
  title,
  value,
}: {
  title: string;
  value: string | number | JSX.Element;
}): JSX.Element {
  return (
    <Fragment key={title}>
      <GridItem
        colSpan={[2, 1, 1, 1]}
        p={3}
        pb={5}
        pt={2}
        fontSize={13}
        textAlign="start"
        backgroundColor="gray.50"
        borderBottomColor="gray.100"
        borderBottomWidth={1.5}
        borderRightColor="gray.100"
        borderRightWidth={1.5}
      >
        {title}
      </GridItem>
      <GridItem
        colSpan={[2, 1, 1, 1]}
        p={3}
        textAlign="start"
        borderBottomColor="gray.100"
        borderBottomWidth={1.5}
        fontSize={14}
        mb={[3, 0, 0, 0]}
      >
        {value}
      </GridItem>
    </Fragment>
  );
}

const columns = [
  { title: '회사명', field: 'companyName' },
  { title: '사업자등록번호', field: 'businessRegistrationNumber' },
  { title: '대표명', field: 'representativeName' },
  { title: '업태/종목', field: ['businessType', 'businessItem'] },
  { title: '사업장소재지', field: 'businessAddress' },
  { title: '전자세금계산서 수신 이메일', field: 'taxInvoiceMail' },
];

function makeListRow(sellerBusinessRegistration: SellerBusinessRegistrationInterface) {
  if (!sellerBusinessRegistration) {
    return [];
  }
  return columns.map(({ title, field }) => {
    if (Array.isArray(field)) {
      return {
        title,
        value: `${sellerBusinessRegistration[field[0]]} / ${
          sellerBusinessRegistration[field[1]]
        }`,
      };
    }
    return {
      title,
      value: sellerBusinessRegistration[field],
    };
  });
}

type BusinessRegistrationBoxProps = {
  refetch: SettlementInfoRefetchType;
  sellerBusinessRegistration: SellerBusinessRegistration;
};

export function BusinessRegistrationBox(
  props: BusinessRegistrationBoxProps,
): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { sellerBusinessRegistration, refetch } = props;

  return (
    <Box borderWidth="1px" borderRadius="lg" p={7} height="100%">
      <Flex direction="row" justifyContent="space-between" pb={1} mb={3}>
        <Text fontSize="lg" fontWeight="medium">
          사업자 등록 정보
        </Text>
        <Button size="sm" onClick={onOpen}>
          사업자 등록증 등록
        </Button>
      </Flex>
      {sellerBusinessRegistration ? (
        <Grid templateColumns="2fr 3fr" borderTopColor="gray.100" borderTopWidth={1.5}>
          {makeListRow(sellerBusinessRegistration).map((element) => makeTable(element))}
        </Grid>
      ) : (
        <>
          <Divider color="gray.100" />
          <Center mt={10}>
            <VStack>
              <Text>등록된 사업자 등록증이 없습니다.</Text>
              <Text fontSize="sm">위의 버튼을 통해 사업자 등록증을 등록해주세요.</Text>
            </VStack>
          </Center>
        </>
      )}
      <BusinessRegistrationDialog isOpen={isOpen} onClose={onClose} refetch={refetch} />
    </Box>
  );
}
