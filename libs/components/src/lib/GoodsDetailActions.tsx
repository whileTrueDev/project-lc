import { HStack, Button } from '@chakra-ui/react';
import { GoodsByIdRes } from '@project-lc/shared-types';

export interface GoodsDetailActionsProps {
  goods: GoodsByIdRes;
}
export function GoodsDetailActions({ goods }: GoodsDetailActionsProps) {
  return (
    <HStack>
      <Button>버튼1</Button>
      <Button>버튼2</Button>
    </HStack>
  );
}
