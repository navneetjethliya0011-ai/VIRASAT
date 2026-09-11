// Deterministic value noise for procedural terrain — no external assets required.
let seed = 1337;

export function setSeed(s) { seed = s |  0; }

export function hash2(x, y) {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(seed, 224682251);
  h = Math.imul(h ^ (h >>>  13),1552433901);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

export function smoothNoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi), b = hash2(xi + 1, yi), c = hash2(xi, yi + 1), d = hash2(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

export function fbm(x, y, octaves = 4) {
  let amp = 0.5, freq = 1, val =0, norm =0;
  for (let i =0; i < octaves; i++){
    val += amp * smoothNoise(x * freq, y * freq);
    norm += amp;
    amp *=0.5;
    freq *=2;
  }
  return val / norm;
}