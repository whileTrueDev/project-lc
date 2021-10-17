import {
  Box,
  Button,
  Flex,
  Stack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Text,
  Badge,
  Grid,
  useToast,
  Divider,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

import { ConfirmDialog, ConfirmDialogProps } from '../ConfirmDialog';

export function AdminLiveShoppingUpdateConfirmModal(
  props: Pick<ConfirmDialogProps, 'isOpen' | 'onClose' | 'onConfirm'>,
): JSX.Element {
  const { isOpen, onClose, onConfirm } = props;

  const { watch } = useFormContext();
  return (
    <ConfirmDialog
      title="등록정보 확인"
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <Box>
        <Text>아래와 같이 등록하시겠습니까?</Text>
        <Text>{watch('progress')}</Text>
        <Text>{watch('broadcaster')}</Text>
        <Text>{watch('broadcastStartDate')}</Text>
        <Text>{watch('broadcastEndDate')}</Text>
        <Text>{watch('sellStartDate')}</Text>
        <Text>{watch('sellEndDate')}</Text>
        <Text>{watch('rejectionReason')}</Text>
      </Box>
    </ConfirmDialog>
  );
}
