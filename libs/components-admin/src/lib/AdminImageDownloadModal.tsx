import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Input,
  ModalProps,
  Text,
} from '@chakra-ui/react';
import { GridRowData } from '@material-ui/data-grid';
import { s3KeyType, s3 } from '@project-lc/utils-s3';
import { useForm, FormProvider } from 'react-hook-form';
import { AdminImageDownloadButton } from './AdminImageDownloadButton';

export type AdminImageDownloadModalProps = Pick<ModalProps, 'isOpen' | 'onClose'> & {
  type: s3KeyType;
  row: GridRowData;
};

export function AdminImageDownloadModal(
  props: AdminImageDownloadModalProps,
): JSX.Element {
  const { isOpen, onClose, type, row } = props;

  const methods = useForm({
    defaultValues: {
      reason: '',
    },
  });
  const { register, watch } = methods;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <FormProvider {...methods}>
            <ModalBody>
              <Text>
                * 다운로드 사유를 간략히 입력해주세요
                <br />
                (ex. 승인, 정산정보확인 등)
              </Text>
              <Input {...register('reason', { maxLength: 10 })} />
            </ModalBody>
            <ModalFooter>
              {watch('reason')?.trim() && (
                <AdminImageDownloadButton row={row} type={type} onClose={onClose} />
              )}
            </ModalFooter>
          </FormProvider>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AdminImageDownloadModal;
