FROM node:20 AS builder

# Устанавливаем зависимости для sharp
RUN apt-get update && apt-get install -y libvips-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM node:20
WORKDIR /app
COPY --from=builder /app .

ENV NODE_ENV production
ENV HOST 0.0.0.0
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1

EXPOSE 1337
CMD ["yarn", "start"]
