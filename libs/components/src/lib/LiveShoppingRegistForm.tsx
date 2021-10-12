import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';
import { Stack, Heading, theme, Button, Flex, useToast } from '@chakra-ui/react';
import { FormProvider, useForm } from 'react-hook-form';
import { liveShoppingRegist } from '@project-lc/stores';
import {
  useProfile,
  useApprovedGoodsList,
  useDefaultContacts,
  useCreateLiveShopping,
  useCreateSellerContacts,
} from '@project-lc/hooks';
import { useRouter } from 'next/router';
import LiveShoppingManagerPhoneNumber from './LiveShoppingRegistManagerPhoneNumber';
import LiveShoppingRequestInput from './LiveShoppingRegistRequestField';

export interface UseForm {
  contactId: number;
  email: string;
  firstNumber: string;
  goods_id: number;
  phoneNumber: string;
  requests: string;
  secondNumber: string;
  setDefault: boolean;
  thirdNumber: string;
  useContact: string;
}

export function LiveShoppingRegist(): JSX.Element {
  const { selectedGoods, handleGoodsSelect, setDefault, handleSetDefault } =
    liveShoppingRegist();
  const { data: profileData } = useProfile();
  const { setValue, watch } = useForm();
  const { mutateAsync } = useCreateLiveShopping();
  const { mutateAsync: createSellerContacts } = useCreateSellerContacts();

  const toast = useToast();
  const router = useRouter();

  const goodsList = useApprovedGoodsList({
    email: profileData?.email || '',
  });

  const contacts = useDefaultContacts({
    id: profileData?.id || '',
  });

  const methods = useForm<UseForm>({
    defaultValues: {
      useContact: '',
      goods_id: 0,
      email: '',
      firstNumber: '',
      secondNumber: '',
      thirdNumber: '',
      setDefault: undefined,
      requests: '',
    },
  });

  const { handleSubmit } = methods;

  const regist = async (data: UseForm): Promise<void> => {
    console.log(data);
    const { firstNumber, secondNumber, thirdNumber, useContact } = data;
    const phoneNumber = `${firstNumber}${secondNumber}${thirdNumber}`;
    let concatData = Object.assign(data);

    concatData.goods_id = watch('goods_id');
    concatData.phoneNumber = phoneNumber;

    if (useContact === 'old') {
      mutateAsync(concatData)
        .then(() => {
          toast({
            title: '상품을 성공적으로 등록하였습니다',
            status: 'success',
          });
          router.push('/mypage/goods');
        })
        .catch(() => {
          toast({
            title: '상품 등록 중 오류가 발생하였습니다',
            status: 'error',
          });
        });
    } else {
      concatData.setDefault = setDefault;

      const contactId = await createSellerContacts({
        email: concatData.email,
        phoneNumber,
        isDefault: setDefault,
      }).catch(() => {
        toast({
          title: '상품 등록 중 오류가 발생하였습니다',
          status: 'error',
        });
      });

      concatData = Object.assign(concatData, contactId);

      mutateAsync(concatData)
        .then(() => {
          toast({
            title: '상품을 성공적으로 등록하였습니다',
            status: 'success',
          });
          router.push('/mypage/live/vod');
        })
        .catch(() => {
          toast({
            title: '상품 등록 중 오류가 발생하였습니다',
            status: 'error',
          });
        });
    }
  };

  return (
    <FormProvider {...methods}>
      <Stack w="100%" mt="10" spacing={12} as="form" onSubmit={handleSubmit(regist)}>
        <Heading as="h6" size="xs">
          상품
        </Heading>
        {!goodsList.isLoading &&
          !goodsList.error &&
          !contacts.isLoading &&
          !contacts.error && (
            <>
              <Autocomplete
                options={goodsList.data}
                getOptionLabel={(option) => option?.goods_name}
                style={{ width: 300, marginTop: 0 }}
                renderInput={(params) => (
                  <TextField {...params} label="등록할 상품명을 검색하세요" fullWidth />
                )}
                value={selectedGoods}
                onChange={(_, newValue) => {
                  setValue('goods_id', newValue.id);
                  handleGoodsSelect(newValue);
                }}
              />
              <LiveShoppingManagerPhoneNumber
                data={contacts.data}
                handleSetDefault={handleSetDefault}
              />
              <LiveShoppingRequestInput />
              <Flex
                py={4}
                mx={-2}
                direction="row"
                position="sticky"
                bottom="0px"
                left="0px"
                right="0px"
                justifyContent="flex-end"
                zIndex={theme.zIndices.sticky}
              >
                <Button type="submit" colorScheme="blue" isDisabled={!selectedGoods}>
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
