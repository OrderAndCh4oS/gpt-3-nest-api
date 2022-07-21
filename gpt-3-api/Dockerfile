# For prod see: https://www.tomray.dev/nestjs-docker-production

FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node .. .

USER node

EXPOSE 8080

CMD [ "npm", "run", "dev" ]
