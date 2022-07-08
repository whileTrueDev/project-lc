import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Input,
  Flex,
  Select,
  useDisclosure,
  useToast,
  FormControl,
  FormErrorMessage,
  Grid,
  GridItem,
  InputGroup,
  InputRightAddon,
} from '@chakra-ui/react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { AmountUnit, DiscountApplyType, DiscountApplyField } from '@prisma/client';
import { useAdminCouponMutation } from '@project-lc/hooks';
import { CouponDto } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { AdminCreateCouponConfirmDialog } from './AdminCreateCouponConfirmDialog';
import { AdminCouponCreationGoodsList } from './AdminCouponCreationGoodsList';

type AdminCreateCouponDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export type CreateCouponData = {
  amount: number;
  unit: AmountUnit;
  maxDiscountAmountWon: number;
  minOrderAmountWon: number;
  name: string;
  startDate: Date;
  endDate: Date;
  applyField: DiscountApplyField;
  applyType: DiscountApplyType;
  memo: string;
  goods: CouponDto['goods'];
};

export function AdminCreateCouponDialog(
  props: AdminCreateCouponDialogProps,
): JSX.Element {
  const { isOpen, onClose } = props;

  const {
    isOpen: isConfirmOpen,
    onClose: onConfirmClose,
    onOpen: onConfirmOpen,
  } = useDisclosure();
  const methods = useForm<CreateCouponData>({
    defaultValues: {
      amount: 0,
      unit: 'P',
      maxDiscountAmountWon: 0,
      minOrderAmountWon: 0,
      name: '',
      startDate: undefined,
      endDate: undefined,
      applyField: 'goods',
      applyType: 'allGoods',
      memo: '',
      goods: [],
    },
  });

  const toast = useToast();

  const { mutateAsync } = useAdminCouponMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = methods;

  const handleModalClose = (): void => {
    reset();
    onClose();
  };

  const onSubmit = (formData: CouponDto): void => {
    mutateAsync(formData)
      .then(() => {
        toast({ description: '쿠폰을 등록하였습니다', status: 'success' });
        handleModalClose();
      })
      .catch(() => toast({ description: '등록에 실패하였습니다', status: 'error' }));
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={handleModalClose} size="5xl">
        <FormProvider {...methods}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>쿠폰 생성</ModalHeader>
            <ModalCloseButton />
            <ModalBody as="form" onSubmit={handleSubmit(onSubmit)}>
              <Grid templateColumns="repeat(2, 2fr)">
                <GridItem>
                  <Flex direction="column" h="700px" justifyContent="space-between">
                    <FormControl isInvalid={!!errors.name}>
                      <Flex direction="column">
                        <Text>*쿠폰이름</Text>
                        <Input {...register('name', { required: true })} />
                        <FormErrorMessage>쿠폰 이름을 등록하세요</FormErrorMessage>
                      </Flex>
                    </FormControl>
                    <FormControl isInvalid={!!errors.unit}>
                      <Flex direction="column">
                        <Text>*할인방법</Text>
                        <Controller
                          name="unit"
                          control={control}
                          render={({ field }) => (
                            <Select placeholder="쿠폰 할인 유형" {...field}>
                              <option value="P">퍼센트(%)</option>
                              <option value="W">원(\)</option>
                            </Select>
                          )}
                          rules={{
                            required: '할인방법을 선택해주세요',
                          }}
                        />
                      </Flex>
                      <FormErrorMessage>{errors.unit?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.amount}>
                      <Flex direction="column">
                        <Text>*할인액/할인율</Text>
                        <InputGroup maxW="200px">
                          <Input
                            {...register('amount', {
                              required: '할인액(할인율)을 입력해주세요',
                              min: { value: 1, message: '최소값은 1입니다' },
                              valueAsNumber: true,
                            })}
                          />
                          <InputRightAddon>
                            {watch('unit') === 'P' ? '%' : '원'}
                          </InputRightAddon>
                        </InputGroup>
                      </Flex>
                      <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.applyField}>
                      <Flex direction="column">
                        <Text>*할인영역</Text>
                        <Controller
                          name="applyField"
                          control={control}
                          render={({ field }) => (
                            <Select placeholder="쿠폰 할인 영역" {...field}>
                              <option value="goods">상품할인</option>
                              <option value="shipping">배송비할인</option>
                            </Select>
                          )}
                          rules={{ required: '할인영역을 선택해주세요' }}
                        />
                      </Flex>
                      <FormErrorMessage>{errors.applyField?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.applyType}>
                      <Flex direction="column">
                        <Text>*할인상품선택</Text>
                        <Controller
                          name="applyType"
                          control={control}
                          render={({ field }) => (
                            <Select placeholder="쿠폰 할인 상품 선택" {...field}>
                              <option value="allGoods">모든상품</option>
                              <option value="selectedGoods">선택한 상품</option>
                              <option value="exceptSelectedGoods">특정 상품 제외</option>
                            </Select>
                          )}
                          rules={{ required: '할인 상품 범주를 선택해주세요' }}
                        />
                      </Flex>
                      <FormErrorMessage>{errors.applyType?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.startDate}>
                      <Flex direction="column">
                        <Text>*시작날짜</Text>
                        <Input
                          type="datetime-local"
                          {...register('startDate', {
                            validate: (v) =>
                              dayjs(v).isValid() || '시작날짜를 입력해주세요',
                            valueAsDate: true,
                          })}
                        />
                      </Flex>
                      <FormErrorMessage>{errors.startDate?.message}</FormErrorMessage>
                    </FormControl>
                    <Flex direction="column">
                      <Text>종료날짜</Text>
                      <Input
                        type="datetime-local"
                        {...register('endDate', { valueAsDate: true })}
                      />
                    </Flex>
                    <Flex direction="column">
                      <Text>최대할인금액</Text>
                      <Input
                        {...register('maxDiscountAmountWon', { valueAsNumber: true })}
                      />
                      <Text>최소 주문액</Text>
                      <Input
                        {...register('minOrderAmountWon', {
                          required: true,
                          valueAsNumber: true,
                        })}
                      />
                    </Flex>
                    <Flex direction="column">
                      <Text>메모</Text>
                      <Input {...register('memo')} />
                    </Flex>
                  </Flex>
                </GridItem>
                <GridItem>
                  {(watch('applyType') === 'selectedGoods' ||
                    watch('applyType') === 'exceptSelectedGoods') && (
                    <AdminCouponCreationGoodsList />
                  )}
                </GridItem>
              </Grid>
            </ModalBody>

            <ModalFooter>
              <Button mr={3} onClick={handleModalClose}>
                취소
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => {
                  onConfirmOpen();
                }}
              >
                확인
              </Button>
            </ModalFooter>
            <AdminCreateCouponConfirmDialog
              isOpen={isConfirmOpen}
              onClose={onConfirmClose}
              onConfirm={handleSubmit(onSubmit)}
            />
          </ModalContent>
        </FormProvider>
      </Modal>
    </>
  );
}
