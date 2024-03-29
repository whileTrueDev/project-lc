import { Search2Icon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
  Text,
} from '@chakra-ui/react';
import { OrderProcessStep } from '@prisma/client';
import { useDisplaySize } from '@project-lc/hooks';
import {
  getOrderProcessStepNameByStringNumber,
  KkshowOrderCancelEnum,
  kkshowOrderStatuses,
  KkshowOrderStatusExtendedType,
  orderProcessStepDict,
  orderStatuses,
} from '@project-lc/shared-types';
import { SellerOrderFilterFormType, useSellerOrderStore } from '@project-lc/stores';
import moment from 'moment';
import 'moment/locale/ko';
import { useState } from 'react';
import { DateRangePicker } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

export function OrderFilterConsole(): JSX.Element {
  const { isMobileSize } = useDisplaySize();

  const orderStore = useSellerOrderStore();
  const { handleSubmit, control, register, watch, setValue, getValues } =
    useForm<SellerOrderFilterFormType>({
      defaultValues: {
        search: orderStore.search,
        searchDateType: orderStore.searchDateType,
        searchEndDate: orderStore.periodEnd,
        searchStartDate: orderStore.periodStart,
        searchExtendedStatus: orderStore.searchExtendedStatus,
        searchStatuses: orderStore.searchStatuses,
      },
    });

  // * react-dates 상태
  const [focusedInput, setFocusedInput] = useState<'startDate' | 'endDate' | null>(null);

  // * 필터/검색 폼 제출
  const onSubmit: SubmitHandler<SellerOrderFilterFormType> = (data) => {
    orderStore.handleOrderSearchStates(data);
  };

  const resetCheckBox = (): void => {
    if (getValues('searchStatuses') || getValues('searchExtendedStatus')) {
      setValue('searchStatuses', []);
      setValue('searchExtendedStatus', []);
    }
  };

  return (
    <Stack
      my={6}
      maxW={900}
      mx="auto"
      spacing={4}
      as="form"
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Flex px={[2, 4]} as="section">
        <InputGroup size="md">
          <InputLeftElement pointerEvents="none" zIndex="auto">
            <Search2Icon />
          </InputLeftElement>
          <Input
            placeholder="주문번호,상품번호,주문자명,입금자명,수령자명,(주문자,입금자)휴대전화,상품명"
            autoComplete="off"
            id="order-search-text-project-lc"
            type="text"
            variant="outline"
            {...register('search')}
          />
        </InputGroup>
        <Button ml={1} size="md" border="none" type="submit">
          검색
        </Button>
      </Flex>

      <Stack px={[2, 4]} spacing={4} as="section">
        {/* * 날짜 */}
        <Box>
          <Box mb={2}>
            <Text>날짜</Text>
          </Box>
          <Stack spacing={2} direction={isMobileSize ? 'column' : 'row'}>
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
            <Box>
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
                  setValue(
                    'searchEndDate',
                    endDate ? endDate.format('YYYY-MM-DD') : null,
                  );
                }} // PropTypes.func.isRequired,
                focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                onFocusChange={(_focusedInput) => setFocusedInput(_focusedInput)} // PropTypes.func.isRequired,
                reopenPickerOnClearDates
                isOutsideRange={() => false}
                displayFormat="YYYY-MM-DD"
                withPortal={!!isMobileSize}
                numberOfMonths={isMobileSize ? 1 : 2}
                startDatePlaceholderText="시작일"
                startDateAriaLabel="시작일"
                endDatePlaceholderText="종료일"
                endDateAriaLabel="종료일"
                showClearDates
              />
            </Box>
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
                setValue(
                  'searchStatuses',
                  Object.keys(orderProcessStepDict) as OrderProcessStep[],
                );
                setValue(
                  'searchExtendedStatus',
                  Object.keys(KkshowOrderCancelEnum) as KkshowOrderStatusExtendedType[],
                );
              }}
            >
              전체 선택
            </Button>
            <Button
              size="xs"
              variant="outline"
              borderColor="red.200"
              onClick={resetCheckBox}
            >
              전체 취소
            </Button>
          </Stack>
          <Box>
            {(Object.keys(orderStatuses) as Array<keyof typeof orderStatuses>).map(
              (orderStatus) => {
                const orderProcessStep =
                  getOrderProcessStepNameByStringNumber(orderStatus);
                return (
                  <Checkbox
                    m={1}
                    aria-label={`order-status-${orderStatuses[orderStatus].name}`}
                    key={orderStatuses[orderStatus].name}
                    colorScheme={orderStatuses[orderStatus].chakraColor}
                    isChecked={watch('searchStatuses')?.includes(orderProcessStep)}
                    onChange={(_) => {
                      const prev = getValues('searchStatuses');
                      if (!prev) {
                        return setValue('searchStatuses', [orderProcessStep]);
                      }
                      if (prev.includes(orderProcessStep)) {
                        return setValue(
                          'searchStatuses',
                          prev.filter((x) => x !== orderProcessStep),
                        );
                      }
                      return setValue('searchStatuses', prev.concat(orderProcessStep));
                    }}
                  >
                    <Badge colorScheme={orderStatuses[orderStatus].chakraColor}>
                      {orderStatuses[orderStatus].name}
                    </Badge>
                  </Checkbox>
                );
              },
            )}
            <Divider />
            {(
              Object.keys(KkshowOrderCancelEnum) as Array<
                keyof typeof kkshowOrderStatuses
              >
            ).map((orderStatus) => {
              return (
                <Checkbox
                  m={1}
                  aria-label={`order-status-${kkshowOrderStatuses[orderStatus].name}`}
                  key={`extended-${orderStatus}`}
                  colorScheme={kkshowOrderStatuses[orderStatus].chakraColor}
                  isChecked={watch('searchExtendedStatus')?.includes(orderStatus)}
                  onChange={(_) => {
                    const prev = getValues('searchExtendedStatus');
                    if (!prev) {
                      return setValue('searchExtendedStatus', [orderStatus]);
                    }
                    if (prev.includes(orderStatus)) {
                      return setValue(
                        'searchExtendedStatus',
                        prev.filter((x) => x !== orderStatus),
                      );
                    }
                    return setValue('searchExtendedStatus', prev.concat(orderStatus));
                  }}
                >
                  <Badge colorScheme={kkshowOrderStatuses[orderStatus].chakraColor}>
                    {kkshowOrderStatuses[orderStatus].name}
                  </Badge>
                </Checkbox>
              );
            })}
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
}

export default OrderFilterConsole;
