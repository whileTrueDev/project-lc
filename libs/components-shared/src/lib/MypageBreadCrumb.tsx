import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Box } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { mypageNavLinks } from '@project-lc/components-constants/navigation';

interface BreadCrumbItem {
  path: string;
  href: string;
}
export function MypageBreadcrumb(): JSX.Element | null {
  const router = useRouter();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadCrumbItem[]>();

  useEffect(() => {
    const linkPath = router.asPath.split('/');
    linkPath.shift();

    const pathArray = linkPath.map((path, i) => {
      return { path, href: `/${linkPath.slice(0, i + 1).join('/')}` };
    });
    setBreadcrumbs(pathArray);
  }, [router]);

  const getBreadcrumbName = useCallback((pathname: string): string => {
    if (/[0-9]+/.test(pathname)) return pathname;
    const currNavLink = mypageNavLinks.find((link) => link.href.includes(pathname));
    if (!currNavLink) return pathname;
    if (!currNavLink.children) return currNavLink.name;
    const realNavLink = currNavLink.children.find((childLink) =>
      childLink.href.includes(pathname),
    );
    return realNavLink?.name || pathname;
  }, []);

  if (!breadcrumbs) return null;
  return (
    <Box p={4} pl={6}>
      <Breadcrumb separator={<ChevronRightIcon />}>
        {breadcrumbs.map((breadcrumb, i) => {
          return (
            <BreadcrumbItem
              key={breadcrumb.href}
              isCurrentPage={i + 1 === breadcrumbs.length}
            >
              <NextLink href={breadcrumb.href} passHref>
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
