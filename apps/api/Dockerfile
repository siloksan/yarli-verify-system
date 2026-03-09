FROM node:22-alpine3.20 AS build

WORKDIR /app

COPY . .

RUN corepack enable
RUN yarn install --immutable
RUN yarn workspace api db:generate
RUN yarn workspace @repo/api build
RUN yarn workspace api build

FROM node:22-alpine3.20 AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app /app

EXPOSE 3000

CMD ["node", "apps/api/dist/src/main.js"]
