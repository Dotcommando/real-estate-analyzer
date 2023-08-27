FROM nginx:alpine

WORKDIR /usr/app

RUN apk add --update nodejs npm

COPY .env /usr/app/.env

COPY package.json /usr/app/package.json

COPY nginx-config-replace.js /usr/app/nginx-config-replace.js

COPY nginx.conf /etc/nginx/nginx.conf

RUN npm install

CMD [ "sh", "-c", "node /usr/app/nginx-config-replace.js && nginx -g 'daemon off;'" ]
