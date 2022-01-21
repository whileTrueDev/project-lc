import { Button, Text } from '@chakra-ui/react';
import TextWithPopperButton from '@project-lc/components-core/TextWithPopperButton';
import { useGoodsOnLiveFlag } from '@project-lc/hooks';
import { GoodsByIdRes } from '@project-lc/shared-types';
import { useRouter } from 'next/router';

/** 라이브쇼핑 진행중이므로 수정 불가 표시 */
export function GoodsEditDisabledText(): JSX.Element {
  return (
    <TextWithPopperButton title="수정불가" iconAriaLabel="수정불가" portalBody>
      <Text>
        현재 라이브 쇼핑이 진행중인 상품으로 상품 정보를 변경할 수 없습니다. <br />
        상품 정보를 수정하고 싶은 경우 고객센터로 문의해주세요.
      </Text>
    </TextWithPopperButton>
  );
}

/** 상품 수정 페이지로 이동하는 링크 */
export function GoodsEditButton({ goods }: { goods: GoodsByIdRes }): JSX.Element {
  const router = useRouter();
  const onLiveShopping = useGoodsOnLiveFlag(goods);
  // 라이브쇼핑 진행중인 상품의 경우
  if (onLiveShopping) return <GoodsEditDisabledText />;

  const handleEditClick = (): void => {
    router.push(`/mypage/goods/${goods.id}/edit`);
  };
  return (
    <Button size="sm" variant="outline" onClick={handleEditClick}>
      수정하기
    </Button>
  );
}
export default GoodsEditButton;
