import { RepeatIcon } from '@chakra-ui/icons';
import {
  Avatar,
  AvatarProps,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useBroadcaster } from '@project-lc/hooks';
import { CreateOrderForm } from '@project-lc/shared-types';
import { useFormContext } from 'react-hook-form';

export interface OrderItemSupportProps {
  orderItemIndex: number;
  avatarSize?: AvatarProps['size'];
  broadcasterId?: number | null;
}
export function OrderItemSupport({
  orderItemIndex,
  avatarSize,
  broadcasterId,
}: OrderItemSupportProps): JSX.Element | null {
  const {
    data: broadcaster,
    isLoading,
    refetch,
  } = useBroadcaster({ id: broadcasterId || undefined });
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateOrderForm>();

  if (isLoading) return <Spinner />;
  if (!isLoading && !broadcaster) {
    return (
      <Box>
        <Text>선물 방송인 정보를 불러올 수 없습니다.</Text>
        <Button leftIcon={<RepeatIcon />} onClick={() => refetch()}>
          새로고침
        </Button>
      </Box>
    );
  }
  return (
    <Flex>
      <Avatar size={avatarSize} src={broadcaster?.avatar || ''} mr={2} />
      <Box>
        <Text fontWeight="semibold">{broadcaster?.userNickname}</Text>
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
          <FormErrorMessage>
            {errors?.orderItems?.[orderItemIndex]?.support?.message}
          </FormErrorMessage>
        </FormControl>
      </Box>
    </Flex>
  );
}
export default OrderItemSupport;
