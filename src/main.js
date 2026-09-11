// VIRASAT bootstrap - menu, India map, scene loop, HUD overlays.
import * as THREE from 'three';
import { RajasthanScene } from './scenes/RajasthanScene.js';
import { gameState } from './state/GameState.js';
import { settingsManager } from './settings/settingsManager.js';
import { REGIONS, ARTIFACTS, JOURNAL, LANGUAGE, QUESTS, CULTURAL_GUIDE, TRAVEL_TIPS } from './data/content.js';
import { CONFIG } from './config.js';

const app = document.getElementById('app');
const ui = createUI();

let renderer = null;
let scene = null;
let paused = true;
let started = false;
let raf = 0;

function createUI() {
  const overlay = document.createElement('div');
  overlay.id = 'ui-root';
  overlay.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:10;font-family:Georgia,serif;color:#eadcc0;';
  const hud = document.createElement('div');
  hud.id = 'hud';
  hud.style.cssText = 'display:none;pointer-events:none;position:absolute;inset:0;';
  const cross = document.createElement('div');
  cross.style.cssText = 'position:absolute;left:50%;top:50%;width:6px;height:6px;transform:translate(-50%,-50%);border:2px solid rgba(255,230,180,0.8);border-radius:50%;';
  hud.appendChild(cross);
  const topBar = document.createElement('div');
  topBar.style.cssText = 'position:absolute;top:10px;left:50%;transform:translateX(-50%);display:flex;gap:8px;pointer-events:auto;background:rgba(20,12,6,0.55);padding:6px 10px;border-radius:10px;border:1px solid rgba(217,161,90,0.35);';
  topBar.innerHTML = '<button data-panel="quests">📜 Quests</button><button data-panel="journal">📖 Journal</button><button data-panel="inventory">🎒 Inventory</button><button data-panel="guide">🗣️ Guide</button><button data-panel="settings">⚙️</button>';
  hud.appendChild(topBar);
  const hint = document.createElement('div');
  hint.id = 'interact-hint';
  hint.style.cssText = 'position:absolute;bottom:22%;left:50%;transform:translateX(-50%);background:rgba(10,6,3,0.72);padding:6px 14px;border-radius:8px;border:1px solid rgba(217,161,90,0.5);font-size:15px;display:none;';
  hud.appendChild(hint);
  const questBox = document.createElement('div');
  questBox.id = 'quest-hud';
  questBox.style.cssText = 'position:absolute;top:64px;right:12px;width:230px;background:rgba(20,12,6,0.6);padding:8px 12px;border-radius:10px;border:1px solid rgba(217,161,90,0.3);font-size:13px;pointer-events:none;';
  hud.appendChild(questBox);
  const toastBox = document.createElement('div');
  toastBox.id = 'toast-box';
  toastBox.style.cssText = 'position:absolute;top:110px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;gap:6px;align-items:center;pointer-events:none;';
  hud.appendChild(toastBox);
  const pauseScreen = document.createElement('div');
  pauseScreen.id = 'pause-screen';
  pauseScreen.style.cssText = 'position:fixed;inset:0;background:rgba(8,5,2,0.72);display:none;align-items:center;justify-content:center;flex-direction:column;gap:14px;pointer-events:auto;';
  pauseScreen.innerHTML = '<h2 style="margin:0;font-size:26px;letter-spacing:2px;">VIRASAT</h2><p style="margin:0;opacity:0.75;font-size:14px;">Click to resume</p>';
  overlay.appendChild(pauseScreen);
  const panels = document.createElement('div');
  panels.id = 'panels';
  panels.style.cssText = 'position:absolute;inset:0;display:none;flex-direction:column;align-items:center;justify-content:flex-start;padding:40px 16px;background:rgba(10,6,3,0.78);pointer-events:auto;overflow:auto;';
  panels.innerHTML = '<div id="panel-sheet" style="width:min(640px,92vw);background:#1a120b;border:1px solid rgba(217,161,90,0.5);border-radius:14px;padding:18px 22px;box-shadow:0 8px 30px rgba(0,0,0,0.5);"></div>';
  overlay.appendChild(panels);
  overlay.appendChild(hud);
  app.appendChild(overlay);
  const api = {
    settings: settingsManager,
    initHUD() {},
    toast(msg, ms) {
      const t = document.createElement('div');
      t.textContent = msg;
      t.style.cssText = 'background:rgba(20,12,6,0.85);border:1px solid rgba(217,161,90,0.5);padding:8px 16px;border-radius:8px;font-size:14px;animation:toastIn .25s;';
      toastBox.appendChild(t);
      setTimeout(() => t.remove(), ms || 3200);
    },
    setPaused(v) { paused = !!v; },
    setInteractHint(text) {
      if (!text) { hint.style.display = 'none'; return; }
      hint.textContent = text;
      hint.style.display = 'block';
    },
    showDialogue(dlg, onClose) {
      const d = dlg || { lines: [] };
      let i = 0;
      const box = document.createElement('div');
      box.style.cssText = 'position:absolute;left:50%;bottom:10%;transform:translateX(-50%);width:min(560px,92vw);background:rgba(20,12,6,0.94);border:1px solid rgba(217,161,90,0.55);border-radius:12px;padding:14px 18px;pointer-events:auto;';
      const meta = document.createElement('div');
      meta.style.cssText = 'font-size:15px;font-weight:bold;color:#e8b65a;margin-bottom:6px;';
      meta.textContent = (dlg?.npc || 'Meera');
      const body = document.createElement('div');
      body.style.cssText = 'font-size:15px;line-height:1.5;min-height:40px;';
      body.textContent = d.lines[0]?.text || '';
      const next = document.createElement('button');
      next.textContent = 'Continue ▸';
      next.style.cssText = 'margin-top:10px;background:#2b6cb0;border:none;color:#fff;padding:6px 16px;border-radius:8px;cursor:pointer;font-size:14px;';
      box.append(meta, body, next);
      overlay.appendChild(box);
      const advance = () => {
        i++;
        if (i >= d.lines.length) {
          box.remove();
          if (onClose) onClose();
          return;
        }
        body.textContent = d.lines[i]?.text || '';
        next.textContent = i === d.lines.length - 1 ? 'Done' : 'Continue ▸';
      };
      next.addEventListener('click', advance);
      box.addEventListener('click', ev => { if (ev.target === box) advance(); });
    },
    updateQuest(stages, idx, ms) {
      const cur = stages[Math.max(0, Math.min(stages.length - 1, idx -  1))];
      questBox.innerHTML = '<div style="font-weight:bold;color:#e8b65a;margin-bottom:4px;">📜 Heart of the Desert</div>' + stages.map((s, n) => '<div style="' + (n <= (idx - 1) ? 'opacity:0.55;text-decoration:line-through;' : n === idx ? 'color:#ffe3a8;' : 'opacity:0.6;') + 'padding:2px 0;">' + (n === idx ? '▸ ' : n < (idx - 1) ? '✓ ' : '• ') + s.label + '</div>').join('');
    },
    updateJournalHints() {
      const hintTxt = TRAVEL_TIPS[2] || '';
      hint.textContent = hintTxt;
    },
    updateInventory() {
      openPanel('inventory', true);
    },
    openGuide() {
      openPanel('guide');
    },
  };
  return api;
}

function openPanel(kind, silent) {
  if (!silent) {
    if (document.pointerLockElement) document.exitPointerLock();
    paused = true;
  }
  const sheet = document.getElementById('panel-sheet');
  if (!sheet) return;
  panels.style.display = 'flex';
  let html = '';
  if (kind === 'inventory') {
    const inv = gameState.state.inventory.map(it => { const a = ARTIFACTS.find(x => x.id === it.id); return a ? '<div style="display:flex;gap:10px;align-items:center;padding:8px;border-bottom:1px solid rgba(217,161,90,0.15);"><span style="font-size:24px;">' + a.icon + '</span><div><b>' + a.name + '</b><div style="opacity:0.7;font-size:13px;">' + a.description + '</div></div></div>' : ''; }).join('');
    html = '<h2 style="margin:0 0 10px;">🎒 Inventory</h2>' + (inv || '<p style="opacity:0.7;">Your collection is empty. Find artifacts across India.</p>');
  } else if (kind === 'journal') {
    const entries = gameState.state.journal.map(id => { const j = JOURNAL.find(x => x.id === id); return j ? '<div style="padding:8px 0;border-bottom:1px solid rgba(217,161,90,0.15);"><b>' + j.title + '</b><div style="opacity:0.8;font-size:13px;line-height:1.45;">' + j.text + '</div></div>' : ''; }).join('');
    html = '<h2 style="margin:0 0 10px;">📖 Travel Journal</h2>' + (entries || '<p style="opacity:0.7;">No entries yet. Visit places and talk to people to fill your journal.</p>');
  } else if (kind === 'quests') {
    const q = QUESTS.map(qu => { const st = gameState.questStatus(qu.id); return '<div style="padding:10px 0;border-bottom:1px solid rgba(217,161,90,0.15);"><b>' + qu.title + '</b> <span style="color:#e8b65a;">[' + st.toUpperCase() + ']</span><p style="margin:4px 0 0;opacity:0.75;font-size:13px;">' + qu.objective + '</p></div>'; }).join('');
    html = '<h2 style="margin:0 0 10px;">📜 Quests</h2>' + q;
  } else if (kind === 'guide') {
    const langs = gameState.state.language.map(id => { const w = LANGUAGE.find(x => x.id === id); return w ? '<li><b>' + w.word + '</b> — ' + w.meaning + '</li>' : ''; }).join('');
    html = '<h2 style="margin:0 0 10px;">🗣️ Cultural Guide</h2><p style="opacity:0.8;font-size:13px;">Ask about Rajasthan:type a word below (stepwell, fort, phad, food, camel...).</p><input id="guide-ask" style="width:100%;padding:8px;margin:8px 0;border-radius:8px;border:1px solid rgba(217,161,90,0.4);background:#120b06;color:#eadcc0;font-size:14px;" placeholder="e.g. Tell me about stepwells"><div id="guide-answer" style="opacity:0.9;font-size:14px;line-height:1.5;margin:6px 0;"></div><h3 style="margin:12px 0 4px;">🈶 Language Learned</h3><ul style="margin:0;padding-left:18px;">' + (langs || '<li style="opacity:0.6;">None yet. Greet Meera to learn words.</li>') + '</ul>';
  } else if (kind === 'settings') {
    const s = settingsManager.settings;
    const checked = s.invertY ? 'checked' : '';
    html = '<h2 style="margin:0 0 10px;">⚙️ Settings</h2><label style="display:block;margin:6px 0;">Sensitivity <input id="set-sens" type="range" min="0.2" max="2.5" step="0.05" value="' + s.sensitivity + '" style="width:70%;vertical-align:middle;"></label><label style="display:block;margin:6px 0;">Invert Y <input id="set-inv" type="checkbox" ' + checked + '></label><button id="set-reset" style="margin-top:8px;background:#5a3a1e;border:none;padding:6px 14px;border-radius:8px;color:#eadcc0;cursor:pointer;">Reset settings</button>';
  }
  sheet.innerHTML = html;
  if (kind === 'guide') bindGuidePanel();
  if (kind === 'settings') bindSettingsPanel();
}

function bindGuidePanel() {
  const input = document.getElementById('guide-ask');
  const out = document.getElementById('guide-answer');
  if (!input || !out) return;
  input.addEventListener('keydown', ev => {
    if (ev.key !== 'Enter') return;
    const q = input.value.toLowerCase();
    let ans = '';
    for (const entry of CULTURAL_GUIDE) {
      if (entry.keywords.some(k => q.includes(k))) { ans = entry.answer; break; }
    }
    out.textContent = ans || 'I don’t know that one yet. Try "stepwell", "fort", "phad", "food", or "camel".';
  });
}

function bindSettingsPanel() {
  const sens = document.getElementById('set-sens');
  const inv = document.getElementById('set-inv');
  const reset = document.getElementById('set-reset');
  if (sens) sens.addEventListener('input', () => settingsManager.set('sensitivity', parseFloat(sens.value), true));
  if (inv) inv.addEventListener('change', () => settingsManager.set('invertY', inv.checked, true));
  if (reset) reset.addEventListener('click', () => { settingsManager.reset(); openPanel('settings', true); });
}

function showMenu() {
  panels.style.display = 'none';
  const menu = document.createElement('div');
  menu.id = 'main-menu';
  menu.style.cssText = 'position:fixed;inset:0;background:radial-gradient(ellipse at 50% 20%,#2a1a0c,#0d0804 75%);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;pointer-events:auto;text-align:center;';
  const emblem = document.createElement('div');
  emblem.style.cssText = 'font-size:56px;';
  emblem.textContent = '🏜️';
  const title = document.createElement('h1');
  title.textContent = 'VIRASAT';
  title.style.cssText = 'margin:0;font-size:52px;letter-spacing:8px;color:#e8b65a;text-shadow:0 2px 12px rgba(0,0,0,0.6);';
  const sub = document.createElement('p');
  sub.innerHTML = 'Virtual Immersive Recreation of Ancient Stories, Art &amp; Traditions';
  sub.style.cssText = 'margin:4px 0 0;opacity:0.85;font-size:14px;letter-spacing:1px;';
  const tag = document.createElement('p');
  tag.innerHTML = 'Rajasthan — ' + (REGIONS[0]?.tagline || 'Land of Kings');
  tag.style.cssText = 'margin:10px 0 26px;opacity:0.75;font-size:15px;max-width:560px;padding:0 20px;';
  const startBtn = document.createElement('button');
  startBtn.id = 'start-journey';
  startBtn.textContent = 'START JOURNEY';
  startBtn.style.cssText = 'background:linear-gradient(180deg,#c88a2e,#8a5a1e);border:1px solid rgba(255,220,160,0.5);color:#ffedcf;font-size:18px;letter-spacing:3px;padding:14px 38px;border-radius:12px;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,0.5);';
  const tip = document.createElement('p');
  tip.textContent = 'WASD move · Mouse look · E interact · Shift sprint';
  tip.style.cssText = 'margin-top:24px;opacity:0.55;font-size:13px;';
  menu.append(emblem, title, sub, tag, startBtn, tip);
  app.appendChild(menu);
  startBtn.addEventListener('click', () => showMap());
}

function showMap() {
  const old = document.getElementById('main-menu');
  if (old) old.remove();
  const map = document.createElement('div');
  map.id = 'india-map';
  map.style.cssText = 'position:fixed;inset:0;background:radial-gradient(circle at 50% 30%,#1c2413,#0b0d06 80%);display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:auto;';
  const h = document.createElement('h2');
  h.textContent = 'Choose a Region — India';
  h.style.cssText = 'margin:0 0 6px;color:#e8b65a;letter-spacing:3px;';
  const honey = document.createElement('p');
  honey.textContent = 'Hover the gold marker, then click Rajasthan to begin your journey.';
  honey.style.cssText = 'margin:0 0 22px;opacity:0.8;font-size:14px;';
  const stage = document.createElement('div');
  stage.style.cssText = 'position:relative;width:min(520px,90vw);height:min(560px,82vh);background:rgba(255,240,200,0.05);border:1px solid rgba(217,161,90,0.25);border-radius:16px;overflow:hidden;';
  const rajasthan = document.createElement('button');
  rajasthan.style.cssText = 'position:absolute;left:112px;top:86px;width:96px;height:64px;border-radius:12px;border:2px solid #d9a15a;background:rgba(217,161,90,0.28);color:#ffe3a8;font-size:13px;font-weight:bold;letter-spacing:1px;cursor:pointer;box-shadow:0 0 18px rgba(217,161,90,0.4);';
  rajasthan.textContent = 'RAJASTHAN';
  stage.appendChild(rajasthan);
  const hint2 = document.createElement('div');
  hint2.style.cssText = 'position:absolute;right:14px;bottom:14px;font-size:12px;opacity:0.5;';
  hint2.textContent = 'More regions coming soon';
  stage.appendChild(hint2);
  map.append(h, honey, stage);
  app.appendChild(map);
  rajasthan.addEventListener('click', () => { map.remove(); startGame('rajasthan'); });
}

function startGame(regionId) {
  if (started) return;
  started = true;
  gameState.startRegion(regionId);
  const canvas = document.createElement('canvas');
  canvas.id = 'game-canvas';
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;display:block;';
  app.appendChild(canvas);
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  const preset = settingsManager.get('preset') || 'medium';
  renderer.setPixelRatio(Math.min(window.devicePixelRatio ||  1, uploadPreset(preset)));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = !!settingsManager.get('shadows');
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const resize = () => {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h);
    if (scene && scene.camera) {
      scene.camera.aspect = w / h;
      scene.camera.updateProjectionMatrix();
    }
  };
  window.addEventListener('resize', resize);
  scene = new RajasthanScene(renderer, ui, {});
  document.getElementById('hud').style.display = 'block';
  panels.style.display = 'none';
  paused = false;
  setTimeout(() => ui.toast('Welcome to Rajasthan! Explore the bazaar, meet Meera, and find the royal seal.', 5000, 600));
  animate();
  requestPointerLockNow();
}

function uploadPreset(preset) {
  const p = { low:  1, medium:  1.5, high:  2, ultra:  2 };
  return p[preset] ||  1.5;
}

function requestPointerLockNow() {
  const c = document.getElementById('game-canvas');
  if (c && document.pointerLockElement !== c) c.requestPointerLock();
}

function animate() {
  raf = requestAnimationFrame(animate);
  if (!scene) return;
    const dt = Math.min(scene.clock.getDelta(),  0.05);
  if (!paused && started) {
    scene.update(dt);
    gameState.addPlayTime(dt);
  }
  renderer.render(scene.scene, scene.camera);
}

document.addEventListener('pointerlockchange', () => {
  if (!scene) return;
  const locked = document.pointerLockElement === document.getElementById('game-canvas');
  if (locked) {
    paused = false;
    document.getElementById('pause-screen').style.display = 'none';
  } else if (started) {
    paused = true;
    document.getElementById('pause-screen').style.display = 'flex';
  }
});

document.addEventListener('keydown', ev => {
  if (ev.code === 'KeyI') { ev.preventDefault(); openPanel('inventory'); }
  if (ev.code === 'KeyJ') { ev.preventDefault(); openPanel('quests'); }
  if (ev.code === 'KeyH') { ev.preventDefault(); openPanel('guide'); }
  if (ev.code === 'Tab') { ev.preventDefault(); openPanel('journal'); }
  if (ev.code === 'Escape' && panels.style.display === 'flex') {
    ev.preventDefault();
    panels.style.display = 'none';
    paused = false;
    requestLockSoon();
  }
});

app.addEventListener('click', ev => {
  const btn = ev.target.closest('button[data-panel]');
  if (!btn) return;
  if (btn.dataset.panel === 'settings') { openPanel('settings'); return; }
  if (btn.dataset.panel === 'inventory') { openPanel('inventory'); return; }
  if (btn.dataset.panel === 'journal') { openPanel('journal'); return; }
  if (btn.dataset.panel === 'quests') { openPanel('quests'); return; }
  if (btn.dataset.panel === 'guide') { openPanel('guide'); return; }
});

showMenu();

// Minimal debug handle (harmless) for verification tooling.
window.__virasat = {
  getCamera: () => scene && scene.camera,
  getScene: () => scene,
  getGameState: () => gameState,
  getPaused: () => paused,
  update: (dt) => scene.update(dt),
};