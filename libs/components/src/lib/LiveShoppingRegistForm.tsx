import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';
import { Stack, Heading, theme, Button, Flex } from '@chakra-ui/react';
import { FormProvider, useForm } from 'react-hook-form';
import { liveShoppingRegist } from '@project-lc/stores';
import { useProfile, useApprovedGoodsList, useDefaultContacts } from '@project-lc/hooks';
import LiveShoppingManagerPhoneNumber from './LiveShoppingRegistManagerPhoneNumber';
import LiveShoppingRequestInput from './LiveShoppingRegistRequestField';

export function LiveShoppingRegist(): JSX.Element {
  const {
    selectedGoods,
    mail,
    phoneNumber,
    requests,
    handleGoodsSelect,
    handleEmailInput,
    handlePhoneNumberInput,
    handleRequestsInput,
  } = liveShoppingRegist();
  const { data: profileData } = useProfile();
  const { register, handleSubmit } = useForm();
  const goodsList = useApprovedGoodsList({
    email: profileData?.email || '',
  });

  const contacts = useDefaultContacts({
    id: profileData?.id || '',
  });

  const methods = useForm<any>({
    defaultValues: {
      goodsName: '',
      email: '',
      firstNumber: '',
      secondNumber: '',
      thirdNumber: '',
      requests: '',
    },
  });

  // const { handleSubmit } = methods;

  const regist = async (data: any): Promise<void> => {
    alert('data');
  };

  console.log(goodsList.data);
  console.log(contacts);

  return (
    <FormProvider {...methods}>
      <Stack w="100%" mt="10" spacing={12} onSubmit={handleSubmit(regist)}>
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
                  handleGoodsSelect(newValue);
                }}
              />
              <LiveShoppingManagerPhoneNumber
                mail={mail}
                phoneNumber={phoneNumber}
                handleEmailInput={handleEmailInput}
                handlePhoneNumberInput={handlePhoneNumberInput}
                data={contacts.data}
                register={register}
              />
              <LiveShoppingRequestInput
                requests={requests}
                handleRequestsInput={handleRequestsInput}
              />
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
