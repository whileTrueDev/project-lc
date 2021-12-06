export type SiteType = 'seller' | 'broadcaster';
const siteTypes: Record<SiteType, string> = {
  seller: '판매자센터',
  broadcaster: '방송인센터',
};
export const renderSiteType = (siteType: SiteType): string => siteTypes[siteType];
