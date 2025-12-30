(function () {
  'use strict';
  let exitIntentShownCount = 0;
  let exitPopupActive = false;

  const exitPopupTexts = [
    'Не 1, а 2 бесплатных урока только для вас',
    'Дарим 2 бесплатных урока и скидку 10% на занятия',
    'Дарим 2 бесплатных урока и скидку 20% на занятия. Только никому!'
  ];

  function showMessage(text, type = 'error') {
    const msg = document.getElementById('exitformMessage');
    if (!msg) return;
    msg.textContent = text;
    msg.style.color = type === 'error' ? '#dc3545' : '#27ae60';
    msg.style.display = text ? 'block' : 'none';
  }

  async function onStepSubmit(form) {
    const submitBtn = form.querySelector('.twostep-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправляем...';
    }
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();

    let hasError = false;
    showMessage('', '');

    if (!validatePhone(phone)) {
      hasError = true;
      showMessage(
        'Введите корректный номер телефона (международный формат)',
        'error'
      );
    }
    if (!name) {
      hasError = true;
      showMessage('Введите имя', 'error');
    }
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      hasError = true;
      showMessage('Введите корректный email', 'error');
    }

    if (hasError) {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Завершить запись';
      }
      return;
    }

    const roistat_visit = window.getRoistatVisit();
    const fbclid = window.getFbclid();

    let idx = Math.min(exitIntentShownCount - 1, exitPopupTexts.length - 1);
    const dataToSend = {
      popupId: 'exit-popup',
      phone: phone,
      name: name,
      email: email,
      comment: exitPopupTexts[idx],
      site_url: window.location.href,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      roistat_visit: roistat_visit,
      fbclid: fbclid
    };

    const result = await sendWebhook(dataToSend, true);
    if (!result.success) {
      showMessage(result.error, 'error');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Записаться на пробный урок';
      }
      return;
    }

    showMessage('Заявка отправлена', 'success');
  }

  function showExitPopup(text) {
    if (exitPopupActive) return;
    exitPopupActive = true;

    // Create overlay
    let overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0,0,0,0.4)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = 9999;
    overlay.id = 'exit-popup-overlay';

    // Create popup window
    let popup = document.createElement('div');
    popup.style.background = '#fff';
    popup.style.padding = '28px 32px';
    popup.style.borderRadius = '12px';
    popup.style.boxShadow = '0 6px 32px rgba(0,0,0,0.18)';
    popup.style.maxWidth = '90vw';
    popup.style.minWidth = '280px';
    popup.style.textAlign = 'center';
    popup.style.position = 'relative';
    popup.style.color = '#000';

    popup.innerHTML = ` 
    <button class="twostep-close" type="button" aria-label="Закрыть">&times;</button>
    <div class="twostep-title" >Запишитесь на бесплатный пробный урок</div>
    <div style="margin-bottom:16px;display:flex;align-items:center;justify-content:center;min-height:150px;background: url('https://cdn.prod.website-files.com/63f482676a107eaf67dd8384/695286a389bec42232e07689_winter-banner.png') center/cover no-repeat; border-radius:12px;">
      <span style="padding:12px; font-size:28px; max-width:250px; font-weight:600;">${text}</span>
    </div>
    <div class="exitform-message" id="exitformMessage"></div>
    <form id="exitForm" autocomplete="off">
      <div class="twostep-field">
        <input id="twostep-phone"  type="text" class="twostep-input" name="phone" required autocomplete="off" maxlength="20" placeholder="+1 (999) 123-45-67">
      </div>
      <div class="twostep-field">
        <input id="twostep-name" type="text" class="twostep-input" name="name" required placeholder="Введите имя">
      </div>
        <div class="twostep-field">
        <input id="twostep-email" type="email" class="twostep-input" name="email" required placeholder="Введите email">
      </div>
      <div id="captcha-container" class="smart-captcha"></div>
      <button type="submit" class="twostep-submit">Записаться на урок</button>
       <div style="font-size:12px;color:#888;text-align:center;margin-top:12px;line-height:1.5;">
          Отправляя заявку, вы соглашаетесь с <a href="/privacy-policy" target="_blank" style="color:#27ae60;text-decoration:underline;">политикой конфиденциальности</a>.
        </div>
    </form>
  `;

    const hideModal = () => {
      document.body.removeChild(overlay);
      exitPopupActive = false;
    };
    popup.querySelector('.twostep-close').addEventListener('click', hideModal);
    overlay.appendChild(popup);

    overlay.onclick = function (e) {
      if (e.target === overlay) {
        hideModal();
      }
    };

    document.body.appendChild(overlay);

    let needSubmit = false;
    let captchaWidgetId;
    const form = document.getElementById('exitForm');

    if (window.smartCaptcha) {
      captchaWidgetId = window.smartCaptcha.render(
        document.getElementById('captcha-container'),
        {
          sitekey: 'ysc1_yQJE2tBPlg54Rx63YcJ1AhTlWZdU9yZSEwEr8N0y783e8894',
          callback: () => {
            if (needSubmit) onStepSubmit(form);
          }
        }
      );
      form['smart-token'].required = true;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (form['smart-token'].value) {
        onStepSubmit(form);
      } else {
        needSubmit = true;
        window.smartCaptcha.execute(captchaWidgetId);
      }
    });
  }

  async function sendWebhook(data, sendAnalyticsEvents) {
    var cookies = window.parseCookies();
    if (cookies.admitad_uid) data.admitad_uid = cookies.admitad_uid;
    if (cookies.salid) data.salid = cookies.salid;

    try {
      const response = await fetch(`https://webhook.progkids.com/webhook_v2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      let result = {};
      try {
        result = await response.json();
      } catch (e) {}
      if (!response.ok || (result && result.success === false)) {
        return {
          success: false,
          error: result.error || 'Ошибка отправки заявки. Попробуйте позже.'
        };
      }

      if (sendAnalyticsEvents) {
        window.sendAnalyticsEvents();
        window.sendLeadEvent();
      }

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: 'Ошибка отправки заявки. Попробуйте позже.'
      };
    }
  }

  function onExitIntent(e) {
    if (e.clientY > 20) return;
    if (exitPopupActive) return;

    let idx = Math.min(exitIntentShownCount, exitPopupTexts.length - 1);
    showExitPopup(exitPopupTexts[idx]);
    exitIntentShownCount++;

    document.removeEventListener('mouseleave', onExitIntent);
    setTimeout(() => {
      document.addEventListener('mouseleave', onExitIntent);
    }, 1500);
  }

  const subscribe = () => {
    setTimeout(function () {
      document.addEventListener('mouseout', onExitIntent);
    }, 300);
  };

  if (['complete', 'interactive'].includes(document.readyState)) {
    subscribe();
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      subscribe();
    });
  }
})();
