/* eslint-disable react/jsx-props-no-spreading */

import {
  Grid,
  GridItem,
  Input,
  FormControl,
  FormErrorMessage,
  Select,
} from '@chakra-ui/react';
import { UseFormRegister, FieldError, DeepMap } from 'react-hook-form';
import { SettlementAccountDto } from '@project-lc/shared-types';
import banks from '../constants/banks';

const headerConfig = {
  colSpan: [2, 1, 1, 1],
  p: 3,
  pb: 5,
  pt: 2,
  fontSize: 13,
  backgroundColor: 'gray.50',
  borderBottomColor: 'gray.100',
  borderBottomWidth: 1.5,
  borderRightColor: 'gray.100',
  borderRightWidth: 1.5,
};

const valueConfig = {
  colSpan: [2, 1, 1, 1],
  p: 3,
  borderBottomColor: 'gray.100',
  borderBottomWidth: 1.5,
  fontSize: 14,
  mb: [3, 0, 0, 0],
};

export interface SettlementAccountFormProps {
  register: UseFormRegister<SettlementAccountDto>;
  errors: DeepMap<SettlementAccountDto, FieldError>;
}

export function SettlementAccountForm(props: SettlementAccountFormProps) {
  // 명시적 타입만 props로 전달 가능
  const { register, errors } = props;

  return (
    <Grid templateColumns="2fr 3fr" borderTopColor="gray.100" borderTopWidth={1.5}>
      <GridItem {...headerConfig}>은행</GridItem>
      <GridItem {...valueConfig}>
        <Select
          id="bank"
          m={[1, 3, 3, 3]}
          variant="flushed"
          borderBottomColor="blackAlpha.500"
          isRequired
          autoComplete="off"
          maxW={200}
          maxLength={10}
          {...register('bank', {
            required: '은행을 반드시 선택해주세요.',
          })}
        >
          {banks.map(({ bankCode, bankName }) => (
            <option key={bankCode} value={bankName}>
              {bankName}
            </option>
          ))}
        </Select>
      </GridItem>
      <GridItem {...headerConfig}>계좌번호</GridItem>
      <GridItem {...valueConfig}>
        <FormControl isInvalid={!!errors.number}>
          <Input
            id="number"
            m={[1, 3, 3, 3]}
            variant="flushed"
            maxW={['inherit', 300, 300, 300]}
            autoComplete="off"
            isRequired
            placeholder="계좌번호를 입력해주세요('-' 제외)"
            {...register('number', {
              required: "'-'을 제외하고 숫자만 입력하세요.",
              pattern: {
                value: /^[0-9]+$/,
                message: '계좌번호는 숫자만 가능합니다.',
              },
            })}
            borderBottomColor="blackAlpha.500"
          />
          <FormErrorMessage ml={3} mt={0}>
            {errors.number && errors.number.message}
          </FormErrorMessage>
        </FormControl>
      </GridItem>
      <GridItem {...headerConfig}>예금주명</GridItem>
      <GridItem {...valueConfig}>
        <Input
          id="name"
          m={[1, 3, 3, 3]}
          variant="flushed"
          placeholder="예금주명을 입력하세요."
          isRequired
          autoComplete="off"
          maxW={200}
          {...register('name')}
          borderBottomColor="blackAlpha.500"
        />
      </GridItem>
    </Grid>
  );
}
