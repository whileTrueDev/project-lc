import { Badge } from '@chakra-ui/react';

export function LiveShoppingProgressConverter(props: {
  progress: string;
  startDate?: Date;
  endDate?: Date;
}): JSX.Element {
  const { progress, startDate, endDate } = props;
  if (startDate && endDate) {
    if (
      new Date(startDate).valueOf() < new Date().valueOf() &&
      new Date(endDate).valueOf() > new Date().valueOf() &&
      progress === 'confirmed'
    ) {
      return <Badge colorScheme="blue">라이브 진행중</Badge>;
    }
    if (new Date(endDate).valueOf() < new Date().valueOf() && progress === 'confirmed') {
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
