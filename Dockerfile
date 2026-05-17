FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY .env .env

COPY ./dist ./dist 

EXPOSE 8080

CMD ["node" , "dist/src/main.js" ]