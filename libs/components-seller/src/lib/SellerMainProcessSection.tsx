import {
  processSectionBody,
  sellerMainSectionText,
} from '@project-lc/components-constants/sellerMainText';
import MainSectionLayout from '@project-lc/components-layout/MainSectionLayout';
import { MainProcessItemList } from '@project-lc/components-shared/MainProcessItemList';

export function SellerMainProcessSection(): JSX.Element {
  return (
    <MainSectionLayout
      subtitle={sellerMainSectionText.process.desc}
      _title={sellerMainSectionText.process.title || ''}
      py={12}
    >
      <MainProcessItemList processItems={processSectionBody} />
    </MainSectionLayout>
  );
}

export default SellerMainProcessSection;
