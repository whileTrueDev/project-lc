import { Box, Spinner, Text } from '@chakra-ui/react';
import { useAdminKkshowMainMutation, useKkshowMain } from '@project-lc/hooks';
import { KkshowMainResData } from '@project-lc/shared-types';
import { kkshowDataToDto } from '@project-lc/utils';
import { useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import AdminKkshowMainBestBroadcasterSection from './AdminKkshowMainBestBroadcasterSection';
import AdminKkshowMainBestLiveSection from './AdminKkshowMainBestLiveSection';
import AdminKkshowMainCarouselSection from './AdminKkshowMainCarouselSection';
import AdminKkshowMainPreviewSection from './AdminKkshowMainPreviewSection';
import PageManagerTabs from './PageManagerTabs';

export function AdminKkshowMain(): JSX.Element {
  const { data: kkshowMainData, isLoading, isError, error } = useKkshowMain();

  const methods = useForm<KkshowMainResData>();

  // db에 저장된 데이터 불러오기
  const restoreData = useCallback(() => {
    if (!kkshowMainData) return;
    methods.reset(kkshowMainData);
  }, [kkshowMainData, methods]);

  useEffect(() => {
    if (!kkshowMainData) return;
    restoreData();
  }, [kkshowMainData, restoreData]);

  const postRequest = useAdminKkshowMainMutation();
  const onSubmit = (data: KkshowMainResData): void => {
    // KkshowMainResData -> KkshowMainDto 로 변환하여 요청할것
    const dto = kkshowDataToDto(data);

    postRequest
      .mutateAsync(dto)
      .then((res) => {
        methods.reset(data); // 저장 후 리셋하여 isDirty값을 false로 되돌림
      })
      .catch((e) => console.error(e));
  };

  if (isLoading) return <Spinner />;
  if (isError) return <Text>에러가 발생하였습니다 {JSON.stringify(error)}</Text>;

  return (
    <FormProvider {...methods}>
      <Box as="form" onSubmit={methods.handleSubmit(onSubmit)}>
        <PageManagerTabs
          title="크크쇼 메인 데이터 관리"
          subtitle="캐러셀 아이템 추가하기, 데이터 수정, 삭제 등 작업 후 반드시 저장버튼을
      눌러주세요!"
          tabs={[
            { title: '캐러셀', component: <AdminKkshowMainCarouselSection /> },
            { title: '라이브예고', component: <AdminKkshowMainPreviewSection /> },
            { title: '베스트 라이브', component: <AdminKkshowMainBestLiveSection /> },
            {
              title: '베스트 방송인',
              component: <AdminKkshowMainBestBroadcasterSection />,
            },
          ]}
          formProps={{
            reset: restoreData,
            isResetButtonDisabled: !kkshowMainData,
          }}
        />
      </Box>
    </FormProvider>
  );
}

export default AdminKkshowMain;
