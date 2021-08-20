import { ArrowForwardIcon, Search2Icon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
  Text,
  Checkbox,
} from '@chakra-ui/react';
import 'moment/locale/ko';
import { useCallback, useState } from 'react';
import { DateRangePicker } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { fmOrderStatuses } from '@project-lc/shared-types';
import { useForm, Controller } from 'react-hook-form';

export function OrderFilterConsole(): JSX.Element {
  // * react-dates 상태
  const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();

  // * 선택된 주문 상태 상태
  const [selectedStatuses, setSelectedStatuses] = useState<
    Array<keyof typeof fmOrderStatuses>
  >([]);
  const handleStatusSelect = useCallback((key: keyof typeof fmOrderStatuses) => {
    setSelectedStatuses((prev) => {
      if (prev.includes(key)) return prev.filter((x) => x !== key);
      return prev.concat(key);
    });
  }, []);

  const { handleSubmit, control, register } = useForm();
  function onSubmit(data: any) {
    alert(JSON.stringify(data, null, 2));
  }

  return (
    <Stack
      my={6}
      maxW={900}
      mx="auto"
      spacing={6}
      as="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Flex mx={1}>
        <InputGroup size="lg">
          <InputLeftElement pointerEvents="none">
            <Search2Icon size="lg" />
          </InputLeftElement>
          <Input
            placeholder="주문번호,상품번호,주문자명,입금자명,수령자명,(주문자,입금자)휴대전화,상품명"
            id="order-search-text-project-lc"
            type="text"
            variant="outline"
            {...register('orderSearchText')}
          />
        </InputGroup>
        <Button ml={1} size="lg" border="none" type="submit">
          검색
        </Button>
      </Flex>

      <Stack spacing={4}>
        <Box mx={1}>
          <Box mb={2}>
            <Text>날짜</Text>
          </Box>
          <Flex>
            <Select size="sm" w={120} mr={2}>
              <option value="주문일">주문일 기준</option>
              <option value="입금일">입금일 기준</option>
            </Select>
            <DateRangePicker
              small
              startDate={startDate}
              startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
              endDate={endDate} // momentPropTypes.momentObj or null,
              endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
              onDatesChange={({ startDate: _, endDate: __ }) => {
                setStartDate(_);
                setEndDate(__);
              }} // PropTypes.func.isRequired,
              focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
              onFocusChange={(_focusedInput) => setFocusedInput(_focusedInput)} // PropTypes.func.isRequired,
              showClearDates
              reopenPickerOnClearDates
              isOutsideRange={() => false}
              displayFormat="YYYY-MM-DD"
            />
          </Flex>
        </Box>
        <Box mx={2}>
          <Stack mb={2} direction="row">
            <Text>주문 상태</Text>
            <Button size="xs" variant="outline">
              전체 선택
            </Button>
            <Button size="xs" variant="outline" borderColor="red.200">
              전체 취소
            </Button>
          </Stack>
          <Box>
            {(Object.keys(fmOrderStatuses) as Array<keyof typeof fmOrderStatuses>).map(
              (orderStatus) => (
                <Checkbox
                  m={1}
                  aria-label={`order-status-${fmOrderStatuses[orderStatus].name}`}
                  key={orderStatus}
                  colorScheme={fmOrderStatuses[orderStatus].chakraColor}
                  isChecked={selectedStatuses.includes(orderStatus)}
                  onChange={(e) => handleStatusSelect(orderStatus)}
                >
                  <Badge colorScheme={fmOrderStatuses[orderStatus].chakraColor}>
                    {fmOrderStatuses[orderStatus].name}
                  </Badge>
                </Checkbox>
              ),
            )}
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
}

export default OrderFilterConsole;
