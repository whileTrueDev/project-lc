import {
  Alert,
  AlertIcon,
  Button,
  FormControl,
  Input,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  UnorderedList,
  useToast,
} from '@chakra-ui/react';
import { useExportBundledOrdersMutation } from '@project-lc/hooks';
import {
  CreateKkshowExportDto,
  ExportManyDto,
  OrderDetailRes,
} from '@project-lc/shared-types';
import { sellerExportStore } from '@project-lc/stores';
import { deliveryCompanies } from '@project-lc/utils-frontend';
import { useCallback, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

export interface ExportBundleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => Promise<void> | void;
  orders: Pick<
    OrderDetailRes,
    | 'shippings'
    | 'ordererName'
    | 'recipientAddress'
    | 'recipientDetailAddress'
    | 'recipientName'
    | 'recipientPhone'
    | 'orderItems'
  >[];
}
export function ExportBundleDialog({
  isOpen,
  onClose,
  onSuccess,
  orders,
}: ExportBundleDialogProps): JSX.Element {
  const toast = useToast();
  const {
    getValues,
    formState: { isSubmitting },
  } = useFormContext<CreateKkshowExportDto[]>();
  const selectedOrderShippings = sellerExportStore((s) => s.selectedOrderShippings);
  const [deliveryCompany, setDeliveryCompany] = useState('');
  const [deliveryNumber, setDeliveryNumber] = useState('');

  const exportBundledOrders = useExportBundledOrdersMutation();

  const _targetOrders = useMemo(() => {
    return orders.filter((order) => {
      return order.shippings?.some((shipp) => {
        return !!selectedOrderShippings.find((x) => x.shippingId === shipp.id);
      });
    });
  }, [orders, selectedOrderShippings]);

  /** 합포장 출고처리 가능한 지 체크 */
  const isAbleToBundle = useMemo(() => {
    return _targetOrders.reduce((isOk, order, crrIndex) => {
      if (!isOk) return false;
      const prev = _targetOrders[crrIndex - 1];
      if (!prev) return true;
      // * 선택한 주문의 주문자, 받는곳, 받는분, 받는분 연락처(휴대폰)의 정보가 동일해야 합니다.
      // 주문자
      if (order.ordererName !== prev.ordererName) return false;
      // 받는 곳
      if (order.recipientAddress !== prev.recipientAddress) return false;
      if (order.recipientDetailAddress !== prev.recipientDetailAddress) return false;
      // 받는 분
      if (order.recipientName !== prev.recipientName) return false;
      // 받는 분 연락처
      if (order.recipientPhone !== prev.recipientPhone) return false;
      // * 선택한 주문의 동일 판매자의 실물 배송상품을 합포장 할 수 있습니다.
      return true;
    }, true);
  }, [_targetOrders]);

  /** 합포장 출고 처리 요청 */
  const exportBundle = useCallback(
    async (dto: ExportManyDto) => {
      const isExportable = dto.exportOrders.every((o) =>
        o.items.every((i) => !(Number(i.quantity) === 0)),
      );
      if (!isExportable)
        return toast({
          status: 'warning',
          description:
            '모든 주문상품의 보낼 수량이 0 입니다. 보낼 수량을 올바르게 입력해주세요.',
        });

      // options배열의 빈 값 정리
      const realDto = {
        ...dto,
        exportOrders: dto.exportOrders.map((order) => ({
          ...order,
          items: order.items.filter((x) => !!x.quantity),
        })),
      };

      return exportBundledOrders
        .mutateAsync(realDto)
        .then(() => {
          toast({
            status: 'success',
            description: '합포장 출고 처리가 성공적으로 완료되었습니다.',
          });
          onClose();
          if (onSuccess) onSuccess();
        })
        .catch(() =>
          toast({
            status: 'error',
            description:
              '합포장 출고 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          }),
        );
    },
    [exportBundledOrders, onClose, onSuccess, toast],
  );

  /** 합포장 출고처리 API 요청 */
  async function onBundledExportSubmit(): Promise<string | number | void> {
    const formData = getValues();
    const selectedKeys = Object.keys(formData);
    const _orders: CreateKkshowExportDto[] = [];

    // 상품 판매자 id
    const sellerId = _targetOrders[0]?.orderItems[0]?.goods?.sellerId;
    selectedKeys.forEach((k) => {
      const data = formData[Number(k)];
      const realData = {
        ...data,
        items: data.items.filter((x) => !!x.quantity),
        deliveryCompany,
        deliveryNumber,
        sellerId,
      };
      _orders.push(realData);
    });
    const realOrders = _orders.filter((d) =>
      selectedOrderShippings.find((x) => x.orderId === d.orderId),
    );
    // 합포장 출고처리 요청
    return exportBundle({ exportOrders: realOrders });
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>합포장 출고처리</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isAbleToBundle ? (
            <>
              <Text>
                선택된 주문의 배송묶음 {selectedOrderShippings.length} 개를 합포장 처리
                합니다.
              </Text>
              <Stack mt={4} spacing={2}>
                <FormControl>
                  <Select
                    placeholder="택배사를 선택하세요."
                    value={deliveryCompany}
                    onChange={(e) => setDeliveryCompany(e.target.value)}
                  >
                    {deliveryCompanies.map((company) => (
                      <option key={company.company} value={company.company}>
                        {company.company}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <Input
                    placeholder="송장번호"
                    value={deliveryNumber}
                    onChange={(e) => setDeliveryNumber(e.target.value)}
                  />
                </FormControl>
              </Stack>
            </>
          ) : (
            <Stack spacing={4}>
              <Alert status="error">
                <AlertIcon />
                <Text>합포장 출고처리를 진행할 수 없습니다.</Text>
              </Alert>

              <UnorderedList>
                <ListItem>
                  선택한 모든 주문의 주문자, 받는곳, 받는분, 받는분 연락처(휴대폰)의
                  정보가 동일해야 합니다.
                </ListItem>
              </UnorderedList>
            </Stack>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            isLoading={exportBundledOrders.isLoading || isSubmitting}
            isDisabled={!deliveryCompany || !deliveryNumber}
            colorScheme="pink"
            onClick={() => onBundledExportSubmit()}
          >
            합포장 출고처리
          </Button>
          <Button onClick={onClose} ml={2}>
            취소
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
