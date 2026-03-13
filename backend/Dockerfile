FROM node:20

WORKDIR /app

COPY package*.json ./

RUN apt-get update && apt-get install -y docker.io 

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm","run","dev"]