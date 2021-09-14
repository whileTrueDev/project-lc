import { QuestionIcon } from '@chakra-ui/icons';
import { Heading, HStack, Stack, Text } from '@chakra-ui/layout';
import { Radio, RadioGroup } from '@chakra-ui/radio';
import SectionWithTitle from './SectionWithTitle';
import TextWithPopperButton from './TextWithPopperButton';

export function GoodsRegistDataSales(): JSX.Element {
  return (
    <SectionWithTitle title="판매정보">
      <HStack>
        <Text>판매상태 fm_goods.goods_status</Text>
        <RadioGroup>
          <Radio>정상</Radio>
          <Radio>재고확보중</Radio>
          <Radio>판매중지</Radio>
        </RadioGroup>
      </HStack>

      <HStack>
        <TextWithPopperButton
          title="청약철회 fm_goods.cancel_type"
          iconAriaLabel="청약철회 설명"
          icon={<QuestionIcon />}
        >
          <Text>청약철회 불가 선택 시 결제 확인 이후, 취소, 반품, 교환이 불가합니다</Text>
        </TextWithPopperButton>
        <RadioGroup>
          <Radio>가능</Radio>
          <Radio>불가 (취소/교환/반품 불가)</Radio>
        </RadioGroup>
      </HStack>
    </SectionWithTitle>
  );
}

export default GoodsRegistDataSales;
