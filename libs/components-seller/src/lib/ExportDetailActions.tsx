import { HStack, Button, useToast } from '@chakra-ui/react';
import { FmExportRes } from '@project-lc/shared-types';

export interface ExportDetailActionsProps {
  exportData: FmExportRes;
}
export function ExportDetailActions({
  exportData,
}: ExportDetailActionsProps): JSX.Element {
  const toast = useToast();
  return (
    <HStack>
      <Button
        onClick={() => {
          // alert(`배송조회 클릭 송장번호: ${exportData.delivery_number}`)
          toast({ title: '배송 조회 기능 중비중입니다.', status: 'warning' });
        }}
      >
        배송조회
      </Button>
    </HStack>
  );
}

export default ExportDetailActions;
