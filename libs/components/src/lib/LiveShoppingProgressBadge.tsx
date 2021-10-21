import { Badge } from '@chakra-ui/react';
import {
  LiveShoppingProgressParams,
  getLiveShoppingProgress,
} from '@project-lc/shared-types';

export type LiveShoppingProgressBadgeProps = LiveShoppingProgressParams;

export function LiveShoppingProgressBadge(
  props: LiveShoppingProgressBadgeProps,
): JSX.Element {
  const shoppingProgress = getLiveShoppingProgress(props);
  const colorSchemeObj: Record<string, string | undefined> = {
    등록됨: undefined,
    조율중: 'purple',
    확정됨: 'orange',
    방송진행중: 'blue',
    방송종료: 'telegram',
    판매종료: 'teal',
    취소됨: 'red',
  };

  return <Badge colorScheme={colorSchemeObj[shoppingProgress]}>{shoppingProgress}</Badge>;
}
