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
        toast({ description: '????????? ?????????????????????', status: 'success' });
        handleModalClose();
      })
      .catch(() => toast({ description: '????????? ?????????????????????', status: 'error' }));
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={handleModalClose} size="5xl">
        <FormProvider {...methods}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>?????? ??????</ModalHeader>
            <ModalCloseButton />
            <ModalBody as="form" onSubmit={handleSubmit(onSubmit)}>
              <Grid templateColumns="repeat(2, 2fr)">
                <GridItem>
                  <Flex direction="column" h="700px" justifyContent="space-between">
                    <FormControl isInvalid={!!errors.name}>
                      <Flex direction="column">
                        <Text>*????????????</Text>
                        <Input {...register('name', { required: true })} />
                        <FormErrorMessage>?????? ????????? ???????????????</FormErrorMessage>
                      </Flex>
                    </FormControl>
                    <FormControl isInvalid={!!errors.unit}>
                      <Flex direction="column">
                        <Text>*????????????</Text>
                        <Controller
                          name="unit"
                          control={control}
                          render={({ field }) => (
                            <Select placeholder="?????? ?????? ??????" {...field}>
                              <option value="P">?????????(%)</option>
                              <option value="W">???(\)</option>
                            </Select>
                          )}
                          rules={{
                            required: '??????????????? ??????????????????',
                          }}
                        />
                      </Flex>
                      <FormErrorMessage>{errors.unit?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.amount}>
                      <Flex direction="column">
                        <Text>*?????????/?????????</Text>
                        <InputGroup maxW="200px">
                          <Input
                            {...register('amount', {
                              required: '?????????(?????????)??? ??????????????????',
                              min: { value: 1, message: '???????????? 1?????????' },
                              valueAsNumber: true,
                            })}
                          />
                          <InputRightAddon>
                            {watch('unit') === 'P' ? '%' : '???'}
                          </InputRightAddon>
                        </InputGroup>
                      </Flex>
                      <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.applyField}>
                      <Flex direction="column">
                        <Text>*????????????</Text>
                        <Controller
                          name="applyField"
                          control={control}
                          render={({ field }) => (
                            <Select placeholder="?????? ?????? ??????" {...field}>
                              <option value="goods">????????????</option>
                              <option value="shipping">???????????????</option>
                            </Select>
                          )}
                          rules={{ required: '??????????????? ??????????????????' }}
                        />
                      </Flex>
                      <FormErrorMessage>{errors.applyField?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.applyType}>
                      <Flex direction="column">
                        <Text>*??????????????????</Text>
                        <Controller
                          name="applyType"
                          control={control}
                          render={({ field }) => (
                            <Select placeholder="?????? ?????? ?????? ??????" {...field}>
                              <option value="allGoods">????????????</option>
                              <option value="selectedGoods">????????? ??????</option>
                              <option value="exceptSelectedGoods">?????? ?????? ??????</option>
                            </Select>
                          )}
                          rules={{ required: '?????? ?????? ????????? ??????????????????' }}
                        />
                      </Flex>
                      <FormErrorMessage>{errors.applyType?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.startDate}>
                      <Flex direction="column">
                        <Text>*????????????</Text>
                        <Input
                          type="datetime-local"
                          {...register('startDate', {
                            validate: (v) =>
                              dayjs(v).isValid() || '??????????????? ??????????????????',
                            valueAsDate: true,
                          })}
                        />
                      </Flex>
                      <FormErrorMessage>{errors.startDate?.message}</FormErrorMessage>
                    </FormControl>
                    <Flex direction="column">
                      <Text>????????????</Text>
                      <Input
                        type="datetime-local"
                        {...register('endDate', { valueAsDate: true })}
                      />
                    </Flex>
                    <Flex direction="column">
                      <Text>??????????????????</Text>
                      <Input
                        {...register('maxDiscountAmountWon', { valueAsNumber: true })}
                      />
                      <Text>?????? ?????????</Text>
                      <Input
                        {...register('minOrderAmountWon', {
                          required: true,
                          valueAsNumber: true,
                        })}
                      />
                    </Flex>
                    <Flex direction="column">
                      <Text>??????</Text>
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
                ??????
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => {
                  onConfirmOpen();
                }}
              >
                ??????
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
