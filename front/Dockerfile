FROM node:22-alpine
WORKDIR /app

COPY ./package.json .
RUN npm install

COPY . .

EXPOSE 4173

CMD ["npm", "run", "start"]
