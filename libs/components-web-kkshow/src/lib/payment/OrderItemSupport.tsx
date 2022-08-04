import {
  Avatar,
  AvatarProps,
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react';
import { CreateOrderForm } from '@project-lc/shared-types';
import { useFormContext } from 'react-hook-form';

export interface OrderItemSupportProps {
  orderItemIndex: number;
  avatarSize?: AvatarProps['size'];
  avatar?: string | null;
  nickname?: string | null;
}
export function OrderItemSupport({
  orderItemIndex,
  avatarSize,
  avatar,
  nickname,
}: OrderItemSupportProps): JSX.Element {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateOrderForm>();

  return (
    <Flex>
      <Avatar size={avatarSize} src={avatar || ''} mr={2} />
      <Box>
        <Text fontWeight="semibold">{nickname}</Text>
        <FormControl
          isInvalid={
            !!(errors.orderItems && errors.orderItems[orderItemIndex].support?.message)
          }
        >
          <FormLabel mb={0} fontSize="xs">
            구매후원메시지 (최대 30자)
          </FormLabel>
          <Input
            size="sm"
            {...register(`orderItems.${orderItemIndex}.support.message`, {
              max: {
                value: 30,
                message: '후원메시지는 최대 30자까지 작성 가능합니다.',
              },
            })}
          />
        </FormControl>
      </Box>
    </Flex>
  );
}
export default OrderItemSupport;
