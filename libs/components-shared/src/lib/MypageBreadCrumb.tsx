import { ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import {
  mypageNavLinks,
  broadcasterCenterMypageNavLinks,
} from '@project-lc/components-constants/navigation';
import { UserType } from '@project-lc/shared-types';
import { flatten } from 'lodash';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface BreadCrumbItem {
  path: string;
  href: string;
}
export function MypageBreadcrumb(): JSX.Element | null {
  const router = useRouter();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadCrumbItem[]>();

  useEffect(() => {
    const linkPath = router.asPath.replace('#', '').split('/');
    linkPath.shift();

    const pathArray = linkPath.map((path, i) => {
      return {
        path,
        href: `/${linkPath.slice(0, i + 1).join('/')}`,
      };
    });
    setBreadcrumbs(pathArray);
  }, [router]);

  const appType = process.env.NEXT_PUBLIC_APP_TYPE as UserType;
  const navLinks = useMemo(
    () => (appType === 'broadcaster' ? broadcasterCenterMypageNavLinks : mypageNavLinks),
    [appType],
  );
  const getBreadcrumbName = useCallback(
    (pathname: string): string => {
      if (/[0-9]+/.test(pathname)) return pathname;
      const currNavLink = navLinks.find((link) => {
        if (link.children && link.children.length > 0) {
          return link.children.find((l) => l.href.includes(pathname));
        }
        return link.href.includes(pathname);
      });
      if (!currNavLink) return pathname;
      if (!currNavLink.children) return currNavLink.name;
      const realNavLink = currNavLink.children.find((childLink) => {
        return childLink.href.includes(pathname);
      });
      return realNavLink?.name || pathname;
    },
    [navLinks],
  );

  const isBreadcrumbLinkable = useCallback(
    (href: string): boolean => {
      return Boolean(flatten(navLinks).find((l) => l.href === href));
    },
    [navLinks],
  );

  if (!breadcrumbs) return null;
  return (
    <Box p={4} pl={6}>
      <Breadcrumb separator={<ChevronRightIcon />}>
        {breadcrumbs.map((breadcrumb, i) => {
          // 마이페이지 > 이용안내 예외처리 : 이용안내 화면에서 이용안내id 표시 안되도록
          if (/manual\/[0-9]+/.test(breadcrumb.href)) return null;
          return (
            <BreadcrumbItem
              key={breadcrumb.href}
              isCurrentPage={i + 1 === breadcrumbs.length}
            >
              <NextLink
                href={
                  isBreadcrumbLinkable(breadcrumb.href) ? breadcrumb.href : router.asPath
                }
                passHref
              >
                <BreadcrumbLink
                  fontWeight={i + 1 === breadcrumbs.length ? 'bold' : 'normal'}
                >
                  {getBreadcrumbName(breadcrumb.path)}
                </BreadcrumbLink>
              </NextLink>
            </BreadcrumbItem>
          );
        })}
      </Breadcrumb>
    </Box>
  );
}

export default MypageBreadcrumb;
