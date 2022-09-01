import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { GridColumns } from '@material-ui/data-grid';
import { OverlayTheme } from '@prisma/client';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import {
  useAdminOverlayThemeDeleteMutation,
  useOverlayThemeList,
} from '@project-lc/hooks';
import { OverlayThemeDataType } from '@project-lc/shared-types';
import OverlayDisplayPreview from './OverlayDisplayPreview';

const columns: GridColumns = [
  {
    field: 'category',
    headerName: '분류',
    flex: 0.25,
  },
  {
    field: 'name',
    headerName: '테마 이름',
    flex: 1,
    renderCell: ({ row }) => <OverlayPreviewDialog theme={row as OverlayTheme} />,
  },
  {
    field: 'createDate',
    headerName: '생성일시',
    minWidth: 250,
  },
  {
    field: 'key',
    headerName: '식별키',
    minWidth: 250,
  },
];

export function OverlayThemeListSection(): JSX.Element {
  const { data } = useOverlayThemeList();
  return (
    <ChakraDataGrid
      rows={data || []}
      columns={columns}
      minH={500}
      density="compact"
      disableSelectionOnClick
    />
  );
}

export default OverlayThemeListSection;

function OverlayPreviewDialog({ theme }: { theme: OverlayTheme }): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const style: OverlayThemeDataType = JSON.parse(JSON.stringify(theme.data));

  const toast = useToast();
  const { mutateAsync, isLoading } = useAdminOverlayThemeDeleteMutation();

  const onClick = async (): Promise<void> => {
    mutateAsync({ id: theme.id })
      .then(() => {
        toast({ title: '삭제완료', status: 'success' });
        onClose();
      })
      .catch((e) => {
        toast({ title: '삭제 중 에러 발생', status: 'error', description: e });
      });
  };
  return (
    <>
      <Button onClick={onOpen} variant="link">
        {theme.name}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {theme.category} - {theme.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* 미리보기 */}
            <OverlayDisplayPreview
              _backgroundImage={style.backgroundImage}
              _podiumImage={style.podiumImage}
              _timerImage={style.timerImage}
              _backgroundColor={style.backgroundColor}
              _color={style.color}
              _titleColor={style.titleColor}
              _textShadow={style.textShadow}
            />
            <Text whiteSpace="pre-wrap">
              data : {JSON.stringify(theme.data, null, 2)}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClick} isLoading={isLoading}>
              삭제
            </Button>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              닫기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
