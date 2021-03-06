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
          π¨ νμ¬ μ μ°μ΄ λΆκ°λ₯ ν©λλ€!
        </PopoverHeader>
        <PopoverArrow />
        <PopoverBody>
          <OrderedList>
            <ListItem fontSize="xs">
              <Text>μ¬μμ λ±λ‘μ¦μ΄ λ±λ‘λμλμ§ νμΈν΄μ£ΌμΈμ.</Text>
            </ListItem>
            <ListItem fontSize="xs">
              <Text>μ μ° κ³μ’κ° λ±λ‘λμλμ§ νμΈν΄μ£ΌμΈμ.</Text>
            </ListItem>
          </OrderedList>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default SettlementPopoverButton;
