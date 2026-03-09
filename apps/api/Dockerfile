FROM node:20-alpine AS build

WORKDIR /app

COPY . .

RUN corepack enable
RUN yarn install --immutable
RUN yarn workspace api db:generate
RUN yarn workspace @repo/api build
RUN yarn workspace api build

FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app /app

EXPOSE 3000

CMD ["node", "apps/api/dist/main.js"]
