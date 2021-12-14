import { ChakraDataGrid } from '../ChakraDataGrid';

export function AdminBroadcasterSettlementInfoList(): JSX.Element {
  return (
    <>
      <ChakraDataGrid
        borderWidth={0}
        hideFooter
        headerHeight={50}
        minH={300}
        density="compact"
        columns={[
          {
            field: 'companyName',
            headerName: '회사명',
          },
        ]}
        rows={[{ id: 1, companyName: 'test' }]}
        rowCount={5}
        rowsPerPageOptions={[25, 50]}
        onCellClick={() => console.log('click')}
        disableColumnMenu
        disableColumnFilter
        disableSelectionOnClick
      />
      {/* <AdminBusinessRegistrationRejectionDialog
      isOpen={isRejectionOpen}
      onClose={onRejectionClose}
      row={selectedRow}
    />
    <AdminBusinessRegistrationConfirmationDialog
      isOpen={isConfirmationOpen}
      onClose={onConfirmationClose}
      row={selectedRow}
    /> */}
    </>
  );
}

export default AdminBroadcasterSettlementInfoList;
