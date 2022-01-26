FROM node:14

ENV NODE_ENV production
# timezone 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY ./dist/apps/api-realtime .
RUN yarn install --prod

EXPOSE 3000

CMD NODE_ENV=production node ./main.js