import { InfoIcon, QuestionIcon } from '@chakra-ui/icons';
import {
  Alert,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  IconButton,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { BusinessRegistrationConfirmation } from '@prisma/client';
import {
  BusinessRegistrationStatus,
  SellerBusinessRegistrationType,
} from '@project-lc/shared-types';
import { useMemo } from 'react';
import { MdCancel, MdCheckCircle } from 'react-icons/md';
import { SettlementPopoverButton } from './SettlementPopoverButton';

type SettlementStateBoxProps = {
  hasRegistration: boolean;
  hasAccount: boolean;
  sellerBusinessRegistration: SellerBusinessRegistrationType;
};

// 정산의 상태를 보여주는 컴포넌트
export function SettlementStateBox(props: SettlementStateBoxProps): JSX.Element {
  const { hasRegistration, hasAccount, sellerBusinessRegistration } = props;
  const isAllReady = useMemo<boolean>(
    () => hasAccount && hasRegistration,
    [hasAccount, hasRegistration],
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  // 상태창 색깔을 결정하는 메모이징 변수
  const alertStatus = useMemo(() => {
    let status = 'error' as 'error' | 'success' | 'warning' | 'info';
    switch (sellerBusinessRegistration?.BusinessRegistrationConfirmation?.status) {
      case BusinessRegistrationStatus.CONFIRMED: {
        status = 'success';
        break;
      }
      case BusinessRegistrationStatus.WAITING: {
        status = 'warning';
        break;
      }
      default: {
        status = 'error';
        break;
      }
    }
    return status;
  }, [sellerBusinessRegistration?.BusinessRegistrationConfirmation]);

  return (
    <Box borderWidth="1px" borderRadius="lg" p={7}>
      <Flex
        direction={['column', 'column', 'column', 'row']}
        justifyContent="space-between"
      >
        <Text fontSize="lg" fontWeight="medium" pb={1}>
          정산 준비
        </Text>
        {!isAllReady && (
          <Flex direction="row" mb={1} height="100%" alignItems="center">
            <Badge colorScheme="red" fontSize="sm" width="max-content" mr={1} pb={1}>
              정산 불가 상태
            </Badge>
            <SettlementPopoverButton>
              <IconButton
                size="sm"
                variant="ghost"
                aria-label="settlement-question-mark-icon"
                icon={<QuestionIcon boxSize="1.2rem" />}
              />
            </SettlementPopoverButton>
          </Flex>
        )}
      </Flex>
      <List mt={3} spacing={2}>
        <Divider backgroundColor="gray.100" />
        <ListItem>
          <Alert borderRadius="md" h={10} status={alertStatus}>
            <Flex
              direction="row"
              width="100%"
              justify="space-between"
              alignItems="center"
            >
              <div>
                <ListIcon as={hasRegistration ? MdCheckCircle : MdCancel} />
                사업자 등록증 등록
              </div>
              {!hasRegistration && (
                <ConfirmationBadge
                  confirmation={
                    sellerBusinessRegistration?.BusinessRegistrationConfirmation
                  }
                  onOpen={onOpen}
                />
              )}
            </Flex>
          </Alert>
        </ListItem>
        <ListItem>
          <Alert borderRadius="md" h={10} status={hasAccount ? 'success' : 'error'}>
            <ListIcon as={hasAccount ? MdCheckCircle : MdCancel} />
            정산 계좌 등록
          </Alert>
        </ListItem>
      </List>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>사업자등록정보 검수 반려</ModalHeader>
          <ModalCloseButton />
          <ModalBody m={3}>
            <InfoIcon mr={1} />
            사업자등록정보 검수가 반려되었습니다. <br />
            아래 검수 반려 사유를 참고하여 사업자등록정보를 다시 등록해주세요.
            <Text
              whiteSpace="break-spaces"
              borderWidth="1px"
              borderRadius="lg"
              mt={2}
              p={7}
            >
              {sellerBusinessRegistration?.BusinessRegistrationConfirmation
                ?.rejectionReason || ''}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

// 사업자 등록 검수 상태 badge
function ConfirmationBadge(props: {
  confirmation: BusinessRegistrationConfirmation | null;
  onOpen: () => void;
}): JSX.Element {
  const { confirmation, onOpen } = props;
  let components = null;
  switch (confirmation?.status) {
    case BusinessRegistrationStatus.REJECTED: {
      components = (
        <Button colorScheme="red" size="xs" onClick={onOpen}>
          반려사유확인
        </Button>
      );
      break;
    }
    case BusinessRegistrationStatus.WAITING: {
      components = (
        <Badge colorScheme="orange" fontSize="sm">
          검수대기
        </Badge>
      );
      break;
    }
    default: {
      components = <></>;
    }
  }
  return components;
}

export default SettlementStateBox;
