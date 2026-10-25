// 공통 패치노트 팝업 — 항목 데이터는 patchnotes-data.js에서 관리합니다.
(function () {
  const safe = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let closingTimer = null;
  function compareVersions(a, b) {
    const av = String(a.version || '').replace(/^v/i, '').split('.').map(n => parseInt(n,10) || 0);
    const bv = String(b.version || '').replace(/^v/i, '').split('.').map(n => parseInt(n,10) || 0);
    for(let i=0;i<Math.max(av.length,bv.length);i++) {
      if((av[i] || 0) !== (bv[i] || 0)) return (bv[i] || 0) - (av[i] || 0);
    }
    return String(b.date || '').localeCompare(String(a.date || ''));
  }
  const css = document.createElement('style');
  css.textContent = `
    #patchnotes-modal {transition:opacity .24s ease,visibility .24s ease;opacity:0;visibility:hidden;pointer-events:none;display:flex!important}
    #patchnotes-modal.pn-visible {opacity:1;visibility:visible;pointer-events:auto}
    #patchnotes-panel {transform:translateY(24px) scale(.96);opacity:0;transition:transform .3s cubic-bezier(.2,.75,.3,1),opacity .24s ease}
    #patchnotes-modal.pn-visible #patchnotes-panel {transform:translateY(0) scale(1);opacity:1}
    #patchnotes-entries {overscroll-behavior:contain;scrollbar-width:thin;}
    @media(prefers-reduced-motion:reduce){#patchnotes-modal,#patchnotes-panel {transition:none!important}}
  `;
  document.head.appendChild(css);
  function buildModal() {
    if(document.getElementById('patchnotes-modal')) return;
    const overlay=document.createElement('div');
    overlay.id='patchnotes-modal';
    overlay.className='fixed inset-0 items-center justify-center z-[10001] bg-black/50 p-4';
    overlay.setAttribute('aria-hidden','true');
    overlay.innerHTML=`<div id="patchnotes-panel" role="dialog" aria-modal="true" aria-labelledby="patchnotes-heading" class="bg-white rounded-2xl shadow-xl w-full max-w-sm max-h-[85vh] flex flex-col overflow-hidden"><div class="p-4 border-b border-gray-100 flex justify-between items-center shrink-0"><h3 id="patchnotes-heading" class="text-lg font-bold text-gray-900">패치노트</h3><button type="button" onclick="closePatchNotesModal()" aria-label="닫기" class="text-2xl text-gray-500">&times;</button></div><div id="patchnotes-entries" class="overflow-y-auto p-4 space-y-3 min-h-0"></div><div class="px-4 py-3 border-t border-gray-100 shrink-0"><button type="button" onclick="closePatchNotesModal()" class="w-full py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm">닫기</button></div></div>`;
    overlay.addEventListener('click',e=>{if(e.target===overlay)window.closePatchNotesModal();});
    document.body.appendChild(overlay);
  }
  window.openPatchNotesModal=function(){
    buildModal();
    if(closingTimer) {clearTimeout(closingTimer);closingTimer=null;}
    const records=Array.isArray(window.PATCH_NOTES) ? [...window.PATCH_NOTES].sort(compareVersions) : [];
    document.getElementById('patchnotes-entries').innerHTML=records.length ? records.map(n=>`<article class="rounded-2xl border border-gray-200 bg-gray-50/70 overflow-hidden"><div class="px-4 pt-4 pb-3"><div class="flex items-center justify-between gap-2 mb-2"><span class="inline-flex px-2.5 py-1 text-xs font-extrabold text-indigo-700 bg-indigo-100 rounded-lg">${safe(n.version || '버전 미지정')}</span><time class="text-[11px] text-gray-400">${safe(n.date)}</time></div><h4 class="font-extrabold text-gray-900 text-base">${safe(n.title)}</h4></div><div class="px-4 pb-4 text-xs text-gray-600 whitespace-pre-line leading-relaxed">${safe(n.content)}</div></article>`).join('') : '<p class="text-center py-8 text-gray-400 text-sm">등록된 패치노트가 없습니다.</p>';
    document.getElementById('patchnotes-entries').scrollTop=0;
    const modal=document.getElementById('patchnotes-modal');
    modal.setAttribute('aria-hidden','false');
    // 스타일 적용 직후 다음 프레임에서 등장 애니메이션을 시작합니다.
    requestAnimationFrame(()=>requestAnimationFrame(()=>modal.classList.add('pn-visible')));
  };
  window.closePatchNotesModal=function(){
    const modal=document.getElementById('patchnotes-modal');
    if(!modal)return;
    modal.classList.remove('pn-visible');
    modal.setAttribute('aria-hidden','true');
    if(closingTimer)clearTimeout(closingTimer);
    closingTimer=setTimeout(()=>{closingTimer=null;},300);
  };
  document.addEventListener('keydown',e=>{if(e.key==='Escape')window.closePatchNotesModal();});
  const script=document.createElement('script');
  script.src='patchnotes-data.js?v=20261025-2';
  document.head.appendChild(script);
})();
