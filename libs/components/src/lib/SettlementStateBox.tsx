import {
  Text,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  List,
  ListItem,
  ListIcon,
  Box,
  Flex,
  Badge,
} from '@chakra-ui/react';
import { QuestionIcon } from '@chakra-ui/icons';

import { MdCheckCircle, MdCancel } from 'react-icons/md';
import { PopoverButton } from './PopoverButton';

type SettlementStateBoxProps = {
  hasRegistration: boolean;
  hasAccount: boolean;
};

function setIconType(bool: boolean) {
  if (bool) {
    return {
      as: MdCheckCircle,
      color: 'green.500',
    };
  }
  return {
    as: MdCancel,
    color: 'red.500',
  };
}

// 정산의 상태를 보여주는 컴포넌트
export function SettlementStateBox(props: SettlementStateBoxProps): JSX.Element {
  const { hasRegistration, hasAccount } = props;
  return (
    <Box borderWidth="1px" borderRadius="lg" p={7}>
      <Flex direction={['column', 'column', 'column', 'row']}>
        <Stat>
          <StatLabel fontSize="lg">정산 예정 금액</StatLabel>
          <StatNumber fontSize={['4xl', '5xl', '5xl', '5xl']}>
            20,000
            <Text ml={1} as="span" fontSize="2xl">
              원
            </Text>
          </StatNumber>
          <StatHelpText>2021.08.02 - 2021.08.15</StatHelpText>
        </Stat>
        {!(hasAccount && hasRegistration) && (
          <Flex direction="row" mb={1} height="100%">
            <Badge colorScheme="red" fontSize="sm" width="max-content" mr={1}>
              정산 불가 상태
            </Badge>
            <PopoverButton>
              <QuestionIcon boxSize="1.2rem" />
            </PopoverButton>
          </Flex>
        )}
      </Flex>
      <Divider />
      <List mt={3} spacing={1}>
        <ListItem
          backgroundColor={hasRegistration ? 'whiteAlpha.50' : 'red.50'}
          borderRadius="lg"
          p={1}
        >
          <ListIcon {...setIconType(hasRegistration)} />
          사업자 등록증 등록
        </ListItem>
        <ListItem
          backgroundColor={hasAccount ? 'whiteAlpha.50' : 'red.50'}
          borderRadius="lg"
          p={1}
        >
          <ListIcon {...setIconType(hasAccount)} />
          정산 계좌 등록
        </ListItem>
      </List>
    </Box>
  );
}
