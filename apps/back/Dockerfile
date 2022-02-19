FROM node:alpine as base

ENV TZ=Europe/Paris

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app

RUN apk add --no-cache libc6-compat
RUN apk add --no-cache make gcc g++ python3

COPY package.json package-lock.json ./
RUN npm ci
RUN apk del make gcc g++ python3

FROM node:alpine as builder

ENV TZ=Europe/Paris

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app

COPY --from=base /app/package-lock.json ./
COPY --from=base /app/package.json ./
COPY --from=base /app/node_modules ./node_modules
COPY src ./src
COPY .babelrc ./

#RUN npm install --production --ignore-scripts --prefer-offline

# Running the app
CMD [ "npm", "run", "start:prod" ]
