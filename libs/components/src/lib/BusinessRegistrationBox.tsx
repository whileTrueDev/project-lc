import {
  Box,
  Text,
  Grid,
  Button,
  Flex,
  Divider,
  Center,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { SettlementInfoRefetchType } from '@project-lc/hooks';
import { SellerBusinessRegistration } from '@prisma/client';
import { BusinessRegistrationDialog } from './BusinessRegistrationDialog';
import { GridTableItem } from './GridTableItem';

interface SellerBusinessRegistrationInterface extends SellerBusinessRegistration {
  [index: string]: string | number;
}
const columns = [
  { title: '회사명', field: 'companyName' },
  { title: '사업자등록번호', field: 'businessRegistrationNumber' },
  { title: '대표명', field: 'representativeName' },
  { title: '업태/종목', field: ['businessType', 'businessItem'] },
  { title: '사업장소재지', field: 'businessAddress' },
  { title: '전자세금계산서 수신 이메일', field: 'taxInvoiceMail' },
];

function makeListRow(
  sellerBusinessRegistration: SellerBusinessRegistrationInterface,
): Array<{
  title: string;
  value: string | number;
}> {
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
      <Flex direction={['column', 'row']} justifyContent="space-between" pb={1} mb={3}>
        <Text fontSize="lg" fontWeight="medium">
          사업자 등록 정보
        </Text>
        <Button size="sm" onClick={onOpen} mt={[3, 0]}>
          사업자 등록증 등록
        </Button>
      </Flex>
      {sellerBusinessRegistration ? (
        <Grid templateColumns="2fr 3fr" borderTopColor="gray.100" borderTopWidth={1.5}>
          {makeListRow(sellerBusinessRegistration).map(({ title, value }) => (
            <GridTableItem title={title} value={value} key={title} />
          ))}
        </Grid>
      ) : (
        <>
          <Divider backgroundColor="gray.100" />
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
