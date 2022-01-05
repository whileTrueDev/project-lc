import { Text, Box, List, Select, Stack, Spinner } from '@chakra-ui/react';
import {
  useSettlementHistoryMonths,
  useSettlementHistoryRounds,
  useSettlementHistoryYears,
} from '@project-lc/hooks';
import { settlementHistoryStore } from '@project-lc/stores';
import { useState } from 'react';

export function SettlementRoundHistory(): JSX.Element {
  const [selectedYear, setSelectedYear] = useState<string>();
  const [selectedMonth, setSelectedMonth] = useState<string>();
  const [selectedRound, setSelectedRound] = useState<string>();

  const years = useSettlementHistoryYears();
  const months = useSettlementHistoryMonths({ year: selectedYear });
  const rounds = useSettlementHistoryRounds({ year: selectedYear, month: selectedMonth });
  const settlementHistory = settlementHistoryStore();

  if (years.isLoading) return <Spinner />;
  if (!years.isLoading && years.data && years.data.length === 0) {
    return (
      <Box>
        <Text>아직 정산내역이 없습니다.</Text>
      </Box>
    );
  }

  return (
    <List>
      <Stack direction={{ base: 'column', sm: 'row' }}>
        <Select
          w="100px"
          placeholder="년도"
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(e.target.value);
          }}
        >
          {years.data?.map((year) => (
            <option value={year} key={year}>
              {year}
            </option>
          ))}
        </Select>

        <Select
          isDisabled={!selectedYear || !months.data}
          w="100px"
          placeholder="월"
          value={selectedMonth}
          onChange={(e) => {
            setSelectedMonth(e.target.value);
          }}
        >
          {months.data?.map((month) => (
            <option key={month}>{month}</option>
          ))}
        </Select>

        <Select
          isDisabled={!selectedYear || !selectedMonth || !months.data || !rounds.data}
          w="150px"
          placeholder="회차"
          value={selectedRound}
          onChange={(e) => {
            setSelectedRound(e.target.value);
            settlementHistory.handleRoundSelect(e.target.value);
          }}
        >
          {rounds.data?.map((round) => (
            <option key={round}>{round}</option>
          ))}
        </Select>
      </Stack>
    </List>
  );
}

export default SettlementRoundHistory;
