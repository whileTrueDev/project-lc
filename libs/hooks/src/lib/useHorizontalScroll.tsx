import { useState, useCallback, useEffect } from 'react';

export interface HorizontalScrollToolSet {
  isEndOfLeft: boolean;
  isEndOfRight: boolean;
  scrollLeft: () => void;
  scrollRight: () => void;
  scrollLeftToEnd: () => void;
  scrollRightToEnd: () => void;
}

/**
 * 횡방향 스크롤이 필요한 컨테이너(ex. 이미지 갤러리)를 제어하는 기능 모음 훅
 * @param elRef 횡방향 스크롤이 필요한 컨테이너 (HTMLDivElement)
 * @returns 기능 모음 객체
 * - isEndOfLeft: 스크롤이 좌측 끝에 위치했는지 불린 값
 * - isEndOfRight: 스크롤이 우측 끝에 위치했는지 불린 값
 * - scrollLeft: 스크롤을 보이는 화면 크기만큼 좌측으로 이동시키는 함수
 * - scrollRight: 스크롤을 보이는 화면 크기만큼 우측으로 이동시키는 함수
 * - scrollLeftToEnd: 스크롤을 좌측 끝으로 이동시키는 함수
 * - scrollRightToEnd: 스크롤을 우측 끝으로 이동시키는 함수
 */
export const useHorizontalScroll = (
  elRef: React.RefObject<HTMLDivElement>,
): HorizontalScrollToolSet => {
  const [isEndOfLeft, setIsEndOfLeft] = useState(true);
  const [isEndOfRight, setIsEndOfRight] = useState(false);

  const scrollLeft = (): void => {
    elRef.current?.scrollTo({
      left: elRef.current?.scrollLeft - elRef.current?.offsetWidth,
      behavior: 'smooth',
    });
  };

  const scrollRight = (): void => {
    elRef.current?.scrollTo({
      left: elRef.current?.offsetWidth + elRef.current?.scrollLeft,
      behavior: 'smooth',
    });
  };

  const scrollLeftToEnd = (): void => {
    elRef.current?.scrollTo({
      left: 0,
      behavior: 'smooth',
    });
  };

  const scrollRightToEnd = (): void => {
    elRef.current?.scrollTo({
      left: elRef.current?.scrollWidth,
      behavior: 'smooth',
    });
  };

  const onScroll = useCallback(() => {
    const isScrollEnd =
      (elRef.current?.scrollLeft || 0) + (elRef.current?.offsetWidth || 0) ===
      elRef.current?.scrollWidth;
    if (elRef.current?.scrollLeft === 0) {
      setIsEndOfLeft(true);
    } else if (isScrollEnd) {
      setIsEndOfRight(true);
    } else {
      setIsEndOfLeft(false);
      setIsEndOfRight(false);
    }
  }, [elRef]);

  useEffect(() => {
    const el = elRef.current;
    el?.addEventListener('scroll', onScroll);

    return () => {
      el?.removeEventListener('scroll', onScroll);
    };
  }, [elRef, onScroll]);

  return {
    isEndOfLeft,
    isEndOfRight,
    scrollLeft,
    scrollRight,
    scrollLeftToEnd,
    scrollRightToEnd,
    // onScroll,
  };
};
