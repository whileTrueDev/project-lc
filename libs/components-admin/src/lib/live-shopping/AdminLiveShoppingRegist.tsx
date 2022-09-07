import {
  Radio,
  RadioGroup,
  Stack,
  Text,
  Input,
  Button,
  useToast,
  Box,
  Divider,
} from '@chakra-ui/react';
import { ChakraAutoComplete } from '@project-lc/components-core/ChakraAutoComplete';
import {
  useAdminGoodsList,
  useAdminSellerList,
  useCreateLiveShoppingByAdminMutation,
} from '@project-lc/hooks';
import {
  AdminGoodsData,
  AdminSellerListItem,
  LiveShoppingRegistByAdminDto,
  SellerGoodsSortColumn,
  SellerGoodsSortDirection,
} from '@project-lc/shared-types';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { ErrorText } from '@project-lc/components-core/ErrorText';
import { useRouter } from 'next/router';

type LiveShoppingByAdminFormData = {
  sellerId?: number;
  goodsType: 'kkshow' | 'external';
  goodsId?: number;
  externalGoods?: {
    name?: string;
    linkUrl?: string;
  };
};
export function AdminLiveShoppingRegist(): JSX.Element {
  const toast = useToast();
  const router = useRouter();
  const methods = useForm<LiveShoppingByAdminFormData>({
    defaultValues: {
      goodsType: 'kkshow',
    },
  });
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    getValues,
    formState: { errors },
  } = methods;

  const { data: sellerList } = useAdminSellerList();

  const handleSuccess = (): void => {
    toast({
      title: '관리자로 라이브쇼핑 등록 성공',
      description: '상세페이지에서 라이브쇼핑 이름 등 기타 정보를 입력해주세요',
      status: 'success',
    });
    router.push('/live-shopping');
  };

  const handleError = (e: any): void => {
    console.error(e);
    toast({
      title: '관리자로 라이브쇼핑 등록 실패',
      status: 'error',
      description: e?.response?.data?.message || e,
    });
  };

  const { mutateAsync } = useCreateLiveShoppingByAdminMutation();
  const onSubmit = (formData: LiveShoppingByAdminFormData): void => {
    if (!formData.sellerId) return;

    const dto: LiveShoppingRegistByAdminDto = {
      sellerId: formData.sellerId,
    };
    if (formData.goodsType === 'kkshow') {
      dto.goodsId = formData.goodsId;
    } else {
      dto.externalGoods = {
        name: formData.externalGoods?.name || '',
        linkUrl: formData.externalGoods?.linkUrl || '',
      };
    }

    mutateAsync(dto).then(handleSuccess).catch(handleError);
  };

  register('sellerId', { required: '판매자를 선택해주세요' });
  register('goodsId', {
    validate: {
      required: (value: number | undefined): boolean | string => {
        if (!value && getValues('goodsType') === 'kkshow' && !!getValues('sellerId'))
          return '크크쇼 상품을 선택해주세요';
        return true;
      },
    },
  });
  const sellerId = watch('sellerId');
  return (
    <FormProvider {...methods}>
      <Stack as="form" onSubmit={handleSubmit(onSubmit)} spacing={6}>
        <Stack direction="row">
          <Button onClick={router.back}>돌아가기</Button>
        </Stack>

        <Stack>
          <Text fontWeight="bold">1. 판매자 선택</Text>
          <ChakraAutoComplete<AdminSellerListItem>
            options={sellerList || []}
            getOptionLabel={(seller) =>
              seller
                ? `${seller.name} (${seller.email} ${seller?.sellerShop?.shopName})`
                : ''
            }
            onChange={(newV) => {
              setValue('sellerId', newV?.id || undefined);
            }}
          />
          <ErrorText>{errors.sellerId && errors.sellerId.message}</ErrorText>
        </Stack>

        <Divider />

        {sellerId && (
          <Stack>
            <Text fontWeight="bold">2. 상품 유형 선택</Text>
            <Text color="GrayText">
              판매자의 스마트스토어 등 크크쇼가 아닌 외부 판매창구를 사용하는 경우
              &lsquo;외부상품&lsquo;을 선택해주세요
            </Text>
            <RadioGroup
              defaultValue="kkshow"
              onChange={() => {
                setValue('goodsId', undefined);
                setValue('externalGoods', undefined);
              }}
            >
              <Stack spacing={2} direction="row" flexWrap="wrap">
                <Radio {...register('goodsType')} value="kkshow">
                  판매자가 크크쇼 판매자센터에서 등록한 상품
                </Radio>
                <Radio {...register('goodsType')} value="external">
                  외부상품(스마트스토어 등)
                </Radio>
              </Stack>
            </RadioGroup>
          </Stack>
        )}

        <Divider />

        {sellerId && watch('goodsType') === 'kkshow' && (
          <SelectSellerGoodsSection sellerId={sellerId} />
        )}

        {sellerId && watch('goodsType') === 'external' && <WriteExternalGoodsSection />}

        <Stack direction="row">
          <Button type="submit" colorScheme="blue">
            라이브 쇼핑 등록하기
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
}

export default AdminLiveShoppingRegist;

function SelectSellerGoodsSection({ sellerId }: { sellerId?: number }): JSX.Element {
  const {
    setValue,
    formState: { errors },
  } = useFormContext<LiveShoppingByAdminFormData>();
  const { data } = useAdminGoodsList(
    { sort: SellerGoodsSortColumn.REGIST_DATE, direction: SellerGoodsSortDirection.DESC },
    { enabled: !!sellerId },
  );

  const sellerGoodsList = data?.items
    ? data.items.filter((item) => item.sellerId === sellerId)
    : [];
  return (
    <Stack>
      <Text fontWeight="bold">3. 라이브커머스 진행할 크크쇼 상품 선택</Text>
      <ChakraAutoComplete<AdminGoodsData>
        options={sellerGoodsList}
        getOptionLabel={(goods) => (goods ? `${goods.goods_name} (id: ${goods.id})` : '')}
        onChange={(newV) => {
          setValue('goodsId', newV?.id || undefined);
        }}
      />
      <ErrorText>{errors.goodsId && errors.goodsId.message}</ErrorText>
    </Stack>
  );
}

function WriteExternalGoodsSection(): JSX.Element {
  const {
    register,
    getValues,
    formState: { errors },
  } = useFormContext<LiveShoppingByAdminFormData>();

  const externalGoodsValueOptions = {
    validate: {
      required: (value: string | undefined): boolean | string => {
        if (!value?.trim() && getValues('goodsType') === 'external')
          return '외부상품인 경우 상품명과 상품판매 링크를 입력해주세요';
        return true;
      },
    },
  };
  return (
    <Stack>
      <Text fontWeight="bold">3. 라이브커머스 진행할 외부 상품 정보 입력</Text>
      <Text>상품명</Text>
      <Input
        placeholder="먹보 소고기 국밥"
        {...register('externalGoods.name', externalGoodsValueOptions)}
      />
      <ErrorText>
        {errors.externalGoods?.name && errors.externalGoods.name.message}
      </ErrorText>

      <Text>상품 링크(스마트스토어 등 상품 판매페이지 주소)</Text>
      <Input
        type="url"
        placeholder="https://smartstore.naver.com/mukbo_gukbap/products/6387804902"
        {...register('externalGoods.linkUrl', externalGoodsValueOptions)}
      />
      <Text>
        {errors.externalGoods?.linkUrl && errors.externalGoods?.linkUrl.message}
      </Text>
    </Stack>
  );
}
