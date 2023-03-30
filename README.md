# webhook-progkids

# Код который нужно разместить перед </body> в WebFlow
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
