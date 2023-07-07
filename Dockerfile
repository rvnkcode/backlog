# https://www.codemochi.com/blog/2022-01-01-dockerizing-nextjs-with-prisma-for-production
# https://www.prisma.io/docs/concepts/components/prisma-migrate/migrate-development-production
# https://www.prisma.io/docs/guides/deployment/deploy-database-changes-with-prisma-migrate

# Base stage
FROM node:lts-alpine AS base

WORKDIR /app
COPY [ "package.json", "yarn.lock", "./" ]

# Build stage
FROM base AS build

RUN export NODE_ENV=production

RUN yarn config delete proxy && yarn config delete https-proxy && yarn config set "strict-ssl" false -g
RUN yarn install --frozen-lockfile --network-timeout 1000000

COPY . .

RUN yarn prisma generate
RUN yarn build

# Production build stage
FROM base AS prod-build

RUN yarn --prod --network-timeout 1000000
RUN yarn cache clean

COPY prisma prisma
RUN yarn prisma generate

RUN cp -R node_modules prod_node_modules

# Production stage
FROM base AS prod

COPY --from=prod-build /app/prod_node_modules /app/node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/prisma ./prisma

RUN mkdir /memo && chown node /memo

# TODO: Change exposed port number?
ENV ORIGIN=http://localhost:3000
EXPOSE 3000

CMD [ "yarn", "start" ]