FROM node:slim

WORKDIR /app

COPY . /app

RUN    npm config set registry 'https://registry.npm.taobao.org' \
    && npm i --prod

EXPOSE 8080

CMD npm start
