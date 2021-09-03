import {
  Box,
  Text,
  Grid,
  Button,
  Flex,
  Center,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { Divider } from '@material-ui/core';
import { SettlementInfoRefetchType } from '@project-lc/hooks';
import { SellerSettlementAccount } from '@prisma/client';
import { makeTable } from './BusinessRegistrationBox';
import { SettlementAccountDialog } from './SettlementAccountDialog';

const columns = [
  { title: '은행명', field: 'bank' },
  { title: '계좌 번호', field: 'number' },
  { title: '예금주', field: 'name' },
];
interface SellerSettlementAccountInterface extends SellerSettlementAccount {
  [index: string]: string | number;
}

function makeListRow(settlementAccount: SellerSettlementAccountInterface) {
  if (!settlementAccount) {
    return [];
  }
  return columns.map(({ title, field }: { title: string; field: string }) => {
    return {
      title,
      value: settlementAccount[field],
    };
  });
}

type SettlementAccountBoxProps = {
  refetch: SettlementInfoRefetchType;
  settlementAccount: SellerSettlementAccount;
};

export function SettlementAccountBox(props: SettlementAccountBoxProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { settlementAccount, refetch } = props;

  return (
    <Box borderWidth="1px" borderRadius="lg" p={7} height="100%">
      <Flex direction="row" justifyContent="space-between" pb={1} mb={3}>
        <Text fontSize="lg" fontWeight="medium">
          정산 계좌 정보
        </Text>
        <Button size="sm" onClick={onOpen}>
          정산 계좌 등록
        </Button>
      </Flex>
      {settlementAccount ? (
        <Grid templateColumns="1fr 3fr" borderTopColor="gray.100" borderTopWidth={1.5}>
          {makeListRow(settlementAccount).map((element) => makeTable(element))}
        </Grid>
      ) : (
        <>
          <Divider color="gray.100" />
          <Center mt={10}>
            <VStack>
              <Text>등록된 정산 계좌가 없습니다.</Text>
              <Text fontSize="sm">위의 버튼을 통해 정산 계좌를 등록해주세요.</Text>
            </VStack>
          </Center>
        </>
      )}
      <SettlementAccountDialog isOpen={isOpen} onClose={onClose} refetch={refetch} />
    </Box>
  );
}
