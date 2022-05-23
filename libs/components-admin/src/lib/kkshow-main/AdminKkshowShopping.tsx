import { AddIcon } from '@chakra-ui/icons';
import { Box, Spinner, Text, useToast } from '@chakra-ui/react';
import { useAdminKkshowShoppingMutation, useKkshowShopping } from '@project-lc/hooks';
import { KkshowShoppingTabResData } from '@project-lc/shared-types';
import { kkshowShoppingToDto } from '@project-lc/utils';
import { useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { AdminKkshowShoppingBanner } from './AdminKkshowShoppingBanner';
import AdminKkshowShoppingCarousel from './AdminKkshowShoppingCarousel';
import AdminKkshowShoppingGoods from './AdminKkshowShoppingGoods';
import AdminKkshowShoppingKeywords from './AdminKkshowShoppingKeywords';
import AdminKkshowShoppingReviews from './AdminKkshowShoppingReviews';
import PageManagerContainer from './PageManagerContainer';
import PageManagerTabs from './PageManagerTabs';

const tabs: { title: string; component: JSX.Element }[] = [
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
  {
    title: '금주의상품',
    component: (
      <PageManagerContainer
        title="금주의 상품"
        fieldName="goodsOfTheWeek"
        buttons={[
          {
            label: '금주의 상품 추가',
            icon: <AddIcon />,
            onClick: ({ append }) => append({}),
          },
        ]}
        Component={({ index }) => (
          <AdminKkshowShoppingGoods index={index} type="goodsOfTheWeek" />
        )}
      />
    ),
  },
  {
    title: '신상라인업',
    component: (
      <PageManagerContainer
        title="신상라인업"
        fieldName="newLineUp"
        buttons={[
          {
            label: '신상라인업 추가(최대 5개까지만 보여짐)',
            icon: <AddIcon />,
            onClick: ({ append }) => append({}),
          },
        ]}
        Component={({ index }) => (
          <AdminKkshowShoppingGoods index={index} type="newLineUp" />
        )}
      />
    ),
  },
  {
    title: '많이찾은상품',
    component: (
      <PageManagerContainer
        title="많이찾은상품"
        fieldName="popularGoods"
        buttons={[
          {
            label: '많이찾은상품 추가(최대 5개까지만 보여짐)',
            icon: <AddIcon />,
            onClick: ({ append }) => append({}),
          },
        ]}
        Component={({ index }) => (
          <AdminKkshowShoppingGoods index={index} type="popularGoods" />
        )}
      />
    ),
  },
  {
    title: '추천상품',
    component: (
      <PageManagerContainer
        title="추천상품"
        fieldName="recommendations"
        buttons={[
          {
            label: '추천상품 추가(최대 3개까지만 보여짐)',
            icon: <AddIcon />,
            onClick: ({ append }) => append({}),
          },
        ]}
        Component={({ index }) => (
          <AdminKkshowShoppingGoods index={index} type="recommendations" />
        )}
      />
    ),
  },
  {
    title: '배너',
    component: <AdminKkshowShoppingBanner />,
  },
  {
    title: '생생후기',
    component: (
      <PageManagerContainer
        title="생생후기"
        fieldName="reviews"
        buttons={[
          {
            label: '생생후기 추가(최대 4개까지만 보여짐)',
            icon: <AddIcon />,
            onClick: ({ append }) => append({}),
          },
        ]}
        Component={({ index }) => <AdminKkshowShoppingReviews index={index} />}
      />
    ),
  },
  {
    title: '키워드검색',
    component: (
      <PageManagerContainer
        title="키워드검색"
        fieldName="keywords"
        buttons={[
          {
            label: '키워드검색 추가',
            icon: <AddIcon />,
            onClick: ({ append }) => append({}),
          },
        ]}
        Component={({ index }) => <AdminKkshowShoppingKeywords index={index} />}
      />
    ),
  },
];

export function AdminKkshowShopping(): JSX.Element {
  const toast = useToast();
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

  const putRequest = useAdminKkshowShoppingMutation();
  const onSubmit = (data: KkshowShoppingTabResData): void => {
    const dto = kkshowShoppingToDto(data);
    putRequest
      .mutateAsync(dto)
      .then(() => methods.reset(data))
      .catch((e) => {
        toast({ title: '쇼핑탭 데이터 등록 중 에러발생', status: 'error' });
        console.error(e);
      });
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
          tabs={tabs}
        />
      </Box>
    </FormProvider>
  );
}

export default AdminKkshowShopping;
