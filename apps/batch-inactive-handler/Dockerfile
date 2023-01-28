FROM node:14-slim

RUN apt-get update
RUN apt-get install -y openssl

ENV NODE_ENV production
# timezone 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY ./dist/apps/batch-inactive-handler .
COPY ./libs/prisma-orm/prisma ./prisma

RUN yarn install --prod
RUN yarn global add prisma@4.9.0
RUN prisma generate


CMD NODE_ENV=production node ./main.js
