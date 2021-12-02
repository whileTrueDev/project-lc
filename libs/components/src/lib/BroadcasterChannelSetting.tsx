import { AddIcon } from '@chakra-ui/icons';
import { Button, Text } from '@chakra-ui/react';
import SettingSectionLayout from './SettingSectionLayout';

export function BroadcasterChannelSetting(): JSX.Element {
  return (
    <SettingSectionLayout title="활동 플랫폼">
      <Text>
        현재 활동하고 있는 플랫폼의 채널 주소를 입력하세요. 아프리카, 유투브, 트위치,
        인스타그램 등...
      </Text>
      <Text>(최대 5개 업로드 가능)</Text>
      <Button leftIcon={<AddIcon />} variant="outline">
        링크추가
      </Button>
    </SettingSectionLayout>
  );
}

export default BroadcasterChannelSetting;
