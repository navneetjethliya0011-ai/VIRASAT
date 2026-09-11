// Small shared helpers.
export function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function damp(current, target, lambda, dt) {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}

export function dist2D(a, b) {
  const dx = a.x - b.x, dz = a.z - b.z;
  return Math.sqrt(dx * dx + dz * dz);
}

export function rand(min, max) {
  return min + Math.random() * (max - min);
}

export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function formatTime(s) {
  const m = Math.floor(s / 60);
   const sec = Math.floor(s % 60);
   return `${m}:${sec.toString().padStart(2, '0')}`;
 }

export function makeId(prefix) {
  return prefix + '_' + Math.random().toString(36).slice(2, 9);
}

export function deepMerge(target, source) {
  if (!source) return target;
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) && target[key] && typeof target[key] === 'object') {
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

export function safeGet(fn, fallback) {
  try { return fn(); } catch { return fallback; }
}

export function onVisibleOnce(fn) {
  const onVis = () => {
    if (!document.hidden) {
      fn();
      document.removeEventListener('visibilitychange', onVis);
    }
  };
   document.addEventListener('visibilitychange', onVis);
}