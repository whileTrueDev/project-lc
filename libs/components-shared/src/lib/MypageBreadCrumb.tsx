import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export function MypageBreadcrumb(): JSX.Element {
  const router = useRouter();
  const [breadcrumbs, setBreadcrumbs] = useState<
    {
      breadcrumb: string;
      href: string;
    }[]
  >();

  const convertToKorean = (pathname: string): string => {
    switch (pathname) {
      case 'mypage':
        return '마이페이지';
      case 'mypage#':
        return '마이페이지';
      case 'goods':
        return '상품';
      case 'regist':
        return '등록';
      case 'orders':
        return '주문';
      case 'settlement':
        return '정산';
      case 'live':
        return '라이브쇼핑';
      case 'shopinfo':
        return '상점설정';
      case 'purchase':
        return '구입현황';
      case 'setting':
        return '계정설정';
      default:
        return /\d/.test(pathname) ? '상세보기' : pathname;
    }
  };

  useEffect(() => {
    if (router) {
      const linkPath = router.asPath.split('/');
      linkPath.shift();

      const pathArray = linkPath.map((path, i) => {
        return { breadcrumb: path, href: `/${linkPath.slice(0, i + 1).join('/')}` };
      });

      setBreadcrumbs(pathArray);
    }
  }, [router]);

  if (!breadcrumbs) {
    return <></>;
  }

  return (
    <Box m={2} ml={6}>
      <Breadcrumb separator=">">
        {breadcrumbs.map((breadcrumb, i) => {
          return (
            <BreadcrumbItem
              key={breadcrumb.href}
              isCurrentPage={i + 1 === breadcrumbs.length}
            >
              <BreadcrumbLink
                href={breadcrumb.href}
                fontWeight={i + 1 === breadcrumbs.length ? 'bold' : 'normal'}
              >
                {convertToKorean(breadcrumb.breadcrumb)}
              </BreadcrumbLink>
            </BreadcrumbItem>
          );
        })}
      </Breadcrumb>
    </Box>
  );
}

export default MypageBreadcrumb;
