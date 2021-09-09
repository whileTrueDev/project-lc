/* eslint-disable react/jsx-props-no-spreading */
import {
  List,
  ListItem,
  ListIcon,
  Box,
  Flex,
  Badge,
  Text,
  Divider,
  useColorModeValue,
  Alert,
  IconButton,
} from '@chakra-ui/react';
import { QuestionIcon } from '@chakra-ui/icons';

import { MdCheckCircle, MdCancel } from 'react-icons/md';
import { useMemo } from 'react';
import { SettlementPopoverButton } from './SettlementPopoverButton';

type SettlementStateBoxProps = {
  hasRegistration: boolean;
  hasAccount: boolean;
};

// 정산의 상태를 보여주는 컴포넌트
export function SettlementStateBox(props: SettlementStateBoxProps): JSX.Element {
  const { hasRegistration, hasAccount } = props;
  const isAllReady = useMemo(
    () => hasAccount && hasRegistration,
    [hasAccount, hasRegistration],
  );

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
          <Flex direction="row" mb={1} height="100%" justify="center" alignItems="center">
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
      <List mt={3} spacing={1}>
        <Divider backgroundColor="gray.100" />
        <ListItem p={1}>
          <Alert borderRadius="md" h={10} status={hasRegistration ? 'info' : 'error'}>
            <ListIcon as={hasRegistration ? MdCheckCircle : MdCancel} />
            사업자 등록증 등록
          </Alert>
        </ListItem>
        <ListItem p={1}>
          <Alert borderRadius="md" h={10} status={hasAccount ? 'info' : 'error'}>
            <ListIcon as={hasAccount ? MdCheckCircle : MdCancel} />
            정산 계좌 등록
          </Alert>
        </ListItem>
      </List>
    </Box>
  );
}
