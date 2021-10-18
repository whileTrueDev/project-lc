import { Badge } from '@chakra-ui/react';

export function LiveShoppingProgressConverter(props: {
  progress: string;
  broadcastStartDate: Date | null;
  broadcastEndDate: Date | null;
  sellEndDate: Date | null;
}): JSX.Element {
  const { progress, broadcastStartDate, broadcastEndDate, sellEndDate } = props;
  if (broadcastStartDate && broadcastEndDate) {
    if (
      sellEndDate &&
      new Date(sellEndDate).valueOf() < new Date().valueOf() &&
      progress === 'confirm'
    ) {
      return <Badge colorScheme="teal">판매종료</Badge>;
    }
    if (
      new Date(broadcastStartDate).valueOf() < new Date().valueOf() &&
      new Date(broadcastEndDate).valueOf() > new Date().valueOf() &&
      progress === 'confirm'
    ) {
      return <Badge colorScheme="blue">라이브 진행중</Badge>;
    }
    if (
      new Date(broadcastEndDate).valueOf() < new Date().valueOf() &&
      progress === 'confirm'
    ) {
      return <Badge colorScheme="telegram">방송종료</Badge>;
    }
  }

  switch (progress) {
    case 'adjust':
      return <Badge colorScheme="purple">조율중</Badge>;
    case 'confirm':
      return <Badge colorScheme="orange">확정</Badge>;
    case 'cancel':
      return <Badge colorScheme="red">취소</Badge>;
    default:
      return <Badge>등록됨</Badge>;
  }
}
