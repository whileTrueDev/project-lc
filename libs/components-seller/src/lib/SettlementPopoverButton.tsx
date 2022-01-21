import {
  ListItem,
  OrderedList,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';

export function SettlementPopoverButton({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  return (
    <Popover trigger="click">
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent>
        <PopoverHeader fontSize="sm" fontWeight="semibold">
          🚨 현재 정산이 불가능 합니다!
        </PopoverHeader>
        <PopoverArrow />
        <PopoverBody>
          <OrderedList>
            <ListItem fontSize="xs">
              <Text>사업자 등록증이 등록되었는지 확인해주세요.</Text>
            </ListItem>
            <ListItem fontSize="xs">
              <Text>정산 계좌가 등록되었는지 확인해주세요.</Text>
            </ListItem>
          </OrderedList>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default SettlementPopoverButton;
