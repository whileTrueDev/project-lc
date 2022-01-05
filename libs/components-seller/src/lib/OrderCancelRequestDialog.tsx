import { Button } from '@chakra-ui/button';
import {
  Box,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { ErrorText } from '@project-lc/components-core/ErrorText';
import { useSellerOrderCancelMutation } from '@project-lc/hooks';
import {
  convertFmOrderStatusToString,
  FmOrderItem,
  FmOrderOption,
} from '@project-lc/shared-types';
import { useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { OrderExportDialogProps } from './ExportDialog';

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
    <Tr direction="row" spacing={2} justifyContent="space-around">
      <Td>
        <ChakraNextImage
          layout="intrinsic"
          width={60}
          height={60}
          alt=""
          src={`http://whiletrue.firstmall.kr${image || ''}`}
        />
      </Td>
      <Td>
        <Stack>
          <Text fontWeight="bold">{goods_name}</Text>
          {title1 && (
            <Text colorScheme="gray">
              {title1} : {option1}
            </Text>
          )}
        </Stack>
      </Td>

      <Td>{ea}</Td>
      <Td>
        <Box>{amountInput}</Box>
      </Td>
    </Tr>
  );
}

export type OrderCancelRequestDialogProps = OrderExportDialogProps;
export function OrderCancelRequestDialog({
  order,
  isOpen,
  onClose,
}: OrderCancelRequestDialogProps): JSX.Element {
  const toast = useToast();
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
    reset,
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

    orderCancelRequest
      .mutateAsync(dto)
      .then(() => {
        reset();
        onClose();
        toast({ title: '결제취소를 요청하였습니다.', status: 'success' });
      })
      .catch((error) => {
        console.error(error);
        toast({ title: '결제취소를 요청하는 중 오류가 발생했습니다.', status: 'error' });
      });
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

          <Table mb={4}>
            <Thead>
              <Tr>
                <Th>상품 사진</Th>
                <Th>상품명 / 옵션명</Th>
                <Th>주문 수량</Th>
                <Th>결제 취소 수량</Th>
              </Tr>
            </Thead>
            <Tbody>
              {fields.map((field, index) => {
                const item = getValues(`cancelItems.${index}`);
                if (!item) return null;
                return (
                  <OrderCancelRequstItem
                    key={field.id}
                    item={item}
                    amountInput={
                      <Stack>
                        <Input
                          // width="80px"
                          isInvalid={!!errors?.cancelItems?.[index]?.cancelAmount}
                          {...register(`cancelItems.${index}.cancelAmount` as const, {
                            valueAsNumber: true,
                            required: true,
                            validate: {
                              max: (v) => v <= item.ea || '주문수량 초과불가',
                              min: (v) => v >= 0 || '음수 불가',
                            },
                          })}
                        />
                        {errors.cancelItems?.[index]?.cancelAmount && (
                          <ErrorText>
                            {errors.cancelItems?.[index]?.cancelAmount?.message}
                          </ErrorText>
                        )}
                      </Stack>
                    }
                  />
                );
              })}
            </Tbody>
          </Table>
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
          <Button onClick={onClose} mr={2}>
            취소
          </Button>
          <Button type="submit">요청하기</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default OrderCancelRequestDialog;
