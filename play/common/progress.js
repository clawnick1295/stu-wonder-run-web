// Shared save data for every Stu's Wonder Run map (Rio, Rome, home page).
// localStorage key "stuWonderRun.v1" holds exactly { coins, ownedOutfits, equippedOutfit }.
// Owners: Rome/home worker created this file; the Rio worker imports it too. Keep the shape stable.
export const KEY = 'stuWonderRun.v1';
const BLANK = () => ({ coins: 0, ownedOutfits: [], equippedOutfit: null });
function store() { try { return window.localStorage; } catch (e) { return null; } }
export function load() {
  const s = store(); let p = BLANK();
  try { const raw = s && s.getItem(KEY); if (raw) { const j = JSON.parse(raw); p = { coins: Math.max(0, Math.floor(+j.coins || 0)), ownedOutfits: Array.isArray(j.ownedOutfits) ? j.ownedOutfits.filter(x => typeof x === 'string') : [], equippedOutfit: typeof j.equippedOutfit === 'string' ? j.equippedOutfit : null }; } } catch (e) { p = BLANK(); }
  if (p.equippedOutfit && !p.ownedOutfits.includes(p.equippedOutfit)) p.equippedOutfit = null;
  return p;
}
export function save(p) { const s = store(); try { s && s.setItem(KEY, JSON.stringify({ coins: p.coins, ownedOutfits: p.ownedOutfits, equippedOutfit: p.equippedOutfit })); } catch (e) { } return p; }
// add the coins from one finished run to the saved total; returns the new progress object
export function addCoins(n) { const p = load(); p.coins += Math.max(0, Math.floor(n || 0)); return save(p); }
// buy with earned coins only; returns the new progress or null if not affordable / unknown / already owned
export function buy(id, price) { const p = load(); if (p.ownedOutfits.includes(id) || !(price > 0) || p.coins < price) return null; p.coins -= price; p.ownedOutfits.push(id); p.equippedOutfit = id; return save(p); }
export function equip(id) { const p = load(); p.equippedOutfit = id && p.ownedOutfits.includes(id) ? id : null; return save(p); }
