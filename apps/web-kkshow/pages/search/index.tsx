import {
  Box,
  Divider,
  Spinner,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
} from '@chakra-ui/react';
import { SearchPageSearcher } from '@project-lc/components-web-kkshow/SearchPageSearcher';
import { useDisplaySize } from '@project-lc/hooks';
import SearchKeywordSection from '@project-lc/components-web-kkshow/search/SearchKeywordSection';
import SearchPageLayout, {
  useSearchPageState,
} from '@project-lc/components-web-kkshow/search/SearchPageLayout';
import SearchResultBroadcasterSection from '@project-lc/components-web-kkshow/search/SearchResultBroadcasterSection';
import SearchResultGoodsSection from '@project-lc/components-web-kkshow/search/SearchResultGoodsSection';
import SearchResultLiveContentsSection from '@project-lc/components-web-kkshow/search/SearchResultLiveContentsSection';

export function MobileSearchDrawer(): JSX.Element {
  const { onClose } = useDisclosure();
  const { isMobileSize } = useDisplaySize();
  return (
    <>
      <Drawer onClose={onClose} isOpen={Boolean(isMobileSize)} size="full">
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
export function Search(): JSX.Element {
  const { data, isLoading, searchKeyword } = useSearchPageState();
  const resultCount = data
    ? data.broadcasters.length + data.goods.length + data.liveContents.length
    : 0;

  if (isLoading) {
    return (
      <SearchPageLayout>
        <Spinner />
      </SearchPageLayout>
    );
  }

  return (
    <SearchPageLayout>
      {!data && (
        <Box>
          <MobileSearchDrawer />
          <SearchKeywordSection keyword="" resultCount={0} />
        </Box>
      )}
      {data && (
        <>
          <SearchKeywordSection keyword={searchKeyword} resultCount={resultCount} />
          <Divider />
          <SearchResultGoodsSection keyword={searchKeyword} data={data.goods} />
          <Divider />
          <SearchResultLiveContentsSection
            keyword={searchKeyword}
            data={data.liveContents}
          />
          <Divider />
          <SearchResultBroadcasterSection
            keyword={searchKeyword}
            data={data.broadcasters}
          />
        </>
      )}
    </SearchPageLayout>
  );
}

export default Search;
