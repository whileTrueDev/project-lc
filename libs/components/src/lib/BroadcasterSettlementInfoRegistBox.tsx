import { useDisclosure } from '@chakra-ui/hooks';
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useBroadcasterSettlementInfo, useProfile } from '@project-lc/hooks';
import { BroadcasterSettlementInfoConfirmation } from '.prisma/client';
import { BroadcasterSettlementInfoDialog } from './BroadcasterSettlementInfoDialog';
import { GoodsConfirmStatusBadge } from './GoodsConfirmStatusBadge';
import TextWithPopperButton from './TextWithPopperButton';

function BroadcasterSettlementConfirmationBadge({
  confirmation,
}: {
  confirmation: BroadcasterSettlementInfoConfirmation;
}): JSX.Element {
  const { status, rejectionReason } = confirmation;
  if (status === 'rejected') {
    return (
      <>
        <Text>검수상태 : </Text>
        <TextWithPopperButton
          title={<GoodsConfirmStatusBadge confirmStatus={status} />}
          iconAriaLabel=""
          portalBody
        >
          <Text fontWeight="bold" mb={1}>
            반려 사유
          </Text>
          <Text whiteSpace="break-spaces">{rejectionReason}</Text>
        </TextWithPopperButton>
      </>
    );
  }

  return <GoodsConfirmStatusBadge confirmStatus={status} />;
}

export function BroadcasterSettlementInfoRegistBox(): JSX.Element {
  const { data: profileData } = useProfile();
  const { data: settlementInfoData, isLoading } = useBroadcasterSettlementInfo(
    profileData?.id,
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box borderWidth="1px" borderRadius="lg" p={7} height="100%">
      <Flex direction={['column', 'row']} justifyContent="space-between" mb={3}>
        <Text fontSize="lg" fontWeight="medium">
          정산 정보
        </Text>

        <Button size="sm" onClick={onOpen} colorScheme="blue">
          정산 정보 등록
        </Button>
      </Flex>
      <Divider backgroundColor="gray.100" />

      {/* 정산정보 조회중인경우 */}
      {isLoading && (
        <Center>
          <Spinner />
        </Center>
      )}

      {/* 정산정보 없는 경우 */}
      {!isLoading && !settlementInfoData && (
        <>
          <VStack spacing={2} justifyContent="center" py={10}>
            <Text>등록된 정산 정보가 없습니다.</Text>
            <Text fontWeight="bold">
              정산 정보를 등록하지 않으면 수익금 정산이 불가능합니다.
            </Text>
            <Text>가능한 빨리 정산 정보를 입력하여 수익금 받을 준비를 해두세요!</Text>
            <Text>위의 정산 정보 등록 버튼을 통해 정산 정보를 입력할 수 있습니다.</Text>
          </VStack>
        </>
      )}

      {/* 정산정보 존재하는 경우 */}
      {!isLoading && settlementInfoData && (
        <>
          <BroadcasterSettlementConfirmationBadge
            confirmation={settlementInfoData.confirmation}
          />
          <Grid templateColumns="2fr 3fr" borderTopColor="gray.100" borderTopWidth={1.5}>
            {JSON.stringify(settlementInfoData, null, 2)}
            {/* {makeListRow(sellerBusinessRegistration).map(({ title, value }) => (
            <GridTableItem title={title} value={value} key={title} />
          ))} */}
          </Grid>
        </>
      )}

      {/* 정산정보 등록 폼 다이얼로그 */}
      <BroadcasterSettlementInfoDialog isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}

export default BroadcasterSettlementInfoRegistBox;
