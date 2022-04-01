import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
} from '@chakra-ui/react';
import { useSearchDrawer } from '@project-lc/stores';
import { SearchPageSearcher } from '../SearchPageSearcher';

export function MobileSearchDrawer(): JSX.Element {
  const { onClose } = useDisclosure();
  const { isOpen } = useSearchDrawer();
  return (
    <>
      <Drawer onClose={onClose} isOpen={isOpen} size="full">
        <DrawerOverlay>
          <DrawerContent>
            <DrawerBody>
              <SearchPageSearcher />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
}

export default MobileSearchDrawer;
