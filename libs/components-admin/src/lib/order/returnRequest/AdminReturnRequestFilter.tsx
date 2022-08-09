import { Stack, Text, Input, Select, Button, ButtonGroup } from '@chakra-ui/react';
import { AdminReturnListDto } from '@project-lc/shared-types';
import { useAdminReturnFilterStore } from '@project-lc/stores';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';

export function AdminReturnRequestFilter(): JSX.Element {
  const filterStore = useAdminReturnFilterStore();
  const { register, setValue, handleSubmit } = useForm<AdminReturnListDto>({
    defaultValues: {
      searchDateType: 'requestDate',
      searchStartDate: undefined,
      searchEndDate: undefined,
    },
  });

  const setSearchDuration = (
    value?: number,
    unit?: dayjs.ManipulateType | undefined,
  ): void => {
    if (!value) {
      setValue('searchStartDate', undefined);
      setValue('searchEndDate', undefined);
    } else {
      const today = dayjs().add(1, 'day'); // endDate는 포함하지 않으므로 오늘날짜에서 +1일
      setValue('searchStartDate', today.subtract(value, unit).format('YYYY-MM-DD'));
      setValue('searchEndDate', today.format('YYYY-MM-DD'));
    }
  };

  const onSubmit = (formData: AdminReturnListDto): void => {
    filterStore.setReturnFilter(formData);
  };
  return (
    <Stack as="form" onSubmit={handleSubmit(onSubmit)}>
      <Text>기간필터</Text>
      <Stack direction="row">
        <Select width="150px" size="xs" {...register('searchDateType')}>
          <option value="requestDate">환불요청일</option>
        </Select>

        <Input type="date" width="150px" size="xs" {...register('searchStartDate')} />
        <Text> ~ </Text>
        <Input type="date" width="150px" size="xs" {...register('searchEndDate')} />

        <ButtonGroup size="xs">
          {/* 오늘로부터 1일 전,일주일 전, 1개월 전, 3개월 전, 6개월 전 */}
          <Button onClick={() => setSearchDuration(1, 'day')}>오늘</Button>
          <Button onClick={() => setSearchDuration(1, 'week')}>일주일</Button>
          <Button onClick={() => setSearchDuration(1, 'month')}>1개월</Button>
          <Button onClick={() => setSearchDuration(3, 'month')}>3개월</Button>
          <Button onClick={() => setSearchDuration(6, 'month')}>6개월</Button>
          <Button onClick={() => setSearchDuration()}>전체</Button>
          <Button colorScheme="blue" type="submit">
            적용
          </Button>
        </ButtonGroup>
      </Stack>
    </Stack>
  );
}

export default AdminReturnRequestFilter;
