import {
  processSectionBody,
  sellerMainSectionText,
} from '@project-lc/components-constants/sellerMainText';
import { MainProcessItemList } from '@project-lc/components-shared/MainProcessItemList';
import { SellerMainSectionContainer } from './SellerMainFeatureSection';

export function SellerMainProcessSection(): JSX.Element {
  return (
    <SellerMainSectionContainer sectionData={sellerMainSectionText.process}>
      <MainProcessItemList processItems={processSectionBody} />
    </SellerMainSectionContainer>
  );
}

export default SellerMainProcessSection;
