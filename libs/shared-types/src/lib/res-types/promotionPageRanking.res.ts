export interface GetRankingResItem {
  _count?: number;
  _sum?: { price: number };
  nickname: string;
}
export type GetRankingRes = GetRankingResItem[];
