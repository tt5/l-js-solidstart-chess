FROM node:21-alpine as builder

WORKDIR /build
COPY package.json ./
COPY package-lock.json ./

ARG NPM_TOKEN
ENV NPM_TOKEN $NPM_TOKEN

RUN npm ci --omit=dev --ignore-scripts

FROM node:21-alpine

RUN apk update && apk add --no-cache dumb-init
ENV HOME=/home/app
ENV APP_HOME=$HOME/node/
ENV NODE_ENV=production
WORKDIR $APP_HOME
COPY --chown=node:node . $APP_HOME
COPY --chown=node:node --from=builder /build $APP_HOME
USER node
EXPOSE 3000
ENTRYPOINT ["dumb-init"]
CMD ["npx", "solid-start", "start"]
