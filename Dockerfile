
FROM node:18

ENV NODE_ENV=production

WORKDIR /src

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "app.js" ]