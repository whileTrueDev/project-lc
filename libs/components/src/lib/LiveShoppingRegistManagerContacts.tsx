import {
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import { useDefaultContacts, useProfile } from '@project-lc/hooks';
import { emailRegisterOptions, LiveShoppingInput } from '@project-lc/shared-types';
import { liveShoppingRegist } from '@project-lc/stores';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

export function LiveShoppingManagerPhoneNumber(): JSX.Element {
  const { setDefault, handleSetDefault } = liveShoppingRegist();
  const { data: profileData } = useProfile();
  const { data } = useDefaultContacts({
    email: profileData?.email || '',
  });

  const {
    register,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext<LiveShoppingInput>();

  type Keys = 'first' | 'second' | 'third';
  type SlicedPhoneNumber = { [k in Keys]: string };
  const makePhoneNumberForm = (fullPhoneNumber: string): SlicedPhoneNumber => {
    const first = fullPhoneNumber?.substring(0, 3) || '';
    const second = fullPhoneNumber?.substring(3, 7) || '';
    const third = fullPhoneNumber?.substring(7, 11) || '';
    return { first, second, third };
  };

  const firstNumber = data ? makePhoneNumberForm(data.phoneNumber).first : '';
  const secondNumber = data ? makePhoneNumberForm(data.phoneNumber).second : '';
  const thirdNumber = data ? makePhoneNumberForm(data.phoneNumber).third : '';
  const email = data ? data.email : '';

  useEffect(() => {
    if (!data) {
      setValue('useContact', 'new');
      handleSetDefault(true);
    } else {
      setValue('firstNumber', firstNumber);
      setValue('secondNumber', secondNumber);
      setValue('thirdNumber', thirdNumber);
      setValue('email', email);
    }
  }, [data, setValue, firstNumber, secondNumber, thirdNumber, email, handleSetDefault]);

  return (
    <Stack spacing={2}>
      <Heading as="h6" size="xs">
        담당자 연락처
      </Heading>

      <Stack spacing={2}>
        {!data ? (
          <RadioGroup
            onChange={(value) => {
              setValue('useContact', value);
            }}
            defaultValue="new"
          >
            <Stack spacing={3} direction="row">
              <Radio {...register('useContact')} value="old" isDisabled>
                기본 연락처
              </Radio>
              <Radio {...register('useContact')} value="new" defaultChecked>
                새 연락처
              </Radio>
            </Stack>
          </RadioGroup>
        ) : (
          <RadioGroup
            onChange={(value) => {
              setValue('useContact', value);
              if (watch('useContact') === 'new') {
                setValue('email', '');
                setValue('firstNumber', '');
                setValue('secondNumber', '');
                setValue('thirdNumber', '');
              } else {
                setValue('email', data.email);
                setValue('firstNumber', firstNumber);
                setValue('secondNumber', secondNumber);
                setValue('thirdNumber', thirdNumber);
              }
            }}
            defaultValue="old"
          >
            <Stack spacing={3} direction="row">
              <Radio {...register('useContact')} value="old">
                기존 연락처
              </Radio>
              <Radio {...register('useContact')} value="new">
                새 연락처
              </Radio>
            </Stack>
          </RadioGroup>
        )}

        <Stack borderWidth="0.025rem" maxW="600px" p={2} borderRadius="lg">
          <FormControl isRequired isInvalid={!!errors.email}>
            <FormLabel htmlFor="email">이메일</FormLabel>
            {!data || watch('useContact') === 'new' ? (
              <Input
                id="email"
                placeholder="minsu@example.com"
                autoComplete="off"
                maxWidth={300}
                value={watch('email', '')}
                {...register('email', { ...emailRegisterOptions })}
              />
            ) : (
              <Input
                id="email"
                variant="filled"
                placeholder="minsu@example.com"
                autoComplete="off"
                maxWidth={300}
                value={data.email}
                isDisabled
                {...register('email', { ...emailRegisterOptions })}
              />
            )}
            <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={
              !!errors.firstNumber || !!errors.secondNumber || !!errors.thirdNumber
            }
          >
            <FormLabel htmlFor="phone">전화번호</FormLabel>
            <Stack direction="row" alignItems="center">
              {!data || watch('useContact') === 'new' ? (
                <InputGroup maxWidth={300} alignItems="center">
                  <Input
                    type="text"
                    maxLength={3}
                    value={watch('firstNumber', '')}
                    {...register('firstNumber', {
                      required: '숫자만 입력하세요.',
                      pattern: {
                        value: /^[0-9]+$/,
                        message: '전화번호는 숫자만 가능합니다.',
                      },
                    })}
                  />
                  <span>-</span>
                  <Input
                    type="text"
                    maxLength={4}
                    value={watch('secondNumber', '')}
                    {...register('secondNumber', {
                      required: '숫자만 입력하세요.',
                      pattern: {
                        value: /^[0-9]+$/,
                        message: '전화번호는 숫자만 가능합니다.',
                      },
                    })}
                  />
                  <span>-</span>
                  <Input
                    type="text"
                    maxLength={4}
                    value={watch('thirdNumber', '')}
                    {...register('thirdNumber', {
                      required: '숫자만 입력하세요.',
                      pattern: {
                        value: /^[0-9]+$/,
                        message: '전화번호는 숫자만 가능합니다.',
                      },
                    })}
                  />
                </InputGroup>
              ) : (
                <InputGroup maxWidth={300} alignItems="center">
                  <Input
                    type="text"
                    variant="filled"
                    maxLength={3}
                    value={firstNumber}
                    isDisabled
                    {...register('firstNumber', {
                      required: '숫자만 입력하세요.',
                      pattern: {
                        value: /^[0-9]+$/,
                        message: '전화번호는 숫자만 가능합니다.',
                      },
                    })}
                  />
                  <span>-</span>
                  <Input
                    type="text"
                    variant="filled"
                    maxLength={4}
                    value={secondNumber}
                    isDisabled
                    {...register('secondNumber', {
                      required: '숫자만 입력하세요.',
                      pattern: {
                        value: /^[0-9]+$/,
                        message: '전화번호는 숫자만 가능합니다.',
                      },
                    })}
                  />
                  <span>-</span>
                  <Input
                    type="text"
                    variant="filled"
                    maxLength={4}
                    value={thirdNumber}
                    isDisabled
                    {...register('thirdNumber', {
                      required: '숫자만 입력하세요.',
                      pattern: {
                        value: /^[0-9]+$/,
                        message: '전화번호는 숫자만 가능합니다.',
                      },
                    })}
                  />
                </InputGroup>
              )}

              {!data || watch('useContact') === 'old' ? (
                <Checkbox isChecked isDisabled>
                  기본으로 설정
                </Checkbox>
              ) : (
                <Checkbox
                  isChecked={setDefault}
                  onChange={(e) => handleSetDefault(e.target.checked)}
                >
                  기본으로 설정
                </Checkbox>
              )}
            </Stack>
            <FormErrorMessage>
              {(errors.firstNumber && errors.firstNumber.message) ||
                (errors.secondNumber && errors.secondNumber.message) ||
                (errors.thirdNumber && errors.thirdNumber.message)}
            </FormErrorMessage>
          </FormControl>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default LiveShoppingManagerPhoneNumber;
