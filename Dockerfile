FROM node:lts-buster

RUN apt-get update && \
apt-get install -y \
git \
ffmpeg \
imagemagick \
webp && \
apt-get upgrade -y && \
rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json .

RUN npm i

COPY . .

EXPOSE 7860

RUN chmod -R 777 /app

CMD ["npm", "start"]