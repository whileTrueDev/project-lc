/* eslint-disable react/jsx-props-no-spreading */

import {
  Grid,
  GridItem,
  Input,
  FormControl,
  FormErrorMessage,
  Select,
  useColorModeValue,
} from '@chakra-ui/react';
import { UseFormRegister, FieldError, DeepMap } from 'react-hook-form';
import { banks, SettlementAccountDto } from '@project-lc/shared-types';
import { useDialogHeaderConfig, useDialogValueConfig } from './GridTableItem';

export interface SettlementAccountFormProps {
  register: UseFormRegister<SettlementAccountDto>;
  errors: DeepMap<SettlementAccountDto, FieldError>;
}

export function SettlementAccountForm(props: SettlementAccountFormProps) {
  // 명시적 타입만 props로 전달 가능
  const { register, errors } = props;

  return (
    <Grid templateColumns="2fr 3fr" borderTopColor="gray.100" borderTopWidth={1.5}>
      <GridItem {...useDialogHeaderConfig(useColorModeValue)}>은행</GridItem>
      <GridItem {...useDialogValueConfig(useColorModeValue)}>
        <Select
          id="bank"
          m={[1, 3, 3, 3]}
          variant="flushed"
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
      <GridItem {...useDialogHeaderConfig(useColorModeValue)}>계좌번호</GridItem>
      <GridItem {...useDialogValueConfig(useColorModeValue)}>
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
          />
          <FormErrorMessage ml={3} mt={0}>
            {errors.number && errors.number.message}
          </FormErrorMessage>
        </FormControl>
      </GridItem>
      <GridItem {...useDialogHeaderConfig(useColorModeValue)}>예금주명</GridItem>
      <GridItem {...useDialogValueConfig(useColorModeValue)}>
        <FormControl isInvalid={!!errors.name}>
          <Input
            id="name"
            m={[1, 3, 3, 3]}
            variant="flushed"
            placeholder="예금주명을 입력하세요."
            autoComplete="off"
            maxW={200}
            {...register('name')}
          />
          <FormErrorMessage ml={3} mt={0}>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>
      </GridItem>
    </Grid>
  );
}
