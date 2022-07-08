import { Box } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import { Stat, StatGroup, StatLabel, StatNumber } from '@chakra-ui/stat';
import {
  useBroadcasterAccumulatedSettlementAmount,
  useBroadcasterReceivableSettlementAmount,
  useProfile,
} from '@project-lc/hooks';
import { getLocaleNumber } from '@project-lc/utils-frontend';

/** 방송인 수익금 */
export function BroadcasterIncome(): JSX.Element {
  return (
    <Box borderWidth="thin" borderRadius="lg" p={7} height="100%">
      <StatGroup flexDirection={{ base: 'column', sm: 'row' }} gap={{ base: 6, sm: 0 }}>
        <BroadcasterReceivableAmountStat />
        <BroadcasterAccumulatedSettlementAmountStat />
      </StatGroup>
    </Box>
  );
}

export default BroadcasterIncome;

/** 정산 예정 금액 */
function BroadcasterReceivableAmountStat(): JSX.Element {
  const profile = useProfile();
  // 정산 예정 금액
  const receivable = useBroadcasterReceivableSettlementAmount(profile.data?.id);

  return (
    <Stat>
      <StatLabel>정산 예정 금액</StatLabel>
      {!receivable.isLoading ? (
        <StatNumber>
          {!receivable.data ? '0 원' : `${getLocaleNumber(receivable.data)} 원`}
        </StatNumber>
      ) : (
        <Spinner mt={4} />
      )}
    </Stat>
  );
}

/** 누적 정산 금액 */
function BroadcasterAccumulatedSettlementAmountStat(): JSX.Element {
  const profile = useProfile();
  // 정산 누적 금액
  const acc = useBroadcasterAccumulatedSettlementAmount(profile.data?.id);
  return (
    <Stat>
      <StatLabel>누적 정산 금액</StatLabel>
      {!acc.isLoading ? (
        <Box>
          <StatNumber>
            {!acc.data ? '0 원' : `${getLocaleNumber(acc.data)} 원`}
          </StatNumber>
        </Box>
      ) : (
        <Spinner mt={4} />
      )}
    </Stat>
  );
}
