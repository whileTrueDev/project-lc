import { GridColumns, GridRowData } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import { useColorModeValue, Button } from '@chakra-ui/react';
import { s3, useDisplaySize, s3KeyType } from '@project-lc/hooks';
import { SellerBusinessRegistration } from '@prisma/client';
import { ChakraDataGrid } from '../ChakraDataGrid';

const columns: GridColumns = [
  {
    field: 'companyName',
    headerName: '회사명',
  },
  {
    field: 'sellerEmail',
    headerName: '광고주 이메일',
  },
  {
    field: 'businessRegistrationNumber',
    headerName: '사업자 등록 번호',
  },
  {
    field: 'representativeName',
    headerName: '대표자명',
  },
  {
    field: 'businessType',
    headerName: '업태',
  },
  {
    field: 'businessItem',
    headerName: '종목',
  },
  {
    field: 'businessAddress',
    headerName: '사업장 주소',
    minWidth: 1000,
  },
  {
    field: 'taxInvoiceMail',
    headerName: '계산서 발급 이메일',
  },
  {
    field: 'businessRegistrationImageName',
    headerName: '사업자등록증 이미지',
    renderCell: (params) => DownloadImageButton(params.row, 'business-registration'),
  },
  {
    field: 'mailOrderSalesNumber',
    headerName: '통신판매업등록번호',
  },
  {
    field: 'mailOrderSalesImageName',
    headerName: '통신판매업등록증 이미지',
    renderCell: (params) => DownloadImageButton(params.row, 'mail-order'),
  },
];

// image down button
export function DownloadImageButton(row: GridRowData, type: s3KeyType): JSX.Element {
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

function makeListRow(
  sellerBusinessRegistrations: SellerBusinessRegistration[] | undefined,
): SellerBusinessRegistration[] {
  if (!sellerBusinessRegistrations) {
    return [];
  }
  return sellerBusinessRegistrations.map((element, index: number) => {
    return { ...element, id: index, isRowSelectable: false };
  });
}

// 관리자가 볼 계좌번호 등록 리스트
export function AdminBusinessRegistrationList(props: {
  sellerBusinessRegistrations: SellerBusinessRegistration[];
}): JSX.Element {
  const { isDesktopSize } = useDisplaySize();
  const { sellerBusinessRegistrations } = props;
  const useStyle = makeStyles({
    columnHeader: {
      backgroundColor: useColorModeValue('inherit', '#2D3748'),
    },
    root: {
      borderWidth: 0,
      color: useColorModeValue('inherit', `rgba(255, 255, 255, 0.92)`),
      height: '95%',
    },
  });

  const classes = useStyle();

  return (
    <ChakraDataGrid
      classes={{
        columnHeader: classes.columnHeader,
        root: classes.root,
      }}
      borderWidth={0}
      hideFooter
      headerHeight={50}
      minH={300}
      density="compact"
      columns={columns.map((x) => ({ ...x, flex: isDesktopSize ? 1 : undefined }))}
      rows={makeListRow(sellerBusinessRegistrations)}
      rowCount={5}
      rowsPerPageOptions={[25, 50]}
      disableColumnMenu
      disableColumnFilter
      disableSelectionOnClick
    />
  );
}
