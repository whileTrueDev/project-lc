import { Button, Spinner, Stack, Text } from '@chakra-ui/react';
import { useKkshowMain } from '@project-lc/hooks';
import { KkshowMainResData } from '@project-lc/shared-types';
import { jsonToResType } from '@project-lc/utils';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

export function AdminKkshowMain(): JSX.Element {
  const { data: kkshowMainData, isLoading, isError, error } = useKkshowMain();

  const methods = useForm<KkshowMainResData>();

  useEffect(() => {
    if (!kkshowMainData) return;
    // kkshowMainData는 json 형태이므로 타입 명시되어있는 defaultValue로 설정하려면 타입 변경 필요
    const obj = jsonToResType(kkshowMainData);
    methods.setValue('carousel', obj.carousel);
    methods.setValue('trailer', obj.trailer);
    methods.setValue('bestLive', obj.bestLive);
    methods.setValue('bestBroadcaster', obj.bestBroadcaster);
  }, [kkshowMainData, methods]);

  const onSubmit = (data: any): void => {
    // KkshowMainResData -> KkshowMainDto 로 변환하여 요청할것
    console.log(data);
  };

  if (isLoading) return <Spinner />;
  if (isError) return <Text>에러가 발생하였습니다 {JSON.stringify(error)}</Text>;

  return (
    <FormProvider {...methods}>
      <Stack as="form" onSubmit={methods.handleSubmit(onSubmit)}>
        <Button type="submit">submit</Button>
        <Text>크크쇼 메인</Text>
        <Text>{JSON.stringify(methods.watch())}</Text>
      </Stack>
    </FormProvider>
  );
}

export default AdminKkshowMain;
