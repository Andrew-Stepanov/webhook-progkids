(function () {
  'use strict';

  // Configuration
  const CONFIG = {
    popupId: 'call-me-button',
    serverUrl: 'https://popup.progkids.com', // <-- С„РёРєСЃРёСЂСѓРµРј Р°РґСЂРµСЃ
    buttonColor: '#007bff',
    position: 'bottom-left'
  };

  function sendLeadEvent() {
    if (typeof fbq === 'function') {
      fbq('track', 'Lead');
    }
  }

  // CSS styles
  const styles = `
      .callback-button-wrapper {
        position: fixed !important;
        bottom: 32px !important;
        left: 32px !important;
        display: flex;
        align-items: center;
        z-index: 10000;
      }
      .callback-button {
        position: static !important;
        width: 60px;
        height: 60px;
        background: #27ae60;
        border-radius: 50%;
        border: none;
        color: #fff;
        font-size: 28px;
        cursor: pointer;
        box-shadow: 0 4px 24px rgba(39,174,96,0.18);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: box-shadow 0.18s, background 0.18s, transform 0.18s;
        animation: pulse 1.5s infinite;
        padding: 0;
        font-weight: 700;
        margin-right: 16px;
      }
      .callback-button-label {
        background: #222;
        color: #fff;
        padding: 6px 13px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 700;
        box-shadow: 0 4px 16px rgba(39,174,96,0.13);
        letter-spacing: 0.01em;
        user-select: none;
        pointer-events: auto;
        display: block;
        line-height: 1.18;
        text-align: left;
        border: none;
        cursor: pointer;
        outline: none;
        transition: background 0.18s, color 0.18s;
      }
      .callback-button-label:active, .callback-button-label:focus {
        background: #333;
        color: #27ae60;
      }
      .callback-button-label span { display: block; }
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(39,174,96,0.18); }
        70% { box-shadow: 0 0 0 12px rgba(39,174,96,0.08); }
        100% { box-shadow: 0 0 0 0 rgba(39,174,96,0.18); }
      }
      .callback-button[title]:hover:after { display: none; }
      .callback-button:hover {
        background: #219150;
        box-shadow: 0 8px 32px rgba(39,174,96,0.22);
        transform: scale(1.07);
      }
      .callback-overlay {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background: rgba(0,0,0,0.62) !important;
        z-index: 10000 !important;
        opacity: 1 !important;
        transition: opacity 0.2s;
        pointer-events: auto !important;
        display: none;
      }
      .callback-overlay.show { display: block; }
      .callback-modal {
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.45);
        z-index: 10001;
        display: none;
        align-items: center;
        justify-content: center;
        animation: fadeInBg 0.2s;
      }
      .callback-modal.show { display: flex; }
      @keyframes fadeInBg { from { background: rgba(0,0,0,0); } to { background: rgba(0,0,0,0.18); } }
      .callback-form {
        background: #fff;
        padding: 32px 28px 18px 28px;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(39,174,96,0.13);
        max-width: 340px;
        width: 95vw;
        position: relative;
        font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
        animation: popupIn 0.22s cubic-bezier(.68,-0.55,.27,1.55);
        color: #222;
      }
      @keyframes popupIn { from { transform: scale(0.95) translateY(30px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
      .callback-close {
        position: absolute;
        top: 14px;
        right: 16px;
        background: none;
        border: none;
        font-size: 26px;
        color: #b0b0b0;
        cursor: pointer;
        transition: color 0.18s, background 0.18s, transform 0.18s;
        z-index: 2;
        line-height: 1;
        padding: 0 6px;
        border-radius: 50%;
        outline: none;
      }
      .callback-close:hover {
        color: #27ae60;
        background: #f0f6ff;
        transform: scale(1.13);
      }
      .callback-title {
        font-size: 20px;
        font-weight: 700;
        margin-bottom: 18px;
        text-align: center;
        color: #222;
        letter-spacing: 0.01em;
      }
      .callback-subtitle {
        font-size: 15px;
        color: #27ae60;
        text-align: center;
        margin-bottom: 18px;
        font-weight: 500;
      }
      .callback-field { margin-bottom: 15px; }
      .callback-label { display: none; }
      .callback-input {
        width: 100%;
        padding: 12px 13px;
        border: 1.5px solid #e2e8f0;
        border-radius: 7px;
        font-size: 16px;
        transition: border-color 0.18s, background 0.18s;
        box-sizing: border-box;
        background: #f8fafc;
        font-family: inherit;
        color: black;
      }
      .callback-input:focus {
        outline: none;
        border-color: #27ae60;
        background: #fff;
      }
      .callback-input.error {
        border-color: #dc3545;
        background: #fff0f3;
      }
      .callback-submit {
        width: 100%;
        padding: 14px 0;
        background: #27ae60;
        color: #fff;
        border: none;
        border-radius: 7px;
        font-size: 17px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.18s, box-shadow 0.18s, transform 0.18s;
        box-shadow: 0 2px 8px rgba(39,174,96,0.08);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        letter-spacing: 0.01em;
        font-family: inherit;
      }
      .callback-submit:hover {
        background: #219150;
        transform: scale(1.03);
        box-shadow: 0 4px 16px rgba(39,174,96,0.13);
      }
      .callback-submit:disabled {
        background: #b5e6c9;
        cursor: not-allowed;
        color: #fff;
        opacity: 0.7;
      }
      .callback-message {
        padding: 13px;
        border-radius: 7px;
        margin-bottom: 14px;
        text-align: center;
        font-weight: 500;
        font-size: 15px;
      }
      .callback-message.success {
        background: #e6f7ed;
        color: #227a4d;
        border: 1px solid #b7e2c7;
      }
      .callback-message.error {
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
      }
      .callback-error {
        color: #dc3545;
        font-size: 14px;
        margin-top: 5px;
        display: none;
      }
      .callback-privacy {
        font-size: 12px;
        color: #888;
        text-align: center;
        margin-top: 10px;
        margin-bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
      }
      .callback-privacy svg {
        width: 14px;
        height: 14px;
        margin-right: 3px;
        color: #27ae60;
        flex-shrink: 0;
      }
      .callback-social-proof-min {
        font-size: 11px;
        color: #b0b0b0;
        text-align: center;
        margin-top: 18px;
        margin-bottom: 0;
        display: block;
      }
      .callback-form,
      .callback-title,
      .callback-label,
      .callback-subtitle,
      .callback-message,
      .callback-privacy {
        color: #222 !important;
      }
      .callback-submit {
        color: #fff !important;
      }
      .callback-form input,
      .callback-form input:focus,
      .callback-form input[type="text"],
      .callback-form input[type="tel"] {
        color: #222 !important;
        background: #fff !important;
        font: 16px 'Inter', 'Segoe UI', Arial, sans-serif !important;
        caret-color: #222 !important;
        border: 1.5px solid #e2e8f0 !important;
        box-shadow: none !important;
      }
      .callback-livefeed {
        position: absolute;
        top: -18px;
        left: 0;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        pointer-events: none;
        z-index: 10;
      }
      .callback-livefeed-msg {
        background: #fff;
        color: #222;
        border-radius: 14px;
        box-shadow: 0 2px 12px rgba(39,174,96,0.13);
        padding: 9px 18px;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 7px;
        opacity: 0;
        transform: translateY(-10px) scale(0.98);
        animation: livefeedIn 0.5s forwards, livefeedOut 0.5s 3.5s forwards;
        display: flex;
        align-items: center;
        gap: 7px;
      }
      @keyframes livefeedIn {
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes livefeedOut {
        to { opacity: 0; transform: translateY(-10px) scale(0.98); }
      }
      .callback-livefeed-global {
        position: fixed;
        left: 0;
        right: 0;
        top: 8vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 10002;
        pointer-events: none;
      }
      .callback-livefeed-msg {
        background: #fff;
        color: #222;
        border-radius: 14px;
        box-shadow: 0 2px 12px rgba(39,174,96,0.13);
        padding: 9px 18px;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 7px;
        opacity: 0;
        transform: translateY(-10px) scale(0.98);
        animation: livefeedIn 0.5s forwards, livefeedOut 0.5s 3.5s forwards;
        display: flex;
        align-items: center;
        gap: 7px;
      }
      @keyframes livefeedIn {
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes livefeedOut {
        to { opacity: 0; transform: translateY(-10px) scale(0.98); }
      }
      .callback-social-proof-min {
        font-size: 15px;
        color: #27ae60;
        text-align: center;
        margin-top: 18px;
        margin-bottom: 0;
        display: block;
        font-weight: 700;
        letter-spacing: 0.01em;
      }
      .callback-privacy {
        font-size: 11px;
        color: #b0b0b0;
        text-align: center;
        margin-top: 18px;
        margin-bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
      }
      .callback-privacy svg {
        width: 14px;
        height: 14px;
        margin-right: 3px;
        color: #27ae60;
        flex-shrink: 0;
      }
      .callback-success-block {
        text-align: center;
        margin: 0 0 18px 0;
      }
      .callback-success-thank {
        color: #27ae60;
        font-size: 22px;
        font-weight: 800;
        margin-top: 10px;
        margin-bottom: 8px;
      }
      .callback-success-desc {
        color: #888;
        font-size: 15px;
        font-weight: 500;
        margin-bottom: 10px;
      }
      .callback-success-phone {
        color: #27ae60;
        font-size: 24px;
        font-weight: 800;
        margin-bottom: 18px;
        margin-top: 8px;
        letter-spacing: 0.02em;
      }
      .callback-social-proof-min {
        font-size: 15px;
        color: #27ae60;
        font-weight: 700;
        margin-bottom: 12px;
      }
      .callback-privacy {
        font-size: 11px;
        color: #b0b0b0;
        text-align: center;
        margin-top: 18px;
        margin-bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
      }
      .callback-privacy svg {
        width: 14px;
        height: 14px;
        margin-right: 3px;
        color: #27ae60;
        flex-shrink: 0;
      }
      @media (max-width: 480px) {
        .callback-livefeed-global {
          padding-left: 12px;
          padding-right: 12px;
        }
      }
      .callback-spinner {
        display: inline-block;
        width: 18px;
        height: 18px;
        border: 2.5px solid #fff;
        border-top: 2.5px solid #27ae60;
        border-radius: 50%;
        animation: callback-spin 0.7s linear infinite;
        margin-right: 8px;
        vertical-align: middle;
      }
      @keyframes callback-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .callback-phone-success {
        text-align: center;
        font-size: 17px;
        color: #27ae60;
        font-weight: 600;
        margin-bottom: 18px;
        margin-top: 10px;
        letter-spacing: 0.01em;
        word-break: break-all;
      }
      .callback-phone-success-thank {
        color: #27ae60;
        font-size: 20px;
        font-weight: 700;
        display: block;
        margin-bottom: 2px;
      }
      .callback-phone-success-desc {
        color: #27ae60;
        font-size: 16px;
        font-weight: 500;
        display: block;
        margin-bottom: 7px;
      }
      .callback-phone-number {
        display: block;
        color: #27ae60;
        font-size: 22px;
        font-weight: 700;
        margin-top: 7px;
        margin-bottom: 0;
        letter-spacing: 0.01em;
        word-break: break-all;
      }
      .callback-button-text {
        display: none;
      }
      .callback-button-tooltip {
        position: absolute;
        left: 70px;
        bottom: 50%;
        transform: translateY(50%);
        background: #222;
        color: #fff;
        padding: 8px 16px;
        border-radius: 8px;
        white-space: nowrap;
        font-size: 15px;
        font-weight: 600;
        z-index: 10001;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.18s, transform 0.18s;
        box-shadow: 0 4px 16px rgba(39,174,96,0.13);
      }
      .callback-button:hover + .callback-button-tooltip {
        opacity: 1;
        transform: translateY(50%) scale(1.04);
        pointer-events: auto;
      }
      @media (max-width: 600px) {
        .callback-button-wrapper {
          left: 16px !important;
          bottom: 30px !important;
        }
        .callback-button {
          width: 44px;
          height: 44px;
          font-size: 18px;
          margin-right: 7px;
        }
        .callback-button-label {
          font-size: 12.5px;
          padding: 5px 8px;
          border-radius: 8px;
        }
      }
    `;

  // Create and inject styles
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = styles;
    document.head.appendChild(style);
  }

  // РџРѕРґРєР»СЋС‡РµРЅРёРµ libphonenumber-js Р»РѕРєР°Р»СЊРЅРѕ
  function loadLibPhoneNumber(callback) {
    if (window.libphonenumber) return callback();
    const script = document.createElement('script');
    script.src = 'https://popup.progkids.com/libphonenumber-max.js';
    script.onload = callback;
    script.onerror = () => {
      console.error(
        '[Callback Popup] РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ libphonenumber-js Р»РѕРєР°Р»СЊРЅРѕ'
      );
    };
    document.body.appendChild(script);
  }

  let iti = null;

  // Create button
  function createButton() {
    const wrapper = document.createElement('div');
    wrapper.className = 'callback-button-wrapper';
    const button = document.createElement('button');
    button.className = 'callback-button';
    button.innerHTML =
      '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3.08 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.13 1.05.37 2.06.72 3.03a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.97.35 1.98.59 3.03.72A2 2 0 0 1 22 16.92z"></path></svg>';
    button.title = '';
    button.addEventListener('click', showModal);
    const labelBtn = document.createElement('button');
    labelBtn.type = 'button';
    labelBtn.className = 'callback-button-label';
    labelBtn.innerHTML =
      '<span>Р—Р°РєР°Р·Р°С‚СЊ</span><span>Р·РІРѕРЅРѕРє</span>';
    labelBtn.addEventListener('click', showModal);
    wrapper.appendChild(button);
    wrapper.appendChild(labelBtn);
    document.body.appendChild(wrapper);
  }

  // Р’СЃС‚Р°РІР»СЏСЋ livefeed-РєРѕРЅС‚РµР№РЅРµСЂ РІ body, Р° РЅРµ РІ РїРѕРїР°Рї
  function createLiveFeedContainer() {
    if (document.getElementById('callbackLiveFeed')) return;
    const liveFeed = document.createElement('div');
    liveFeed.className = 'callback-livefeed-global';
    liveFeed.id = 'callbackLiveFeed';
    document.body.appendChild(liveFeed);
  }

  // Create modal
  function createModal() {
    if (document.querySelector('.callback-modal')) return; // РќРµ СЃРѕР·РґР°РІР°С‚СЊ РїРѕРІС‚РѕСЂРЅРѕ
    const modal = document.createElement('div');
    modal.className = 'callback-modal';
    modal.innerHTML = `
        <div class="callback-form">
          <button class="callback-close" type="button" aria-label="Р—Р°РєСЂС‹С‚СЊ">&times;</button>
          <div class="callback-title">РћСЃС‚Р°РІСЊС‚Рµ РЅРѕРјРµСЂ вЂ” РјС‹ РїРµСЂРµР·РІРѕРЅРёРј!</div>
          <div class="callback-subtitle">РЎРІСЏР¶РµРјСЃСЏ СЃ РІР°РјРё РІ С‚РµС‡РµРЅРёРµ 5 РјРёРЅСѓС‚</div>
          <div class="callback-message" id="callbackMessage" style="display: none;"></div>
          <form id="callbackForm" autocomplete="off">
            <div class="callback-field">
              <input type="text" class="callback-input" name="phone" required autocomplete="off" maxlength="20" placeholder="+1 814 351-10-00">
              <div class="callback-error" id="phoneError"></div>
            </div>
            <button type="submit" class="callback-submit">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="#fff"/><path d="M6.5 10.5L9 13L14 8" stroke="#27ae60" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span>Р–РґСѓ Р·РІРѕРЅРєР°</span>
            </button>
          </form>
          <div class="callback-social-proof-min">РЈР¶Рµ 124 РєР»РёРµРЅС‚Р° РїРѕР»СѓС‡РёР»Рё РєРѕРЅСЃСѓР»СЊС‚Р°С†РёСЋ СЃРµРіРѕРґРЅСЏ</div>
          <div class="callback-privacy">
            <svg fill="currentColor" viewBox="0 0 20 20"><path d="M10 2C6.13 2 3 5.13 3 9v3.28c0 .53-.21 1.04-.59 1.41l-1.7 1.7A1 1 0 003 17h14a1 1 0 00.71-1.71l-1.7-1.7a2 2 0 01-.59-1.41V9c0-3.87-3.13-7-7-7zm0 2a5 5 0 015 5v3.28c0 1.06.42 2.08 1.17 2.83l.29.29H3.54l.29-.29A4.01 4.01 0 005 10.28V9a5 5 0 015-5zm0 10a3 3 0 01-3-3h6a3 3 0 01-3 3z"/></svg>
            РњС‹ Р·Р°Р±РѕС‚РёРјСЃСЏ Рѕ РІР°С€РёС… РґР°РЅРЅС‹С…. РћС‚РїСЂР°РІР»СЏСЏ С„РѕСЂРјСѓ, РІС‹ РїСЂРёРЅРёРјР°РµС‚Рµ СѓСЃР»РѕРІРёСЏ РџРѕР»РёС‚РёРєРё РєРѕРЅС„РёРґРµРЅС†РёР°Р»СЊРЅРѕСЃС‚Рё.
          </div>
        </div>
      `;
    document.body.appendChild(modal);
    modal.querySelector('.callback-close').addEventListener('click', hideModal);
    // РџРѕРґРєР»СЋС‡Р°РµРј libphonenumber-js
    loadLibPhoneNumber(() => {
      console.log(
        '[Callback Popup] libphonenumber-js РёРЅРёС†РёР°Р»РёР·РёСЂРѕРІР°РЅ'
      );
    });
    return modal;
  }

  // Create overlay
  function createOverlay() {
    let overlay = document.querySelector('.callback-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'callback-overlay';
      document.body.appendChild(overlay);
    }
    overlay.addEventListener('click', hideModal);
    return overlay;
  }

  // Show modal
  function showModal() {
    const modal = document.querySelector('.callback-modal');
    const overlay = document.querySelector('.callback-overlay');
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
    if (overlay) {
      overlay.classList.add('show');
    }
  }

  // Hide modal
  function hideModal() {
    const modal = document.querySelector('.callback-modal');
    const overlay = document.querySelector('.callback-overlay');
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
      resetForm();
    }
    if (overlay) {
      overlay.classList.remove('show');
    }
  }

  // Reset form
  function resetForm() {
    const form = document.getElementById('callbackForm');
    const message = document.getElementById('callbackMessage');
    const inputs = form.querySelectorAll('input');

    form.reset();
    message.style.display = 'none';
    inputs.forEach((input) => {
      input.classList.remove('error');
    });
    document.querySelectorAll('.callback-error').forEach((error) => {
      error.style.display = 'none';
    });
  }

  // Show message
  function showMessage(text, type = 'success') {
    const message = document.getElementById('callbackMessage');
    if (!message) return; // РќРµ РїС‹С‚Р°С‚СЊСЃСЏ РјРµРЅСЏС‚СЊ innerHTML, РµСЃР»Рё СЌР»РµРјРµРЅС‚Р° РЅРµС‚
    message.innerHTML = text;
    message.className = `callback-message ${type}`;
    message.style.display = 'block';
  }

  // РЈРЅРёРІРµСЂСЃР°Р»СЊРЅР°СЏ РІР°Р»РёРґР°С†РёСЏ РЅРѕРјРµСЂР° РґР»СЏ РІСЃРµС… СЃС‚СЂР°РЅ
  function validateForm(formData) {
    const errors = {};
    // РўРѕР»СЊРєРѕ С‚РµР»РµС„РѕРЅ
    if (window.libphonenumber) {
      try {
        const phoneUtil = window.libphonenumber.parsePhoneNumber(
          formData.phone
        );
        if (!phoneUtil.isValid()) {
          errors.phone =
            'Р’РІРµРґРёС‚Рµ РєРѕСЂСЂРµРєС‚РЅС‹Р№ РЅРѕРјРµСЂ С‚РµР»РµС„РѕРЅР° (РјРµР¶РґСѓРЅР°СЂРѕРґРЅС‹Р№ С„РѕСЂРјР°С‚)';
        }
      } catch (e) {
        errors.phone =
          'Р’РІРµРґРёС‚Рµ РєРѕСЂСЂРµРєС‚РЅС‹Р№ РЅРѕРјРµСЂ С‚РµР»РµС„РѕРЅР° (РјРµР¶РґСѓРЅР°СЂРѕРґРЅС‹Р№ С„РѕСЂРјР°С‚)';
      }
    } else {
      if (
        !/^\+[\d\s\-\(\)]+$/.test(formData.phone) ||
        formData.phone.replace(/\D/g, '').length < 8
      ) {
        errors.phone =
          'Р’РІРµРґРёС‚Рµ РєРѕСЂСЂРµРєС‚РЅС‹Р№ РЅРѕРјРµСЂ С‚РµР»РµС„РѕРЅР° (РјРµР¶РґСѓРЅР°СЂРѕРґРЅС‹Р№ С„РѕСЂРјР°С‚)';
      }
    }
    return errors;
  }

  // Р¤СѓРЅРєС†РёСЏ РґР»СЏ РїРѕР»СѓС‡РµРЅРёСЏ roistat_visit
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

  // Submit form
  async function submitForm(formData) {
    try {
      const phone = formData.phone;
      const roistat_visit = getRoistatVisit();
      const site_url = window.location.href;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const fbclid = getFbclid();
      console.log('[SUBMIT] РћС‚РїСЂР°РІР»СЏРµРј РґР°РЅРЅС‹Рµ:', {
        phone,
        roistat_visit,
        site_url,
        timezone,
        fbclid
      });
      const submitBtn = document.querySelector('.callback-submit');
      const phoneInput = document.querySelector(
        '.callback-input[name="phone"]'
      );
      const phoneField = phoneInput?.closest('.callback-field');
      const form = document.getElementById('callbackForm');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML =
          '<span class="callback-spinner"></span> РћС‚РїСЂР°РІР»СЏРµРј...';
      }
      const response = await fetch(`${CONFIG.serverUrl}/api/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          popupId: CONFIG.popupId,
          phone: phone,
          roistat_visit: roistat_visit,
          site_url: site_url,
          timezone: timezone,
          fbclid: fbclid
        })
      });
      const result = await response.json();
      if (result.success) {
        if (typeof gtag === 'function') gtag('event', 'form_submit');
        if (typeof ym === 'function') ym(48800852, 'reachGoal', 'form_submit');
        if (typeof twq === 'function') twq('event', 'tw-pzuj8-pzujb', {});
        if (typeof _tmr !== 'undefined')
          _tmr.push({ type: 'reachGoal', id: 3498335, goal: 'lead' });
        sendLeadEvent();
        // РЎРєСЂС‹РІР°РµРј РїРѕР»Рµ Рё РєРЅРѕРїРєСѓ, РїРѕРєР°Р·С‹РІР°РµРј РєСЂР°СЃРёРІС‹Р№ Р±Р»РѕРє СѓСЃРїРµС…Р°
        if (phoneField) phoneField.style.display = 'none';
        if (submitBtn) submitBtn.style.display = 'none';
        // РЎРєСЂС‹РІР°РµРј Р·Р°РіРѕР»РѕРІРѕРє Рё social proof
        const title = document.querySelector('.callback-title');
        if (title) title.style.display = 'none';
        const socialProof = document.querySelector(
          '.callback-social-proof-min'
        );
        if (socialProof) socialProof.style.display = 'none';
        // РЈРґР°Р»СЏРµРј СЃС‚Р°СЂС‹Р№ Р±Р»РѕРє СѓСЃРїРµС…Р°, РµСЃР»Рё РµСЃС‚СЊ
        let successBlock = document.querySelector('.callback-success-block');
        if (successBlock) successBlock.remove();
        // РЎРѕР·РґР°С‘Рј РЅРѕРІС‹Р№ Р±Р»РѕРє СѓСЃРїРµС…Р°
        successBlock = document.createElement('div');
        successBlock.className = 'callback-success-block';
        successBlock.innerHTML = `
            <div class="callback-success-thank">РЎРїР°СЃРёР±Рѕ!</div>
            <div class="callback-success-desc">РњС‹ СѓР¶Рµ РЅР°Р±РёСЂР°РµРј РІР°С€ РЅРѕРјРµСЂ:</div>
            <div class="callback-success-phone">${phone}</div>
            <button type="button" class="callback-reset-btn" style="margin-top: 10px; padding: 8px 18px; background: #f3f3f3; color: #27ae60; border: 1.5px solid #27ae60; border-radius: 7px; font-size: 15px; font-weight: 600; cursor: pointer;">РћС€РёР±СЃСЏ РЅРѕРјРµСЂРѕРј</button>
          `;
        // Р’СЃС‚Р°РІР»СЏРµРј Р±Р»РѕРє РїРѕСЃР»Рµ С„РѕСЂРјС‹
        form.parentNode.insertBefore(successBlock, form.nextSibling);
        // Р”РѕР±Р°РІР»СЏРµРј РѕР±СЂР°Р±РѕС‚С‡РёРє РЅР° РєРЅРѕРїРєСѓ СЃР±СЂРѕСЃР°
        const resetBtn = successBlock.querySelector('.callback-reset-btn');
        if (resetBtn) {
          resetBtn.addEventListener('click', function () {
            // РЎР±СЂРѕСЃРёС‚СЊ С„РѕСЂРјСѓ Рё РїРѕРєР°Р·Р°С‚СЊ СЃРЅРѕРІР° РїРѕР»СЏ
            successBlock.remove();
            if (phoneField) phoneField.style.display = '';
            if (submitBtn) submitBtn.style.display = '';
            if (title) title.style.display = '';
            if (socialProof) socialProof.style.display = '';
            form.reset();
            // РЎР±СЂРѕСЃ РѕС€РёР±РѕРє
            form
              .querySelectorAll('.callback-input')
              .forEach((input) => input.classList.remove('error'));
            document.querySelectorAll('.callback-error').forEach((error) => {
              error.style.display = 'none';
            });
            // РЎС„РѕРєСѓСЃРёСЂРѕРІР°С‚СЊ РЅР° РїРѕР»Рµ С‚РµР»РµС„РѕРЅР°
            const phoneInput = form.querySelector(
              '.callback-input[name="phone"]'
            );
            if (phoneInput) phoneInput.focus();
          });
        }
      } else {
        showMessage(
          result.error || 'РћС€РёР±РєР° РѕС‚РїСЂР°РІРєРё Р·Р°СЏРІРєРё',
          'error'
        );
        // РџРѕРєР°Р·С‹РІР°РµРј РїРѕР»СЏ РѕР±СЂР°С‚РЅРѕ
        if (phoneField) phoneField.style.display = '';
        if (submitBtn) submitBtn.style.display = '';
        // РЎРєСЂС‹РІР°РµРј Р±Р»РѕРє СѓСЃРїРµС…Р°
        let successBlock = document.querySelector('.callback-success-block');
        if (successBlock) successBlock.style.display = 'none';
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML =
          '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="#fff"/><path d="M6.5 10.5L9 13L14 8" stroke="#27ae60" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> <span>Р–РґСѓ Р·РІРѕРЅРєР°</span>';
      }
    } catch (error) {
      console.error('Form submission error:', error);
      showMessage(
        'РћС€РёР±РєР° РѕС‚РїСЂР°РІРєРё Р·Р°СЏРІРєРё. РџРѕРїСЂРѕР±СѓР№С‚Рµ РїРѕР·Р¶Рµ.',
        'error'
      );
      const submitBtn = document.querySelector('.callback-submit');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML =
          '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="#fff"/><path d="M6.5 10.5L9 13L14 8" stroke="#27ae60" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> <span>Р–РґСѓ Р·РІРѕРЅРєР°</span>';
      }
      // РџРѕРєР°Р·С‹РІР°РµРј РїРѕР»СЏ РѕР±СЂР°С‚РЅРѕ
      const phoneField = document
        .querySelector('.callback-input[name="phone"]')
        ?.closest('.callback-field');
      if (phoneField) phoneField.style.display = '';
      const submitBtn2 = document.querySelector('.callback-submit');
      if (submitBtn2) submitBtn2.style.display = '';
      // РЎРєСЂС‹РІР°РµРј Р±Р»РѕРє СѓСЃРїРµС…Р°
      let successBlock = document.querySelector('.callback-success-block');
      if (successBlock) successBlock.style.display = 'none';
    }
  }

  // Initialize
  function init() {
    injectStyles();
    createButton();
    createLiveFeedContainer();
    createOverlay();
    createModal();
    startLiveFeed();

    // Form submission
    document.addEventListener('submit', function (e) {
      if (e.target.id === 'callbackForm') {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = {
          phone: formData.get('phone')
        };

        // Validate
        const errors = validateForm(data);

        // РЎР±СЂРѕСЃ РѕС€РёР±РѕРє
        e.target
          .querySelectorAll('.callback-input')
          .forEach((input) => input.classList.remove('error'));
        document.querySelectorAll('.callback-error').forEach((error) => {
          error.style.display = 'none';
        });

        if (Object.keys(errors).length > 0) {
          // Show errors
          Object.keys(errors).forEach((field) => {
            const input = e.target.querySelector(`[name="${field}"]`);
            const errorDiv = document.getElementById(`${field}Error`);

            input.classList.add('error');
            errorDiv.textContent = errors[field];
            errorDiv.style.display = 'block';
          });
          // Р‘Р»РѕРєРёСЂСѓРµРј РєРЅРѕРїРєСѓ РЅР° 1 СЃРµРє, С‡С‚РѕР±С‹ РёР·Р±РµР¶Р°С‚СЊ СЃРїР°РјР°
          const submitBtn = e.target.querySelector('.callback-submit');
          submitBtn.disabled = true;
          setTimeout(() => {
            submitBtn.disabled = false;
          }, 1000);
          return;
        }

        // Submit
        submitForm(data);
      }
    });

    // Close modal on outside click
    document.addEventListener('click', function (e) {
      if (e.target.classList.contains('callback-modal')) {
        hideModal();
      }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        hideModal();
      }
    });
  }

  // Make hideModal globally available
  window.hideModal = hideModal;

  // Р¤РѕСЂРјР°С‚РёСЂРѕРІР°РЅРёРµ РЅРѕРјРµСЂР° РїСЂРё РїРѕС‚РµСЂРµ С„РѕРєСѓСЃР°
  document.addEventListener(
    'blur',
    function (e) {
      if (e.target && e.target.name === 'phone' && window.libphonenumber) {
        try {
          const phoneNumber = window.libphonenumber.parsePhoneNumber(
            e.target.value
          );
          e.target.value = phoneNumber.formatInternational();
        } catch (e) {}
      }
    },
    true
  );

  // Р¤РѕСЂРјР°С‚РёСЂРѕРІР°РЅРёРµ РЅРѕРјРµСЂР° РїСЂРё РІРІРѕРґРµ (input)
  document.addEventListener(
    'input',
    function (e) {
      if (e.target && e.target.name === 'phone') {
        // Р•СЃР»Рё РїРµСЂРІС‹Р№ СЃРёРјРІРѕР» РЅРµ "+" Рё РІРІРµРґРµРЅР° С†РёС„СЂР° вЂ” РґРѕР±Р°РІР»СЏРµРј "+"
        if (/^\d/.test(e.target.value)) {
          e.target.value = '+' + e.target.value;
        }
        // Р•СЃР»Рё РЅРѕРјРµСЂ РЅР°С‡РёРЅР°РµС‚СЃСЏ СЃ +89, Р·Р°РјРµРЅСЏРµРј РЅР° +79
        if (/^\+89/.test(e.target.value)) {
          e.target.value = e.target.value.replace(/^\+89/, '+79');
        }
        if (window.libphonenumber) {
          try {
            const phoneNumber = window.libphonenumber.parsePhoneNumber(
              e.target.value
            );
            e.target.value = phoneNumber.formatInternational();
          } catch (e) {}
        }
      }
    },
    true
  );

  // Livefeed: Р°РЅРѕРЅРёРјРЅС‹Рµ РјРµР¶РґСѓРЅР°СЂРѕРґРЅС‹Рµ РЅРѕРјРµСЂР°, С‡Р°С‰Рµ
  function startLiveFeed() {
    const numbers = [
      '+49 *** *** 12-34',
      '+44 *** *** 56-78',
      '+33 *** *** 90-12',
      '+34 *** *** 34-56',
      '+39 *** *** 78-90',
      '+41 *** *** 23-45',
      '+31 *** *** 67-89',
      '+36 *** *** 01-23',
      '+420 *** *** 45-67',
      '+371 *** *** 89-01',
      '+370 *** *** 23-45',
      '+48 *** *** 67-89',
      '+43 *** *** 12-34',
      '+46 *** *** 56-78',
      '+47 *** *** 90-12',
      '+32 *** *** 34-56',
      '+30 *** *** 78-90',
      '+353 *** *** 23-45',
      '+358 *** *** 67-89',
      '+372 *** *** 01-23'
    ];
    const liveFeed = document.getElementById('callbackLiveFeed');
    if (!liveFeed) return;
    function showMsg() {
      const number = numbers[Math.floor(Math.random() * numbers.length)];
      const msg = document.createElement('div');
      msg.className = 'callback-livefeed-msg';
      msg.innerHTML = `<svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#27ae60"/><path d="M8 12.5l3 3 5-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> ${number} С‚РѕР»СЊРєРѕ С‡С‚Рѕ РѕСЃС‚Р°РІРёР»(Р°) Р·Р°СЏРІРєСѓ`;
      liveFeed.appendChild(msg);
      setTimeout(() => {
        msg.remove();
      }, 4000);
    }
    setInterval(() => {
      if (document.querySelector('.callback-modal.show')) {
        showMsg();
      }
    }, Math.floor(6000 + Math.random() * 14000)); // РєР°Р¶РґС‹Рµ 6-10 СЃРµРєСѓРЅРґ
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
