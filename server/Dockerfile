FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["sh", "-c", "sleep 5 && npx knex migrate:latest && npm start"]
