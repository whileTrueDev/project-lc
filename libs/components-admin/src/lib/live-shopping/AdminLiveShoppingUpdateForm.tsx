import { EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Divider,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { TtsSetting } from '@prisma/client';
import {
  LiveShoppingManage,
  useUpdateLiveShoppingManageMutation,
} from '@project-lc/hooks';
import { LiveShoppingUpdateDTO, LiveShoppingWithGoods } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { AdminLiveShoppingUpdateConfirmModal } from '../AdminLiveShoppingUpdateConfirmModal';
import { AdminOverlayImageUploadDialog } from '../AdminOverlayImageUploadDialog';
import BroadcasterAutocomplete from '../BroadcasterAutocomplete';
import LiveShoppingDatePicker from '../LiveShoppingDatePicker';
import LiveShoppingProgressSelector from '../LiveShoppingProgressSelector';
import AdminLiveShoppingSalesGuideImageUploadDialog from './AdminLiveShoppingSalesGuideImageUploadDialog';

export type LiveShoppingFormData = Omit<LiveShoppingUpdateDTO, 'id'>;

export interface AdminLiveShoppingUpdateFormProps {
  liveShopping: LiveShoppingWithGoods;
}
export function AdminLiveShoppingUpdateForm({
  liveShopping,
}: AdminLiveShoppingUpdateFormProps): JSX.Element {
  const { mutateAsync } = useUpdateLiveShoppingManageMutation();
  const methods = useForm<LiveShoppingFormData>({
    defaultValues: {
      progress: undefined,
      liveShoppingName: '',
      broadcasterId: undefined,
      broadcastStartDate: '',
      broadcastEndDate: '',
      sellStartDate: '',
      sellEndDate: '',
      rejectionReason: '',
      videoUrl: '',
      whiletrueCommissionRate: undefined,
      broadcasterCommissionRate: undefined,
    },
  });
  const { handleSubmit, register, watch, reset } = methods;
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const {
    isOpen: imageDialogIsOpen,
    onOpen: imageDialogOnOpen,
    onClose: imageDialogOnClose,
  } = useDisclosure();
  const salesGuideDialog = useDisclosure();
  const onClose = (): void => {
    setIsOpen(false);
  };

  const openConfirmModal = (): void => {
    setIsOpen(true);
  };

  const onSuccess = (): void => {
    reset({
      progress: undefined,
      liveShoppingName: '',
      broadcasterId: undefined,
      broadcastStartDate: '',
      broadcastEndDate: '',
      sellStartDate: '',
      sellEndDate: '',
      rejectionReason: '',
      videoUrl: '',
      whiletrueCommissionRate: undefined,
      broadcasterCommissionRate: undefined,
      messageSetting: {
        fanNick: '',
        levelCutOffPoint: undefined,
        ttsSetting: undefined,
      },
    });
    toast({ title: '변경 완료', status: 'success' });
  };

  const onFail = (err?: AxiosError): void => {
    console.error(err);
    toast({
      title: '변경 실패',
      description:
        err?.response?.status === 400 ? err?.response?.data?.message : undefined,
      status: 'error',
    });
  };

  const onSubmit = async (data: LiveShoppingFormData): Promise<void> => {
    const videoUrlExist = Boolean(liveShopping?.liveShoppingVideo?.youtubeUrl);
    const { sellerId, goodsId: _, contactId, requests, ...restData } = data; // formData타입에서 LiveShoppingManage 타입으로 바꾸기 위해
    const dto: LiveShoppingManage = Object.assign(restData, {
      id: liveShopping.id,
    });
    mutateAsync({ dto, videoUrlExist }).then(onSuccess).catch(onFail);
  };

  return (
    // {/* 라이브쇼핑 정보 변경 폼 */}
    <FormProvider {...methods}>
      <Stack as="form" spacing={5}>
        <LiveShoppingProgressSelector />
        <Divider />
        <Stack>
          <Text>라이브 쇼핑 이름</Text>
          <Input {...register('liveShoppingName')} />
        </Stack>
        <BroadcasterAutocomplete />

        <Divider />
        <Box>
          <Text fontWeight="bold">구매 메시지 설정</Text>
          <Text>비회원 팬닉: </Text>
          <Input {...register('messageSetting.fanNick')} placeholder="OOO 팬" />

          <Text>1,2단계 구매메시지 기준 금액: </Text>
          <Input
            type="number"
            {...register('messageSetting.levelCutOffPoint', {
              valueAsNumber: true,
            })}
            placeholder="30000"
          />

          <Text>TTS 설정: </Text>
          <RadioGroup
            onChange={(value: TtsSetting) => {
              methods.setValue('messageSetting.ttsSetting', value);
            }}
          >
            <Stack spacing={2} direction="row" flexWrap="wrap">
              <Radio {...register('messageSetting.ttsSetting')} value={TtsSetting.full}>
                전체
              </Radio>
              <Radio
                {...register('messageSetting.ttsSetting')}
                value={TtsSetting.nick_purchase}
              >
                닉,구매감사
              </Radio>
              <Radio
                {...register('messageSetting.ttsSetting')}
                value={TtsSetting.nick_purchase_price}
              >
                닉,금액,구매감사
              </Radio>
              <Radio
                {...register('messageSetting.ttsSetting')}
                value={TtsSetting.only_message}
              >
                메세지만
              </Radio>
              <Radio {...register('messageSetting.ttsSetting')} value={TtsSetting.no_tts}>
                TTS 없음
              </Radio>
              <Radio
                {...register('messageSetting.ttsSetting')}
                value={TtsSetting.no_sound}
              >
                소리 없음(콤보모드)
              </Radio>
            </Stack>
          </RadioGroup>
        </Box>

        <Divider />

        <LiveShoppingDatePicker title="방송 시작시간" registerName="broadcastStartDate" />
        <LiveShoppingDatePicker title="방송 종료시간" registerName="broadcastEndDate" />
        {dayjs(watch('broadcastStartDate')) > dayjs(watch('broadcastEndDate')) && (
          <Text as="em" color="tomato">
            방송 종료시간이 시작시간보다 빠릅니다
          </Text>
        )}
        <Divider />

        <LiveShoppingDatePicker title="판매 시작시간" registerName="sellStartDate" />
        <LiveShoppingDatePicker
          title="판매 종료시간"
          registerName="sellEndDate"
          min={watch('sellStartDate')}
        />
        {dayjs(watch('sellStartDate')) > dayjs(watch('sellEndDate')) && (
          <Text as="em" color="tomato">
            판매 종료시간이 시작시간보다 빠릅니다
          </Text>
        )}
        <Divider />

        <Stack>
          <Text>
            영상 URL ( https://youtu.be/4pIuCJTMXQU 와 같은 형태로 입력해주세요 )
          </Text>
          <Input placeholder="https://youtu.be/4pIuCJTMXQU" {...register('videoUrl')} />
        </Stack>
        <Divider />

        <Button onClick={openConfirmModal} colorScheme="blue">
          변경
        </Button>
        <Button
          rightIcon={<EditIcon />}
          onClick={imageDialogOnOpen}
          isDisabled={!liveShopping.broadcaster}
        >
          오버레이 이미지 등록
        </Button>
        <Button rightIcon={<EditIcon />} onClick={salesGuideDialog.onOpen}>
          판매가이드 이미지 등록
        </Button>
      </Stack>

      <AdminLiveShoppingUpdateConfirmModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleSubmit(onSubmit)}
      />
      {liveShopping.broadcaster && liveShopping.broadcaster.email && (
        <AdminOverlayImageUploadDialog
          isOpen={imageDialogIsOpen}
          onClose={imageDialogOnClose}
          broadcasterEmail={liveShopping.broadcaster.email}
          liveShoppingId={liveShopping.id}
        />
      )}
      <AdminLiveShoppingSalesGuideImageUploadDialog
        isOpen={salesGuideDialog.isOpen}
        onClose={salesGuideDialog.onClose}
        liveShoppingId={liveShopping.id}
      />
    </FormProvider>
  );
}

export default AdminLiveShoppingUpdateForm;
