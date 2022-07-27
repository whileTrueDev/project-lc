import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Collapse,
  Flex,
  FormControl,
  FormErrorMessage,
  Image,
  Input,
  InputGroup,
  InputRightAddon,
  ListItem,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  Text,
  UnorderedList,
  useDisclosure,
  useMergeRefs,
  useToast,
} from '@chakra-ui/react';
import { ChakraAutoComplete } from '@project-lc/components-core/ChakraAutoComplete';
import {
  useApprovedGoodsList,
  useCreateLiveShoppingMutation,
  useCreateSellerContactsMutation,
  useDefaultContacts,
  useGoodsById,
  useProfile,
} from '@project-lc/hooks';
import {
  ApprovedGoodsListItem,
  LiveShoppingInput,
  LiveShoppingRegistDTO,
} from '@project-lc/shared-types';
import { liveShoppingRegist } from '@project-lc/stores';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { Goods } from '.prisma/client';
import LiveShoppingRegistManagerContacts from './LiveShoppingRegistManagerContacts';
import LiveShoppingRegistRequestField from './LiveShoppingRegistRequestField';

export function LiveShoppingRegistForm(): JSX.Element {
  const { selectedGoods, handleGoodsSelect, setDefault } = liveShoppingRegist();
  const { data: profileData } = useProfile();
  const { mutateAsync, isLoading } = useCreateLiveShoppingMutation();
  const { mutateAsync: createSellerContacts } = useCreateSellerContactsMutation();

  const toast = useToast();
  const router = useRouter();

  const goodsList = useApprovedGoodsList();

  const contacts = useDefaultContacts({ email: profileData?.email });

  const methods = useForm<LiveShoppingInput>({
    defaultValues: {
      goods_id: null,
      useContact: '',
      contactId: 0,
      email: '',
      requests: '',
      desiredPeriod: '무관',
    },
  });

  const { handleSubmit, setValue, watch } = methods;

  const onSuccess = (): void => {
    toast({
      title: '라이브쇼핑을 성공적으로 등록하였습니다',
      status: 'success',
    });
    handleGoodsSelect(null);
    router.push('/mypage/live');
  };

  const onFail = (): void => {
    toast({
      title: '라이브쇼핑 등록 중 오류가 발생하였습니다',
      status: 'error',
    });
  };

  const regist = async (data: LiveShoppingInput): Promise<void> => {
    const { firstNumber, secondNumber, thirdNumber, useContact, email } = data;
    const phoneNumber = `${firstNumber}${secondNumber}${thirdNumber}`;
    const dto: LiveShoppingRegistDTO = {
      requests: '',
      goodsId: 0,
      contactId: 0,
      // streamId: '',
      desiredCommission: data.desiredCommission,
      desiredPeriod: data.desiredPeriod,
    };

    if (contacts.data) dto.contactId = contacts.data.id;
    dto.requests = data.requests;

    const goodsId = watch('goods_id');
    if (!goodsId) {
      toast({ title: '상품을 올바르게 선택해주세요.', status: 'error' });
      return;
    }
    dto.goodsId = goodsId;
    if (useContact === 'old') {
      mutateAsync(dto).then(onSuccess).catch(onFail);
    } else {
      await createSellerContacts({
        email,
        phoneNumber,
        isDefault: setDefault,
      })
        .then((value) => {
          dto.contactId = Number(Object.values(value));
        })
        .catch(onFail);
      mutateAsync(dto).then(onSuccess).catch(onFail);
    }
  };

  return (
    <>
      <FormProvider {...methods}>
        <Stack w="100%" mt={10} spacing={12} as="form" onSubmit={handleSubmit(regist)}>
          {!contacts.isLoading && !contacts.error && (
            <>
              {/* 라이브쇼핑 진행할 상품 */}
              <Stack>
                {(!goodsList.data || goodsList.data.length === 0) && (
                  <Alert status="error" my={2} mb={6}>
                    <AlertIcon />
                    <Text fontSize="sm">
                      라이브 쇼핑을 진행할 수 있는 상태의 상품이 없습니다.
                    </Text>
                  </Alert>
                )}
                <ChakraAutoComplete<ApprovedGoodsListItem>
                  label="라이브 쇼핑을 진행할 상품"
                  options={goodsList.data || []}
                  isLoading={goodsList.isLoading}
                  isDisabled={!goodsList.data || goodsList.data.length === 0}
                  getOptionLabel={(opt) => opt?.goods_name || ''}
                  value={selectedGoods}
                  onChange={(newV) => {
                    if (newV) {
                      setValue('goods_id', newV.id);
                      handleGoodsSelect(newV);
                    } else {
                      setValue('goods_id', null);
                      handleGoodsSelect(null);
                    }
                  }}
                />
                {selectedGoods && (
                  <Box mt={2}>
                    <GoodsSummary goodsId={selectedGoods.id} />
                  </Box>
                )}
              </Stack>
              {/* 담당자 연락처 */}
              <LiveShoppingRegistManagerContacts />
              {/* 희망 진행 기간 */}
              <LiveShoppingDesiredPeriod />
              {/* 희망 판매 수수료 */}
              <LiveShoppingDesiredCommission />
              {/* 요청사항 */}
              <LiveShoppingRegistRequestField />
              {/* 완료 버튼 */}
              <Flex>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isLoading}
                  isDisabled={!selectedGoods}
                >
                  등록
                </Button>
              </Flex>
            </>
          )}
        </Stack>
      </FormProvider>
    </>
  );
}

function LiveShoppingDesiredPeriod(): JSX.Element {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<LiveShoppingInput>();
  const { onOpen, isOpen, onClose } = useDisclosure();

  const inputRef = useRef<HTMLInputElement>(null);
  const registeredDesiredPeriod = register('desiredPeriod', {
    maxLength: {
      value: 30,
      message: '30자 이내로 작성해주세요.',
    },
  });
  const mergedRef = useMergeRefs(registeredDesiredPeriod.ref, inputRef);
  useEffect(() => {
    if (inputRef.current && isOpen) inputRef.current.focus();
  }, [isOpen]);
  return (
    <Stack>
      <Text as="h6" size="sm" fontWeight="bold">
        희망 진행 기간
      </Text>
      <RadioGroup
        value={watch('desiredPeriod')}
        onChange={(newV) => {
          onClose();
          setValue('desiredPeriod', newV);
        }}
      >
        <Stack direction="row">
          <Radio value="무관">무관</Radio>
          <Radio value="가능한 빠른 일정">가능한 빠른 일정</Radio>
          <Radio value="4주 이내">4주 이내</Radio>
        </Stack>
      </RadioGroup>

      <Box mt={3}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (!isOpen) {
              onOpen();
              setValue('desiredPeriod', '');
            } else {
              onClose();
              setValue('desiredPeriod', '무관');
            }
          }}
        >
          직접입력
        </Button>
      </Box>

      <Collapse in={isOpen} animateOpacity unmountOnExit>
        <Box maxW="200px">
          <FormControl isInvalid={!!errors.desiredPeriod}>
            <Input {...registeredDesiredPeriod} ref={mergedRef} />
            <FormErrorMessage>{errors.desiredPeriod?.message}</FormErrorMessage>
          </FormControl>
        </Box>
      </Collapse>
    </Stack>
  );
}

function LiveShoppingDesiredCommission(): JSX.Element {
  const {
    register,
    formState: { errors },
  } = useFormContext<LiveShoppingInput>();

  return (
    <FormControl isInvalid={!!errors.desiredCommission}>
      <Text as="h6" size="sm" fontWeight="bold">
        희망 판매 수수료
      </Text>
      <Text color="gray.500" fontSize="sm">
        판매수수료가 높을수록 방송인 매칭 조율이 원만하며, 진행이 빠를 수 있습니다.
      </Text>
      <Text color="gray.500" fontSize="sm">
        단순 희망 수수료이며, 확정 수수료는 아닙니다.
      </Text>
      <Box maxW={140} mt={2}>
        <InputGroup>
          <Input
            placeholder="30"
            type="number"
            {...register('desiredCommission', {
              max: { value: 100, message: '100을 넘을 수 없습니다.' },
              min: { value: 0, message: '0보다 낮을 수 없습니다.' },
            })}
          />
          <InputRightAddon>%</InputRightAddon>
        </InputGroup>
        <FormErrorMessage>{errors.desiredCommission?.message}</FormErrorMessage>
      </Box>
    </FormControl>
  );
}

interface GoodsSummaryProps {
  goodsId: Goods['id'];
}
function GoodsSummary({ goodsId }: GoodsSummaryProps): JSX.Element | null {
  const goods = useGoodsById(goodsId);
  const goodsFirstImage = useMemo(() => goods.data?.image?.[0], [goods.data?.image]);
  const isConfirmRequired = useMemo(
    () => goods.data?.confirmation.status !== 'confirmed',
    [goods.data?.confirmation.status],
  );
  if (goods.isLoading) return <Spinner />;
  if (goods.isError) return null;
  if (!goods.data) return null;

  return (
    <Flex gap={2}>
      {goodsFirstImage && (
        <Image
          rounded="md"
          width={50}
          height={50}
          alt={goods.data.goods_name}
          objectFit="cover"
          src={goodsFirstImage.image}
        />
      )}

      <Box>
        {isConfirmRequired && (
          <Badge variant="subtle" colorScheme="red">
            검수 미완료 상태
          </Badge>
        )}
        <Text fontWeight="bold">{goods.data.goods_name}</Text>
        <Text>{goods.data.summary}</Text>
        <Text color="gray" fontSize="sm">
          {dayjs(goods.data.regist_date).format('YYYY년 MM월 DD일 HH:mm:ss')} 등록
        </Text>

        {isConfirmRequired && (
          <UnorderedList mt={2}>
            <ListItem color="gray" fontSize="sm">
              <Text>
                검수 미완료 상태의 상품은 상품 검수가 거절되는 경우 라이브쇼핑도 함께
                거절될 수 있습니다.
              </Text>
            </ListItem>
          </UnorderedList>
        )}
      </Box>
    </Flex>
  );
}
export default LiveShoppingRegistForm;
