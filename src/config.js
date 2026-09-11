// Global configuration for VIRASAT
export const CONFIG = {
  version: '0.1.0',
  saveKey: 'virasat-save-v1',
  settingsKey: 'virasat-settings-v1',
  startRegion: 'rajasthan',
};

export const KEYS = {
  forward: ['KeyW', 'ArrowUp'],
  back: ['KeyS', 'ArrowDown'],
  left: ['KeyA', 'ArrowLeft'],
  right: ['KeyD', 'ArrowRight'],
  interact: 'KeyE',
  sprint: 'ShiftLeft',
  jump: 'Space',
  pause: 'Escape',
};

export const GRAPHICS_PRESETS = {
  low: { label: 'LOW', pixelRatioCap: 1, shadows: false, shadowMapSize: 512, drawDistance:  180, fogDensityFactor:  1.35, particles: 0.4, terrainSegments: 96, wallSegments: 2 },
   medium: { label: 'MEDIUM', pixelRatioCap:  1.5, shadows: true, shadowMapSize: 1024, drawDistance: 260, fogDensityFactor: 1.0, particles: 0.7, terrainSegments: 128, wallSegments: 3 },
   high: { label: 'HIGH', pixelRatioCap:  2, shadows: true, shadowMapSize: 2048, drawDistance: 340, fogDensityFactor: 0.85, particles: 0.9, terrainSegments: 160, wallSegments: 4 },
   ultra: { label: 'ULTRA', pixelRatioCap:  0, shadows: true, shadowMapSize: 2048, drawDistance: 420, fogDensityFactor: 0.75, particles: 1, terrainSegments: 192, wallSegments: 5 },
 };

export const DEFAULT_SETTINGS = {
  master: 0.8, music: 0.7, sfx: 0.8, preset: 'medium',
  shadows: true, particles: true, ambientFx: true, cameraBob: true,
  cameraFx: true, textScale: 1, subtitles: true, reducedMotion: false,
  highContrast: false, sensitivity: 1, invertY: false,
 };

export const JOURNAL_CATEGORIES = [
  { id: 'history', label: 'History' },
  { id: 'monuments', label: 'Monuments' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'language', label: 'Language' },
  { id: 'arts', label: 'Arts & Crafts' },
   { id: 'traditions', label: 'Traditions' },
   { id: 'artifacts', label: 'Artifacts' },
   { id: 'people', label: 'People' },
   { id: 'places', label: 'Places' },
   { id: 'food', label: 'Food' },
   { id: 'music', label: 'Music' },
   { id: 'water', label: 'Water Systems' },
   { id: 'trade', label: 'Trade & Daily Life' },
 ];

export const REGION_LABEL = 'Rajasthan';
export const REGION_TAGLINE = '"Land of Kings — forts, stepwells, desert routes, crafts and living traditions."';
