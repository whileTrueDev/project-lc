import {
  Button,
  useBoolean,
  Text,
  Radio,
  RadioGroup,
  Input,
  HStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import SectionWithTitle from './SectionWithTitle';

export function GoodsRegistDataOptions(): JSX.Element {
  const [optionUse, setOptionUse] = useState('0'); // 0: 사용안함, 1: 사용

  return (
    <SectionWithTitle title="판매정보">
      <Text>옵션 사용 여부</Text>
      <RadioGroup value={optionUse} onChange={setOptionUse}>
        <Radio value="1">사용</Radio>
        <Radio value="0">사용 안함</Radio>
      </RadioGroup>
      <Button>옵션 생성/수정 {optionUse}</Button>
      {optionUse === '1' ? (
        <Text>생성된 옵션목록 & 기본옵션 표시</Text>
      ) : (
        <HStack>
          <Text>기본옵션 입력폼</Text>
          <Input />
        </HStack>
      )}
    </SectionWithTitle>
  );
}

export default GoodsRegistDataOptions;
