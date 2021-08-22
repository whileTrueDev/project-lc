/* eslint-disable react/jsx-props-no-spreading */
import { Search2Icon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
  Text,
  useBreakpoint,
} from '@chakra-ui/react';
import { fmOrderStatuses } from '@project-lc/shared-types';
import { useFmOrderStore } from '@project-lc/stores';
import moment from 'moment';
import 'moment/locale/ko';
import { useMemo, useState } from 'react';
import { DateRangePicker } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

export interface OrderFilterFormType {
  search: string;
  searchDateType: '주문일' | '입금일';
  searchStartDate: string | null; // this way is not supported https://github.com/react-hook-form/react-hook-form/issues/4704
  searchEndDate: string | null; // this way is not supported https://github.com/react-hook-form/react-hook-form/issues/4704
  searchStatuses: string[];
}

export function OrderFilterConsole(): JSX.Element {
  const xSize = useBreakpoint();
  const isMobile = useMemo(() => xSize && ['base', 'sm'].includes(xSize), [xSize]);

  const handleOrderSearchStates = useFmOrderStore((s) => s.handleOrderSearchStates);
  const { handleSubmit, control, register, watch, setValue, getValues } =
    useForm<OrderFilterFormType>();

  // * react-dates 상태
  const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);

  // * 필터/검색 폼 제출
  const onSubmit: SubmitHandler<OrderFilterFormType> = (data) => {
    handleOrderSearchStates(data);
  };

  return (
    <Stack
      my={6}
      maxW={900}
      mx="auto"
      spacing={6}
      as="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Flex px={[2, 4]} as="section">
        <InputGroup size="lg">
          <InputLeftElement pointerEvents="none">
            <Search2Icon size="lg" />
          </InputLeftElement>
          <Input
            placeholder="주문번호,상품번호,주문자명,입금자명,수령자명,(주문자,입금자)휴대전화,상품명"
            id="order-search-text-project-lc"
            type="text"
            variant="outline"
            {...register('search')}
          />
        </InputGroup>
        <Button ml={1} size="lg" border="none" type="submit">
          검색
        </Button>
      </Flex>

      <Stack px={[2, 4]} spacing={4} as="section">
        {/* * 날짜 */}
        <Box>
          <Box mb={2}>
            <Text>날짜</Text>
          </Box>
          <Stack spacing={2} direction={isMobile ? 'column' : 'row'}>
            <Controller
              name="searchDateType"
              control={control}
              defaultValue="주문일"
              render={({ field }) => (
                <Select size="sm" w={120} {...field}>
                  <option value="주문일">주문일 기준</option>
                  <option value="입금일">입금일 기준</option>
                </Select>
              )}
            />

            <DateRangePicker
              small
              startDate={
                watch('searchStartDate') ? moment(watch('searchStartDate')) : null
              }
              startDateId="searchStartDate" // PropTypes.string.isRequired,
              endDate={watch('searchEndDate') ? moment(watch('searchEndDate')) : null} // momentPropTypes.momentObj or null,
              endDateId="searchEndDate" // PropTypes.string.isRequired,
              onDatesChange={({ startDate, endDate }) => {
                setValue(
                  'searchStartDate',
                  startDate ? startDate.format('YYYY-MM-DD') : null,
                );
                setValue('searchEndDate', endDate ? endDate.format('YYYY-MM-DD') : null);
              }} // PropTypes.func.isRequired,
              focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
              onFocusChange={(_focusedInput) => setFocusedInput(_focusedInput)} // PropTypes.func.isRequired,
              reopenPickerOnClearDates
              isOutsideRange={() => false}
              displayFormat="YYYY-MM-DD"
              withPortal={!!isMobile}
              numberOfMonths={isMobile ? 1 : 2}
            />
          </Stack>
        </Box>

        {/* * 주문 상태 */}
        <Box>
          <Stack mb={2} direction="row">
            <Text>주문 상태</Text>
            <Button
              size="xs"
              variant="outline"
              onClick={() => {
                setValue('searchStatuses', Object.keys(fmOrderStatuses));
              }}
            >
              전체 선택
            </Button>
            <Button
              size="xs"
              variant="outline"
              borderColor="red.200"
              onClick={
                getValues('searchStatuses')
                  ? () => setValue('searchStatuses', [])
                  : undefined
              }
            >
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
                  isChecked={watch('searchStatuses')?.includes(orderStatus)}
                  onChange={(_) => {
                    const prev = getValues('searchStatuses');
                    if (!prev) {
                      return setValue('searchStatuses', [orderStatus]);
                    }
                    if (prev.includes(orderStatus)) {
                      return setValue(
                        'searchStatuses',
                        prev.filter((x) => x !== orderStatus),
                      );
                    }
                    return setValue('searchStatuses', prev.concat(orderStatus));
                  }}
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
