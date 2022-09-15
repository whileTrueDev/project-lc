import { Button } from '@chakra-ui/button';

// 각 페이지에서 조회하는 데이터의 쿼리키
const queryKeyByPath: Record<string, string> = {
  '/broadcaster/settlement-info': 'AdminBroadcasterSettlementInfoList',
  '/broadcaster/settlement': 'BcSettlementTargets',
  '/seller/account': 'Settlement', // 계좌정보는 sellerSettlementAccount에 들어있음
  '/seller/business-registration': 'Settlement', // 사업자등록정보는 sellerBusinessRegistration
  '/seller/settlement': 'SellerSettlementTargets',
  '/goods/confirmation': 'AdminGoodsList', // 상품목록은 items에 들어있음
  '/goods/inquiry': 'InfiniteInquiries', // 상품문의 목록은 해당 쿼리키의 pages[].goodsInquiries에 들어있음
  '/live-shopping': 'AdminLiveShoppingList',
  '/order/order-cancel': 'AdminOrderCancelRequest',
  '/order/list': 'AdminOrderList', // orders에 들어있음
  '/order/refund': 'AdminReturnList',
  '/general/inquiry': 'getAdminInquiry',
};

export function AdminTabAlarmResetButton({
  onClick,
}: {
  onClick: () => Promise<void> | void;
}): JSX.Element {
  return (
    <Button colorScheme="red" onClick={onClick}>
      알림 초기화
    </Button>
  );
}

export default AdminTabAlarmResetButton;
