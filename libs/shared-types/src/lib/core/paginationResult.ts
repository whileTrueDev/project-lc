/** 페이지네이션 응답 인터페이스. */
export interface PaginationResult<
  /** 페이지네이션 응답 데이터 타입 */
  T = unknown,
  /** 페이지네이션 응답 데이터 Unique ID 타입, 응답 데이터가 id 필드가 포함되어있는 객체인 경우, id 필드의 타입을 따름 */
  TID = T extends { id: number } ? T['id'] : unknown,
> {
  /** 응답 데이터 배열 */
  edges: T[];
  /** 다음 페이지가 존재하는지 여부 */
  hasNextPage: boolean;
  /** 다음 커서 (다음 요소의 Unique ID) */
  nextCursor?: TID;
}
