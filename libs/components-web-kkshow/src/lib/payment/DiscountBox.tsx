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
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { GridRowData } from '@material-ui/data-grid';

const dummyCoupon = [
  { id: 1, name: '3000원 할인 쿠폰', amount: 3000 },
  { id: 2, name: '5000원 할인 쿠폰', amount: 5000 },
  { id: 3, name: '10000원 할인 쿠폰', amount: 10000 },
];

export function DiscountBox(): JSX.Element {
  const MAX_MILEAGE = 1100;
  const { setValue, getValues, resetField, watch } = useFormContext<any>();

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
            setValue('coupon', row.amount);
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
      resetField(type);
    } else {
      resetField(type);
    }
  };

  return (
    <Flex direction="column" justifyContent="space-evenly" h="xs">
      <Heading>할인/적립금</Heading>
      <Flex direction="column">
        <Text mb={3}>쿠폰할인</Text>
        <Flex alignItems="center">
          <Text mr={5}>쿠폰</Text>
          <Input
            w={{ base: '50%', md: '20%' }}
            variant="flushed"
            disabled
            size="xs"
            value={getValues('coupon')}
          />

          <Button size="xs" onClick={onOpen} colorScheme="blue" mr={1}>
            쿠폰사용
          </Button>
          {watch('coupon') ? (
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
            onBlur={(e) => {
              if (Number(e.target.value) <= MAX_MILEAGE) {
                setValue('mileage', Number(e.target.value));
              } else {
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
