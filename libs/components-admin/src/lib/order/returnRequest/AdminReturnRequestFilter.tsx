import { Stack, Text, Input, Select, Button, ButtonGroup } from '@chakra-ui/react';
import { AdminReturnListDto } from '@project-lc/shared-types';
import { useAdminReturnFilterStore } from '@project-lc/stores';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export function AdminReturnRequestFilter(): JSX.Element {
  const filterStore = useAdminReturnFilterStore();
  const { register, setValue, handleSubmit, getValues } = useForm<AdminReturnListDto>({
    defaultValues: {
      searchDateType: 'requestDate',
      searchStartDate: dayjs().format('YYYY-MM-DD'),
      searchEndDate: dayjs().add(1, 'week').format('YYYY-MM-DD'),
    },
  });

  // filerStore 초기화(일주일로 설정, 최초 한번만 실행)
  useEffect(() => {
    filterStore.setReturnFilter({ ...getValues() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setSearchDuration = (
    value?: number,
    unit?: dayjs.ManipulateType | undefined,
  ): void => {
    if (!value) {
      setValue('searchStartDate', undefined);
      setValue('searchEndDate', undefined);
    } else {
      const today = dayjs();
      setValue('searchStartDate', today.format('YYYY-MM-DD'));
      setValue('searchEndDate', today.add(value, unit).format('YYYY-MM-DD'));
    }
  };

  const onSubmit = (formData: AdminReturnListDto): void => {
    console.log(formData);
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
