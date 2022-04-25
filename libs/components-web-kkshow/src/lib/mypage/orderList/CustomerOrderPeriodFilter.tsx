import { SearchIcon } from '@chakra-ui/icons';
import { Stack, Text, Input, Button, IconButton, ButtonGroup } from '@chakra-ui/react';
import { GetOrderListDto } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { SubmitHandler, useForm } from 'react-hook-form';

export interface CustomerOrderPeriodFilterProps {
  changePeriod: (period: PeriodInputs) => void;
}
export function CustomerOrderPeriodFilter({
  changePeriod,
}: CustomerOrderPeriodFilterProps): JSX.Element {
  return (
    <Stack>
      <Text>기간별 주문 조회</Text>
      <Stack direction={{ base: 'column', md: 'row' }}>
        <PeriodButtonSet changePeriod={changePeriod} />
        <PeriodInputSet changePeriod={changePeriod} />
      </Stack>
    </Stack>
  );
}

export default CustomerOrderPeriodFilter;

export function PeriodButtonSet({
  changePeriod,
}: CustomerOrderPeriodFilterProps): JSX.Element {
  return (
    <ButtonGroup size="sm" isAttached variant="outline">
      <Button
        size="sm"
        onClick={() =>
          changePeriod({ periodStart: dayjs().subtract(1, 'week').format('YYYY-MM-DD') })
        }
      >
        최근 1주
      </Button>
      <Button
        size="sm"
        onClick={() =>
          changePeriod({ periodStart: dayjs().subtract(1, 'month').format('YYYY-MM-DD') })
        }
      >
        최근 1달
      </Button>
      <Button
        size="sm"
        onClick={() =>
          changePeriod({ periodStart: dayjs().subtract(6, 'month').format('YYYY-MM-DD') })
        }
      >
        최근 6개월
      </Button>
    </ButtonGroup>
  );
}

type PeriodInputs = {
  periodStart?: GetOrderListDto['periodStart'];
  periodEnd?: GetOrderListDto['periodEnd'];
};
export function PeriodInputSet({
  changePeriod,
}: CustomerOrderPeriodFilterProps): JSX.Element {
  const { register, handleSubmit } = useForm<PeriodInputs>({
    defaultValues: {},
  });

  const onSubmit: SubmitHandler<PeriodInputs> = (data) => {
    changePeriod(data);
  };
  return (
    <Stack
      as="form"
      direction="row"
      onSubmit={handleSubmit(onSubmit)}
      alignItems="center"
      spacing={1}
    >
      <Input type="date" size="sm" width="150px" {...register('periodStart')} />
      <Text>~</Text>
      <Input type="date" size="sm" width="150px" {...register('periodEnd')} />
      <IconButton
        size="sm"
        aria-label="기간 내 주문 검색"
        icon={<SearchIcon />}
        type="submit"
      />
    </Stack>
  );
}
