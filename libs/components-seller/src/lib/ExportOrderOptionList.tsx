import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  HStack,
  Image,
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
import TextDotConnector from '@project-lc/components-core/TextDotConnector';
import { OrderStatusBadge } from '@project-lc/components-shared/order/OrderStatusBadge';
import {
  useOrderDetail,
  useOrderExportableCheck,
  useOrderShippingItemsExportableCheck,
  useProfile,
} from '@project-lc/hooks';
import {
  CreateKkshowExportDto,
  OrderDetailRes,
  OrderDetailShipping,
} from '@project-lc/shared-types';
import { sellerExportStore } from '@project-lc/stores';
import { deliveryCompanies } from '@project-lc/utils-frontend';
import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

export interface ExportOrderOptionListProps {
  orderCode?: string;
  orderIndex?: number;
  onSubmitClick?: (id: number, idx: number) => void | Promise<void>;
  disableSelection?: boolean;
}
export function ExportOrderOptionList({
  orderCode,
  orderIndex = 0,
  onSubmitClick,
  disableSelection = false,
}: ExportOrderOptionListProps): JSX.Element | null {
  const { data: profileData } = useProfile();
  // 주문 조회시 해당 판매자의 고유번호도 같이 전송하여, 주문상품 중에서 해당 판매자의 상품 & 배송비정책에 연결된 상품만 가져온다
  const order = useOrderDetail({
    orderCode,
    sellerId: profileData?.type === 'seller' ? profileData?.id : undefined,
  });
  // 주문 출고가능한 지 체크
  const { isDone, isExportable } = useOrderExportableCheck(order.data);
  if (isDone) return null;
  if (!isExportable) {
    return (
      <Alert status="warning">
        <AlertIcon />
        출고 가능한 상태가 아닙니다.
      </Alert>
    );
  }
  if (order.isLoading) {
    return (
      <Alert status="warning">
        <AlertIcon />
        데이터를 로딩중
      </Alert>
    );
  }
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
      {order.data.shippings
        ?.filter((shipping) => shipping.items.length > 0)
        .map((shipping, shippingIndex) => (
          <ExportOrderShippingListItem
            key={shipping.id}
            shipping={shipping}
            order={order.data}
            disableSelection={disableSelection}
            orderIndex={orderIndex}
            shippingIndex={shippingIndex}
            onSubmitClick={onSubmitClick}
          />
        ))}
    </Stack>
  );
}

type ExportOrderShippingListItemProps = ExportOrderOptionListProps & {
  shipping: OrderDetailShipping;
  order: OrderDetailRes;
  shippingIndex: number;
};
function ExportOrderShippingListItem({
  shipping,
  order,
  disableSelection,
  orderIndex = 0,
  shippingIndex,
  onSubmitClick,
}: ExportOrderShippingListItemProps): JSX.Element {
  const { setValue } = useFormContext<CreateKkshowExportDto[]>();
  const selectedOrderShippings = sellerExportStore((s) => s.selectedOrderShippings);
  const handleSelect = sellerExportStore((s) => s.handleOrderShippingSelect);
  const selected = useMemo(() => {
    if (disableSelection) return true;
    return !!selectedOrderShippings.find((x) => x.shippingId === shipping.id);
  }, [disableSelection, selectedOrderShippings, shipping.id]);

  // 현재 주문 상품배송 출고가능한 지 체크
  const { isDone, isExportable } = useOrderShippingItemsExportableCheck(shipping);

  const isDisabled = useMemo(
    () => !isExportable || isDone || !selected,
    [isDone, isExportable, selected],
  );

  const onShippingSelect = (): void =>
    handleSelect({ shippingId: shipping.id, orderId: order.id });

  // 첫 렌더링시, 해당 상품 선택
  useEffect(() => {
    if (
      !isDone &&
      isExportable &&
      !selectedOrderShippings.find((x) => x.shippingId === shipping.id)
    ) {
      setValue(`${orderIndex * 2 + shippingIndex * 3}.orderId`, order.id);
      onShippingSelect();
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
        onSelect={onShippingSelect}
      />

      {isDone && <OrderStatusBadge step="exportDone" />}
      {!isExportable && <Badge>출고불가</Badge>}

      {/* 주문 상품 정보 및 출고처리 란 */}
      <Stack mt={4} direction="row" alignItems="center">
        {/* 주문 상품 정보 */}
        <Stack flex={3}>
          {shipping.items.map((item, itemIndex) => (
            <ExportOrderItem
              key={item.id}
              orderId={order.id}
              order={order}
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
            orderId={order.id}
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
  order: OrderDetailRes;
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
        <Text fontSize="sm">{order.orderCode}</Text>
        <TextDotConnector />
        <Text fontSize="sm" ml={2}>
          {dayjs(order.createDate).fromNow()}
        </Text>
      </HStack>
      <HStack>
        <Text fontSize="sm">
          {order.recipientAddress} {order.recipientDetailAddress || ''}
        </Text>
        <Text fontSize="sm">
          {order.recipientName} {order.recipientPhone}
        </Text>
      </HStack>
      {order.ordererName === order.recipientName &&
      order.ordererPhone === order.recipientPhone ? null : (
        <HStack>
          <Text fontSize="sm">
            (주문인) {order.ordererName} {order.ordererPhone}
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
  orderId: number;
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
  } = useFormContext<CreateKkshowExportDto[]>();

  return (
    <Stack>
      {/* 택배사 선택 */}
      <FormControl isInvalid={!!errors[orderShippingIndex]?.deliveryCompany}>
        <Select
          isDisabled={isDisabled}
          {...register(`${orderShippingIndex}.deliveryCompany`, {
            required: { message: '택배사를 선택하세요.', value: !!selected },
          })}
          placeholder="택배사 선택"
        >
          {deliveryCompanies.map((company) => (
            <option key={company.company} value={company.company}>
              {company.company}
            </option>
          ))}
        </Select>
        <FormErrorMessage>
          {errors[orderShippingIndex]?.deliveryCompany &&
            errors[orderShippingIndex]?.deliveryCompany?.message}
        </FormErrorMessage>
      </FormControl>

      {/* 송장번호 입력 */}
      <FormControl isInvalid={!!errors[orderShippingIndex]?.deliveryNumber}>
        <Input
          isDisabled={isDisabled}
          {...register(`${orderShippingIndex}.deliveryNumber`, {
            required: { message: '송장번호를 입력하세요.', value: !!selected },
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
  orderId: number;
  item: OrderDetailShipping['items'][number];
  order: OrderDetailRes;
  orderShippingIndex: number;
  itemIndex: number;
  selected?: boolean;
}
export function ExportOrderItem({
  item,
  orderId,
  order,
  orderShippingIndex,
  itemIndex,
  selected,
}: ExportOrderItemProps): JSX.Element | null {
  const { setValue } = useFormContext<CreateKkshowExportDto[]>();
  useEffect(() => {
    setValue(`${orderShippingIndex}.orderId`, orderId);
  }, [orderId, orderShippingIndex, setValue]);

  const orderItem = useMemo(
    () => order.orderItems.find((oi) => oi.id === item.id),
    [item.id, order.orderItems],
  );
  return (
    <Stack
      pl={3}
      direction="row"
      alignItems="center"
      borderWidth="0.025rem"
      borderRadius="lg"
    >
      <Flex gap={2} align="center">
        <Image
          objectFit="cover"
          w="50px"
          h="50px"
          rounded="md"
          draggable={false}
          src={orderItem?.goods.image?.[0]?.image}
        />
        <Text maxW={75} fontSize="sm" noOfLines={3}>
          {orderItem?.goods.goods_name}
        </Text>
      </Flex>
      <Box flex={2}>
        <Table>
          <Thead>
            <Tr>
              <Th>옵션</Th>
              <Th>총수량</Th>
              <Th>보냄</Th>
              <Th>남음</Th>
              <Th>보낼수량</Th>
            </Tr>
          </Thead>

          <Tbody>
            {item.options.map((opt, optIndex) => (
              <ExportOrderOptionItem
                key={opt.id}
                item={item}
                option={opt}
                order={order}
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
  order: OrderDetailRes;
  item: OrderDetailShipping['items'][number];
  option: OrderDetailShipping['items'][number]['options'][number];
  orderShippingIndex: number;
  optionIndex: number;
  itemIndex: number;
  selected?: boolean;
}
export function ExportOrderOptionItem({
  order,
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
  } = useFormContext<CreateKkshowExportDto[]>();

  // 보낸 수량
  const sendedEa = useMemo(() => {
    if (!order.exports || order.exports.length === 0) return 0; // 출고가 없는 경우
    const orderExp = order.exports.find((e) => e.orderId === order.id);
    if (!orderExp) return 0; // 출고를 찾을 수 없는 경우
    const orderOptExp = orderExp.items.find((i) => i.orderItemOptionId === option.id);
    if (!orderOptExp) return 0; // 출고가 있으나 해당 옵션에 대한 출고는 없는 경우
    return orderOptExp.quantity;
  }, [option.id, order.exports, order.id]);

  // 남은 수량
  const restEa = useMemo(() => {
    // 출고가 없는 경우
    if (!order.exports || order.exports.length === 0) return option.quantity;
    const orderExp = order.exports.find((e) => e.orderId === order.id);
    if (!orderExp) return option.quantity;
    const orderOptExp = orderExp.items.find((i) => i.orderItemOptionId === option.id);
    if (!orderOptExp) return option.quantity;
    const _restEa = option.quantity - orderOptExp.quantity;
    if (_restEa < 0) return 0;
    return _restEa;
  }, [option.id, option.quantity, order.exports, order.id]);

  const realIndex = useMemo(() => {
    // 두 배열인덱스를 통해 중복없는 값을 만들어내는 과정.
    return itemIndex * 2 + optionIndex * 3;
  }, [itemIndex, optionIndex]);

  useEffect(() => {
    if (selected) {
      // 입력받지는 않지만, 필수 값 처리
      setValue(`${orderShippingIndex}.items.${realIndex}.orderItemOptionId`, option.id);
      setValue(`${orderShippingIndex}.items.${realIndex}.orderItemId`, item.id);
      // 보낼 수량 기본값으로 남은 수량 만큼 설정되어 있도록 처리
      if (restEa > 0) {
        setValue(`${orderShippingIndex}.items.${realIndex}.quantity`, restEa);
      }
    }
  }, [item.id, option.id, orderShippingIndex, realIndex, restEa, selected, setValue]);

  return (
    <Tr key={`${option.name}${option.value}`}>
      <Td>
        {option.name && option.value ? (
          <Text fontSize="sm">
            {option.name} : {option.value}
          </Text>
        ) : (
          <Text fontSize="sm">{option.goodsName}</Text>
        )}
        <OrderStatusBadge step={option.step} />
      </Td>
      <Td>{option.quantity}</Td>
      <Td>{sendedEa}</Td>
      <Td>{restEa}</Td>
      <Td w="65px">
        <FormControl
          isInvalid={
            !!(
              errors[orderShippingIndex]?.items &&
              errors[orderShippingIndex]?.items?.[realIndex]?.quantity
            )
          }
        >
          <Input
            isDisabled={restEa === 0 || !selected}
            {...register(`${orderShippingIndex}.items.${realIndex}.quantity`, {
              required: {
                message: '보낼 수량을 입력해주세요.',
                value: !!selected && sendedEa !== option.quantity,
              },
              min: { value: 0, message: '0보다 작을 수 없습니다.' },
              max: { value: restEa, message: '남은 수량 보다 클 수 없습니다.' },
              valueAsNumber: true,
            })}
            w="60px"
            placeholder={String(restEa)}
          />
          <FormErrorMessage fontSize="xs">
            {errors[orderShippingIndex]?.items &&
              errors[orderShippingIndex]?.items?.[realIndex]?.quantity &&
              errors[orderShippingIndex]?.items?.[realIndex]?.quantity?.message}
          </FormErrorMessage>
        </FormControl>
      </Td>
    </Tr>
  );
}
export default ExportOrderOptionList;
