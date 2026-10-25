/* Shared progressive web app install action for login and settings screens. */
(() => {
  'use strict';
  let deferredPrompt = null;
  const selector = '[data-install-app]';
  const standalone = () => window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.navigator.standalone === true;
  const appleMobile = () => /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const syncButtons = () => {
    document.querySelectorAll(selector).forEach(button => {
      button.hidden = standalone();
      button.style.display = standalone() ? 'none' : '';
    });
  };
  const inform = message => {
    if (typeof window.triggerToast === 'function') window.triggerToast(message);
    else window.alert(message);
  };
  async function installApp() {
    if (standalone()) { syncButtons(); return; }
    if (deferredPrompt) {
      const prompt = deferredPrompt;
      deferredPrompt = null;
      try {
        await prompt.prompt();
        await prompt.userChoice;
      } catch (error) {
        console.warn('앱 설치 요청 실패:', error);
        inform('브라우저 메뉴에서 앱 설치 또는 홈 화면에 추가를 선택해주세요.');
      }
      syncButtons();
      return;
    }
    if (appleMobile()) {
      inform('Safari에서 공유 버튼을 누른 뒤 ‘홈 화면에 추가’를 선택해주세요.');
    } else {
      inform('브라우저 메뉴에서 ‘앱 설치’ 또는 ‘홈 화면에 추가’를 선택해주세요. 설치 메뉴가 없다면 HTTPS 환경에서 접속했는지 확인해주세요.');
    }
  }
  window.installOutingApp = installApp;
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredPrompt = event;
    syncButtons();
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    syncButtons();
  });
  document.addEventListener('visibilitychange', syncButtons);
  window.addEventListener('pageshow', syncButtons);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', syncButtons);
  else syncButtons();
})();
