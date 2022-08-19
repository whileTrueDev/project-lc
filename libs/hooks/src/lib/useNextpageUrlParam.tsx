import { NEXT_PAGE_PARAM_KEY } from '@project-lc/shared-types';
import { useRouter } from 'next/router';

export const useNextpageUrlParam = (): string | null => {
  const router = useRouter();
  const nextPage = router.query[NEXT_PAGE_PARAM_KEY] as string;
  if (!nextPage) return null;
  return nextPage.startsWith('/') ? nextPage : `/${nextPage}`;
};
export default useNextpageUrlParam;
