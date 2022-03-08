// image down button
import { Button } from '@chakra-ui/react';
import { s3, s3KeyType } from '@project-lc/utils-s3';
import { GridRowData } from '@material-ui/data-grid';

/**
 * 버킷의 경로에 따라 이미지를 다운로드하는 버튼 컴포넌트
 * @param props.row datagrid table의 row
 * @param props.type 다운받을 이미지의 경로
 * @returns 클릭시 S3 경로를 통햇 이미지를 다운받는 버튼 컴포넌트
 */
export function AdminImageDownloadButton({
  row,
  type,
}: {
  row: GridRowData;
  type: s3KeyType;
}): JSX.Element {
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
    case 'broadcaster-id-card': {
      // 방송인 신분증
      fileName = row.idCardImageName;
      break;
    }
    case 'broadcaster-account-image': {
      // 방송인 통장사본
      fileName = row.accountImageName;
      break;
    }
    default: {
      fileName = row.businessRegistrationImageName;
    }
  }

  let userEmail = '';
  switch (type) {
    case 'broadcaster-id-card':
    case 'broadcaster-account-image':
      userEmail = row.broadcaster.email;
      break;

    default:
      userEmail = row.sellerEmail;
  }

  async function downloadFromS3(sellerEmail: string): Promise<void> {
    const Key = `${type}/${sellerEmail}/${fileName}`;
    const imageUrl = await s3.getPresignedUrl({Key},{expiresIn: 60});
    window.open(imageUrl, '_blank');
  }

  return (
    <Button size="xs" onClick={() => downloadFromS3(userEmail)} disabled={disabled}>
      이미지 다운로드
    </Button>
  );
}
