FROM node:14

ENV NODE_ENV production
# timezone 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY ./dist/apps/overlay-controller .
COPY ./libs/prisma-orm/prisma ./prisma

RUN yarn install --prod
RUN yarn global add prisma
RUN prisma generate
RUN yarn add hbs
RUN yarn add argon2@0.28.2
RUN npx node-pre-gyp rebuild -C ./node_modules/argon2

EXPOSE 3333

CMD NODE_ENV=production node ./main.js