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
  ExportBundledOrdersDto,
  ExportOrderDto,
  FindFmOrderRes,
  fmDeliveryCompanies,
} from '@project-lc/shared-types';
import { fmExportStore } from '@project-lc/stores';
import { useCallback, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

export interface ExportBundleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => Promise<void> | void;
  orders: Pick<
    FindFmOrderRes,
    | 'shipping_seq'
    | 'order_user_name'
    | 'recipient_address'
    | 'recipient_address_detail'
    | 'recipient_user_name'
    | 'recipient_cellphone'
  >[];
}
export function ExportBundleDialog({
  isOpen,
  onClose,
  onSuccess,
  orders,
}: ExportBundleDialogProps): JSX.Element {
  const toast = useToast();
  const { getValues } = useFormContext<ExportOrderDto[]>();
  const selectedOrderShippings = fmExportStore((s) => s.selectedOrderShippings);
  const [deliveryCompany, setDeliveryCompany] = useState('');
  const [deliveryNumber, setDeliveryNumber] = useState('');

  const exportBundledOrders = useExportBundledOrdersMutation();

  /** 합포장 출고처리 가능한 지 체크 */
  const isAbleToBundle = useMemo(() => {
    const targetOrders = orders.filter((order) => {
      const shippingIds = order.shipping_seq.split(',');
      if (!shippingIds || shippingIds.length === 0) return false;
      return shippingIds.some((shippingSeq) => {
        return selectedOrderShippings.includes(Number(shippingSeq));
      });
    });

    return targetOrders.reduce((isOk, order, crrIndex) => {
      if (!isOk) return false;
      const prev = targetOrders[crrIndex - 1];
      if (!prev) return true;
      // * 선택한 주문의 주문자, 받는곳, 받는분, 받는분 연락처(휴대폰)의 정보가 동일해야 합니다.
      // 주문자
      if (order.order_user_name !== prev.order_user_name) return false;
      // 받는 곳
      if (order.recipient_address !== prev.recipient_address) return false;
      if (order.recipient_address_detail !== prev.recipient_address_detail) return false;
      // 받는 분
      if (order.recipient_user_name !== prev.recipient_user_name) return false;
      // 받는 분 연락처
      if (order.recipient_cellphone !== prev.recipient_cellphone) return false;

      // * 선택한 주문의 동일 판매자의 실물 배송상품을 합포장 할 수 있습니다.

      return true;
    }, true);
  }, [orders, selectedOrderShippings]);

  /** 합포장 출고 처리 요청 */
  const exportBundle = useCallback(
    async (dto: ExportBundledOrdersDto) => {
      const isExportable = dto.exportOrders.every((o) =>
        o.exportOptions.every((_o) => !(Number(_o.exportEa) === 0)),
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
          exportOptions: order.exportOptions.filter((x) => !!x.exportEa),
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
    const _orders: ExportOrderDto[] = [];
    selectedKeys.forEach((k) => {
      const data = formData[Number(k)];
      _orders.push({
        ...data,
        deliveryCompanyCode: deliveryCompany,
        deliveryNumber,
      });
    });

    // 합포장 출고처리 요청
    return exportBundle({ exportOrders: _orders });
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
                선택된 주문 {selectedOrderShippings.length} 개를 합포장 처리 합니다.
              </Text>
              <Stack mt={4} spacing={2}>
                <FormControl>
                  <Select
                    placeholder="택배사를 선택하세요."
                    value={deliveryCompany}
                    onChange={(e) => setDeliveryCompany(e.target.value)}
                  >
                    {Object.keys(fmDeliveryCompanies).map((company) => (
                      <option key={company} value={company}>
                        {fmDeliveryCompanies[company].name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <Input
                    placeholder="송장번호"
                    value={deliveryNumber}
                    onChange={(e) => {
                      setDeliveryNumber(e.target.value);
                    }}
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
            isDisabled={!deliveryCompany || !deliveryNumber}
            colorScheme="pink"
            onClick={() => onBundledExportSubmit()}
          >
            출고처리
          </Button>
          <Button onClick={onClose} ml={2}>
            취소
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
