import { Box, Button, Divider, Spinner, Stack, Text } from '@chakra-ui/react';
import { useAdminKkshowMainMutation, useKkshowMain } from '@project-lc/hooks';
import { KkshowMainResData } from '@project-lc/shared-types';
import { kkshowDataToDto, kkshowMainJsonToResType } from '@project-lc/utils';
import { useEffect, useMemo } from 'react';
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
        methods.reset(data); // 저장 후 리셋하여 isDirty값을 false로 되돌림
      })
      .catch((e) => console.error(e));
  };

  const saveButton = useMemo(() => {
    return (
      <Stack>
        <Button
          width="100%"
          type="submit"
          colorScheme={methods.formState.isDirty ? 'red' : 'blue'}
        >
          저장
        </Button>
        {methods.formState.isDirty && (
          <Text as="span" color="red">
            데이터 변경사항이 있습니다. 저장버튼을 눌러주세요!!!!
          </Text>
        )}
      </Stack>
    );
  }, [methods.formState.isDirty]);

  if (isLoading) return <Spinner />;
  if (isError) return <Text>에러가 발생하였습니다 {JSON.stringify(error)}</Text>;

  return (
    <FormProvider {...methods}>
      <Stack as="form" onSubmit={methods.handleSubmit(onSubmit)}>
        <Text fontWeight="bold">크크쇼 메인 데이터 관리</Text>
        <Text>
          캐러셀 아이템 추가하기, 데이터 수정, 삭제 등 작업 후 반드시 저장버튼을
          눌러주세요!
        </Text>
        {saveButton}

        <Divider variant="dashed" />
        <AdminKkshowMainCarouselSection />
        <Divider variant="dashed" />

        {saveButton}
      </Stack>
    </FormProvider>
  );
}

export default AdminKkshowMain;
