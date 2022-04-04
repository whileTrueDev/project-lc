/**
 * 이용안내에 사용할 대분류, 연결페이지 데이터
 */

import { UserType } from '@prisma/client';

// 이용안내 연결 페이지 데이터 타입
export type ManualLinkPage = {
  name: string; // 페이지 이름, (예: 라이브쇼핑), 관리자
  href: string; // 페이지 라우터 경로, (예: /mypage/live)
};

export const linkPage: Record<UserType, ManualLinkPage[]> = {
  // app/web-seller/pages/mypage 아래있는 페이지 중 매뉴얼 표시될 수 있는 페이지 경로
  seller: [
    { name: '상품', href: '/mypage/goods' },
    { name: '라이브쇼핑', href: '/mypage/live' },
    { name: '주문', href: '/mypage/orders' },
    { name: '정산', href: '/mypage/settlement' },
    { name: '상점설정', href: '/mypage/shopinfo' },
    { name: '계정 설정', href: '/mypage/setting' },
    { name: '상품 등록', href: '/mypage/goods/regist' },
    { name: '라이브쇼핑 등록', href: '/mypage/live/regist' },
    { name: '주문 출고', href: '/mypage/orders/exports' },
  ].sort((a, b) => a.name.localeCompare(b.name)),
  // app/web-broadcaster-center/pages/mypage 아래있는 페이지 중 매뉴얼 표시될 수 있는 페이지 경로
  broadcaster: [
    { name: '라이브쇼핑', href: '/mypage/live' },
    { name: '구입현황', href: '/mypage/purchase' },
    { name: '정산', href: '/mypage/settlement' },
    { name: '계정설정', href: '/mypage/setting' },
  ].sort((a, b) => a.name.localeCompare(b.name)),
};

// 이용안내 대분류 데이터 타입
export type ManualMainCategory = {
  key: string; // 카테고리 고유값, 다른 카테고리와 중복되면 안됨
  label: string; // 카테고리명 (예: 라이브쇼핑)
};
export const mainCategory: Record<UserType, ManualMainCategory[]> = {
  seller: [
    { key: 'goods', label: '상품' },
    { key: 'live', label: '라이브쇼핑' },
    { key: 'order', label: '주문' },
    { key: 'settlement', label: '정산' },
    { key: 'shopinfo', label: '상점설정' },
    { key: 'setting', label: '계정설정' },
  ].sort((a, b) => a.label.localeCompare(b.label)),
  broadcaster: [
    { key: 'live', label: '라이브쇼핑' },
    { key: 'purchase', label: '구입현황' },
    { key: 'settlement', label: '정산' },
    { key: 'setting', label: '계정설정' },
  ].sort((a, b) => a.label.localeCompare(b.label)),
};
