FROM node:14

ENV NODE_ENV production
# timezone 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY ./dist/apps/api-realtime .
COPY ./libs/prisma-orm/prisma ./prisma

RUN yarn global add prisma
RUN yarn install --prod
RUN prisma generate

EXPOSE 3001
CMD NODE_ENV=production node ./main.js