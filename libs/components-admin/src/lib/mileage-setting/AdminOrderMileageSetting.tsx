import {
  Stack,
  Text,
  Input,
  InputGroup,
  InputRightAddon,
  Button,
  Select,
  FormControl,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react';
import { MileageSetting, MileageStrategy } from '@prisma/client';
import {
  useDefaultMileageSetting,
  useAdminMileageSettingUpdateMutation,
} from '@project-lc/hooks';
import { useForm, Controller } from 'react-hook-form';
import { mileageStrategiesToKorean } from '@project-lc/components-constants/adminMileageStrategy';
import { useEffect } from 'react';
import { percentageRateMinMax } from '../AdminBroadcasterProductPromotionSection';

type formData = Pick<MileageSetting, 'defaultMileagePercent' | 'mileageStrategy'> & {
  useMileageFeature: 'use' | 'notUse';
};

const DEFAULT_MILEAGE_SETTING_ID = 1;

export function AdminOrderMileageSetting(): JSX.Element {
  const toast = useToast();
  const { data } = useDefaultMileageSetting();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
    setValue,
  } = useForm<formData>({
    defaultValues: {
      defaultMileagePercent: data?.defaultMileagePercent || 1,
      mileageStrategy: data?.mileageStrategy || 'onPaymentWithoutMileageUse',
      useMileageFeature: data?.useMileageFeature === true ? 'use' : 'notUse',
    },
  });

  useEffect(() => {
    if (data) {
      setValue('defaultMileagePercent', data.defaultMileagePercent);
      setValue('mileageStrategy', data.mileageStrategy);
      setValue('useMileageFeature', data.useMileageFeature === true ? 'use' : 'notUse');
    }
    // 최초 한번만 실행
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateMileageSetting = useAdminMileageSettingUpdateMutation();

  const onSubmit = (submitData: formData): void => {
    let useMileageFeature;
    if (submitData.useMileageFeature === 'use') useMileageFeature = true;
    if (submitData.useMileageFeature === 'notUse') useMileageFeature = false;

    const dto = {
      id: DEFAULT_MILEAGE_SETTING_ID,
      ...submitData,
      useMileageFeature,
    };

    updateMileageSetting
      .mutateAsync(dto)
      .then((res) => {
        toast({ title: '기본 마일리지 설정 변경 성공', status: 'success' });
        reset(submitData); // isDirty값을 false로 돌리기 위해 default 값을 변경
      })
      .catch((e) => {
        console.error(e);
        toast({ title: '기본 마일리지 설정 변경 실패', status: 'error' });
      });
  };

  return (
    <Stack as="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="row">
        <Button
          type="submit"
          colorScheme={isDirty ? 'red' : 'blue'}
          isLoading={updateMileageSetting.isLoading}
        >
          저장하기
        </Button>
        {isDirty && (
          <Text as="span" color="red">
            데이터 변경사항이 있습니다. 저장버튼을 눌러주세요!!!!
          </Text>
        )}
      </Stack>

      <FormControl isInvalid={!!errors.useMileageFeature}>
        <Stack direction="row" alignItems="center">
          <Text mr={1}>
            마일리지 적립 기능 사용여부(이 기능을 사용해야 소비자가 구매확정시 마일리지가
            적립됩니다)
          </Text>
          <Controller
            name="useMileageFeature"
            control={control}
            render={({ field }) => (
              <Select
                placeholder="마일리지 적립 기능 사용여부를 선택하세요"
                {...field}
                w="200px"
              >
                <option value="use">사용</option>
                <option value="notUse">미사용</option>
              </Select>
            )}
            rules={{
              required: '마일리지 적립 기능 사용여부를 선택하세요',
            }}
          />
        </Stack>

        <FormErrorMessage>{errors.useMileageFeature?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.defaultMileagePercent}>
        <InputGroup alignItems="center">
          <Text mr={1}>상품 구매시 마일리지 적립률</Text>
          <Input
            w="80px"
            type="number"
            {...register('defaultMileagePercent', {
              required: true,
              ...percentageRateMinMax,
              valueAsNumber: true,
            })}
          />
          <InputRightAddon>%</InputRightAddon>
        </InputGroup>
        <FormErrorMessage>{errors.defaultMileagePercent?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.mileageStrategy}>
        <Stack direction="row">
          <Text mr={1}>마일리지 적립방식</Text>
          <Controller
            name="mileageStrategy"
            control={control}
            render={({ field }) => (
              <Select placeholder="마일리지 적립방식을 선택하세요" {...field} w="700px">
                {Object.keys(MileageStrategy).map((strategy) => (
                  <option value={strategy} key={strategy}>
                    {mileageStrategiesToKorean[strategy as MileageStrategy]}
                  </option>
                ))}
              </Select>
            )}
            rules={{
              required: '마일리지 적립방식을 선택해주세요',
            }}
          />
        </Stack>
        <FormErrorMessage>{errors.mileageStrategy?.message}</FormErrorMessage>
      </FormControl>
    </Stack>
  );
}

export default AdminOrderMileageSetting;
