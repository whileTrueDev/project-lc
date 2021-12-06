import { AddIcon } from '@chakra-ui/icons';
import {
  Button,
  Input,
  Text,
  Stack,
  ButtonGroup,
  useBoolean,
  Collapse,
  Spinner,
  Link,
  useToast,
} from '@chakra-ui/react';
import { BroadcasterChannel } from '@prisma/client';
import {
  useProfile,
  useBroadcasterChannels,
  useBroadcasterChannelDeleteMutation,
  useBroadcasterChannelCreateMutation,
} from '@project-lc/hooks';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import SettingSectionLayout from './SettingSectionLayout';
import { ErrorText } from './ShippingOptionIntervalApply';

/** 입력한 채널 아이템 표시 & 삭제버튼 */
function BroadcasterChannelItem(item: BroadcasterChannel): JSX.Element {
  const { id, url } = item;
  const toast = useToast();

  const deleteRequest = useBroadcasterChannelDeleteMutation();
  const onClick = (): void => {
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
      <Link href={url} isExternal color="blue.500" textDecoration="underline">
        {url}
      </Link>
      <Button onClick={onClick} size="sm" isLoading={deleteRequest.isLoading}>
        삭제
      </Button>
    </Stack>
  );
}

type ChannelFormData = {
  url: string;
};

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
    profileData?.id || 1,
  );

  const allowAddChannel = useMemo(() => channels && channels.length < 5, [channels]);

  const createChannelRequest = useBroadcasterChannelCreateMutation();
  const onSubmit = (data: ChannelFormData): void => {
    // if (!profileData) return;

    createChannelRequest
      .mutateAsync({
        ...data,
        // broadcasterId: profileData.id,
        broadcasterId: 1,
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
      <Text>현재 활동하고 있는 플랫폼의 채널 주소를 입력하세요.(최대 5개)</Text>

      {/* 방송인이 등록한 채널 url 목록 */}
      {channels && (
        <Stack>
          {channels.map((item) => (
            <BroadcasterChannelItem key={item.id} {...item} />
          ))}
        </Stack>
      )}

      {/* 채널 url 입력창 여닫는 버튼 */}
      {allowAddChannel && (
        <Button leftIcon={<AddIcon />} variant="outline" onClick={toggle} size="sm">
          링크추가
        </Button>
      )}

      {/* 채널 url 입력폼 */}
      <Collapse in={isOpen} animateOpacity>
        <Stack as="form" onSubmit={handleSubmit(onSubmit)}>
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
              isDisabled={!allowAddChannel}
              isLoading={createChannelRequest.isLoading}
              colorScheme="blue"
            >
              확인
            </Button>
            <Button onClick={off}>취소</Button>
          </ButtonGroup>
        </Stack>
      </Collapse>
    </SettingSectionLayout>
  );
}

export default BroadcasterChannelSection;
