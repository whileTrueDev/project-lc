import { Spinner } from '@chakra-ui/react';
import { KkshowShoppingSectionItem } from '@prisma/client';
import { useKkshowShoppingSections } from '@project-lc/hooks';
import {
  KkshowShoppingTabBannerData,
  KkshowShoppingTabCarouselItem,
  KkshowShoppingTabGoodsData,
  KkshowShoppingTabReviewData,
  LAYOUT_AUTO_SLIDE,
  LAYOUT_BANNER,
  LAYOUT_BIG_SQUARE_LIST,
  LAYOUT_CAROUSEL,
  LAYOUT_RATING_DETAIL,
  LAYOUT_RECT_GRID,
  LAYOUT_SMALL_SQUARE_LIST,
} from '@project-lc/shared-types';
import { parseJsonToGenericType } from '@project-lc/utils';
import { ShoppingAutoSlideLayout } from './section-layout/ShoppingAutoSlideLayout';
import ShoppingBannerLayout from './section-layout/ShoppingBannerLayout';
import ShoppingBigSquareRowLayout from './section-layout/ShoppingBigSquareRowLayout';
import ShoppingCarouselLayout from './section-layout/ShoppingCarouselLayout';
import ShoppingRatingRowLayout from './section-layout/ShoppingRatingRowLayout';
import ShoppingRectGridLayout from './section-layout/ShoppingRectGridLayout';
import ShoppingSmallSquareRowLayout from './section-layout/ShoppingSmallSquareRowLayout';
import ShoppingCategories from './ShoppingCategories';

const renderSection = (sectionItem: KkshowShoppingSectionItem): JSX.Element => {
  if (!sectionItem) return <></>;

  const { layoutType } = sectionItem;
  if (layoutType === LAYOUT_CAROUSEL) {
    const data = parseJsonToGenericType<KkshowShoppingTabCarouselItem[]>(
      sectionItem.data,
    );
    return <ShoppingCarouselLayout carouselData={data} key={sectionItem.id} />;
  }
  if (layoutType === LAYOUT_AUTO_SLIDE) {
    const data = parseJsonToGenericType<KkshowShoppingTabGoodsData[]>(sectionItem.data);
    return (
      <ShoppingAutoSlideLayout
        title={sectionItem.title}
        data={data}
        key={sectionItem.id}
      />
    );
  }
  if (layoutType === LAYOUT_SMALL_SQUARE_LIST) {
    const data = parseJsonToGenericType<KkshowShoppingTabGoodsData[]>(sectionItem.data);
    return (
      <ShoppingSmallSquareRowLayout
        title={sectionItem.title}
        data={data}
        key={sectionItem.id}
      />
    );
  }

  if (layoutType === LAYOUT_BIG_SQUARE_LIST) {
    const data = parseJsonToGenericType<KkshowShoppingTabGoodsData[]>(sectionItem.data);
    return (
      <ShoppingBigSquareRowLayout
        title={sectionItem.title}
        data={data}
        key={sectionItem.id}
      />
    );
  }

  if (layoutType === LAYOUT_RECT_GRID) {
    const data = parseJsonToGenericType<KkshowShoppingTabGoodsData[]>(sectionItem.data);
    return (
      <ShoppingRectGridLayout
        title={sectionItem.title}
        data={data}
        key={sectionItem.id}
      />
    );
  }

  if (layoutType === LAYOUT_RATING_DETAIL) {
    const data = parseJsonToGenericType<KkshowShoppingTabReviewData[]>(sectionItem.data);
    return (
      <ShoppingRatingRowLayout
        title={sectionItem.title}
        data={data}
        key={sectionItem.id}
      />
    );
  }

  if (layoutType === LAYOUT_BANNER) {
    const data = parseJsonToGenericType<KkshowShoppingTabBannerData>(sectionItem.data);
    return (
      <ShoppingBannerLayout
        {...data}
        link={sectionItem.link || undefined}
        key={sectionItem.id}
      />
    );
  }
  return <></>;
};

export function ShoppingSectionsContainer(): JSX.Element {
  const { data, isLoading } = useKkshowShoppingSections();

  if (isLoading) return <Spinner />;
  if (!data) return <></>;
  return (
    <>
      {/* 쇼핑탭 상단 캐러셀영역 */}
      {renderSection(data.carousel)}

      {/* 카테고리 */}
      <ShoppingCategories />

      {/* 캐러셀 제외한 다른 레이아웃 섹션을 순서대로 표시 */}
      {data.sectionItems.map((sectionItem) => renderSection(sectionItem))}
    </>
  );
}

export default ShoppingSectionsContainer;
