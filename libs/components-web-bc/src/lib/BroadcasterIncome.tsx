import { Box } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import { Stat, StatGroup, StatHelpText, StatLabel, StatNumber } from '@chakra-ui/stat';
import {
  useBroadcasterAccumulatedSettlementAmount,
  useBroadcasterReceivableSettlementAmount,
  useProfile,
} from '@project-lc/hooks';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import dayjs from 'dayjs';

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
        <Box>
          <StatNumber>
            {!receivable.data?.amount
              ? '0 원'
              : `${getLocaleNumber(receivable.data?.amount)} 원`}
          </StatNumber>
          {receivable.data?.startedAt && receivable.data?.endedAt && (
            <StatHelpText>
              {dayjs(receivable.data.startedAt).format('YYYY/MM/DD')} -{' '}
              {dayjs(receivable.data.endedAt).format('YYYY/MM/DD')}
            </StatHelpText>
          )}
        </Box>
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
