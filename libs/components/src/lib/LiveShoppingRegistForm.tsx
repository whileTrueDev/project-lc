import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';
import { Stack, Heading, theme, Button, Flex } from '@chakra-ui/react';
import { FormProvider, useForm } from 'react-hook-form';
import { liveShoppingRegist } from '@project-lc/stores';
import {
  useProfile,
  useApprovedGoodsList,
  useDefaultContacts,
  useCreateLiveShopping,
} from '@project-lc/hooks';
import LiveShoppingManagerPhoneNumber from './LiveShoppingRegistManagerPhoneNumber';
import LiveShoppingRequestInput from './LiveShoppingRegistRequestField';

export function LiveShoppingRegist(): JSX.Element {
  const { selectedGoods, handleGoodsSelect } = liveShoppingRegist();
  const { data: profileData } = useProfile();
  const { setValue, watch } = useForm();
  const { mutateAsync } = useCreateLiveShopping();

  const goodsList = useApprovedGoodsList({
    email: profileData?.email || '',
  });

  const contacts = useDefaultContacts({
    id: profileData?.id || '',
  });

  const methods = useForm<any>({
    defaultValues: {
      useContact: '',
      goods_id: 0,
      email: '',
      firstNumber: '',
      secondNumber: '',
      thirdNumber: '',
      setDefault: '',
      requests: '',
    },
  });

  const { handleSubmit } = methods;

  const regist = async (data: any): Promise<void> => {
    const concatData = Object.assign(data);
    concatData.goods_id = watch('goods_id');

    const { firstNumber, secondNumber, thirdNumber, useContact, setDefault } = concatData;

    const fullPhoneNumber = `${firstNumber}${secondNumber}${thirdNumber}`;
    concatData.phoneNumber = fullPhoneNumber;
    console.log(concatData);
    if (useContact) {
      // 기존 연락처 사용
      console.log('기존 연락처 사용');
      mutateAsync(concatData).then((res: any) => {
        console.log('res', res);
      });
    } else {
      // 새로운 연락처 사용
      console.log('새로운 연락처 사용');
      if (setDefault) {
        // 새로운 연락처 기본으로 설정
        console.log('새로운 연락처 기본으로 설정');
      }
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
                getOptionLabel={(option) => option.goods_name}
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
              <LiveShoppingManagerPhoneNumber data={contacts.data} />
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
                <Button type="submit" colorScheme="blue">
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
