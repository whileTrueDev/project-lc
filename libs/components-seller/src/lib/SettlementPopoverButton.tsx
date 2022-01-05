import {
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
          <Text as="u" fontSize="xs">
            1. 사업자 등록증이 등록되었는지 확인해주세요.
          </Text>
          <br />
          <Text as="u" fontSize="xs">
            2. 정산 계좌가 등록되었는지 확인해주세요.
          </Text>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default SettlementPopoverButton;
