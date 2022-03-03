import { Button, Divider, Spinner, Stack, Text } from '@chakra-ui/react';
import { useAdminKkshowMainMutation, useKkshowMain } from '@project-lc/hooks';
import { KkshowMainResData } from '@project-lc/shared-types';
import { kkshowDataToDto, kkshowMainJsonToResType } from '@project-lc/utils';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import AdminKkshowMainCarouselSection from './AdminKkshowMainCarouselData';

export function AdminKkshowMain(): JSX.Element {
  const { data: kkshowMainData, isLoading, isError, error } = useKkshowMain();

  const methods = useForm<KkshowMainResData>();

  useEffect(() => {
    if (!kkshowMainData) return;
    // kkshowMainData는 json 형태이므로 타입 명시되어있는 defaultValue로 설정하려면 타입 변경 필요
    const obj = kkshowMainJsonToResType(kkshowMainData);
    methods.setValue('carousel', obj.carousel);
    methods.setValue('trailer', obj.trailer);
    methods.setValue('bestLive', obj.bestLive);
    methods.setValue('bestBroadcaster', obj.bestBroadcaster);
  }, [kkshowMainData, methods]);

  const postRequest = useAdminKkshowMainMutation();
  const onSubmit = (data: KkshowMainResData): void => {
    // KkshowMainResData -> KkshowMainDto 로 변환하여 요청할것
    const dto = kkshowDataToDto(data);

    postRequest
      .mutateAsync(dto)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => console.error(e));
  };

  if (isLoading) return <Spinner />;
  if (isError) return <Text>에러가 발생하였습니다 {JSON.stringify(error)}</Text>;

  return (
    <FormProvider {...methods}>
      <Stack as="form" onSubmit={methods.handleSubmit(onSubmit)}>
        <Text>크크쇼 메인</Text>
        <Divider variant="dashed" />
        <AdminKkshowMainCarouselSection />
        <Divider variant="dashed" />

        <Button type="submit">submit</Button>
      </Stack>
    </FormProvider>
  );
}

export default AdminKkshowMain;
