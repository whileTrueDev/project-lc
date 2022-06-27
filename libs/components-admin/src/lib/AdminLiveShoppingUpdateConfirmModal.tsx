import { Box, Text } from '@chakra-ui/react';
import {
  ConfirmDialog,
  ConfirmDialogProps,
} from '@project-lc/components-core/ConfirmDialog';
import { LiveShoppingProgressBadge } from '@project-lc/components-shared/LiveShoppingProgressBadge';
import { liveShoppingManageStore } from '@project-lc/stores';
import dayjs from 'dayjs';
import { useFormContext } from 'react-hook-form';

export function AdminLiveShoppingUpdateConfirmModal(
  props: Pick<ConfirmDialogProps, 'isOpen' | 'onClose' | 'onConfirm'>,
): JSX.Element {
  const { isOpen, onClose, onConfirm } = props;
  const { watch } = useFormContext();
  const { selectedBroadcaster } = liveShoppingManageStore();
  return (
    <ConfirmDialog
      title="라이브쇼핑 변경 정보 확인"
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <Box>
        <Text>아래와 같이 라이브쇼핑 정보를 변경하시겠습니까?</Text>

        <Box mb={2} mt={4} borderWidth="thin" borderRadius="md" p={2}>
          {watch('progress') ? (
            <Text>
              진행상태 :
              <LiveShoppingProgressBadge progress={watch('progress')} />
            </Text>
          ) : null}
          {watch('liveShoppingName') ? (
            <Text>라이브쇼핑 이름 : {watch('liveShoppingName')}</Text>
          ) : null}
          {watch('broadcasterId') ? <Text>방송인 : {selectedBroadcaster}</Text> : null}
          {watch('broadcastStartDate') ? (
            <Text>
              방송시작 시간 :{' '}
              {dayjs(watch('broadcastStartDate')).format('A YYYY/MM/DD HH:mm:ss')}
            </Text>
          ) : null}
          {watch('broadcastEndDate') ? (
            <Text>
              방송종료 시간 :{' '}
              {dayjs(watch('broadcastEndDate')).format('A YYYY/MM/DD HH:mm:ss')}
            </Text>
          ) : null}
          {dayjs(watch('broadcastStartDate')) > dayjs(watch('broadcastEndDate')) && (
            <Text as="em" color="tomato">
              방송 종료시간이 시작시간보다 빠릅니다
            </Text>
          )}
          {watch('sellStartDate') ? (
            <Text>
              판매시작 시간 :{' '}
              {dayjs(watch('sellStartDate')).format('A YYYY/MM/DD HH:mm:ss')}
            </Text>
          ) : null}
          {watch('sellEndDate') ? (
            <Text>
              판매종료 시간 :{' '}
              {dayjs(watch('sellEndDate')).format('A YYYY/MM/DD HH:mm:ss')}
            </Text>
          ) : null}
          {dayjs(watch('sellStartDate')) > dayjs(watch('sellEndDate')) && (
            <Text as="em" color="tomato">
              방송 종료시간이 시작시간보다 빠릅니다
            </Text>
          )}
          {watch('rejectionReason') ? (
            <Text>거절사유 : {watch('rejectionReason')}</Text>
          ) : null}
          {watch('videoUrl') ? <Text>영상 URL : {watch('videoUrl')}</Text> : null}
          {watch('whiletrueCommissionRate') ? (
            <Text>와일트루 수수료율 : {watch('whiletrueCommissionRate')}</Text>
          ) : null}
          {watch('broadcasterCommissionRate') ? (
            <Text>방송인 수수료율 : {watch('broadcasterCommissionRate')}</Text>
          ) : null}
        </Box>
      </Box>
    </ConfirmDialog>
  );
}
