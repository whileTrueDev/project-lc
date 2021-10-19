import {
  Image,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  HStack,
  Text,
} from '@chakra-ui/react';
import { useSettlementTargets } from '@project-lc/hooks';
import { ChakraDataGrid } from '../ChakraDataGrid';
import TextDotConnector from '../TextDotConnector';

export function SettlementTargetList(): JSX.Element | null {
  const targets = useSettlementTargets();
  if (!targets.data) return null;
  return (
    <Box>
      <Accordion defaultIndex={[0]} allowMultiple>
        {targets.data.map((target) => (
          <AccordionItem key={target.export_code}>
            <h2>
              <AccordionButton>
                <HStack w="100%">
                  <Text>{target.export_code}</Text>
                  <TextDotConnector />
                  <Text>{target.order_seq}</Text>
                </HStack>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              {target.options.map((opt) => (
                <Box key={opt.export_item_seq} my={4} borderWidth="thin" p={2}>
                  {opt.image && (
                    <Image src={`http://whiletrue.firstmall.kr${opt.image}`} />
                  )}
                  <Text>{opt.goods_seq}</Text>
                  <Text>{opt.goods_name}</Text>
                  <Text>{opt.price}</Text>
                  <Text>{opt.seller?.email}</Text>
                  <Text>{opt.seller?.name}</Text>
                  <Text>{opt.seller?.sellerShop?.shopName}</Text>
                </Box>
              ))}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
}
