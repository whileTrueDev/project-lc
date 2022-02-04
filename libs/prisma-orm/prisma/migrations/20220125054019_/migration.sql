/*
  Warnings:

  - You are about to drop the `LiveShoppingStateBoardAlert` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LiveShoppingStateBoardMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `LiveShoppingStateBoardAlert`;

-- DropTable
DROP TABLE `LiveShoppingStateBoardMessage`;

/*
!주의 ================================
이 마이그레이션까지 22 02 03 배포됨.
향후 마이그레이션 파일 병합시 해당 파일 이전의 마이그레이션 파일은 건드리지 마세요.
!주의 ================================
*/