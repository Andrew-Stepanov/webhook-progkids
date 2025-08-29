(function () {
  'use strict';

  // РљРѕРЅС„РёРі РґР»СЏ РЅРѕРІРѕРіРѕ РїРѕРїР°РїР°
  const CONFIG = {
    popupId: 'call-me-2step', // РќРѕРІС‹Р№ СѓРЅРёРєР°Р»СЊРЅС‹Р№ popupId РґР»СЏ РґРІСѓС…СЌС‚Р°РїРЅРѕРіРѕ РїРѕРїР°РїР°
    serverUrl: 'https://popup.progkids.com',
    buttonColor: '#007bff',
    position: 'bottom-right'
  };

  function sendLeadEvent() {
    if (typeof fbq === 'function') {
      fbq('track', 'Lead');
    }
  }

  // --- РЎС‚РёР»Рё (РјРёРЅРёРјР°Р»СЊРЅРѕ РґР»СЏ РїСЂРёРјРµСЂР°, РјРѕР¶РЅРѕ РґРѕСЂР°Р±РѕС‚Р°С‚СЊ) ---
  const styles = `
      .twostep-popup-wrapper { position: fixed; bottom: 32px; right: 32px; z-index: 10000; }
      .twostep-popup-btn { width: 60px; height: 60px; border-radius: 50%; background: #27ae60; color: #fff; border: none; font-size: 28px; cursor: pointer; box-shadow: 0 4px 24px rgba(39,174,96,0.18); display: flex; align-items: center; justify-content: center; }
      .twostep-modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.62); z-index: 10000; display: none; }
      .twostep-modal-overlay.show { display: block; }
      .twostep-modal { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; display: none; align-items: center; justify-content: center; z-index: 10001; }
      .twostep-modal.show { display: flex; }
      .twostep-form { background: #fff; padding: 32px 28px 18px 28px; border-radius: 16px; box-shadow: 0 8px 32px rgba(39,174,96,0.13); max-width: 340px; width: 95vw; position: relative; font-family: 'Inter', 'Segoe UI', Arial, sans-serif; color: #222; }
      .twostep-close { position: absolute; top: 14px; right: 16px; background: none; border: none; font-size: 26px; color: #b0b0b0; cursor: pointer; }
      .twostep-title { font-size: 20px; font-weight: 700; margin-bottom: 18px; text-align: center; }
      .twostep-field { margin-bottom: 15px; }
      .twostep-input { width: 100%; padding: 12px 13px; border: 1.5px solid #e2e8f0; border-radius: 7px; font-size: 16px; background: #f8fafc; color: black; }
      .twostep-input.error { border-color: #dc3545; background: #fff0f3; }
      .twostep-submit { width: 100%; padding: 14px 0; background: #27ae60; color: #fff; border: none; border-radius: 7px; font-size: 17px; font-weight: 600; cursor: pointer; }
      .twostep-message { padding: 13px; border-radius: 7px; margin-bottom: 14px; text-align: center; font-weight: 500; font-size: 15px; display: none; }
      .twostep-message.success { background: #e6f7ed; color: #227a4d; border: 1px solid #b7e2c7; display: block; }
      .twostep-message.error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; display: block; }
      .twostep-success-block { text-align: center; margin: 0 0 18px 0; }
      .twostep-success-thank { color: #27ae60; font-size: 22px; font-weight: 800; margin-top: 10px; margin-bottom: 8px; }
      .twostep-success-desc { color: #888; font-size: 15px; font-weight: 500; margin-bottom: 10px; }
    `;

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = styles;
    document.head.appendChild(style);
  }

  function loadLibPhoneNumber(callback) {
    if (window.libphonenumber) return callback();
    const script = document.createElement('script');
    script.src = 'https://popup.progkids.com/libphonenumber-max.js';
    script.onload = callback;
    script.onerror = () => {
      console.error(
        '[TwoStepPopup] РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ libphonenumber-js'
      );
    };
    document.body.appendChild(script);
  }

  // --- UI ---
  function createOverlay() {
    let overlay = document.querySelector('.twostep-modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'twostep-modal-overlay';
      document.body.appendChild(overlay);
    }
    overlay.addEventListener('click', hideModal);
    return overlay;
  }

  function createModal() {
    if (document.querySelector('.twostep-modal')) return;
    const modal = document.createElement('div');
    modal.className = 'twostep-modal';
    modal.innerHTML = `
        <div class="twostep-form" id="twostepFormContainer"></div>
      `;
    document.body.appendChild(modal);
    return modal;
  }

  function showModal() {
    const modal = document.querySelector('.twostep-modal');
    const overlay = document.querySelector('.twostep-modal-overlay');
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
    if (overlay) {
      overlay.classList.add('show');
    }
    renderStep1();
  }

  function hideModal() {
    const modal = document.querySelector('.twostep-modal');
    const overlay = document.querySelector('.twostep-modal-overlay');
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
      renderStep1();
    }
    if (overlay) {
      overlay.classList.remove('show');
    }
  }

  // --- State ---
  let savedPhone = '';
  let savedPage = '';
  let savedTimezone = '';

  // РЈРЅРёРІРµСЂСЃР°Р»СЊРЅР°СЏ С„СѓРЅРєС†РёСЏ РѕС‚РїСЂР°РІРєРё webhook
  async function sendWebhook(data) {
    try {
      const response = await fetch(`${CONFIG.serverUrl}/api/webhook`, {
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
          error:
            result.error ||
            'РћС€РёР±РєР° РѕС‚РїСЂР°РІРєРё Р·Р°СЏРІРєРё. РџРѕРїСЂРѕР±СѓР№С‚Рµ РїРѕР·Р¶Рµ.'
        };
      }
      if (typeof gtag === 'function') gtag('event', 'form_submit');
      if (typeof ym === 'function') ym(48800852, 'reachGoal', 'form_submit');
      if (typeof twq === 'function') twq('event', 'tw-pzuj8-pzujb', {});
      if (typeof _tmr !== 'undefined')
        _tmr.push({ type: 'reachGoal', id: 3498335, goal: 'lead' });
      sendLeadEvent();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error:
          'РћС€РёР±РєР° РѕС‚РїСЂР°РІРєРё Р·Р°СЏРІРєРё. РџРѕРїСЂРѕР±СѓР№С‚Рµ РїРѕР·Р¶Рµ.'
      };
    }
  }

  // Р¤СѓРЅРєС†РёСЏ РґР»СЏ РїРѕР»СѓС‡РµРЅРёСЏ roistat_visit (РєР°Рє РІ popup.js)
  function getRoistatVisit() {
    // 1. РР· РєСѓРєРё
    const match = document.cookie.match(/(?:^|; )roistat_visit=([^;]*)/);
    if (match) return decodeURIComponent(match[1]);
    // 2. РР· URL ?roistat=...
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('roistat')) return urlParams.get('roistat');
    // 3. РР· URL ?rs=...
    if (urlParams.get('rs')) return urlParams.get('rs');
    return '';
  }

  // Р¤СѓРЅРєС†РёСЏ РґР»СЏ РїРѕР»СѓС‡РµРЅРёСЏ fbclid
  function getFbclid() {
    try {
      // 1. РР· URL РїР°СЂР°РјРµС‚СЂР° fbclid
      const urlParams = new URLSearchParams(window.location.search);
      const fbclidFromQuery = urlParams.get('fbclid');
      if (fbclidFromQuery) {
        console.log(
          '[FBCLID] РќР°Р№РґРµРЅ РІ query РїР°СЂР°РјРµС‚СЂР°С…:',
          fbclidFromQuery
        );
        return fbclidFromQuery;
      }

      // 2. РР· URL РїР°СЂР°РјРµС‚СЂР° fbclid РІ hash
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const fbclidFromHash = hashParams.get('fbclid');
      if (fbclidFromHash) {
        console.log(
          '[FBCLID] РќР°Р№РґРµРЅ РІ hash РїР°СЂР°РјРµС‚СЂР°С…:',
          fbclidFromHash
        );
        return fbclidFromHash;
      }

      // 3. РђР»СЊС‚РµСЂРЅР°С‚РёРІРЅС‹Р№ СЃРїРѕСЃРѕР± - С‡РµСЂРµР· regex
      const url = window.location.href;
      const fbclidMatch = url.match(/[?&]fbclid=([^&#]*)/);
      if (fbclidMatch && fbclidMatch[1]) {
        console.log('[FBCLID] РќР°Р№РґРµРЅ С‡РµСЂРµР· regex:', fbclidMatch[1]);
        return decodeURIComponent(fbclidMatch[1]);
      }

      console.log('[FBCLID] РќРµ РЅР°Р№РґРµРЅ РІ URL');
      console.log('[FBCLID] РўРµРєСѓС‰РёР№ URL:', window.location.href);
      console.log('[FBCLID] Query РїР°СЂР°РјРµС‚СЂС‹:', window.location.search);
      console.log('[FBCLID] Hash РїР°СЂР°РјРµС‚СЂС‹:', window.location.hash);
      return '';
    } catch (error) {
      console.error(
        '[FBCLID] РћС€РёР±РєР° РїСЂРё РёР·РІР»РµС‡РµРЅРёРё fbclid:',
        error
      );
      return '';
    }
  }

  // --- Step 1 ---
  // Р”РёРЅР°РјРёС‡РµСЃРєРёР№ social proof (С„РёРєСЃРёСЂРѕРІР°РЅРЅС‹Р№ РЅР° РґРµРЅСЊ)
  function seededRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }
  function getLeadsCountToday() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = now.getMonth() + 1;
    const dd = now.getDate();
    const daySeed = yyyy * 10000 + mm * 100 + dd;
    // Р”РёР°РїР°Р·РѕРЅС‹
    const min = 30,
      max = 60; // СЃС‚Р°СЂС‚РѕРІРѕРµ
    const minEnd = 150,
      maxEnd = 220; // С„РёРЅР°Р»СЊРЅРѕРµ
    // Р”РµС‚РµСЂРјРёРЅРёСЂРѕРІР°РЅРЅРѕ РґР»СЏ РґРЅСЏ
    const start = Math.round(min + (max - min) * seededRandom(daySeed));
    const end = Math.round(
      minEnd + (maxEnd - minEnd) * seededRandom(daySeed + 1)
    );
    // Р’СЂРµРјСЏ
    const startHour = 0,
      endHour = 23 + 59 / 60;
    const currentHour = now.getHours() + now.getMinutes() / 60;
    if (currentHour < startHour) return start;
    if (currentHour > endHour) return end;
    // Р›РёРЅРµР№РЅС‹Р№ СЂРѕСЃС‚
    const progress = (currentHour - startHour) / (endHour - startHour);
    const count = Math.round(start + (end - start) * progress);
    return count;
  }

  function renderStep1() {
    const container = document.getElementById('twostepFormContainer');
    if (!container) return;
    container.innerHTML = `
        <button class="twostep-close" type="button" aria-label="Р—Р°РєСЂС‹С‚СЊ">&times;</button>
        <div class="twostep-title">Р—Р°РїРёС€РёС‚РµСЃСЊ РЅР° Р±РµСЃРїР»Р°С‚РЅС‹Р№ РїСЂРѕР±РЅС‹Р№ СѓСЂРѕРє</div>
        <div class="twostep-message" id="twostepMessage1"></div>
        <form id="twostepForm1" autocomplete="off">
          <div class="twostep-field">
            <label for="twostep-phone" style="font-size:15px;font-weight:500;display:block;margin-bottom:6px;">Р’Р°С€ С‚РµР»РµС„РѕРЅ</label>
            <input id="twostep-phone" type="text" class="twostep-input" name="phone" required autocomplete="off" maxlength="20" placeholder="+1 (999) 123-45-67">
          </div>
          <button type="submit" class="twostep-submit">Р—Р°РїРёСЃР°С‚СЊСЃСЏ РЅР° РїСЂРѕР±РЅС‹Р№ СѓСЂРѕРє</button>
          <div style="font-size:12px;color:#888;text-align:center;margin-top:12px;line-height:1.5;">
            РћС‚РїСЂР°РІР»СЏСЏ Р·Р°СЏРІРєСѓ, РІС‹ СЃРѕРіР»Р°С€Р°РµС‚РµСЃСЊ СЃ <a href="/privacy-policy" target="_blank" style="color:#27ae60;text-decoration:underline;">РїРѕР»РёС‚РёРєРѕР№ РєРѕРЅС„РёРґРµРЅС†РёР°Р»СЊРЅРѕСЃС‚Рё</a>.
          </div>
        </form>
        <div class="twostep-social-proof" style="margin-top:18px;font-size:13px;color:#27ae60;text-align:center;">
          РЈР¶Рµ <span id="twostep-leads-count"></span> СЂРѕРґРёС‚РµР»РµР№ Р·Р°РїРёСЃР°Р»РёСЃСЊ СЃРµРіРѕРґРЅСЏ
        </div>
      `;
    container
      .querySelector('.twostep-close')
      .addEventListener('click', hideModal);
    document
      .getElementById('twostepForm1')
      .addEventListener('submit', onStep1Submit);
    // РћР±РЅРѕРІРёС‚СЊ social proof
    const leadsCount = getLeadsCountToday();
    const leadsCountEl = document.getElementById('twostep-leads-count');
    if (leadsCountEl) leadsCountEl.textContent = leadsCount;
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
      if (
        !/^\+[\d\s\-\(\)]+$/.test(phone) ||
        phone.replace(/\D/g, '').length < 8
      )
        return false;
    }
    return true;
  }

  function showMessage1(text, type = 'error') {
    const msg = document.getElementById('twostepMessage1');
    if (!msg) return;
    msg.textContent = text;
    msg.className = `twostep-message ${type}`;
    msg.style.display = 'block';
  }

  async function onStep1Submit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('.twostep-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'РћС‚РїСЂР°РІР»СЏРµРј...';
    }
    const phone = form.phone.value.trim();
    if (!validatePhone(phone)) {
      showMessage1(
        'Р’РІРµРґРёС‚Рµ РєРѕСЂСЂРµРєС‚РЅС‹Р№ РЅРѕРјРµСЂ С‚РµР»РµС„РѕРЅР° (РјРµР¶РґСѓРЅР°СЂРѕРґРЅС‹Р№ С„РѕСЂРјР°С‚)',
        'error'
      );
      form.phone.classList.add('error');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent =
          'Р—Р°РїРёСЃР°С‚СЊСЃСЏ РЅР° РїСЂРѕР±РЅС‹Р№ СѓСЂРѕРє';
      }
      return;
    }
    form.phone.classList.remove('error');
    showMessage1('', '');
    // РЎРѕС…СЂР°РЅСЏРµРј С‚РµР»РµС„РѕРЅ Рё РёРЅС„Рѕ
    savedPhone = phone;
    savedPage = window.location.href;
    savedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const roistat_visit = getRoistatVisit();
    const fbclid = getFbclid();
    // РћС‚РїСЂР°РІР»СЏРµРј РїРµСЂРІС‹Р№ СЌС‚Р°Рї (С‚РѕР»СЊРєРѕ С‚РµР»РµС„РѕРЅ, СЃС‚СЂР°РЅРёС†Р°, С‚Р°Р№РјР·РѕРЅР°, roistat_visit, fbclid)
    const result = await sendWebhook({
      popupId: CONFIG.popupId,
      phone: phone,
      site_url: savedPage,
      timezone: savedTimezone,
      roistat_visit: roistat_visit,
      fbclid: fbclid
    });
    if (!result.success) {
      showMessage1(result.error, 'error');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent =
          'Р—Р°РїРёСЃР°С‚СЊСЃСЏ РЅР° РїСЂРѕР±РЅС‹Р№ СѓСЂРѕРє';
      }
      return;
    }
    // РџРµСЂРµС…РѕРґРёРј РєРѕ РІС‚РѕСЂРѕРјСѓ СЌС‚Р°РїСѓ С‚РѕР»СЊРєРѕ РµСЃР»Рё РІСЃС‘ РѕРє
    renderStep2();
  }

  // --- Step 2 ---
  function renderStep2() {
    const container = document.getElementById('twostepFormContainer');
    if (!container) return;
    container.innerHTML = `
        <button class="twostep-close" type="button" aria-label="Р—Р°РєСЂС‹С‚СЊ">&times;</button>
        <div class="twostep-title">РџР°СЂСѓ СѓС‚РѕС‡РЅСЏСЋС‰РёС… РІРѕРїСЂРѕСЃРѕРІ</div>
        <div class="twostep-message" id="twostepMessage2"></div>
        <form id="twostepForm2" autocomplete="off">
          <div class="twostep-field">
            <label for="twostep-name" style="font-size:15px;font-weight:500;display:block;margin-bottom:6px;">Р’Р°С€Рµ РёРјСЏ</label>
            <input id="twostep-name" type="text" class="twostep-input" name="name" required placeholder="Р’РІРµРґРёС‚Рµ РёРјСЏ">
          </div>
          <div class="twostep-field">
            <label for="twostep-email" style="font-size:15px;font-weight:500;display:block;margin-bottom:6px;">Email РґР»СЏ РїРѕРґС‚РІРµСЂР¶РґРµРЅРёСЏ</label>
            <input id="twostep-email" type="email" class="twostep-input" name="email" required placeholder="Р’РІРµРґРёС‚Рµ email">
          </div>
          <div class="twostep-field">
            <label for="twostep-age" style="font-size:15px;font-weight:500;display:block;margin-bottom:6px;">РЎРєРѕР»СЊРєРѕ Р»РµС‚ СЂРµР±С‘РЅРєСѓ?</label>
            <input id="twostep-age" type="number" class="twostep-input" name="child_age" required min="1" max="25" placeholder="Р’РѕР·СЂР°СЃС‚ СЂРµР±С‘РЅРєР°">
          </div>
          <div class="twostep-field">
            <label for="twostep-calltime" style="font-size:15px;font-weight:500;display:block;margin-bottom:6px;">РљРѕРіРґР° РІР°Рј СѓРґРѕР±РЅРѕ РїРѕРіРѕРІРѕСЂРёС‚СЊ?</label>
            <select id="twostep-calltime" class="twostep-input" name="call_time" required style="width:100%">
              <option value="" disabled selected>Р’С‹Р±РµСЂРёС‚Рµ РІСЂРµРјСЏ</option>
              <option value="9:00вЂ“12:00">9:00вЂ“12:00</option>
              <option value="12:00вЂ“15:00">12:00вЂ“15:00</option>
              <option value="15:00вЂ“18:00">15:00вЂ“18:00</option>
              <option value="18:00вЂ“21:00">18:00вЂ“21:00</option>
              <option value="Р’ Р»СЋР±РѕРµ РІСЂРµРјСЏ">Р’ Р»СЋР±РѕРµ РІСЂРµРјСЏ</option>
            </select>
          </div>
          <button type="submit" class="twostep-submit">Р—Р°РІРµСЂС€РёС‚СЊ Р·Р°РїРёСЃСЊ</button>
        </form>
      `;
    container
      .querySelector('.twostep-close')
      .addEventListener('click', hideModal);
    document
      .getElementById('twostepForm2')
      .addEventListener('submit', onStep2Submit);
  }

  function showMessage2(text, type = 'error') {
    const msg = document.getElementById('twostepMessage2');
    if (!msg) return;
    msg.textContent = text;
    msg.className = `twostep-message ${type}`;
    msg.style.display = 'block';
  }

  async function onStep2Submit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('.twostep-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'РћС‚РїСЂР°РІР»СЏРµРј...';
    }
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const child_age = form.child_age.value.trim();
    const call_time = form.call_time.value.trim();
    let hasError = false;
    if (!name) {
      showMessage2('Р’РІРµРґРёС‚Рµ РёРјСЏ', 'error');
      form.name.classList.add('error');
      hasError = true;
    }
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      showMessage2('Р’РІРµРґРёС‚Рµ РєРѕСЂСЂРµРєС‚РЅС‹Р№ email', 'error');
      form.email.classList.add('error');
      hasError = true;
    }
    if (!child_age || isNaN(child_age) || child_age < 1 || child_age > 25) {
      showMessage2(
        'Р’РІРµРґРёС‚Рµ РІРѕР·СЂР°СЃС‚ СЂРµР±РµРЅРєР° РѕС‚ 1 РґРѕ 25',
        'error'
      );
      form.child_age.classList.add('error');
      hasError = true;
    }
    if (!call_time) {
      showMessage2(
        'Р’С‹Р±РµСЂРёС‚Рµ СѓРґРѕР±РЅРѕРµ РІСЂРµРјСЏ РґР»СЏ Р·РІРѕРЅРєР°',
        'error'
      );
      form.call_time.classList.add('error');
      hasError = true;
    }
    if (hasError) {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Р—Р°РІРµСЂС€РёС‚СЊ Р·Р°РїРёСЃСЊ';
      }
      return;
    }
    form.name.classList.remove('error');
    form.email.classList.remove('error');
    form.child_age.classList.remove('error');
    form.call_time.classList.remove('error');
    showMessage2('', '');
    const roistat_visit = getRoistatVisit();
    const fbclid = getFbclid();
    // Р¤РѕСЂРјРёСЂСѓРµРј comment
    const comment = `Р’РѕР·СЂР°СЃС‚ СЂРµР±С‘РЅРєР°: ${child_age}, РЈРґРѕР±РЅРѕРµ РІСЂРµРјСЏ РґР»СЏ Р·РІРѕРЅРєР°: ${call_time}, Р§Р°СЃРѕРІРѕР№ РїРѕСЏСЃ: ${savedTimezone}`;
    // Р›РѕРіРёСЂСѓРµРј РѕС‚РїСЂР°РІР»СЏРµРјС‹Рµ РґР°РЅРЅС‹Рµ
    const dataToSend = {
      popupId: CONFIG.popupId,
      phone: savedPhone,
      name: name,
      email: email,
      child_age: child_age,
      call_time: call_time,
      comment: comment,
      site_url: savedPage,
      timezone: savedTimezone,
      roistat_visit: roistat_visit,
      fbclid: fbclid
    };
    console.log(
      '[popup2.js] РћС‚РїСЂР°РІРєР° РґР°РЅРЅС‹С… РІС‚РѕСЂРѕРіРѕ СЌС‚Р°РїР°:',
      dataToSend
    );
    // РћС‚РїСЂР°РІР»СЏРµРј РІС‚РѕСЂРѕР№ СЌС‚Р°Рї (РІСЃРµ РїРѕР»СЏ)
    const result = await sendWebhook(dataToSend);
    if (!result.success) {
      showMessage2(result.error, 'error');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Р—Р°РІРµСЂС€РёС‚СЊ Р·Р°РїРёСЃСЊ';
      }
      return;
    }
    // РџРѕРєР°Р·С‹РІР°РµРј СѓСЃРїРµС…
    renderSuccess();
  }

  function renderSuccess() {
    const container = document.getElementById('twostepFormContainer');
    if (!container) return;
    container.innerHTML = `
        <div class="twostep-success-block">
          <div class="twostep-success-thank" style="color:#27ae60;font-size:22px;font-weight:800;margin-top:10px;margin-bottom:8px;">Р—Р°СЏРІРєР° РїСЂРёРЅСЏС‚Р°!</div>
          <div class="twostep-success-desc" style="margin-bottom:10px;color:#444;font-size:16px;">РњРµРЅРµРґР¶РµСЂ СЃРєРѕСЂРѕ СЃРІСЏР¶РµС‚СЃСЏ СЃ РІР°РјРё.</div>
          <div style="font-size:15px;color:#222;margin-bottom:10px;">РњС‹ РїРѕР·РІРѕРЅРёРј РІР°Рј РЅР° РЅРѕРјРµСЂ:<br><b>${savedPhone}</b></div>
          <div style="font-size:15px;color:#222;margin-bottom:10px;">Р’С‹ С‚Р°РєР¶Рµ РјРѕР¶РµС‚Рµ РЅР°РїРёСЃР°С‚СЊ РЅР°Рј РїСЂСЏРјРѕ СЃРµР№С‡Р°СЃ:</div>
          <div style="display:flex;gap:12px;justify-content:center;margin-bottom:18px;">
            <a href="https://t.me/schoolprogkids" target="_blank" class="messenger-btn messenger-telegram">
              <span class="messenger-icon"> <svg width="20" height="20" viewBox="0 0 240 240" fill="none"><circle cx="120" cy="120" r="120" fill="#229ED9"/><path d="M180 72L60 120l36 12 12 36 18-24 30 24 24-96z" fill="#fff"/></svg> </span>
              <span>Telegram</span>
            </a>
            <a href="https://api.whatsapp.com/send/?phone=18143511030" target="_blank" class="messenger-btn messenger-whatsapp">
              <span class="messenger-icon"> <svg width="20" height="20" viewBox="0 0 240 240" fill="none"><circle cx="120" cy="120" r="120" fill="#25D366"/><path d="M180 120c0-33.137-26.863-60-60-60s-60 26.863-60 60c0 10.137 2.637 19.663 7.263 27.863L60 180l32.137-7.263C100.337 177.363 109.863 180 120 180c33.137 0 60-26.863 60-60z" fill="#fff"/></svg> </span>
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
        <button class="twostep-submit" onclick="window.location.reload()">Р—Р°РєСЂС‹С‚СЊ</button>
        <style>
          .messenger-btn {
            display: flex;
            align-items: center;
            gap: 7px;
            border-radius: 22px;
            padding: 8px 18px;
            font-size: 15px;
            font-weight: 600;
            text-decoration: none;
            transition: background 0.18s, box-shadow 0.18s, transform 0.18s;
            box-shadow: 0 2px 8px rgba(39,174,96,0.08);
            outline: none;
            border: none;
            cursor: pointer;
            min-width: 0;
          }
          .messenger-telegram {
            background: #229ED9;
            color: #fff;
          }
          .messenger-whatsapp {
            background: #25D366;
            color: #fff;
          }
          .messenger-btn:hover, .messenger-btn:focus {
            filter: brightness(1.08);
            box-shadow: 0 4px 16px rgba(39,174,96,0.13);
            transform: translateY(-2px) scale(1.04);
            text-decoration: none;
          }
          .messenger-icon {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        </style>
      `;
  }

  // --- Init ---
  function init() {
    injectStyles();
    createOverlay();
    createModal();
    loadLibPhoneNumber(() => {});
    // Р”РµР»Р°РµРј showModal РіР»РѕР±Р°Р»СЊРЅРѕР№ РґР»СЏ РІС‹Р·РѕРІР° РёР· Webflow
    window.openTrialPopup = showModal;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
