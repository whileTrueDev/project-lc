import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';
import { Stack, Heading, theme, useColorModeValue, Button, Flex } from '@chakra-ui/react';
import { FormProvider, NestedValue, useForm } from 'react-hook-form';
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

  const goodsList = useApprovedGoodsList({
    email: profileData?.email || '',
  });

  const contacts = useDefaultContacts({
    id: profileData?.id || '',
  });

  const methods = useForm<any>({
    defaultValues: {
      common_contents_type: 'new',
      option_title: '',
      image: [],
      options: [
        {
          option_type: 'direct',
          option1: '',
          consumer_price: 0,
          price: 0,
          option_view: 'Y',
          supply: {
            stock: 0,
          },
        },
      ],
      option_use: '1',
      // 이하 fm_goods 기본값
      goods_view: 'look',
      shipping_policy: 'shop',
      goods_shipping_policy: 'unlimit',
      shipping_weight_policy: 'shop',
      option_view_type: 'divide',
      option_suboption_use: '0',
      member_input_use: '0',
    },
  });

  const { handleSubmit } = methods;

  const regist = async (data: any): Promise<void> => {
    if (!profileData) return;
    const userMail = profileData.email;

    console.log(userMail);
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
                // onChange={(_, newValue) => {
                //   handleGoodsSelect(newValue);
                // }}
              />
              <LiveShoppingManagerPhoneNumber
                mail={mail}
                phoneNumber={phoneNumber}
                handleEmailInput={handleEmailInput}
                handlePhoneNumberInput={handlePhoneNumberInput}
                data={contacts.data}
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
