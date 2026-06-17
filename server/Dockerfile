FROM node:20-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npx prisma generate && npm run build

EXPOSE 4000

CMD ["npm", "run", "start"]
