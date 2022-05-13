import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { GridColDef, GridRowData } from '@material-ui/data-grid';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import SectionWithTitle from '@project-lc/components-layout/SectionWithTitle';
import { CreateOrderForm } from '@project-lc/shared-types';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import { useFormContext } from 'react-hook-form';

// todo : 쿠폰 crud 이후 디비에서 가져오도록 변경
const dummyCoupon = [
  { id: 1, name: '3000원 할인 쿠폰', amount: 3000 },
  { id: 2, name: '5000원 할인 쿠폰', amount: 5000 },
  { id: 3, name: '10000원 할인 쿠폰', amount: 10000 },
];

export function Discount(): JSX.Element {
  const couponSelectDialog = useDisclosure();
  const discountCodeDialog = useDisclosure();
  const MAX_MILEAGE = 1200;

  const {
    resetField,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useFormContext<CreateOrderForm>();

  const mileageAmount = watch('usedMileageAmount');

  const resetDiscountUsage = (type: 'mileage' | 'coupon'): void => {
    if (type === 'mileage') {
      resetField('usedMileageAmount');
    } else {
      setValue('couponId', undefined);
      resetField('usedCouponAmount');
    }
  };

  const handleUseMaxMileage = (): void => {
    setValue('usedMileageAmount', MAX_MILEAGE);
  };

  return (
    <SectionWithTitle title="할인 및 적립금">
      <Stack spacing={4}>
        <Stack>
          <Text fontWeight="semibold">쿠폰할인</Text>
          <Flex alignItems="center" gap={2}>
            <Input size="sm" maxW={150} isReadOnly {...register('usedCouponAmount')} />
            {dummyCoupon && dummyCoupon.length > 0 && (
              <Button size="xs" colorScheme="blue" onClick={couponSelectDialog.onOpen}>
                쿠폰사용
              </Button>
            )}

            {watch('couponId') ? (
              <Button
                variant="outline"
                size="xs"
                onClick={() => resetDiscountUsage('coupon')}
              >
                사용취소
              </Button>
            ) : null}
          </Flex>
        </Stack>

        <Stack>
          {/* // TODO: 결제 금액이 0원 이상일때까지만 적용하도록 구성 */}
          <Text fontWeight="semibold">적립금</Text>
          <FormControl isInvalid={!!errors.usedMileageAmount}>
            <Flex gap={2} alignItems="center">
              <Input
                isReadOnly={MAX_MILEAGE <= 0}
                maxW={150}
                type="number"
                size="sm"
                onFocus={(e) => e.target.select()}
                {...register('usedMileageAmount', {
                  max: {
                    value: MAX_MILEAGE,
                    message: '보유적립금 이상 사용할 수 없습니다.',
                  },
                  min: { value: 0, message: '0원이하로 적용할 수 없습니다.' },
                })}
              />
              {MAX_MILEAGE > 0 && (
                <Button size="xs" colorScheme="blue" onClick={handleUseMaxMileage}>
                  전액사용
                </Button>
              )}
              {mileageAmount && mileageAmount > 0 ? (
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => resetDiscountUsage('mileage')}
                >
                  사용취소
                </Button>
              ) : null}
            </Flex>
            <FormHelperText color="GrayText">
              보유한 총 적립금 {getLocaleNumber(MAX_MILEAGE) || 0} 원
            </FormHelperText>
            <FormErrorMessage>{errors.usedMileageAmount?.message}</FormErrorMessage>
          </FormControl>
        </Stack>

        {/* // TODO: 할인코드 기능 추가 이후 주석 제거 처리 */}
        {/* <Text fontWeight="semibold">할인 코드</Text>
        <Flex alignItems="center">
          <Input
            w={{ base: '50%', md: '20%' }}
            variant="flushed"
            disabled
            size="xs"
            value={getValues('couponAmount')}
          />

          <Button size="xs" onClick={discountCodeDialog.onOpen} colorScheme="blue" mr={1}>
            검색
          </Button>
          {watch('couponId') ? (
            <Button size="xs" onClick={() => resetDiscountUsage('coupon')}>
              사용취소
            </Button>
          ) : null}
        </Flex> */}
      </Stack>

      <CouponSelectDialog
        isOpen={couponSelectDialog.isOpen}
        onClose={couponSelectDialog.onClose}
        onCouponSelect={(coupon) => {
          setValue('couponId', coupon.id);
          setValue('usedCouponAmount', coupon.amount);
        }}
      />

      <DiscountCodeDialog
        isOpen={discountCodeDialog.isOpen}
        onClose={discountCodeDialog.onClose}
      />
    </SectionWithTitle>
  );
}

type CouponSelectDialogProps = Pick<ModalProps, 'isOpen' | 'onClose'> & {
  // TODO: 쿠폰 정보 연결 필요
  onCouponSelect: (coupon: any) => void;
};
/** 쿠폰 선택 다이얼로그 */
function CouponSelectDialog({
  isOpen,
  onClose,
  onCouponSelect,
}: CouponSelectDialogProps): JSX.Element {
  // TODO: 쿠폰 사용 가능여부 처리 필요 (최소 주문금액 등 적용 가능 여부 판단 이후 선택못하도록)
  const columns: GridColDef[] = [
    { field: 'name', headerName: '쿠폰명', flex: 1 },
    { field: 'amount', headerName: '금액' },
    {
      disableColumnMenu: true,
      disableExport: true,
      disableReorder: true,
      sortable: false,
      filterable: false,
      field: '',
      width: 20,
      renderCell: ({ row }: GridRowData) => (
        <Button
          size="xs"
          colorScheme="blue"
          onClick={() => {
            onCouponSelect({ id: row.id, amount: row.amount });
            onClose();
          }}
        >
          적용
        </Button>
      ),
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>적용 쿠폰 선택</ModalHeader>
        <ModalBody>
          <ChakraDataGrid
            disableExtendRowFullWidth
            autoHeight
            pagination
            autoPageSize
            disableSelectionOnClick
            disableColumnMenu
            disableColumnSelector
            columns={columns}
            rows={dummyCoupon}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>닫기</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

type DiscountCodeDialogProps = Pick<ModalProps, 'isOpen' | 'onClose'>;
/** 할인코드 적용 다이얼로그 */
function DiscountCodeDialog({ isOpen, onClose }: DiscountCodeDialogProps): JSX.Element {
  const findDiscountCode = (): void => {
    alert('아직 할인코드 기능이 준비되지 않았습니다.');
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>할인코드 적용</ModalHeader>
        <ModalBody>
          <Stack>
            <FormControl isInvalid>
              <Input placeholder="할인코드를 입력해주세요." />
              <FormErrorMessage>유효하지 않은 할인코드입니다.</FormErrorMessage>
            </FormControl>
            <Box>
              <Button onClick={findDiscountCode}>할인코드 확인</Button>
            </Box>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button colorScheme="blue" disabled>
              적용
            </Button>
            <Button onClick={onClose}>닫기</Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
