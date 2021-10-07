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

export function LiveShoppingManagerPhoneNumber(): JSX.Element {
  const [radio, setRadio] = useState('1');
  return (
    <Box w="100%" mt="10">
      <Stack spacing={5}>
        <Heading as="h6" size="xs">
          담당자 연락처
        </Heading>
        <FormControl>
          <RadioGroup onChange={setRadio} value={radio}>
            <Stack spacing={5} direction="row">
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
          <InputGroup>
            <Input
              type="text"
              maxLength={3}
              // onKeyUp="this.value=this.value.replace(/[^0-9]/g,'');"
            />
            <span>-</span>
            <Input
              type="text"
              maxLength={4}
              // onKeyUp="this.value=this.value.replace(/[^0-9]/g,'');"
            />
            <span>-</span>
            <Input
              type="text"
              maxLength={4}
              // onKeyUp="this.value=this.value.replace(/[^0-9]/g,'');"
            />
          </InputGroup>
        </FormControl>
      </Stack>
    </Box>
  );
}

export default LiveShoppingManagerPhoneNumber;
