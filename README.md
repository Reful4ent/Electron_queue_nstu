
# Start front

### Usages:
1. node version: 18
### Commands:

1. ``cd queue-front`` - Переходим папку с фронтом
2. ``npm install`` - Устанавливаем зависимости
3. ``npm run dev`` - Запускаем проект.

# Start back

### Usages:
1. node version: 18

### Commands:
1. Инициализация проекта
   - ``yarn`` - Установка зависимостей
   - Создаем файл ``.env`` в директории``/queue-strapi``
   - ``yarn build`` - Билд проекта
2. Запуск проекта
   - ``yarn develop`` - Запуск бекенда.

### Export/Import database

### Commands:
Выполняются в директории ``/queue-strapi``
1. ### export 
   - ``yarn strapi export --no-encrypt --file <filename>`` - Расширение файла не указывается
2. ### import 
   - Закидываем полученный файл в директорию ``/queue-strapi``
   - ``yarn strapi import --file <filename>.tar.gz`` - Указывается название файла полностью с расширением