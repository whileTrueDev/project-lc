import { Alert, AlertIcon, Button, Flex, Stack, Text, useToast } from '@chakra-ui/react';
import {
  ApprovedGoodsListItem,
  useApprovedGoodsList,
  useCreateLiveShopping,
  useCreateSellerContacts,
  useDefaultContacts,
  useProfile,
} from '@project-lc/hooks';
import { LiveShoppingDTO, LiveShoppingInput } from '@project-lc/shared-types';
import { liveShoppingRegist } from '@project-lc/stores';
import { useRouter } from 'next/router';
import { FormProvider, useForm } from 'react-hook-form';
import { ChakraAutoComplete } from '..';
import LiveShoppingManagerPhoneNumber from './LiveShoppingRegistManagerContacts';
import LiveShoppingRequestInput from './LiveShoppingRegistRequestField';

export function LiveShoppingRegist(): JSX.Element {
  const { selectedGoods, handleGoodsSelect, setDefault } = liveShoppingRegist();
  const { data: profileData } = useProfile();
  const { mutateAsync, isLoading } = useCreateLiveShopping();
  const { mutateAsync: createSellerContacts } = useCreateSellerContacts();

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
    handleGoodsSelect('');
    router.push('/mypage/live/vod');
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
    const dto: LiveShoppingDTO = {
      requests: '',
      goods_id: 0,
      contactId: 0,
      streamId: '',
      progress: 'registered',
    };

    if (contacts.data) {
      dto.contactId = contacts.data.id;
    }
    dto.requests = data.requests;
    dto.goods_id = watch('goods_id');
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
                options={goodsList.data}
                isLoading={goodsList.isLoading}
                isDisabled={!goodsList.data || goodsList.data.length === 0}
                getOptionLabel={(opt) => opt.goods_name}
                value={selectedGoods}
                onChange={(newV) => {
                  if (newV) {
                    setValue('goods_id', newV.id);
                    handleGoodsSelect(newV.goods_name);
                  }
                }}
              />
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
