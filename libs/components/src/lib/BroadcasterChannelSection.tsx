import {
  Box,
  Button,
  ButtonGroup,
  Collapse,
  Input,
  Link,
  LinkProps,
  Spinner,
  Stack,
  Text,
  useBoolean,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { BroadcasterChannel } from '@prisma/client';
import {
  useBroadcasterChannelCreateMutation,
  useBroadcasterChannelDeleteMutation,
  useBroadcasterChannels,
  useProfile,
} from '@project-lc/hooks';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { boxStyle } from '../constants/commonStyleProps';
import { AddButton } from './BroadcasterContact';
import { ConfirmDialog } from './ConfirmDialog';
import { SettingNeedAlertBox } from './SettingNeedAlertBox';
import SettingSectionLayout from './SettingSectionLayout';
import { ErrorText } from './ShippingOptionIntervalApply';

export function ExternalLink({ href }: { href: string } & LinkProps): JSX.Element {
  return (
    <Link href={href} isExternal color="blue.500" textDecoration="underline">
      {href}
    </Link>
  );
}

/** 입력한 채널 아이템 표시 & 삭제버튼 */
function BroadcasterChannelItem(item: BroadcasterChannel): JSX.Element {
  const { id, url } = item;
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const deleteRequest = useBroadcasterChannelDeleteMutation();
  const onDelete = async (): Promise<void> => {
    deleteRequest.mutateAsync(id).catch((error) => {
      console.error(error);
      toast({
        title: '채널url을 삭제하는 중 오류가 발생했습니다.',
        status: 'error',
      });
    });
  };

  return (
    <Stack direction="row" alignItems="center">
      <ExternalLink href={url} />
      <Button onClick={onOpen} size="sm" isLoading={deleteRequest.isLoading}>
        삭제
      </Button>

      <ConfirmDialog
        title="채널 주소 삭제"
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onDelete}
      >
        해당 채널 주소를 삭제하시겠습니까?
        <Box mt={4} {...boxStyle}>
          <ExternalLink href={url} fontSize="sm" />
        </Box>
      </ConfirmDialog>
    </Stack>
  );
}

type ChannelFormData = {
  url: string;
};

const MAX_CHANNEL_COUNT = 5;

/** 활동 플랫폼 목록 표시 및 추가 섹션 컴포넌트 */
export function BroadcasterChannelSection(): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChannelFormData>();
  const toast = useToast();
  const [isOpen, { toggle, off }] = useBoolean();

  const { data: profileData, isLoading: profileLoading } = useProfile();
  const { data: channels, isLoading: channelLoading } = useBroadcasterChannels(
    profileData?.id,
  );

  const isChannelFull = useMemo(
    () => channels && channels.length >= MAX_CHANNEL_COUNT,
    [channels],
  );

  const createChannelRequest = useBroadcasterChannelCreateMutation();
  const onSubmit = (data: ChannelFormData): void => {
    if (!profileData) return;

    createChannelRequest
      .mutateAsync({
        ...data,
        broadcasterId: profileData.id,
      })
      .then(() => {
        reset();
        off();
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: '채널url을 추가하는 중 오류가 발생했습니다.',
          status: 'error',
        });
      });
  };

  if (profileLoading || channelLoading) {
    return (
      <SettingSectionLayout title="활동 플랫폼">
        <Spinner />
      </SettingSectionLayout>
    );
  }
  return (
    <SettingSectionLayout title="활동 플랫폼">
      {/* 방송인이 등록한 채널 url 목록 */}
      {channels && channels.length > 0 ? (
        <Stack>
          <Text>현재 활동중인 플랫폼의 채널 주소를 입력하세요.(최대 5개)</Text>
          {channels.map((item) => (
            <BroadcasterChannelItem key={item.id} {...item} />
          ))}
        </Stack>
      ) : (
        <SettingNeedAlertBox text="현재 활동중인 방송 플랫폼(아프리카, 유튜브, 트위치, 인스타그램 등)의 채널 주소를 입력해주세요." />
      )}

      <Box>
        {/* 채널 url 입력창 여닫는 버튼 */}
        <AddButton onClick={toggle} maxCount={MAX_CHANNEL_COUNT} isFull={isChannelFull} />

        {/* 채널 url 입력폼 */}
        <Collapse in={isOpen} animateOpacity>
          <Stack as="form" onSubmit={handleSubmit(onSubmit)} spacing={3} mt={1}>
            <Text as="label">채널 URL (아프리카, 유투브, 트위치, 인스타그램 등)</Text>
            <Input
              isInvalid={!!errors.url}
              placeholder="https://www.twitch.tv/chodan_"
              {...register('url', {
                required: '채널 url을 입력해주세요',
                validate: (value) => {
                  const regex = new RegExp('^(http|https)://', 'i');
                  return (
                    regex.test(value) ||
                    '채널 url은 http:// 혹은 https:// 로 시작해야 합니다'
                  );
                },
              })}
            />
            {errors.url && <ErrorText>{errors.url.message}</ErrorText>}
            <ButtonGroup>
              <Button
                type="submit"
                isDisabled={isChannelFull}
                isLoading={createChannelRequest.isLoading}
                colorScheme="blue"
              >
                확인
              </Button>
              <Button onClick={off}>취소</Button>
            </ButtonGroup>
          </Stack>
        </Collapse>
      </Box>
    </SettingSectionLayout>
  );
}

export default BroadcasterChannelSection;
