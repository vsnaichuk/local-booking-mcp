FROM node:23-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV PORT=3333

EXPOSE ${PORT}

RUN npm run build

CMD ["npm", "start"]
