import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  useFmOrder,
  useOrderExportableCheck,
  useOrderShippingItemsExportableCheck,
} from '@project-lc/hooks';
import {
  ExportOrderDto,
  FindFmOrderDetailRes,
  fmDeliveryCompanies,
  FmOrderShipping,
} from '@project-lc/shared-types';
import { fmExportStore } from '@project-lc/stores';
import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { OrderDetailGoods } from '..';
import FmOrderStatusBadge from './FmOrderStatusBadge';
import TextDotConnector from './TextDotConnector';

export interface ExportOrderOptionListProps {
  orderId: string;
  orderIndex?: number;
  onSubmitClick?: (id: string, idx: number) => void | Promise<void>;
  disableSelection?: boolean;
}
export function ExportOrderOptionList({
  orderId,
  orderIndex = 0,
  onSubmitClick,
  disableSelection = false,
}: ExportOrderOptionListProps): JSX.Element | null {
  const order = useFmOrder(orderId);

  // 주문 출고가능한 지 체크
  const { isDone, isExportable } = useOrderExportableCheck(order.data);

  if (isDone) return null;
  if (!isExportable) return null;
  if (order.isLoading) return null;

  if (!order.data) {
    return (
      <Alert status="warning">
        <AlertIcon />
        주문 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
      </Alert>
    );
  }
  return (
    <Stack pt={2} spacing={4}>
      {order.data.shippings.map((shipping, shippingIndex) => (
        <ExportOrderShippingListItem
          key={shipping.shipping_seq}
          shipping={shipping}
          order={order.data}
          disableSelection={disableSelection}
          orderId={orderId}
          orderIndex={orderIndex}
          shippingIndex={shippingIndex}
          onSubmitClick={onSubmitClick}
        />
      ))}
    </Stack>
  );
}

type ExportOrderShippingListItem = ExportOrderOptionListProps & {
  shipping: FmOrderShipping;
  order: FindFmOrderDetailRes;
  shippingIndex: number;
};
function ExportOrderShippingListItem({
  shipping,
  order,
  disableSelection,
  orderId,
  orderIndex = 0,
  shippingIndex,
  onSubmitClick,
}: ExportOrderShippingListItem): JSX.Element {
  const { setValue } = useFormContext<ExportOrderDto[]>();
  const selectedOrderShippings = fmExportStore((s) => s.selectedOrderShippings);
  const handleSelect = fmExportStore((s) => s.handleOrderShippingSelect);
  const selected = useMemo(() => {
    if (disableSelection) return true;
    return selectedOrderShippings.includes(shipping.shipping_seq);
  }, [disableSelection, selectedOrderShippings, shipping.shipping_seq]);

  // 현재 주문 상품배송 출고가능한 지 체크
  const { isDone, isExportable } = useOrderShippingItemsExportableCheck(shipping);

  const isDisabled = useMemo(
    () => !isExportable || isDone || !selected,
    [isDone, isExportable, selected],
  );

  // 첫 렌더링시, 해당 상품 선택
  useEffect(() => {
    if (
      !isDone &&
      isExportable &&
      !selectedOrderShippings.includes(shipping.shipping_seq)
    ) {
      setValue(`${orderIndex * 2 + shippingIndex * 3}.orderId`, orderId);
      handleSelect(shipping.shipping_seq);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      pt={2}
      pb={6}
      px={4}
      borderRadius="xl"
      boxShadow={selected ? 'outline' : undefined}
    >
      {/* 주문 메타 정보 */}
      <ExportOrderSummary
        order={order}
        disableSelection={disableSelection}
        selected={selected}
        onSelect={() => handleSelect(shipping.shipping_seq)}
      />

      {isDone && <FmOrderStatusBadge orderStatus="55" />}
      {!isExportable && <Badge>출고불가</Badge>}

      {/* 주문 상품 정보 및 출고처리 란 */}
      <Stack mt={4} direction="row" alignItems="center">
        {/* 주문 상품 정보 */}
        <Stack flex={3}>
          {shipping.items.map((item, itemIndex) => (
            <ExportOrderItem
              key={item.item_seq}
              orderId={orderId}
              item={item}
              orderShippingIndex={orderIndex * 2 + shippingIndex * 3}
              itemIndex={itemIndex}
              selected={selected}
            />
          ))}
        </Stack>

        {/* 출고처리 란  */}
        <Box flex={1}>
          <ExportOrderFormFields
            isDisabled={isDisabled}
            orderId={orderId}
            orderShippingIndex={orderIndex * 2 + shippingIndex * 3}
            disableSelection={disableSelection}
            selected={selected}
            onSubmitClick={onSubmitClick}
          />
        </Box>
      </Stack>
    </Box>
  );
}

interface ExportOrderSummaryProps {
  order: FindFmOrderDetailRes;
  selected?: boolean;
  disableSelection?: boolean;
  onSelect: () => void;
}
/** 출고 주문 메타 정보 (주문번호, 주문일시, 수령자정보) 등의 데이터를 포함합니다. */
function ExportOrderSummary({
  order,
  disableSelection,
  selected,
  onSelect,
}: ExportOrderSummaryProps): JSX.Element {
  return (
    <Stack spacing={1}>
      {!disableSelection && (
        <Box>
          <Checkbox
            size="lg"
            isChecked={selected}
            onChange={() => {
              onSelect(); // handleSelect(order.id);
            }}
          />
        </Box>
      )}
      <HStack alignItems="center" flexWrap="nowrap">
        <Text fontSize="sm">{order.order_seq}</Text>
        <TextDotConnector />
        <Text fontSize="sm" ml={2}>
          {dayjs(order.regist_date).fromNow()}
        </Text>
      </HStack>
      <HStack>
        <Text fontSize="sm">
          {order.recipient_address} {order.recipient_address_detail || ''}
        </Text>
        <Text fontSize="sm">
          {order.recipient_user_name} {order.recipient_cellphone}
        </Text>
      </HStack>
      {order.order_user_name === order.recipient_user_name &&
      order.order_cellphone === order.recipient_cellphone ? null : (
        <HStack>
          <Text fontSize="sm">
            {order.order_user_name} {order.order_cellphone}
          </Text>
        </HStack>
      )}
      {order.memo && (
        <HStack>
          <Text fontSize="sm">(배송메시지) {order.memo}</Text>
        </HStack>
      )}
    </Stack>
  );
}

interface ExportOrderFormFieldsProps {
  orderId: string;
  onSubmitClick: ExportOrderOptionListProps['onSubmitClick'];
  orderShippingIndex: number;
  isDisabled?: boolean;
  selected?: boolean;
  disableSelection?: boolean;
}
/** 각 주문상품 출고 폼 필드 컴포넌트 */
function ExportOrderFormFields({
  orderId,
  isDisabled,
  orderShippingIndex,
  selected,
  disableSelection,
  onSubmitClick,
}: ExportOrderFormFieldsProps): JSX.Element {
  const submitBtnVariant = useColorModeValue('solid', 'outline');
  const {
    register,
    formState: { errors },
  } = useFormContext<ExportOrderDto[]>();

  return (
    <Stack>
      {/* 택배사 선택 */}
      <FormControl isInvalid={!!errors[orderShippingIndex]?.deliveryCompanyCode}>
        <Select
          isDisabled={isDisabled}
          {...register(`${orderShippingIndex}.deliveryCompanyCode`, {
            required: { message: '택배사를 선택하세요.', value: !!selected },
          })}
          placeholder="택배사 선택"
        >
          {Object.keys(fmDeliveryCompanies).map((company) => (
            <option key={company} value={company}>
              {fmDeliveryCompanies[company].name}
            </option>
          ))}
        </Select>
        <FormErrorMessage>
          {errors[orderShippingIndex]?.deliveryCompanyCode &&
            errors[orderShippingIndex]?.deliveryCompanyCode?.message}
        </FormErrorMessage>
      </FormControl>

      {/* 송장번호 입력 */}
      <FormControl isInvalid={!!errors[orderShippingIndex]?.deliveryNumber}>
        <Input
          isDisabled={isDisabled}
          {...register(`${orderShippingIndex}.deliveryNumber`, {
            required: {
              message: '송장번호를 입력하세요.',
              value: !!selected,
            },
          })}
          placeholder="송장번호"
        />
        <FormErrorMessage>
          {errors[orderShippingIndex]?.deliveryNumber &&
            errors[orderShippingIndex]?.deliveryNumber?.message}
        </FormErrorMessage>
      </FormControl>

      {/* 출고처리 */}
      <Button
        variant={submitBtnVariant}
        colorScheme="pink"
        size="sm"
        onClick={() => {
          if (onSubmitClick) onSubmitClick(orderId, orderShippingIndex);
        }}
        type={disableSelection && selected && !onSubmitClick ? 'submit' : undefined}
        isDisabled={isDisabled}
      >
        출고처리
      </Button>
    </Stack>
  );
}

export interface ExportOrderItemProps {
  orderId: string;
  item: FindFmOrderDetailRes['items'][0];
  orderShippingIndex: number;
  itemIndex: number;
  selected?: boolean;
}
export function ExportOrderItem({
  item,
  orderId,
  orderShippingIndex,
  itemIndex,
  selected,
}: ExportOrderItemProps): JSX.Element | null {
  const { setValue } = useFormContext<ExportOrderDto[]>();
  useEffect(() => {
    setValue(`${orderShippingIndex}.shippingSeq`, item.shipping_seq);
    setValue(`${orderShippingIndex}.orderId`, orderId);
  }, [item.shipping_seq, orderId, orderShippingIndex, setValue]);

  return (
    <Stack
      pl={3}
      direction="row"
      alignItems="center"
      borderWidth="0.025rem"
      borderRadius="lg"
    >
      <Box flex={1}>
        <OrderDetailGoods orderItem={item} />
      </Box>
      <Box flex={2}>
        <Table>
          <Thead>
            <Tr>
              <Th>옵션</Th>
              <Th>총수량</Th>
              <Th>취소</Th>
              <Th>보냄</Th>
              <Th>남음</Th>
              <Th>보낼수량</Th>
            </Tr>
          </Thead>

          <Tbody>
            {item.options.map((opt, optIndex) => (
              <ExportOrderOptionItem
                item={item}
                key={opt.item_option_seq}
                option={opt}
                orderShippingIndex={orderShippingIndex}
                itemIndex={itemIndex}
                optionIndex={optIndex}
                selected={selected}
              />
            ))}
          </Tbody>
        </Table>
      </Box>
    </Stack>
  );
}

export interface ExportOrderOptionItemProps {
  item: FindFmOrderDetailRes['items'][0];
  option: FindFmOrderDetailRes['items'][0]['options'][0];
  orderShippingIndex: number;
  optionIndex: number;
  itemIndex: number;
  selected?: boolean;
}
export function ExportOrderOptionItem({
  item,
  option,
  orderShippingIndex,
  optionIndex,
  itemIndex,
  selected,
}: ExportOrderOptionItemProps): JSX.Element {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext<ExportOrderDto[]>();

  // 보낸 수량
  const sendedEa = useMemo(() => {
    const _calc = option.step55 + option.step65 + option.step75;
    if (_calc > option.ea) return option.ea;
    return _calc;
  }, [option.ea, option.step55, option.step65, option.step75]);
  // 남은 수량
  const restEa = useMemo(() => {
    const _calc =
      option.ea - option.step55 - option.step65 - option.step75 - option.step85;
    if (_calc < 0) return 0;
    return _calc;
  }, [option.ea, option.step55, option.step65, option.step75, option.step85]);

  const realIndex = useMemo(() => {
    // 두 배열인덱스를 통해 중복없는 값을 만들어내는 과정.
    return itemIndex * 2 + optionIndex * 3;
  }, [itemIndex, optionIndex]);

  useEffect(() => {
    if (selected) {
      // 입력받지는 않지만, 필수 값 처리
      setValue(
        `${orderShippingIndex}.exportOptions.${realIndex}.itemOptionSeq`,
        option.item_option_seq,
      );
      setValue(
        `${orderShippingIndex}.exportOptions.${realIndex}.itemSeq`,
        option.item_seq,
      );
      setValue(
        `${orderShippingIndex}.exportOptions.${realIndex}.optionTitle`,
        option.title1,
      );
      setValue(
        `${orderShippingIndex}.exportOptions.${realIndex}.option1`,
        option.option1,
      );

      // 보낼 수량 기본값으로 남은 수량 만큼 설정되어 있도록 처리
      if (restEa > 0) {
        setValue(`${orderShippingIndex}.exportOptions.${realIndex}.exportEa`, restEa);
      }
    }
  }, [
    option.item_option_seq,
    option.item_seq,
    option.option1,
    option.title1,
    orderShippingIndex,
    realIndex,
    restEa,
    selected,
    setValue,
    item.shipping_seq,
  ]);

  return (
    <Tr key={option.title1 + option.option1}>
      <Td>
        {option.title1 && option.option1 ? (
          <Text fontSize="sm">
            {option.title1} : {option.option1}
          </Text>
        ) : (
          <Text fontSize="sm">{item.goods_name}</Text>
        )}
        <FmOrderStatusBadge orderStatus={option.step} />
      </Td>
      <Td>{option.ea}</Td>
      <Td>{option.step85}</Td>
      <Td>{sendedEa}</Td>
      <Td>{restEa}</Td>
      <Td w="65px">
        <FormControl
          isInvalid={
            !!(
              errors[orderShippingIndex]?.exportOptions &&
              errors[orderShippingIndex]?.exportOptions?.[realIndex]?.exportEa
            )
          }
        >
          <Input
            isDisabled={restEa === 0 || !selected}
            {...register(`${orderShippingIndex}.exportOptions.${realIndex}.exportEa`, {
              required: {
                message: '보낼 수량을 입력해주세요.',
                value: !!selected && option.step85 + sendedEa !== option.ea,
              },
              min: { value: 0, message: '0보다 작을 수 없습니다.' },
              max: { value: restEa, message: '남은 수량 보다 클 수 없습니다.' },
            })}
            w="60px"
            placeholder={String(restEa)}
          />
          <FormErrorMessage fontSize="xs">
            {errors[orderShippingIndex]?.exportOptions &&
              errors[orderShippingIndex]?.exportOptions?.[realIndex]?.exportEa &&
              errors[orderShippingIndex]?.exportOptions?.[realIndex]?.exportEa?.message}
          </FormErrorMessage>
        </FormControl>
      </Td>
    </Tr>
  );
}
