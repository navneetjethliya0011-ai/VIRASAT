// Procedural canvas textures - no external assets needed.
import * as THREE from 'three';

let seed = 20240911;

function rnd() {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
}

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function toTex(c, opts) {
  if (!opts) opts = {};
  const repeat = opts.repeat === true;
  const rx = opts.rx || 1;
   const ry = opts.ry ||  1;
   const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
  t.wrapT = repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
  t.repeat.set(rx, ry);
  return t;
}

export function sandstoneTexture(w, h) {
  if (!w) w =  256;
   if (!h) h = 256;
   const c = canvas(w,h);
   const g = c.getContext('2d');
  g.fillStyle = '#b8925e';
   g.fillRect(0,0,w,h);
   const img = g.getImageData(0,0,w,h);
   const px = img.data;
  for (let i = 0; i < px.length; i += 4) {
    const n = (rnd() - 0.5) * 26;
    px[i] = 170 + n;
    px[i + 1] = 126 + n;
    px[i + 2] = 70 + n;
    if (rnd() < 0.06) { px[i] = 140; px[i + 1] = 96; px[i + 2] = 50; }
    if (rnd() < 0.003) px[i + 3] *= 0.1;
  }
  g.putImageData(img, 0, 0);
  g.globalAlpha = 0.18;
   g.strokeStyle = '#3a2410';
   for (let y = 8; y < h; y += 22) {
    g.beginPath();
    g.moveTo(0,y);
    for (let x = 0; x < w; x += 8) g.lineTo(x,y + (rnd() - 0.5) * 3);
    g.stroke();
  }
  return toTex(c, { repeat: true });
}

export function plasterTexture(w, h) {
  if (!w) w = 128;
   if (!h) h = 128;
   const c = canvas(w,h);
   const g = c.getContext('2d');
  g.fillStyle = '#d8c4a0';
   g.fillRect(0, 0,w,h);
   const img = g.getImageData(0, 0,w,h);
   const px = img.data;
  for (let i = 0; i < px.length; i += 4) {
    const n = (rnd() - 0.5) * 18;
    px[i] = 216 + n;
    px[i + 1] = 196 + n;
    px[i + 2] = 160 + n;
    if (rnd() < 0.04) { px[i] *= 0.85; px[i + 1] *= 0.85; px[i + 2] *= 0.85; }
  }
  g.putImageData(img, 0, 0);
  return toTex(c, { repeat: true });
}

export function woodTexture(w, h) {
  if (!w) w = 128;
   if (!h) h = 128;
   const c = canvas(w,h);
   const g = c.getContext('2d');
  g.fillStyle = '#6a4226';
   g.fillRect(0, 0,w,h);
   for (let y = 0; y < h; y += 6) {
    g.fillStyle = 'rgba(60,35,18,0.35)';
    g.fillRect(0,y,w, 2 + rnd() * 3);
  }
  return toTex(c, { repeat: true });
}

export function indigoTexture(w, h) {
  if (!w) w = 128;
   if (!h) h = 128;
   const c = canvas(w,h);
   const g = c.getContext('2d');
  g.fillStyle = '#1c2a4a';
   g.fillRect(0, 0,w,h);
   const img = g.getImageData(0, 0,w,h);
   const px = img.data;
  for (let i = 0; i < px.length; i += 4) {
    const n = (rnd() - 0.5) * 16;
    px[i] += n;
    px[i + 1] += n;
    px[i + 2] += n;
  }
  g.putImageData(img, 0, 0);
  return toTex(c, { repeat: true });
}

export function stoneTexture(w, h) {
  if (!w) w = 128;
   if (!h) h = 128;
   const c = canvas(w,h);
   const g = c.getContext('2d');
  g.fillStyle = '#8a8078';
   g.fillRect(0, 0,w,h);
   const img = g.getImageData(0, 0,w,h);
   const px = img.data;
  for (let i = 0; i < px.length; i += 4) {
    const n = (rnd() - 0.5) * 26;
    px[i] += n;
    px[i + 1] += n;
    px[i + 2] += n;
  }
  g.putImageData(img, 0, 0);
  return toTex(c, { repeat: true });
}

export function brassTexture(w, h) {
  if (!w) w = 128;
   if (!h) h = 128;
   const c = canvas(w,h);
   const g = c.getContext('2d');
  g.fillStyle = '#7a5a22';
   g.fillRect(0, 0,w,h);
   const img = g.getImageData(0, 0,w,h);
   const px = img.data;
  for (let i = 0; i < px.length; i += 4) {
    const n = (rnd() - 0.5) * 30;
    px[i] += n;
    px[i + 1] += n;
    px[i + 2] += n;
    if (rnd() < 0.01) { px[i] = 255; px[i + 1] = 220; px[i + 2] = 140; }
  }
  g.putImageData(img, 0, 0);
  return toTex(c);
}

export function parchmentTexture(w, h) {
  if (!w) w = 128;
   if (!h) h = 128;
   const c = canvas(w,h);
   const g = c.getContext('2d');
  g.fillStyle = '#dcc39a';
   g.fillRect(0, 0,w,h);
   const img = g.getImageData(0, 0,w,h);
   const px = img.data;
  for (let i = 0; i < px.length; i += 4) {
    const n = (rnd() - 0.5) * 20;
    px[i] += n;
    px[i + 1] += n;
    px[i + 2] += n;
    if (rnd() < 0.01) px[i + 3] *= 0.3;
  }
  g.putImageData(img, 0, 0);
  return toTex(c);
}

export function potteryTexture(w, h) {
  if (!w) w = 128;
   if (!h) h = 128;
   const c = canvas(w,h);
   const g = c.getContext('2d');
  g.fillStyle = '#b5532a';
   g.fillRect(0, 0,w,h);
   const img = g.getImageData(0, 0,w,h);
   const px = img.data;
  for (let i = 0; i < px.length; i += 4) {
    px[i] += (rnd() - 0.5) * 24;
    px[i + 1] += (rnd() - 0.5) * 20;
    px[i + 2] += (rnd() - 0.5) * 16;
  }
  g.putImageData(img, 0, 0);
  return toTex(c);
}

export function nameTagTexture(text) {
  const c = canvas(128, 40);
  const g = c.getContext('2d');
  g.fillStyle = 'rgba(30,20,10,0.82)';
   g.beginPath();
  g.roundRect(0, 0,128,40,8);
   g.fill();
  g.fillStyle = '#ffe9c4';
   g.font = 'bold 14px Georgia, serif';
   g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(text,64,20);
   const t = toTex(c);
  t.minFilter = THREE.LinearFilter;
 return t;
}

export function dotTexture() {
  const c = canvas(64,64);
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32,32,0,32,32,30);
  grad.addColorStop(0, 'rgba(255,240,210,1)');
   grad.addColorStop(0.5, 'rgba(255,225,180,0.25)');
   grad.addColorStop(1, 'rgba(255,220,170,0)');
   g.fillStyle = grad;
   g.beginPath();
  g.arc(32,32,30,0,Math.PI * 2);
   g.fill();
  return toTex(c);
}

export function skyGradientTexture() {
  const c = canvas(8,512);
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0,0,0,512);
  grad.addColorStop(0, '#3d5fb4');
   grad.addColorStop(0.5, '#5580c8');
   grad.addColorStop(1, '#c8a05e');
   g.fillStyle = grad;
   g.fillRect(0,0,8,512);
   const t = toTex(c);
  t.minFilter = THREE.LinearFilter;
 return t;
}

export function cloudTexture() {
  const c = canvas(256,128);
  const g = c.getContext('2d');
  for (let i = 0; i < 14; i++) {
    const x = rnd() * 256;
    const y = 30 + rnd() * 68;
    const r = 18 + rnd() * 34;
    g.fillStyle = 'rgba(255,240,220,0.14)';
    g.beginPath();
    g.arc(x,y,r,0,Math.PI * 2);
    g.fill();
  }
  return toTex(c);
}

export function radialGlowTexture() {
  const c = canvas(64,64);
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32,32,0,32,32,32);
  grad.addColorStop(0, 'rgba(255,215,150,0.9)');
   grad.addColorStop(0.4, 'rgba(255,190,110,0.35)');
   grad.addColorStop(1, 'rgba(255,180,100,0)');
   g.fillStyle = grad;
   g.beginPath();
  g.arc(32,32,32,0,Math.PI * 2);
   g.fill();
  return toTex(c);
}

export function makeSandstoneTexture(w, h) { return sandstoneTexture(w, h); }
export function makeBannerTexture(w, h) {
  const c = canvas(w ||  64, h ||  64);
  const g = c.getContext('2d');
  g.fillStyle = '#2b6cb0';
   g.fillRect(0,0,c.width,c.height);
  const stripes = 4;
  for (let i =  0; i < stripes; i++) {
    g.fillStyle = i % 2 === 0 ? '#2b6cb0' : '#e8b65a';
    g.fillRect(0, (c.height / stripes) * i, c.width, c.height / stripes);
  }
  g.fillStyle = '#f5e6c8';
   g.font = 'bold 16px Georgia, serif';
   g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('◈', c.width / 2, c.height / 2);
   return toTex(c, { repeat: true });
}

export function makeWaterTexture(w, h) {
  return plasterTexture(w ||  64, h ||  64);
}