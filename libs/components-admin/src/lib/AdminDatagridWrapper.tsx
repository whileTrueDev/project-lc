import { Box } from '@chakra-ui/react';
import { useAdminLastCheckedData } from '@project-lc/hooks';
import { useRouter } from 'next/router';

/** 관리자가 해당 페이지(router.pathname)에서 마지막으로 확인한(=알림초기화 당시 표시된 데이터 중 가장 큰 id) 데이터의 id 조회. 없으면 -1 반환 */
export const useLatestCheckedDataId = (): number => {
  const { data: adminCheckedData } = useAdminLastCheckedData();
  const router = useRouter();
  const { pathname } = router;
  const latestCheckedDataId = adminCheckedData?.[pathname] || -1; // 관리자가 이전에 확인 한 값이 없는경우 -1

  return latestCheckedDataId;
};

/** 관리자가 확인하지 않은 업데이트된 row 에 적용될 className */
export const NOT_CHECKED_BY_ADMIN_CLASS_NAME = 'not-checked-by-admin-data';

export interface AdminDatagridWrapperProps {
  children: React.ReactNode;
}
/** 관리자가 확인하지 않은 업데이트된 사항을 반투명 붉게 표시하기 위해 ChakraDatagrid 감싸는 래퍼 컴포넌트
 */
export function AdminDatagridWrapper({
  children,
}: AdminDatagridWrapperProps): JSX.Element {
  return (
    <Box
      sx={{
        [`.${NOT_CHECKED_BY_ADMIN_CLASS_NAME}`]: {
          bg: 'red.200',
        },
      }}
    >
      {children}
    </Box>
  );
}

export default AdminDatagridWrapper;
