import { useRouter } from 'next/router';

export const useNextpageUrlParam = (): string | null => {
  const router = useRouter();
  const nextPage = router.query.nextpage as string;
  if (!nextPage) return null;
  return nextPage.startsWith('/') ? nextPage : `/${nextPage}`;
};
export default useNextpageUrlParam;
