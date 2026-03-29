FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 4004

CMD ["sh", "-c", "npm run migration:run && npm run database:seed && npm run start:dev"]
