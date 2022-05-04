import { Box, Text } from '@chakra-ui/react';
import { HtmlStringBox } from '@project-lc/components-core/TermBox';
import { useTerms } from '@project-lc/hooks';

// TODO: 약관 정의 이후 내용 변경

export function TermBox(): JSX.Element {
  return (
    <Box>
      <Text>개인정보 판매자 제공 동의</Text>
      <Box overflow="scroll" h="200px" mb={3} border="1px solid" borderColor="gray.300">
        <HtmlStringBox
          htmlString={useTerms({ userType: 'broadcaster' }).broadcasterTerms[0].text}
        />
      </Box>
      <Text>개인정보 수집 및 이용 동의</Text>
      <Box overflow="scroll" h="200px" mb={3} border="1px solid" borderColor="gray.300">
        <HtmlStringBox
          htmlString={useTerms({ userType: 'broadcaster' }).broadcasterTerms[0].text}
        />
      </Box>
      <Text>주문상품정보 동의</Text>
      <Box overflow="scroll" h="200px" mb={3} border="1px solid" borderColor="gray.300">
        <HtmlStringBox
          htmlString={useTerms({ userType: 'broadcaster' }).broadcasterTerms[0].text}
        />
      </Box>
    </Box>
  );
}
