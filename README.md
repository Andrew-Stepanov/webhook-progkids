# Интеграция Webhook: ProgKids

Этот проект предоставляет сервер для обработки вебхуков и интеграции данных из одного сервиса в другой. В данном случае обрабатываются вебхуки от Webflow и отправляются преобразованные данные в Roistat.

## Установка

Для установки проекта выполните следующие шаги:

1. Склонируйте репозиторий:

   ```
   git clone https://github.com/Andrew-Stepanov/webhook-progkids.git
   ```

2. Перейдите в каталог проекта:

   ```
   cd webhook-progkids
   ```

3. Установите необходимые зависимости:

   ```
   npm install
   ```

## Конфигурация

Перед запуском сервера убедитесь, что вы настроили переменные среды:

1. Создайте файл `.env` в корневом каталоге проекта.

2. Добавьте следующие переменные среды в файл `.env`:

   ```
   WEBHOOK_RECEIVER_URL=&lt;URL для получения вебхуков&gt;
   ```

## Запуск

Чтобы запустить сервер, введите следующую команду:

```
npm start
```

Сервер будет слушать входящие запросы на порту 3000 или на порту, указанном в переменной среды `PORT`.

## Использование

После запуска сервера вы можете настроить свой сервис (например, Webflow) на отправку вебхуков на следующий URL:

```
http://&lt;адрес вашего сервера&gt;:3000/webhook
```

При получении сервером вебхука данные будут преобразованы и отправлены на указанный `WEBHOOK_RECEIVER_URL`.

## Размещение кода на Webflow

Чтобы передавать данные из Webflow на ваш сервер, добавьте следующий код в разделе "Before &lt;/body&gt; Tag" на странице Custom Code вашего проекта Webflow:

```js
<script>
  function parseCookies() {
    const cookieArray = document.cookie.split(';');
    let cookies = {};

    for (const cookie of cookieArray) {
      let [key, value] = cookie.trim().split('=');
      cookies[key] = value;
    }

    return cookies;
  }

  function addCookiesToForm(form) {
    const cookies = parseCookies();

    for (const [key, value] of Object.entries(cookies)) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = `cookies[${key}]`;
      input.value = value;
      form.appendChild(input);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      addCookiesToForm(form);

      const formData = new FormData(form);

      fetch(form.action, {
        method: form.method,
        body: formData,
        credentials: 'same-origin',
      })
        .then((response) => {
          if (response.ok) {
            // Успешная отправка формы
            // Здесь вы можете добавить дополнительные действия, например, перенаправление на другую страницу или вывод сообщения об успешной отправке
          } else {
            // Ошибка при отправке формы
            // Здесь вы можете добавить дополнительные действия, например, вывод сообщения об ошибке
          }
        })
        .catch((error) => {
          // Обработка ошибок сети
          // Здесь вы можете добавить дополнительные действия, например, вывод сообщения об ошибке
        });
    });
  });
</script>
<!-- Lead end -->
```
