FROM node:22-alpine3.20 AS build

WORKDIR /app

ARG VITE_API_BASE_URL=http://localhost:3000
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

COPY . .

RUN corepack enable
RUN yarn install --immutable
RUN yarn workspace @repo/api build
RUN yarn workspace web build

FROM node:22-alpine3.20 AS runtime

WORKDIR /app/apps/web

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=build /app /app
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "/app/apps/web/build/client", "-l", "3000"]
