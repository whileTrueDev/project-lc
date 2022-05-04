import {
  Heading,
  Input,
  Text,
  Flex,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  Divider,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { GridRowData } from '@material-ui/data-grid';
import { useState } from 'react';
import { PaymentPageDto } from '@project-lc/shared-types';

const dummyCoupon = [
  { id: 1, name: '3000원 할인 쿠폰', amount: 3000 },
  { id: 2, name: '5000원 할인 쿠폰', amount: 5000 },
  { id: 3, name: '10000원 할인 쿠폰', amount: 10000 },
];

export function Discount(): JSX.Element {
  const MAX_MILEAGE = 1100;
  const [mileage, setMileage] = useState(0);
  const { setValue, getValues, watch } = useFormContext<PaymentPageDto>();

  const columns = [
    { field: 'name', headerName: '쿠폰명', flex: 1 },
    { field: 'amount', headerName: '금액' },
    {
      field: '',
      width: 20,
      renderCell: ({ row }: GridRowData) => (
        <Button
          size="xs"
          colorScheme="blue"
          onClick={() => {
            setValue('couponId', row.id);
            setValue('couponAmount', row.amount);
            onClose();
          }}
        >
          사용
        </Button>
      ),
    },
  ];

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const resetDiscountUsage = (type: 'mileage' | 'coupon'): void => {
    if (type === 'mileage') {
      setValue('mileage', 0);
      setMileage(0);
    } else {
      setValue('couponId', 0);
      setValue('couponAmount', 0);
    }
  };

  const handleMileage = (value: number): void => {
    setMileage(value);
  };

  return (
    <Flex direction="column" justifyContent="space-evenly" h="xs">
      <Heading size="lg">할인/적립금</Heading>
      <Flex direction="column">
        <Text mb={3}>쿠폰할인</Text>
        <Flex alignItems="center">
          <Text mr={5}>쿠폰</Text>
          <Input
            w={{ base: '50%', md: '20%' }}
            variant="flushed"
            disabled
            size="xs"
            value={getValues('couponAmount')}
          />

          <Button size="xs" onClick={onOpen} colorScheme="blue" mr={1}>
            쿠폰사용
          </Button>
          {watch('couponId') ? (
            <Button size="xs" onClick={() => resetDiscountUsage('coupon')}>
              사용취소
            </Button>
          ) : null}
        </Flex>
      </Flex>
      <Flex direction="column">
        <Text mb={3}>적립금</Text>
        <Flex mb={3}>
          <Text mr={5}>보유</Text>
          <Input
            variant="flushed"
            disabled
            size="xs"
            w={{ base: '50%', md: '20%' }}
            value={MAX_MILEAGE}
          />
        </Flex>
        <Flex>
          <Text mr={5}>사용</Text>
          <Input
            variant="flushed"
            size="xs"
            w={{ base: '50%', md: '20%' }}
            type="number"
            value={mileage}
            onChange={(e) => handleMileage(Number(e.target.value))}
            onBlur={(e) => {
              if (Number(e.target.value) <= MAX_MILEAGE) {
                handleMileage(Number(e.target.value));
                setValue('mileage', Number(e.target.value));
              } else {
                handleMileage(MAX_MILEAGE);
                setValue('mileage', MAX_MILEAGE);
                toast({
                  title: '보유 금액 이상 사용은 불가능 합니다.',
                  status: 'error',
                });
              }
            }}
          />
          <Button
            size="xs"
            colorScheme="blue"
            onClick={() => {
              handleMileage(MAX_MILEAGE);
              setValue('mileage', MAX_MILEAGE);
            }}
          >
            전액사용
          </Button>
          {watch('mileage') ? (
            <Button size="xs" onClick={() => resetDiscountUsage('mileage')}>
              사용취소
            </Button>
          ) : null}
        </Flex>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <>
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
            </>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
