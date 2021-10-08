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
} from '@chakra-ui/react';

export function LiveShoppingManagerPhoneNumber(props: any): JSX.Element {
  const { mail, phoneNumber, handleEmailInput, handlePhoneNumberInput } = props;
  const [radio, setRadio] = useState('1');
  return (
    // <Box w="100%" mt="10">
    <Stack spacing={2}>
      <Heading as="h6" size="xs">
        담당자 연락처
      </Heading>

      <FormControl isRequired>
        <Stack spacing={2}>
          <RadioGroup onChange={setRadio} value={radio}>
            <Stack spacing={3} direction="row">
              <Radio value="1">기존 연락처</Radio>
              <Radio value="2">새 연락처</Radio>
            </Stack>
          </RadioGroup>
          <FormLabel htmlFor="email">이메일</FormLabel>
          <Input
            id="email"
            type="email"
            placeholder="minsu@example.com"
            autoComplete="off"
            width={300}
            // {...register('email', { required: '이메일을 작성해주세요.' })}
          />
          {/* <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage> */}
          <FormLabel htmlFor="phone">전화번호</FormLabel>
          <InputGroup width={300} alignItems="center">
            <Input type="text" maxLength={3} />
            <span>-</span>
            <Input type="text" maxLength={4} />
            <span>-</span>
            <Input type="text" maxLength={4} />
          </InputGroup>
        </Stack>
      </FormControl>
    </Stack>
    // </Box>
  );
}

export default LiveShoppingManagerPhoneNumber;
