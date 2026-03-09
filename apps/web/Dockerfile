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
ENV PATH=/app/node_modules/.bin:$PATH
ENV PORT=3000

COPY --from=build /app /app

EXPOSE 3000

CMD ["react-router-serve", "./build/server/index.js"]
