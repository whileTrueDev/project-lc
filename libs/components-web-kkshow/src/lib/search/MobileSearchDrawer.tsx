import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
} from '@chakra-ui/react';
import { useSearchDrawer } from '@project-lc/stores';
import { useRef } from 'react';
import { DrawerSearcher } from './DrawerSearcher';

export function MobileSearchDrawer(): JSX.Element {
  const { onClose } = useDisclosure();
  const { isOpen } = useSearchDrawer();
  const searchBoxInputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <Drawer
        onClose={onClose}
        isOpen={isOpen}
        size="full"
        initialFocusRef={searchBoxInputRef}
      >
        <DrawerOverlay display={{ base: 'flex', md: 'none' }}>
          <DrawerContent>
            <DrawerBody>
              <DrawerSearcher searchBoxInputRef={searchBoxInputRef} />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
}

export default MobileSearchDrawer;
