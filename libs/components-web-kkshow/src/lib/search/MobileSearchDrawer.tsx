import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
} from '@chakra-ui/react';
import { useSearchDrawer } from '@project-lc/stores';
import { DrawerSearcher } from './DrawerSearcher';

export function MobileSearchDrawer(): JSX.Element {
  const { onClose } = useDisclosure();
  const { isOpen } = useSearchDrawer();
  return (
    <>
      <Drawer onClose={onClose} isOpen={isOpen} size="full">
        <DrawerOverlay display={{ base: 'flex', md: 'none' }}>
          <DrawerContent>
            <DrawerBody>
              <DrawerSearcher />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
}

export default MobileSearchDrawer;
