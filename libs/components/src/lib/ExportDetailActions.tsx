import { HStack, Button } from '@chakra-ui/react';
import { FmExportRes } from '@project-lc/shared-types';

export interface ExportDetailActionsProps {
  exportData: FmExportRes;
}
export function ExportDetailActions({ exportData }: ExportDetailActionsProps) {
  return (
    <HStack>
      <Button
        onClick={() => alert(`배송조회 클릭 송장번호: ${exportData.delivery_number}`)}
      >
        배송조회
      </Button>
    </HStack>
  );
}
