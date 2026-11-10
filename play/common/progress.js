// Shared save data for every Stu's Wonder Run map (Rio, Rome, home page).
// localStorage key "stuWonderRun.v1" holds { coins, ownedOutfits, equippedOutfit, runs }.
// runs is optional and backward compatible; older saves without it still load.
// Owners: Rome/home worker created this file; the Rio worker imports it too.
// See web-2d/muse/progress-v2-proposal.md for the agreed v2 shape.
export const KEY = 'stuWonderRun.v1';
const BLANK_STARS = () => ({ coins: false, gem: false, noBump: false });
const BLANK_RUN = () => ({ completed: false, stars: BLANK_STARS() });
const BLANK = () => ({ coins: 0, ownedOutfits: [], equippedOutfit: null, runs: {}, unlocked: [] });
// runs that predate the unlock order: a save from before `unlocked` existed that already has coins, outfits or any run progress
// (or a finished Colosseum) keeps the Colosseum open, so nobody loses the run they could already play.
const LEGACY_OPEN = ['rome-colosseum'];
const cleanList = l => Array.isArray(l) ? l.filter(x => typeof x === 'string') : [];
function raw0(s) { try { return s && s.getItem(KEY); } catch (e) { return null; } }
function hasKey(s, k) { try { const j = JSON.parse(raw0(s)); return !!j && Object.prototype.hasOwnProperty.call(j, k); } catch (e) { return false; } }
function store() { try { return window.localStorage; } catch (e) { return null; } }
function cleanRuns(raw) {
  const out = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
  for (const [id, v] of Object.entries(raw)) {
    if (typeof id !== 'string' || !v || typeof v !== 'object') continue;
    const src = v.stars && typeof v.stars === 'object' ? v.stars : v;
    out[id] = {
      completed: !!v.completed,
      stars: { coins: !!src.coins, gem: !!src.gem, noBump: !!src.noBump }
    };
  }
  return out;
}
export function load() {
  const s = store(); let p = BLANK();
  try {
    const raw = s && s.getItem(KEY);
    if (raw) {
      const j = JSON.parse(raw);
      p = {
        coins: Math.max(0, Math.floor(+j.coins || 0)),
        ownedOutfits: Array.isArray(j.ownedOutfits) ? j.ownedOutfits.filter(x => typeof x === 'string') : [],
        equippedOutfit: typeof j.equippedOutfit === 'string' ? j.equippedOutfit : null,
        runs: cleanRuns(j.runs),
        unlocked: cleanList(j.unlocked)
      };
    }
  } catch (e) { p = BLANK(); }
  if (raw0(s) && !hasKey(s, 'unlocked') && (p.coins > 0 || p.ownedOutfits.length || Object.keys(p.runs).length)) for (const id of LEGACY_OPEN) if (!p.unlocked.includes(id)) p.unlocked.push(id);
  if (p.runs['rome-colosseum'] && p.runs['rome-colosseum'].completed && !p.unlocked.includes('rome-colosseum')) p.unlocked.push('rome-colosseum');
  if (p.equippedOutfit && !p.ownedOutfits.includes(p.equippedOutfit)) p.equippedOutfit = null;
  return p;
}
export function save(p) {
  const s = store();
  try {
    s && s.setItem(KEY, JSON.stringify({
      coins: p.coins,
      ownedOutfits: p.ownedOutfits,
      equippedOutfit: p.equippedOutfit,
      runs: cleanRuns(p.runs),
      unlocked: cleanList(p.unlocked)
    }));
  } catch (e) { }
  return p;
}
// add the coins from one finished run to the saved total; returns the new progress object
export function addCoins(n) { const p = load(); p.coins += Math.max(0, Math.floor(n || 0)); return save(p); }
// buy with earned coins only; returns the new progress or null if not affordable / unknown / already owned
export function buy(id, price) { const p = load(); if (p.ownedOutfits.includes(id) || !(price > 0) || p.coins < price) return null; p.coins -= price; p.ownedOutfits.push(id); p.equippedOutfit = id; return save(p); }
export function equip(id) { const p = load(); p.equippedOutfit = id && p.ownedOutfits.includes(id) ? id : null; return save(p); }
export function runProgress(id) {
  const p = load();
  return p.runs[id] || BLANK_RUN();
}
// OR-merge stars and completion for one run; stars only ever turn on
export function recordRun(id, rec = {}) {
  const p = load();
  const prev = p.runs[id] || BLANK_RUN();
  const src = rec.stars && typeof rec.stars === 'object' ? rec.stars : rec;
  p.runs[id] = {
    completed: !!(prev.completed || rec.completed),
    stars: {
      coins: !!(prev.stars.coins || src.coins),
      gem: !!(prev.stars.gem || src.gem),
      noBump: !!(prev.stars.noBump || src.noBump)
    }
  };
  return save(p);
}
// first id in order is always unlocked; each later id opens after the previous run is completed
export function isUnlocked(id, order) {
  const i = order.indexOf(id);
  if (i <= 0) return true;
  const prev = load().runs[order[i - 1]];
  return !!(prev && prev.completed);
}
export function starCount(id) {
  const s = runProgress(id).stars;
  return (s.coins ? 1 : 0) + (s.gem ? 1 : 0) + (s.noBump ? 1 : 0);
}
// ---------- map registry (v2 final shape; see muse/progress-v2-proposal.md) ----------
// Every run id is "<map>-<run>". Each map lists its runs in unlock order; the last one is that map's finale.
// China ids are reserved here so the China worker can drop runs in without changing the save shape.
export const MAPS = {
  rio: { name: 'Rio', order: ['rio-tram', 'rio-lagoa', 'rio-tijuca', 'rio-beach'], finale: 'rio-beach' },
  rome: { name: 'Roma', order: ['rome-tiber', 'rome-borghese', 'rome-appia', 'rome-colosseum'], finale: 'rome-colosseum' },
  china: { name: 'China', order: ['china-hutong', 'china-summer', 'china-wall'], finale: 'china-wall' }
};
// ---------- map access (monetization plan: Rio free; each new Wonder is a one-time unlock bought by a grown-up behind a parent gate) ----------
// Nothing is sold yet. A paid map counts as owned when the save holds 'map:<id>' in `unlocked` (a future purchase/restore writes it),
// or while DEV_OPEN_PAID is on (testing builds). Add ?locked to a page URL to preview the locked state with the flag on.
export const MAP_ACCESS = { rio: 'free', rome: 'free', china: 'paid' };
export const DEV_OPEN_PAID = true;
function previewLocked() { try { return new URLSearchParams(location.search).has('locked'); } catch (e) { return false; } }
export function mapPaid(map) { return MAP_ACCESS[map] === 'paid'; }
export function mapOwned(map) { if (!mapPaid(map)) return true; if (load().unlocked.includes('map:' + map)) return true; return DEV_OPEN_PAID && !previewLocked(); }
export function mapOf(id) { const m = String(id || '').split('-')[0]; return MAPS[m] ? m : null; }
export function orderOf(id) { const m = mapOf(id); return m ? MAPS[m].order : [id]; }
// unlock check without passing the order by hand
export function runUnlocked(id) { const p = load(), r = p.runs[id]; return !!(r && r.completed) || p.unlocked.includes(id) || isUnlocked(id, orderOf(id)); }
// the run after this one on the same map (null after the finale)
export function nextRun(id) { const o = orderOf(id), i = o.indexOf(id); return i >= 0 && i < o.length - 1 ? o[i + 1] : null; }
// { got, max, completed } for a whole map (home-page cards)
export function mapStars(map) {
  const M = MAPS[map]; if (!M) return { got: 0, max: 0, completed: 0 };
  const runs = load().runs; let got = 0, completed = 0;
  for (const id of M.order) { const r = runs[id]; if (!r) continue; if (r.completed) completed++; got += (r.stars.coins ? 1 : 0) + (r.stars.gem ? 1 : 0) + (r.stars.noBump ? 1 : 0); }
  return { got, max: M.order.length * 3, completed };
}
