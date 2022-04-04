FROM node:14-slim

RUN apt-get update
RUN apt-get install -y openssl

ENV NODE_ENV production
# timezone 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY ./dist/apps/overlay-controller .
COPY ./libs/prisma-orm/prisma ./prisma

RUN yarn install --prod
RUN yarn global add prisma@3.11.0
RUN prisma generate
RUN yarn add hbs

EXPOSE 3333

CMD NODE_ENV=production node ./main.js