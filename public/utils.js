function sendLeadEvent() {
  if (typeof fbq === 'function') {
    fbq('track', 'Lead');
  }
}

// Функция для получения roistat_visit
function getRoistatVisit() {
  // 1. Из куки
  const match = document.cookie.match(/(?:^|; )roistat_visit=([^;]*)/);
  if (match) return decodeURIComponent(match[1]);
  // 2. Из URL ?roistat=...
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('roistat')) return urlParams.get('roistat');
  // 3. Из URL ?rs=...
  if (urlParams.get('rs')) return urlParams.get('rs');
  return '';
}

// Функция для получения fbclid
function getFbclid() {
  try {
    // 1. Из URL параметра fbclid
    const urlParams = new URLSearchParams(window.location.search);
    const fbclidFromQuery = urlParams.get('fbclid');
    if (fbclidFromQuery) {
      console.log('[FBCLID] Найден в query параметрах:', fbclidFromQuery);
      return fbclidFromQuery;
    }

    // 2. Из URL параметра fbclid в hash
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const fbclidFromHash = hashParams.get('fbclid');
    if (fbclidFromHash) {
      console.log('[FBCLID] Найден в hash параметрах:', fbclidFromHash);
      return fbclidFromHash;
    }

    // 3. Альтернативный способ - через regex
    const url = window.location.href;
    const fbclidMatch = url.match(/[?&]fbclid=([^&#]*)/);
    if (fbclidMatch && fbclidMatch[1]) {
      console.log('[FBCLID] Найден через regex:', fbclidMatch[1]);
      return decodeURIComponent(fbclidMatch[1]);
    }

    console.log('[FBCLID] Не найден в URL');
    console.log('[FBCLID] Текущий URL:', window.location.href);
    console.log('[FBCLID] Query параметры:', window.location.search);
    console.log('[FBCLID] Hash параметры:', window.location.hash);
    return '';
  } catch (error) {
    console.error('[FBCLID] Ошибка при извлечении fbclid:', error);
    return '';
  }
}

// Функция для отправки аналитических событий
function sendAnalyticsEvents() {
  if (typeof gtag === 'function') gtag('event', 'form_submit');
  if (typeof ym === 'function') ym(48800852, 'reachGoal', 'form_submit');
  if (typeof twq === 'function') twq('event', 'tw-pzuj8-pzujb', {});
  if (typeof _tmr !== 'undefined')
    _tmr.push({ type: 'reachGoal', id: 3498335, goal: 'lead' });
}

function parseCookies() {
  var cookies = {};
  var items = document.cookie.split(';');
  for (var i = 0; i < items.length; i++) {
    var parts = items[i].trim().split('=');
    var key = parts[0];
    var value = parts.slice(1).join('=');
    cookies[key] = value;
  }
  return cookies;
}

function validatePhone(phone) {
  if (window.libphonenumber) {
    try {
      const phoneUtil = window.libphonenumber.parsePhoneNumber(phone);
      if (!phoneUtil.isValid()) return false;
    } catch (e) {
      return false;
    }
  } else {
    if (!/^\+[\d\s\-\(\)]+$/.test(phone) || phone.replace(/\D/g, '').length < 8)
      return false;
  }
  return true;
}

window.sendLeadEvent = sendLeadEvent;
window.getRoistatVisit = getRoistatVisit;
window.getFbclid = getFbclid;
window.sendAnalyticsEvents = sendAnalyticsEvents;
window.parseCookies = parseCookies;
window.validatePhone = validatePhone;
