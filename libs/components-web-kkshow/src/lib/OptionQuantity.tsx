import { MinusIcon, AddIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Text } from '@chakra-ui/react';

export interface OptionQuantityProps {
  handleDecrease: () => void;
  handleIncrease: () => void;
  decreaseDisabled?: boolean;
  increaseDisabled?: boolean;
  quantity: number;
}
export function OptionQuantity({
  handleDecrease,
  handleIncrease,
  decreaseDisabled,
  increaseDisabled,
  quantity,
}: OptionQuantityProps): JSX.Element {
  return (
    <Flex gap={1}>
      <IconButton
        variant="outline"
        aria-label="decrease-cart-item-option-quantity"
        icon={<MinusIcon />}
        size="xs"
        m={0}
        onClick={handleDecrease}
        isDisabled={decreaseDisabled || quantity === 1}
      />
      <Text fontSize={{ base: 'md', lg: 'lg' }} w={6} textAlign="center">
        {quantity}
      </Text>
      <IconButton
        variant="outline"
        aria-label="increase-cart-item-option-quantity"
        icon={<AddIcon />}
        size="xs"
        m={0}
        isDisabled={increaseDisabled}
        onClick={handleIncrease}
      />
    </Flex>
  );
}

export default OptionQuantity;
