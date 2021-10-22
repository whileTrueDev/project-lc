import { Button } from '@chakra-ui/button';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Stack,
  Input,
  Textarea,
  Box,
} from '@chakra-ui/react';
import { useSellerOrderCancelMutation } from '@project-lc/hooks';
import {
  convertFmOrderStatusToString,
  FmOrderItem,
  FmOrderOption,
} from '@project-lc/shared-types';
import { useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { ChakraNextImage } from './ChakraNextImage';
import { OrderExportDialogProps } from './ExportDialog';
import { ErrorText } from './ShippingOptionIntervalApply';

type OrderCancelItemType = Pick<
  FmOrderItem,
  'goods_seq' | 'goods_name' | 'item_seq' | 'image'
> &
  Pick<FmOrderOption, 'item_option_seq' | 'title1' | 'option1' | 'ea' | 'step'>;

type OrderCancelFormItem = OrderCancelItemType & { cancelAmount: number };

type OrderCancelForm = {
  cancelReason: string;
  cancelItems: OrderCancelFormItem[];
};

/** order 데이터에서 중첩 배열로 들어가있는 orderItemOptions를 1차원 배열로 바꿈 */
function flattenOrderItemOptions(
  items: (FmOrderItem & {
    options: FmOrderOption[];
  })[],
): OrderCancelItemType[] {
  return items.reduce((arr, item) => {
    const { goods_seq, goods_name, item_seq, options, image } = item;
    const itemOptions = options.map((opt) => {
      const { item_option_seq, title1, option1, ea, step } = opt;
      return {
        item_option_seq,
        title1,
        option1,
        ea,
        step,
        goods_seq,
        goods_name,
        item_seq,
        image,
      };
    });
    return [...arr, ...itemOptions];
  }, [] as OrderCancelItemType[]);
}

function OrderCancelRequstItem({
  item,
  amountInput,
}: {
  item: OrderCancelFormItem;
  amountInput: React.ReactNode;
}): JSX.Element {
  const { goods_name, title1, option1, ea, image } = item;
  return (
    <Stack direction="row" spacing={2} justifyContent="space-around">
      <ChakraNextImage
        layout="intrinsic"
        width={60}
        height={60}
        alt=""
        src={`http://whiletrue.firstmall.kr${image || ''}`}
      />
      <Stack>
        <Text fontWeight="bold">{goods_name}</Text>
        {title1 && (
          <Text colorScheme="gray">
            {title1} : {option1}
          </Text>
        )}
      </Stack>

      <Text>{ea}</Text>
      <Box>{amountInput}</Box>
    </Stack>
  );
}

export type OrderCancelRequestDialogProps = OrderExportDialogProps;
export function OrderCancelRequestDialog({
  order,
  isOpen,
  onClose,
}: OrderCancelRequestDialogProps): JSX.Element {
  // 결제취소 가능한 상품옵션목록
  const orderCancelItemList = useMemo(
    () =>
      flattenOrderItemOptions(order.items).filter(
        (item) => convertFmOrderStatusToString(item.step) === '결제확인',
      ),
    [order.items],
  );

  const {
    register,
    getValues,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderCancelForm>({
    defaultValues: {
      cancelItems: orderCancelItemList.map((item) => ({
        ...item,
        cancelAmount: item.ea,
      })),
      cancelReason: '',
    },
  });
  const { fields } = useFieldArray({
    name: 'cancelItems',
    control,
  });

  const orderCancelRequest = useSellerOrderCancelMutation();

  const submit = (data: OrderCancelForm): void => {
    const { cancelItems, cancelReason } = data;
    console.log('submit');
    // 판매자 email은 sellerEmail 로
    const dto = {
      orderSeq: order.order_seq.toString(),
      reason: cancelReason,
      orderCancelItems: cancelItems.map((item) => {
        const { cancelAmount, item_seq, item_option_seq } = item;
        return {
          amount: cancelAmount,
          orderItemSeq: item_seq,
          orderItemOptionSeq: item_option_seq,
        };
      }),
    };
    console.log(dto);
    orderCancelRequest.mutateAsync(dto);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="6xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(submit)}>
        <ModalHeader>결제취소 요청하기</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>결제 취소를 요청할 상품과 수량을 선택하세요</Text>

          <Stack direction="row" spacing={2} justifyContent="space-around">
            <Text>상품 사진</Text>
            <Text>상품명 / 옵션명</Text>
            <Text>주문 수량</Text>
            <Text>결제 취소 수량</Text>
          </Stack>

          {fields.map((field, index) => {
            const item = getValues(`cancelItems.${index}`);
            if (!item) return null;
            return (
              <OrderCancelRequstItem
                key={field.id}
                item={item}
                amountInput={
                  <Input
                    isInvalid={!!errors?.cancelItems?.[index]?.cancelAmount}
                    {...register(`cancelItems.${index}.cancelAmount` as const, {
                      valueAsNumber: true,
                      required: true,
                      max: item.ea,
                      min: 0,
                    })}
                  />
                }
              />
            );
          })}
          <Text>결제 취소 사유를 입력해주세요(최대 255자)</Text>

          <Textarea
            {...register('cancelReason', {
              required: true,
              validate: {
                notEmpty: (v) => {
                  if (!v || /^\s*$/.test(v))
                    return '빈 문자는 결제 취소 사유가 될 수 없습니다';
                  return true;
                },
              },
            })}
            resize="none"
            maxLength={255}
          />
          {errors?.cancelReason && <ErrorText>{errors?.cancelReason.message}</ErrorText>}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>취소</Button>
          <Button type="submit">취소요청하기</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default OrderCancelRequestDialog;
