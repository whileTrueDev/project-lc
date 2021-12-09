import {
  Checkbox,
  FormControl,
  FormErrorMessage,
  Grid,
  Input,
  InputGroup,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { TAX_MANAGEMENT_TERM } from '../constants/broadcastetSettlementTerms';
import {
  CustomRowItem,
  SectionHeading,
  TermBox,
} from './BroadcasterSettlementInfoDialog';
import { ImageInput } from './ImageInput';

export function BroadcasterSettlementInfoContractor(): JSX.Element {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();
  return (
    <VStack alignItems="stretch">
      <SectionHeading>계약자 정보</SectionHeading>
      <Grid templateColumns="1fr 3fr" borderTopColor="gray.100" borderTopWidth={1.5}>
        <CustomRowItem
          header="과세 유형"
          body={
            <RadioGroup
              onChange={(value) => {
                setValue('type', value);
              }}
              defaultValue="개인(사업소득)"
            >
              <Stack spacing={3} direction="row">
                <Radio {...register('type')} value="개인(사업소득)">
                  개인(사업소득)
                </Radio>
                <Radio {...register('type')} value="개인사업자">
                  개인사업자
                </Radio>
              </Stack>
            </RadioGroup>
          }
        />
        {watch('type') === '개인사업자' && (
          <CustomRowItem
            header="세무처리 관련 설명"
            body={
              <FormControl isInvalid={!!errors.taxManageAgreement}>
                <TermBox text={TAX_MANAGEMENT_TERM} />

                <Checkbox
                  {...register('taxManageAgreement', {
                    required: '세무처리 관련 설명을 읽고 동의해주세요.',
                  })}
                >
                  세무처리와 관련된 설명을 읽고 이해하였으며, 이에 동의합니다
                </Checkbox>
                <FormErrorMessage ml={3} mt={0}>
                  {errors.taxManageAgreement && errors.taxManageAgreement.message}
                </FormErrorMessage>
              </FormControl>
            }
          />
        )}

        <CustomRowItem
          header="성명"
          body={
            <FormControl isInvalid={!!errors.name}>
              <Input
                id="name"
                variant="flushed"
                placeholder="실명을 입력해주세요."
                autoComplete="off"
                maxW={200}
                {...register('name', {
                  required: '실명 입력이 필요합니다.',
                })}
              />
              <FormErrorMessage ml={3} mt={0}>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>
          }
        />
        <CustomRowItem
          header="휴대전화번호"
          body={
            <FormControl
              isInvalid={!!errors.phone1 || !!errors.phone2 || !!errors.phone3}
            >
              <InputGroup alignItems="center">
                <Input
                  type="number"
                  variant="flushed"
                  autoComplete="off"
                  maxW={45}
                  placeholder="010"
                  maxLength={3}
                  {...register('phone1', {
                    required: {
                      value: true,
                      message: '휴대전화를 올바르게 입력해주세요.',
                    },
                    minLength: 3,
                    maxLength: 4,
                  })}
                />
                <Text as="span" mx={1}>
                  -
                </Text>
                <Input
                  type="number"
                  variant="flushed"
                  autoComplete="off"
                  maxW={45}
                  maxLength={4}
                  placeholder="0000"
                  {...register('phone2', {
                    required: {
                      value: true,
                      message: '휴대전화를 올바르게 입력해주세요.',
                    },
                    minLength: 4,
                    maxLength: 4,
                  })}
                />
                <Text as="span" mx={1}>
                  -
                </Text>
                <Input
                  type="number"
                  variant="flushed"
                  autoComplete="off"
                  maxW={45}
                  maxLength={4}
                  placeholder="0000"
                  {...register('phone3', {
                    required: {
                      value: true,
                      message: '휴대전화를 올바르게 입력해주세요.',
                    },
                    minLength: 4,
                    maxLength: 4,
                  })}
                />
              </InputGroup>
              <FormErrorMessage>휴대전화를 올바르게 입력해주세요</FormErrorMessage>
            </FormControl>
          }
        />

        <CustomRowItem
          header="주민등록번호"
          body={
            <FormControl isInvalid={!!errors.idCardNumber1 || !!errors.idCardNumber2}>
              <InputGroup alignItems="center">
                <Input
                  type="number"
                  variant="flushed"
                  autoComplete="off"
                  maxW={70}
                  placeholder="991231"
                  maxLength={6}
                  {...register('idCardNumber1', {
                    required: {
                      value: true,
                      message: '주민등록번호를 올바르게 입력해주세요.',
                    },
                    minLength: 6,
                    maxLength: 6,
                  })}
                />
                <Text as="span" mx={1}>
                  -
                </Text>
                <Input
                  type="number"
                  variant="flushed"
                  autoComplete="off"
                  maxW={70}
                  maxLength={4}
                  placeholder="1234567"
                  {...register('idCardNumber2', {
                    required: {
                      value: true,
                      message: '주민등록번호를 올바르게 입력해주세요.',
                    },
                    minLength: 7,
                    maxLength: 7,
                  })}
                />
              </InputGroup>
              <FormErrorMessage>주민등록번호를 올바르게 입력해주세요</FormErrorMessage>
            </FormControl>
          }
        />
        <CustomRowItem
          header="신분증 업로드"
          body={
            <FormControl isInvalid={!!errors.idCardImageName}>
              <ImageInput
                variant="chakra"
                size="sm"
                handleSuccess={() => {
                  console.log('success');
                }}
                handleError={() => {
                  console.log('error');
                }}
              />
              <FormErrorMessage ml={3} mt={0}>
                {errors.idCardImageName && errors.idCardImageName.message}
              </FormErrorMessage>
            </FormControl>
          }
        />
      </Grid>
    </VStack>
  );
}

export default BroadcasterSettlementInfoContractor;
