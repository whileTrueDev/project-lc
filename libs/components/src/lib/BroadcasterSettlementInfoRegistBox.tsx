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
import { s3, useBroadcasterSettlementInfo, useProfile } from '@project-lc/hooks';
import { useMemo } from 'react';
import { BroadcasterSettlementInfoConfirmation, TaxationType } from '.prisma/client';
import { BroadcasterSettlementInfoDialog } from './BroadcasterSettlementInfoDialog';
import { GoodsConfirmStatusBadge } from './GoodsConfirmStatusBadge';
import { GridTableItem } from './GridTableItem';

/** 검수결과 설명문 */
const CONFIRMATION_DESC = {
  waiting:
    '입력하신 정산 정보를 관리자가 검수중입니다. 승인받은 후 수익금 정산이 가능합니다.',
  rejected:
    '승인 반려되었습니다. 아래 반려사유를 확인한 후 다시 정산 정보를 등록해주세요.',
};

export const TAX_TYPE: Record<TaxationType, string> = {
  naturalPerson: '개인(사업소득)',
  selfEmployedBusiness: '개인사업자',
};

/** 정산정보 검수상태, 반려사유 표시 */
function BroadcasterSettlementConfirmationDisplay({
  confirmation,
}: {
  confirmation: BroadcasterSettlementInfoConfirmation;
}): JSX.Element {
  const { status, rejectionReason } = confirmation;

  const badge = useMemo(
    () => <GoodsConfirmStatusBadge confirmStatus={status} />,
    [status],
  );

  const description = useMemo(() => {
    if (status === 'waiting') {
      return <Text fontSize="sm">{CONFIRMATION_DESC.waiting}</Text>;
    }
    if (status === 'rejected') {
      return (
        <>
          <Text fontSize="sm">{CONFIRMATION_DESC.rejected}</Text>
          <Text fontSize="sm">{rejectionReason}</Text>
        </>
      );
    }
    return null;
  }, [rejectionReason, status]);

  return (
    <VStack alignItems="stretch">
      <Flex alignItems="center">
        <Text mr={1}>검수상태</Text>
        {badge}
      </Flex>
      {description}
    </VStack>
  );
}

export function BroadcasterSettlementInfoRegistBox(): JSX.Element {
  const { data: profileData } = useProfile();
  const { data: settlementInfoData, isLoading } = useBroadcasterSettlementInfo(
    profileData?.id,
  );

  const downloadIdCardImage = async (): Promise<void> => {
    if (!profileData || !settlementInfoData) return;
    const imageUrl = await s3.s3DownloadImageUrl(
      settlementInfoData.idCardImageName,
      profileData.email,
      'broadcaster-id-card',
    );
    window.open(imageUrl, '_blank');
  };

  const downloadAccountImage = async (): Promise<void> => {
    if (!profileData || !settlementInfoData) return;
    const imageUrl = await s3.s3DownloadImageUrl(
      settlementInfoData.accountImageName,
      profileData.email,
      'broadcaster-account-image',
    );
    window.open(imageUrl, '_blank');
  };

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
      <Divider backgroundColor="gray.500" mb={3} />

      {/* 정산정보 조회중인경우 */}
      {isLoading && (
        <Center>
          <Spinner />
        </Center>
      )}

      {/* 정산정보 없는 경우 */}
      {!isLoading && !settlementInfoData && (
        <VStack spacing={2} justifyContent="center" py={10}>
          <Text>등록된 정산 정보가 없습니다.</Text>
          <Text fontWeight="bold">
            정산 정보를 등록하지 않으면 수익금 정산이 불가능합니다.
          </Text>
          <Text>가능한 빨리 정산 정보를 입력하여 수익금 받을 준비를 해두세요!</Text>
          <Text>위의 정산 정보 등록 버튼을 통해 정산 정보를 입력할 수 있습니다.</Text>
        </VStack>
      )}

      {/* 정산정보 존재하는 경우 */}
      {!isLoading && settlementInfoData && (
        <VStack spacing={4} alignItems="stretch">
          {/* 정산정보 검수상태 표시 */}
          <BroadcasterSettlementConfirmationDisplay
            confirmation={settlementInfoData.confirmation}
          />
          {/* 입력한 정산정보 표시 */}
          <VStack alignItems="stretch">
            <Text>계약자 정보</Text>
            <Grid
              templateColumns="2fr 3fr"
              borderTopColor="gray.100"
              borderTopWidth={1.5}
            >
              <GridTableItem title="과세유형" value={TAX_TYPE[settlementInfoData.type]} />
              <GridTableItem title="성명" value={settlementInfoData.name} />
              <GridTableItem
                title="주민등록번호"
                value={settlementInfoData.idCardNumber}
              />
              <GridTableItem
                title="휴대전화번호"
                value={settlementInfoData.phoneNumber}
              />
              <GridTableItem
                title="신분증"
                value={
                  <Button size="xs" onClick={downloadIdCardImage}>
                    신분증 확인
                  </Button>
                }
              />
            </Grid>
          </VStack>

          <VStack alignItems="stretch">
            <Text>정산계좌정보</Text>
            <Grid
              templateColumns="2fr 3fr"
              borderTopColor="gray.100"
              borderTopWidth={1.5}
            >
              <GridTableItem title="예금주" value={settlementInfoData.accountHolder} />
              <GridTableItem title="계좌번호" value={settlementInfoData.accountNumber} />
              <GridTableItem
                title="통장사본"
                value={
                  <Button size="xs" onClick={downloadAccountImage}>
                    통장사본 확인
                  </Button>
                }
              />
            </Grid>
          </VStack>
        </VStack>
      )}

      {/* 정산정보 등록 폼 다이얼로그 */}
      <BroadcasterSettlementInfoDialog isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}

export default BroadcasterSettlementInfoRegistBox;
