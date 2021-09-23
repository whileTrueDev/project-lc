FROM node:14

ENV NODE_ENV production
# timezone 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY ./dist/apps/overlay .
COPY ./libs/prisma-orm/prisma ./prisma

ENV PRISMA_BINARIES_MIRROR http://prisma-builds.s3-eu-west-1.amazonaws.com

RUN yarn global add prisma
RUN yarn install --prod
RUN prisma generate

EXPOSE 3002

CMD NODE_ENV=production node ./main.js