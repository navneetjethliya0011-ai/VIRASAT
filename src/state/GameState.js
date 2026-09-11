// Central game state with localStorage persistence and subscriber notifications.
import { CONFIG } from '../config.js';

const emptyState = () => ({
  version: CONFIG.version,
  region: null,
  player: { x: 0, y: 4, z: 0, yaw: 0, pitch: 0 },
  quests: {},  // questId -> { status: 'active'|'completed'|'locked', stage: n, flags: {…} }
  questLog: [],
  inventory: [],
  journal: [],
  language: [],
  discoveredLocations: [],
  completion: null,
  playTime:  0,
  lastPlayed: null,
});

class GameState {
  constructor() {
    this.state = this.load();
    this.subscribers = [];
  }

  load() {
    try {
      const raw = localStorage.getItem(CONFIG.saveKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        const base = emptyState();
        return { ...base, ...parsed, player: { ...base.player, ...(parsed.player || {}) } };
      }
    } catch (e) {
      console.warn('Save load failed', e);
    }
    return emptyState();
  }

  emit() {
    for (const fn of this.subscribers) {
      try { fn(this.state); } catch (e) { console.warn(e); }
    }
  }

  subscribe(fn) {
    this.subscribers.push(fn);
  }

  save() {
    this.state.lastPlayed = Date.now();
    try {
      localStorage.setItem(CONFIG.saveKey, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Save failed — progress not persisted', e);
    }
    this.emit();
  }

  reset() {
    localStorage.removeItem(CONFIG.saveKey);
    this.state = emptyState();
    this.emit();
  }

  hasSave() {
    return !!localStorage.getItem(CONFIG.saveKey);
  }

  setPlayer(x, y, z, yaw, pitch) {
    const p = this.state.player;
    if (x !== undefined) p.x = x;
    if (y !== undefined) p.y = y;
    if (z !== undefined) p.z = z;
    if (yaw !== undefined) p.yaw = yaw;
    if (pitch !== undefined) p.pitch = pitch;
  }

  startRegion(regionId) {
    this.state.region = regionId;

    this.save();
  }

  getQuest(questId) {
    let q = this.state.quests[questId];
    if (!q) { q = { status: 'active', stage: 0, flags: {} };
      this.state.quests[questId] = q;
    }
    return q;
  }

  setQuestStage(questId, stage) {
    const q = this.getQuest(questId);
    q.stage = stage;
    q.status = 'active';
    this.save();
  }

  setQuestFlag(questId, key, value) {
    this.getQuest(questId).flags[key] = value;
    this.save();
  }

  getQuestFlag(questId, key, fallback) {
    return this.state.quests[questId] ? this.state.quests[questId].flags[key] !== undefined ? this.state.quests[questId].flags[key] : fallback : fallback;
  }

  completeQuest(questId, opts) {
    const q = this.getQuest(questId);
    q.status = 'completed';
    if (opts && opts.stage !== undefined) q.stage = opts.stage;
    this.save();
  }

  questStatus(questId) {
    const q = this.state.quests[questId];
    return q ? q.status : 'locked';
  }

  addToInventory(itemId, meta) {
    if (this.hasItem(itemId)) return { added: false, reason: 'already' };
    this.state.inventory.push({ id: itemId, at: Date.now(), ...(meta || {}) });
    this.save();
    return { added: true };
  }

  addInventory(itemId, meta) {
    return this.addToInventory(itemId, meta);
  }

  hasItem(itemId) {
    return this.state.inventory.some(it => it.id === itemId);
  }

  addJournal(entryIds, via) {
    const added = [];
    for (const id of (Array.isArray(entryIds) ? entryIds : [entryIds])) {
      if (!this.state.journal.includes(id)) {
        this.state.journal.push(id);
        added.push({ id, via: via || null });
      }
    }
    if (added.length) this.save();
    return added;
  }

  hasJournal(entryId) {
    return this.state.journal.includes(entryId);
  }

  addLanguage(wordIds) {
    const added = [];
    for (const id of (Array.isArray(wordIds) ? wordIds : [wordIds])) {
      if (!this.state.language.includes(id)) {
        this.state.language.push(id);
        added.push(id);
      }
    }
    if (added.length) this.save();
    return added;
  }

  hasLanguage(wordId) {
    return this.state.language.includes(wordId);
  }

  discoverLocation(locId) {
    if (!this.state.discoveredLocations.includes(locId)) {
      this.state.discoveredLocations.push(locId);
      this.save();
      return true;
    }
    return false;
  }

  isDiscovered(locId) {
    return this.state.discoveredLocations.includes(locId);
  }

  addPlayTime(dt) {
    this.state.playTime += dt;

    if (this.state.playTime %  30 < dt) this.save();
  }

  setCompletion(stats) {
    this.state.completion = stats;
    this.save();
  }
}

export const gameState = new GameState();