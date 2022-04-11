FROM node:16-alpine
WORKDIR /usr/src/app

COPY ./package.json ./package-lock.json ./
RUN npm install
COPY ./ ./
RUN npm run build && npm run prisma:generate

ENV NODE_ENV=production

ENV DATABASE_URL=${DATABASE_URL}
ENV BCRYPT_SALT_ROUNDS=${BCRYPT_SALT_ROUNDS}
ENV SESSION_SECRET=${SESSION_SECRET}
ENV SESSION_COOKIE_NAME=${SESSION_COOKIE_NAME}

CMD npm run start
