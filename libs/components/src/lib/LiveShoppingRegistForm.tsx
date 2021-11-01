import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Image,
  Spinner,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
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
  LiveShoppingRegistDTO,
  LiveShoppingInput,
  LIVE_SHOPPING_PROGRESS,
} from '@project-lc/shared-types';
import { liveShoppingRegist } from '@project-lc/stores';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Goods } from '.prisma/client';
import { ChakraAutoComplete } from '..';
import LiveShoppingManagerPhoneNumber from './LiveShoppingRegistManagerContacts';
import LiveShoppingRequestInput from './LiveShoppingRegistRequestField';

export function LiveShoppingRegist(): JSX.Element {
  const { selectedGoods, handleGoodsSelect, setDefault } = liveShoppingRegist();
  const { data: profileData } = useProfile();
  const { mutateAsync, isLoading } = useCreateLiveShoppingMutation();
  const { mutateAsync: createSellerContacts } = useCreateSellerContactsMutation();

  const toast = useToast();
  const router = useRouter();

  const goodsList = useApprovedGoodsList({
    email: profileData?.email || '',
  });

  const contacts = useDefaultContacts({
    email: profileData?.email || '',
  });

  const methods = useForm<LiveShoppingInput>({
    defaultValues: {
      goods_id: null,
      useContact: '',
      contactId: 0,
      email: '',
      requests: '',
    },
  });

  const { handleSubmit, setValue, watch } = methods;

  const onSuccess = (): void => {
    toast({
      title: '상품을 성공적으로 등록하였습니다',
      status: 'success',
    });
    handleGoodsSelect(null);
    router.push('/mypage/live');
  };

  const onFail = (): void => {
    toast({
      title: '상품 등록 중 오류가 발생하였습니다',
      status: 'error',
    });
  };

  const regist = async (data: LiveShoppingInput): Promise<void> => {
    const { firstNumber, secondNumber, thirdNumber, useContact, email } = data;
    const phoneNumber = `${firstNumber}${secondNumber}${thirdNumber}`;
    const dto: LiveShoppingRegistDTO = {
      requests: '',
      goods_id: 0,
      contactId: 0,
      streamId: '',
      progress: LIVE_SHOPPING_PROGRESS.등록됨,
    };

    if (contacts.data) {
      dto.contactId = contacts.data.id;
    }
    dto.requests = data.requests;

    const goodsId = watch('goods_id');
    if (!goodsId) {
      toast({ title: '상품을 올바르게 선택해주세요.', status: 'error' });
      return;
    }
    dto.goods_id = goodsId;
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
            <LiveShoppingManagerPhoneNumber />
            {/* 요청사항 */}
            <LiveShoppingRequestInput />
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
  );
}

export default LiveShoppingRegist;

interface GoodsSummaryProps {
  goodsId: Goods['id'];
}
function GoodsSummary({ goodsId }: GoodsSummaryProps): JSX.Element | null {
  const goods = useGoodsById(goodsId);

  const goodsFirstImage = useMemo(
    () => goods.data?.image.find((i) => i.cut_number === 1),
    [goods.data?.image],
  );

  if (goods.isLoading) return <Spinner />;
  if (!goods.data) return null;
  if (goods.isError) return null;

  return (
    <Flex maxW="300px" alignItems="center">
      <Box>
        {goodsFirstImage && <Image width={50} height={50} src={goodsFirstImage.image} />}
      </Box>
      <Box ml={2}>
        <Text fontWeight="bold" isTruncated>
          {goods.data.goods_name}
        </Text>
        <Text isTruncated>{goods.data.summary}</Text>
        <Text isTruncated>
          {dayjs(goods.data.regist_date).format('YYYY년 MM월 DD일 HH:mm:ss')}
        </Text>
      </Box>
    </Flex>
  );
}
