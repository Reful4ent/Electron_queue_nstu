FROM node:18.18.2

# Устанавливаем зависимости
RUN apt-get update && \
    apt-get install -y nano openssl curl python3 build-essential && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копируем зависимости
COPY ./queue-front/package.json ./queue-front/yarn.lock ./

# Устанавливаем зависимости
RUN yarn install --frozen-lockfile --network-timeout 1000000

# Копируем исходный код
COPY ./queue-front/ .

# Собираем проект
RUN yarn build

EXPOSE 5173

# Запускаем preview сервер
#CMD ["yarn", "preview", "--host", "0.0.0.0", "--port", "5173"]

CMD yarn build && yarn preview