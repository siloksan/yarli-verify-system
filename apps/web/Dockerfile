FROM node:20-alpine AS build

WORKDIR /app

ARG VITE_API_BASE_URL=http://localhost:3000
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

COPY . .

RUN corepack enable
RUN yarn install --immutable
RUN yarn workspace @repo/api build
RUN yarn workspace web build

FROM node:20-alpine AS runtime

WORKDIR /app/apps/web

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=build /app /app

EXPOSE 3000

CMD ["node", "/app/apps/web/node_modules/@react-router/serve/bin.js", "./build/server/index.js"]
