// Settings manager - persistent via localStorage, drives real engine values.
import { DEFAULT_SETTINGS, GRAPHICS_PRESETS, CONFIG } from '../config.js';
import { deepMerge } from '../utils/helpers.js';

class SettingsManager {
  constructor() {
    this.settings = this.load();
    this.listeners = [];
  }

  load() {
    try {
      const raw = localStorage.getItem(CONFIG.settingsKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        return deepMerge(structuredClone(DEFAULT_SETTINGS), parsed);
      }
    } catch (e) {
      console.warn('Settings load failed', e);
    }
    return structuredClone(DEFAULT_SETTINGS);
  }

  applyPreset(presetName) {
    const preset = GRAPHICS_PRESETS[presetName];
    if (!preset) return;
    const s = this.settings;
    s.preset = presetName;
    s.shadows = preset.shadows;
    if (presetName === 'low') {
      s.particles = false;
      s.ambientFx = false;
      s.cameraFx = false;
    }
    this.saveAndEmit();
  }

  get(name) {
    return this.settings[name];
  }

  set(name, value, silent) {
    this.settings[name] = value;
    if (name === 'preset') {
      const preset = GRAPHICS_PRESETS[value];
      if (preset) {
        this.settings.shadows = preset.shadows;
        this.settings.particles = true;
        if (value === 'low') {
          this.settings.shadows = false;
          this.settings.particles = false;
          this.settings.ambientFx = false;
        }
      }
    }
    this.saveAndEmit(silent);
  }

  toggle(name) {
    this.set(name, !this.settings[name]);
  }

  onChanged(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(f => f !== fn);
    };
  }

  saveAndEmit(silent) {
    try {
      localStorage.setItem(CONFIG.settingsKey, JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Settings save failed', e);
    }
    if (!silent) for (const fn of this.listeners) fn(this.settings);
  }

  reset() {
    this.settings = structuredClone(DEFAULT_SETTINGS);
    this.saveAndEmit();
  }

  save() {
    try {
      localStorage.setItem(CONFIG.settingsKey, JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Settings save failed', e);
    }
  }
}

export const settingsManager = new SettingsManager();