// image down button
import { Button } from '@chakra-ui/react';
import { s3, s3KeyType } from '@project-lc/hooks';
import { GridRowData } from '@material-ui/data-grid';

export function AdminImageDownloadButton(row: GridRowData, type: s3KeyType): JSX.Element {
  // 해당 링크로 들어가는 버튼
  let fileName = '';
  let disabled = false;
  switch (type) {
    case 'business-registration': {
      fileName = row.businessRegistrationImageName;
      break;
    }
    case 'settlement-account': {
      fileName = row.settlementAccountImageName;
      break;
    }
    case 'mail-order': {
      fileName = row.mailOrderSalesImageName;
      if (!row?.mailOrderSalesImageName) {
        disabled = true;
      }
      break;
    }
    default: {
      fileName = row.businessRegistrationImageName;
    }
  }

  async function downloadFromS3(sellerEmail: string): Promise<void> {
    const imageUrl = s3.s3DownloadImageUrl(fileName, sellerEmail, type);
    window.open(imageUrl, '_blank');
  }

  return (
    <Button size="xs" onClick={() => downloadFromS3(row.sellerEmail)} disabled={disabled}>
      이미지 다운로드
    </Button>
  );
}
