-- DROP INDEX
DROP INDEX `Broadcaster_userNickname_idx` ON `Broadcaster`;

-- DROP INDEX
DROP INDEX `Goods_goods_name_idx` ON `Goods`;

ALTER TABLE `Broadcaster` ADD FULLTEXT INDEX `Broadcaster_userNickname_idx`(`userNickname`) WITH PARSER NGRAM;

ALTER TABLE `Goods` ADD FULLTEXT INDEX `Goods_goods_name_idx`(`goods_name`) WITH PARSER NGRAM;
