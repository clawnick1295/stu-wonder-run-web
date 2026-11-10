// Shared Practice Run launcher (src/common, owned by Rome/home). The Practice Run itself is built by the Rio worker
// inside the Rio engine (src/rio-practice.js + wonder.js) and lives at /genesis/?run=practice.
// Shape agreed in muse/progress-v2-proposal.md ("Practice / tutorial module"):
//   localStorage 'stuWonderRun.practice' = { rio: true, rome: true, ... }   (separate key; progress.js save() never touches it)
//   practiceSeen(map?)  -> map omitted = seen on ANY map (one control scheme, so one practice is enough to play anywhere)
//   markPracticeSeen(map)
//   PRACTICE_ID(map)    -> 'rio-practice' | 'rome-practice' (never in MAPS unlock order, no stars)
//   ?next=<url relative to the Practice page>  -> where the Practice page sends the kid when it finishes
export const PRACTICE_KEY = 'stuWonderRun.practice';
export const PRACTICE_ID = map => `${map}-practice`;
export const PRACTICE_PAGE = '../genesis/?run=practice';    // relative to /play/
function read() { try { const o = JSON.parse(localStorage.getItem(PRACTICE_KEY) || '{}'); return o && typeof o === 'object' ? o : {}; } catch (e) { return {}; } }
export function practiceSeen(map) { const o = read(); return map ? !!o[map] : Object.keys(o).some(k => o[k] === true); }
export function markPracticeSeen(map = 'rio') { try { const o = read(); o[map] = true; localStorage.setItem(PRACTICE_KEY, JSON.stringify(o)); } catch (e) { } }
// URL of the Practice page from the current page. playRoot = path from here to /play/ ('' on home, '../' in /play/rome/, '../../' in /play/rome/tiber/).
// target (optional) = where to go afterwards, relative to /play/ (e.g. 'rome/tiber/', '' for home, '../genesis/' for Rio).
export function practiceURL(playRoot = '', target = null) {
  let u = playRoot + PRACTICE_PAGE;
  if (target !== null) u += '&next=' + encodeURIComponent('../play/' + target);   // the Practice page sits at /genesis/, one level below the site root
  return u;
}
// first-timers go through Practice before `target`. Returns true when it redirected.
export function practiceFirst(target, playRoot = '') { if (practiceSeen()) return false; location.href = practiceURL(playRoot, target); return true; }
// for the Practice page: the validated ?next= (plain relative paths only), or the fallback
export function practiceNext(fallback = null) {
  const n = new URLSearchParams(location.search).get('next');
  return n && /^[\w\-./?=&]+$/.test(n) && !n.includes('//') && !n.startsWith('/') && !/^[a-z]+:/i.test(n) ? n : fallback;
}
