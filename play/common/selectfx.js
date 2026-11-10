// v3 shared run-select / home juice: spoken names on tap, "A new adventure!" unlock moments, v3 star rows.
// Seen-open runs live in their own key so the save (stuWonderRun.v1) is never touched.
export const SEEN_KEY = 'stuWonderRun.seen';
function readSeen() { try { const j = JSON.parse(localStorage.getItem(SEEN_KEY) || '{}'); return Array.isArray(j.open) ? j.open : []; } catch (e) { return []; } }
// no key yet (first visit after this update, or a new player): seed silently, so only future unlocks get the moment
export function hasSeenKey() { try { return localStorage.getItem(SEEN_KEY) !== null; } catch (e) { return true; } }
export function isSeen(id) { return readSeen().includes(id); }
export function markSeen(ids) { try { const s = new Set(readSeen()); ids.forEach(i => s.add(i)); localStorage.setItem(SEEN_KEY, JSON.stringify({ open: [...s] })); } catch (e) { } }
export function isMuted() { try { return localStorage.getItem('stuWonderRun.mute') === '1'; } catch (e) { return false; } }
let cur = null;
// play one clip; resolves when it ends (or after maxMs, or at once if muted / blocked)
export function play(url, maxMs = 1800) {
  return new Promise(res => { if (isMuted()) return res(false); let done = false; const fin = ok => { if (!done) { done = true; res(ok); } };
    try { if (cur) cur.pause(); cur = new Audio(url); cur.onended = () => fin(true); cur.onerror = () => fin(false); cur.play().then(() => setTimeout(() => fin(true), maxMs), () => fin(false)); } catch (e) { fin(false); } });
}
// a clip that may be blocked by autoplay rules: try now, else on the first tap anywhere
export function playSoon(url) { play(url).then(ok => { if (ok || isMuted()) return; const go = () => { removeEventListener('pointerdown', go, true); play(url); }; addEventListener('pointerdown', go, true); }); }
// say the name, then go (tap again to skip the wait)
export function sayThenGo(url, go) { let gone = false; const g = () => { if (!gone) { gone = true; go(); } }; play(url, 1700).then(g); setTimeout(g, 1900); }
const STAR = on => `<svg class="star" viewBox="0 0 24 24"><path d="M12 2l3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21.1l1.4-7L2 9.3l7-.8z" fill="${on ? '#f2c94c' : '#d8cfc0'}" stroke="#4b2f5e" stroke-width="1.8" stroke-linejoin="round"/></svg>`;
const ICONS = {
  explorer: '<svg viewBox="0 0 20 20" width="18" height="18"><circle cx="10" cy="10" r="8" fill="#fff1cf" stroke="#a0662f" stroke-width="1.8"/><path d="M10 3.6 12 10H8z" fill="#e0553a"/><path d="M10 16.4 12 10H8z" fill="#4b6b8f"/></svg>',
  treasure: '<svg viewBox="0 0 20 20" width="18" height="18"><g stroke="#8a5a1a" stroke-width="1.2"><circle cx="6.5" cy="13" r="4.5" fill="#f2c94c"/><circle cx="13.5" cy="13" r="4.5" fill="#f2c94c"/><circle cx="10" cy="7" r="4.5" fill="#ffd95a"/></g></svg>',
  gem: '<svg viewBox="0 0 20 20" width="18" height="18"><path d="M5 3h10l3 5-8 10L2 8z" fill="#4fcf8a" stroke="#1f7a4a" stroke-width="1.4" stroke-linejoin="round"/><path d="M2 8h16M7 3l3 5 3-5M10 8v10" stroke="#bff2d6" stroke-width="1"/></svg>'
};
const HEART = '<svg viewBox="0 0 24 24" width="26" height="26" aria-label="no-bump sticker"><circle cx="12" cy="12" r="11" fill="#fff8ea" stroke="#d97a8a" stroke-width="1.6" stroke-dasharray="3 2"/><path d="M12 18C4 12 7 5 12 9c5-4 8 3 0 9z" fill="#ee6f86" stroke="#4b2f5e" stroke-width="1.2"/></svg>';
// v3 star row: Explorer, Treasure, Gem (+ the no-bump heart sticker when earned)
export function starRow(r) { const s = r.stars || {}, st = r.stickers || {};
  return ['explorer', 'treasure', 'gem'].map(k => `<span>${STAR(s[k])}<i>${ICONS[k]}</i></span>`).join('') + (st.noBump ? `<span class="sticker">${HEART}</span>` : ''); }
export const STAR_CSS = '.stars i{width:18px;height:18px;display:block}.stars .sticker{transform:rotate(-10deg);margin-left:4px}'
  + '.run.fresh img{animation:greyToColour 1.6s .35s ease-out both}.run.fresh{animation:pop .7s 1.6s ease-out both}'
  + '.run .spark{position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 20% 30%,#fff6c8 0 3px,transparent 4px),radial-gradient(circle at 75% 20%,#fff6c8 0 4px,transparent 5px),radial-gradient(circle at 60% 65%,#ffe27a 0 3px,transparent 4px),radial-gradient(circle at 35% 75%,#fff6c8 0 2px,transparent 3px);opacity:0;animation:spark 1.8s 1.2s ease-out both}'
  + '@keyframes greyToColour{from{filter:grayscale(1) brightness(.8)}to{filter:none}}@keyframes pop{0%{transform:scale(1)}40%{transform:scale(1.05)}100%{transform:scale(1)}}@keyframes spark{0%{opacity:0;transform:scale(.8)}30%{opacity:1}100%{opacity:0;transform:scale(1.25)}}'
  + '@media (prefers-reduced-motion:reduce){.run.fresh img,.run.fresh,.run .spark{animation:none}}';
