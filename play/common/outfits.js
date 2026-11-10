// Stu's Outfit Closet: accessories only (Stu himself and his cap are never recoloured or covered).
// drawOutfit() works in Stu's rig space (body sprite coordinates, ~300 units tall body, feet at y=420).
export const OUTFITS = [
  { id: 'badge', name: 'Explorer Badge', price: 75, icon: '🏅' },
  { id: 'scarf', name: 'Red Scarf', price: 100, icon: '🧣' },
  { id: 'flag', name: 'Backpack Flag', price: 125, icon: '🚩' },
  { id: 'stars', name: 'Star Glasses', price: 150, icon: '⭐' },
  { id: 'laurel', name: 'Roman Laurel', price: 250, icon: '🌿' },
  { id: 'feather', name: 'Carnival Feather', price: 300, icon: '🪶' },
  { id: 'cape', name: 'Hero Cape', price: 400, icon: '🦸' },
];
export const outfitById = id => OUTFITS.find(o => o.id === id) || null;
function star(c, x, y, r, rot = 0) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = rot - Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); }
function leaf(c, x, y, a, L) { c.save(); c.translate(x, y); c.rotate(a); c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(L * 0.5, -L * 0.42, L, 0); c.quadraticCurveTo(L * 0.5, L * 0.42, 0, 0); c.fill(); c.stroke(); c.restore(); }
// layer: 'back' (before the body sprite) or 'front' (after). dx shifts head items for the arms-up body. t = seconds.
export function drawOutfit(c, id, layer, dx = 0, t = 0) {
  if (!id) return;
  c.save(); c.lineJoin = 'round'; c.lineCap = 'round';
  const ink = '#3a2418';
  if (id === 'cape' && layer === 'back') {
    const w = Math.sin(t * 7) * 8, x0 = 58 + dx * 0.4, x1 = 156 + dx * 0.4;
    c.fillStyle = '#d8342c'; c.strokeStyle = ink; c.lineWidth = 6;
    c.beginPath(); c.moveTo(x0, 182); c.quadraticCurveTo(x0 - 30, 270, x0 - 44 + w, 372);
    c.quadraticCurveTo(x0 + 10 + w * 0.5, 362, (x0 + x1) / 2 + w * 0.3, 380); c.quadraticCurveTo(x1 + 10, 362, x1 + 34 + w * 0.4, 372);
    c.quadraticCurveTo(x1 + 18, 270, x1, 188); c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = '#f2c230'; c.lineWidth = 7; c.beginPath(); c.moveTo(x0 - 40 + w, 362); c.quadraticCurveTo(x0 + 10 + w * 0.5, 352, (x0 + x1) / 2 + w * 0.3, 370); c.quadraticCurveTo(x1 + 10, 352, x1 + 30 + w * 0.4, 362); c.stroke();
    c.fillStyle = '#f2c230'; star(c, x0 - 14 + w * 0.5, 300, 13, 0.3); c.fill(); star(c, x1 + 14 + w * 0.3, 300, 13, -0.3); c.fill();
  }
  if (id === 'flag' && layer === 'back') {
    const w = Math.sin(t * 8) * 6;
    c.strokeStyle = ink; c.lineWidth = 7; c.beginPath(); c.moveTo(38, 230); c.lineTo(22, 20); c.stroke();
    c.strokeStyle = '#c98a4a'; c.lineWidth = 4; c.beginPath(); c.moveTo(38, 230); c.lineTo(22, 20); c.stroke();
    c.fillStyle = '#2f8fdc'; c.strokeStyle = ink; c.lineWidth = 5;
    c.beginPath(); c.moveTo(22, 22); c.quadraticCurveTo(-20, 18 + w, -58, 36 + w); c.quadraticCurveTo(-20, 52 - w, 26, 70); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#ffd84a'; star(c, -10, 44 + w * 0.5, 12); c.fill();
    c.fillStyle = '#ffd84a'; c.beginPath(); c.arc(22, 18, 7, 0, 7); c.fill(); c.stroke();
  }
  if (id === 'feather' && layer === 'back') {
    const w = Math.sin(t * 5) * 0.06;
    c.translate(48 + dx, 82); c.rotate(-0.55 + w);
    c.fillStyle = '#ff4fa3'; c.strokeStyle = ink; c.lineWidth = 5;
    c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(-34, -60, 0, -150); c.quadraticCurveTo(34, -60, 0, 0); c.fill(); c.stroke();
    c.fillStyle = '#ffd84a'; c.beginPath(); c.moveTo(0, -20); c.quadraticCurveTo(-16, -60, 0, -110); c.quadraticCurveTo(16, -60, 0, -20); c.fill();
    c.fillStyle = '#28b9a8'; c.beginPath(); c.arc(0, -70, 9, 0, 7); c.fill();
    c.strokeStyle = ink; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -140); c.stroke();
  }
  if (layer === 'front') {
    if (id === 'scarf') {   // knot at the neck, two tails streaming back (never covers his face or hands)
      const w = Math.sin(t * 9) * 9, w2 = Math.sin(t * 9 + 1.3) * 9, kx = 70 + dx * 0.6, ky = 172;
      c.fillStyle = '#e23b32'; c.strokeStyle = ink; c.lineWidth = 6;
      c.beginPath(); c.moveTo(kx, ky - 8); c.quadraticCurveTo(kx - 40, ky - 16 + w, kx - 92, ky - 30 + w); c.lineTo(kx - 86, ky - 6 + w); c.quadraticCurveTo(kx - 40, ky + 6, kx, ky + 8); c.closePath(); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(kx, ky); c.quadraticCurveTo(kx - 34, ky + 18 + w2, kx - 74, ky + 20 + w2); c.lineTo(kx - 66, ky + 42 + w2); c.quadraticCurveTo(kx - 30, ky + 36, kx + 4, ky + 12); c.closePath(); c.fill(); c.stroke();
      c.strokeStyle = '#ffd84a'; c.lineWidth = 4; c.beginPath(); c.moveTo(kx - 80, ky - 18 + w); c.quadraticCurveTo(kx - 40, ky - 6 + w * 0.5, kx - 8, ky - 2); c.stroke();
      c.fillStyle = '#e23b32'; c.strokeStyle = ink; c.lineWidth = 6; c.beginPath(); c.ellipse(kx + 2, ky + 2, 15, 13, 0, 0, 7); c.fill(); c.stroke();
    }
    if (id === 'badge') {
      c.fillStyle = '#f4c535'; c.strokeStyle = ink; c.lineWidth = 5;
      c.beginPath(); c.arc(96, 222, 19, 0, 7); c.fill(); c.stroke();
      c.fillStyle = '#e2453a'; star(c, 96, 222, 12); c.fill();
    }
    if (id === 'stars') {
      const y = 128;
      c.fillStyle = '#ffcf2e'; c.strokeStyle = ink; c.lineWidth = 5;
      star(c, 88 + dx, y, 19, 0.1); c.fill(); c.stroke();
      star(c, 122 + dx, y - 3, 19, -0.1); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(100 + dx, y - 5); c.quadraticCurveTo(105 + dx, y - 10, 110 + dx, y - 6); c.stroke();
      c.fillStyle = 'rgba(255,255,255,0.8)'; c.beginPath(); c.arc(83 + dx, y - 6, 4, 0, 7); c.arc(117 + dx, y - 9, 4, 0, 7); c.fill();
    }
    if (id === 'laurel') {
      c.fillStyle = '#58a83a'; c.strokeStyle = '#24501c'; c.lineWidth = 3;
      for (let i = 0; i < 4; i++) { leaf(c, 58 + dx - i * 3, 100 + i * 15, Math.PI + 0.9 - i * 0.25, 30); leaf(c, 150 + dx + i * 3, 96 + i * 15, -0.9 + i * 0.25, 30); }
      c.fillStyle = '#f4c535'; c.strokeStyle = ink; c.beginPath(); c.arc(58 + dx, 98, 7, 0, 7); c.arc(150 + dx, 94, 7, 0, 7); c.fill();
    }
  }
  c.restore();
}
