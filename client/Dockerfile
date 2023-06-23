FROM node:erbium

WORKDIR /usr/app
COPY package.json .
COPY yarn.lock .
RUN yarn

COPY . .
CMD ["yarn", "start:dev"]
