import { useState, useRef } from 'react';
import {
  Radio,
  RadioGroup,
  Box,
  Heading,
  Stack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  Checkbox,
} from '@chakra-ui/react';

export function LiveShoppingManagerPhoneNumber(props: any): JSX.Element {
  const { mail, phoneNumber, handleEmailInput, handlePhoneNumberInput, data } = props;
  const [radio, setRadio] = useState('');
  type Keys = 'first' | 'second' | 'third';
  type SlicedPhoneNumber = { [k in Keys]: string };
  const makePhoneNumberForm = (fullPhoneNumber: string): SlicedPhoneNumber => {
    const first = fullPhoneNumber.substring(0, 3);
    const second = fullPhoneNumber.substring(3, 7);
    const third = fullPhoneNumber.substring(7, 11);
    return { first, second, third };
  };
  return (
    <Stack spacing={2}>
      <Heading as="h6" size="xs">
        담당자 연락처
      </Heading>

      <FormControl isRequired>
        <Stack spacing={2}>
          {data === '' ? (
            <RadioGroup onChange={setRadio} defaultValue="2">
              <Stack spacing={3} direction="row">
                <Radio value="1" isDisabled>
                  기본 연락처
                </Radio>
                <Radio value="2" defaultChecked>
                  새 연락처
                </Radio>
              </Stack>
            </RadioGroup>
          ) : (
            <RadioGroup onChange={setRadio} defaultValue="1">
              <Stack spacing={3} direction="row">
                <Radio value="1">기존 연락처</Radio>
                <Radio value="2">새 연락처</Radio>
              </Stack>
            </RadioGroup>
          )}
          <Stack
            outline="solid 0.5px lightgray"
            width="600px"
            padding="7px"
            borderRadius="3pt"
          >
            <FormLabel htmlFor="email">이메일</FormLabel>
            {data === '' || radio === '2' ? (
              <Input
                id="email"
                type="email"
                placeholder="minsu@example.com"
                autoComplete="off"
                width={300}
                value=""
                // {...register('email', { required: '이메일을 작성해주세요.' })}
              />
            ) : (
              <Input
                id="email"
                type="email"
                placeholder="minsu@example.com"
                autoComplete="off"
                width={300}
                value={data.email}
                isDisabled
                // {...register('email', { required: '이메일을 작성해주세요.' })}
              />
            )}
            {/* <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage> */}
            <FormLabel htmlFor="phone">전화번호</FormLabel>
            <Stack direction="row" alignItems="center">
              {data === '' || radio === '2' ? (
                <InputGroup width={300} alignItems="center">
                  <Input type="text" maxLength={3} value="" />
                  <span>-</span>
                  <Input type="text" maxLength={4} value="" />
                  <span>-</span>
                  <Input type="text" maxLength={4} value="" />
                </InputGroup>
              ) : (
                <InputGroup width={300} alignItems="center">
                  <Input
                    type="text"
                    maxLength={3}
                    value={makePhoneNumberForm(data.phoneNumber).first}
                    isDisabled
                  />
                  <span>-</span>
                  <Input
                    type="text"
                    maxLength={4}
                    value={makePhoneNumberForm(data.phoneNumber).second}
                    isDisabled
                  />
                  <span>-</span>
                  <Input
                    type="text"
                    maxLength={4}
                    value={makePhoneNumberForm(data.phoneNumber).third}
                    isDisabled
                  />
                </InputGroup>
              )}

              {data === '' || radio === '2' ? (
                <Checkbox>기본으로 설정</Checkbox>
              ) : (
                <Checkbox isChecked isDisabled>
                  기본으로 설정
                </Checkbox>
              )}
            </Stack>
          </Stack>
        </Stack>
      </FormControl>
    </Stack>
  );
}

export default LiveShoppingManagerPhoneNumber;
