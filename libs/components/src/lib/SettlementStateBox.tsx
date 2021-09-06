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
} from '@chakra-ui/react';
import { QuestionIcon } from '@chakra-ui/icons';

import { MdCheckCircle, MdCancel } from 'react-icons/md';
import { SettlementPopoverButton } from './SettlementPopoverButton';

type SettlementStateBoxProps = {
  hasRegistration: boolean;
  hasAccount: boolean;
};

function setIconType(bool: boolean, usemode: typeof useColorModeValue) {
  if (bool) {
    return {
      as: MdCheckCircle,
      color: 'green.500',
    };
  }
  return {
    as: MdCancel,
    color: usemode('red.500', 'red.700'),
    mb: 0.6,
  };
}

// 정산의 상태를 보여주는 컴포넌트
export function SettlementStateBox(props: SettlementStateBoxProps): JSX.Element {
  const { hasRegistration, hasAccount } = props;
  const badgeColor = useColorModeValue('red.500', 'red.100');
  const badgeGroundColor = useColorModeValue('red.50', 'red.300');

  return (
    <Box borderWidth="1px" borderRadius="lg" p={7}>
      <Flex
        direction={['column', 'column', 'column', 'row']}
        justifyContent="space-between"
      >
        <Text fontSize="lg" fontWeight="medium" pb={1}>
          정산 준비
        </Text>
        {!(hasAccount && hasRegistration) && (
          <Flex direction="row" mb={1} height="100%" justify="center">
            <Badge
              color={badgeColor}
              backgroundColor={badgeGroundColor}
              fontSize="sm"
              width="max-content"
              mr={1}
              pb={1}
            >
              정산 불가 상태
            </Badge>
            <SettlementPopoverButton>
              <QuestionIcon boxSize="1.2rem" />
            </SettlementPopoverButton>
          </Flex>
        )}
      </Flex>
      <List mt={3} spacing={1}>
        <Divider backgroundColor="gray.100" />
        <ListItem
          backgroundColor={hasRegistration ? 'whiteAlpha.50' : badgeGroundColor}
          borderRadius="lg"
          p={1}
        >
          <ListIcon {...setIconType(hasRegistration, useColorModeValue)} />
          사업자 등록증 등록
        </ListItem>
        <ListItem
          backgroundColor={hasAccount ? 'whiteAlpha.50' : badgeGroundColor}
          borderRadius="lg"
          p={1}
        >
          <ListIcon {...setIconType(hasAccount, useColorModeValue)} />
          정산 계좌 등록
        </ListItem>
      </List>
    </Box>
  );
}
