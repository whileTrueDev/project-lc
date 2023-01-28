FROM node:14

RUN apt-get update
RUN apt-get install -y openssl

ENV NODE_ENV production
# timezone 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone


COPY ./dist/apps/api-realtime .
COPY ./libs/prisma-orm/prisma ./prisma
RUN yarn global add prisma@4.9.0
RUN yarn install --prod
RUN prisma generate

RUN yarn add argon2@0.28.2
RUN npx node-pre-gyp rebuild -C ./node_modules/argon2

EXPOSE 3001
CMD NODE_ENV=production node ./main.js
