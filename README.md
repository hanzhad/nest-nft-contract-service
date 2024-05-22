<p align="right">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Deployment

```Dockerfile
FROM node:14.18.1
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE $PORT
CMD ["node", "dist/main"]
```

###Env vars
```
PORT - application port(docker file should have the same port
REDIS_HOST - redis url
REDIS_PREFIX - prefix for application
PG_HOST - posgress host
PG_USER - posgress user
PG_PORT - posgress port
PG_BASE - posgress db name
PG_PASS - posgress user passwor
COLLECT_BLOCKCHAIN_EVENTS_CRONE - cron time (exapme '* */3 * * *' every 3h)
NFT_MARKET_ADDRESS - contract address for nft market
NFT_AUCTION_ADDRESS -  contract address for nft auction
```

## Migration
```
cd /db
sequelize db:migrate
```
https://github.com/sequelize/cli

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
