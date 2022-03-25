import { AddIcon } from '@chakra-ui/icons';
import { Box, Spinner, Text } from '@chakra-ui/react';
import { useKkshowShopping } from '@project-lc/hooks';
import { KkshowMainResData, KkshowShoppingTabResData } from '@project-lc/shared-types';
import { useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import AdminKkshowShoppingCarousel from './AdminKkshowShoppingCarousel';
import PageManagerContainer from './PageManagerContainer';
import PageManagerTabs from './PageManagerTabs';

export function AdminKkshowShopping(): JSX.Element {
  const { data: kkshowShoppingData, isLoading, isError, error } = useKkshowShopping();

  const methods = useForm<KkshowShoppingTabResData>();
  // db에 저장된 데이터 불러오기
  const restoreData = useCallback(() => {
    if (!kkshowShoppingData) return;
    methods.reset(kkshowShoppingData);
  }, [kkshowShoppingData, methods]);

  useEffect(() => {
    if (!kkshowShoppingData) return;
    restoreData();
  }, [kkshowShoppingData, restoreData]);

  // const postRequest = useAdminKkshowMainMutation();
  const onSubmit = (data: KkshowMainResData): void => {
    // KkshowMainResData -> KkshowMainDto 로 변환하여 요청할것
    // const dto = kkshowDataToDto(data);
    // postRequest
    //   .mutateAsync(dto)
    //   .then((res) => {
    //     methods.reset(data); // 저장 후 리셋하여 isDirty값을 false로 되돌림
    //   })
    //   .catch((e) => console.error(e));
  };

  if (isLoading) return <Spinner />;
  if (isError) return <Text>에러가 발생하였습니다 {JSON.stringify(error)}</Text>;

  return (
    <FormProvider {...methods}>
      <Box as="form" onSubmit={methods.handleSubmit(onSubmit)}>
        <PageManagerTabs
          title="크크쇼 쇼핑페이지 데이터 관리"
          subtitle="캐러셀 아이템 추가하기, 데이터 수정, 삭제 등 작업 후 반드시 저장버튼을
      눌러주세요!"
          formProps={{
            reset: restoreData,
            isResetButtonDisabled: !kkshowShoppingData,
          }}
          tabs={[
            {
              title: '캐러셀',
              component: (
                <PageManagerContainer
                  title="쇼핑탭 캐러셀"
                  fieldName="carousel"
                  buttons={[
                    {
                      label: '캐러셀 이미지 추가',
                      icon: <AddIcon />,
                      onClick: ({ append }) =>
                        append({ description: '', imageUrl: '', linkUrl: '' }),
                    },
                  ]}
                  Component={({ index }) => <AdminKkshowShoppingCarousel index={index} />}
                />
              ),
            },
            { title: '금주의상품', component: <div>금주의상품</div> },
            { title: '신상라인업', component: <div>신상라인업</div> },
            { title: '많이찾은상품', component: <div>많이찾은상품</div> },
            { title: '생생후기', component: <div>생생후기</div> },
            { title: '키워드검색', component: <div>키워드검색</div> },
          ]}
        />
      </Box>
    </FormProvider>
  );
}

export default AdminKkshowShopping;
