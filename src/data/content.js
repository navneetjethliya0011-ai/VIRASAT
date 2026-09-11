// VIRASAT content data — regions, quests, artifacts, journal, language, dialogs.
// All heritage claims below are based on established, widely-documented features of Rajasthan.
import { REGION_LABEL } from '../config.js';

export const REGIONS = [
  {
    id: 'rajasthan',
    name: REGION_LABEL,
    tagline: '"Land of Kings — forts, stepwells, desert routes, crafts and living traditions."',
    tagline2: 'Golden dunes, blue cities, and stories carved in stone.',
    color: '#d9a15a',
    accent: '#2b6cb0',
    start: { x:  0, y:  1.7, z:  8 },
    blurb: 'Step into Rajasthan, a living museum of forts, stepwells, bazaars and desert trails. Your guide, Meera, awaits beheinda worn stone archway of the Spice Bazaar.',
  },
];

export const QUIZ_QUESTIONS = [];

export const QUESTS = [
  {
    id: 'heart_of_the_desert',
    region: 'rajasthan',
    title: 'Heart of the Desert',
    giver: 'Meera',
    objective: 'Meet Meera at the Spice Bazaar archway, then search the old stepwell for the missing royal seal.',
    intro: 'Meera, a young heritage conservator,d greets you: "Welcome to Jaisalmer, traveller. A royal seal was lost while the old stepwell was being cleaned. It must be found before sunset prayers."',
    stages: [
      { label: 'Meet Meera at the Spice Bazaar archway.' },
      { label: 'Speak with Meera and accept her request.' },
      { label: 'Find the royal seal near the old stepwell.' },
      { label: 'Return the seal to Meera.' },
    ],
    rewards: {
      journal: ['raj_meera', 'raj_stepwell'],
      artifact: 'raj_royal_seal',
      xp: 120,
    },
  },
];

export const ARTIFACTS = [
  {
    id: 'raj_royal_seal',
    name: 'Royal Sandstone Seal',
    category: 'artifacts',
    icon: '🔶',
    description: 'A small carved jharokha seal in mustard sandstone, used to stamp royal dispatches in 13th-century Jaisalmer.',
  },
  {
    id: 'raj_phad_scroll',
    name: 'Pabuji Phad Scroll',
    category: 'arts',
    icon: '🖼️',
    description: 'A cloth scroll for the Pabuji epic, painted in vegetable dyes by the Joshi family of Bhilwara.',
  },
  {
    id: 'raj_blue_pot',
    name: 'Jodhpur Blue Pottery Fragment',
    category: 'arts',
    icon: '🏺',
    description: 'Cobalt-glazed shard from the blue pottery tradition of Jodhpur.',
  },
];

export const JOURNAL = [
  {
    id: 'raj_meera',
    category: 'people',
    title: 'Meera — The Young Conservator',
    text: 'Meera guides travellers through Jaisalmer. She catalogues fading stepwell carvings before the desert wind claims them.',
  },
  {
    id: 'raj_stepwell',
    category: 'water',
    title: 'Rajasthan’s Stepwells',
    text: 'Stepwells (baolis) turned desert water into architecture — multi-storey wells whose shaded galleries collected every drop of rain. Jaisalmer’s stepwells are among the finest.',
  },
  {
    id: 'raj_fort',
    category: 'monuments',
    title: 'Jaisalmer Fort — The Golden Fort',
    text: 'Rising from the Thar desert, Jaisalmer’s sandstone fort glows gold at sunset. Its walls sheltered merchants on the silk route to Persia.',
  },
  {
    id: 'raj_phad',
    category: 'arts',
    title: 'Pabuji Phad Painting',
    text: 'Phad is a scroll painting tradition from Bhilwara. Painted in natural dyes, it narrates the epic of Pabuji, the hero-god of shepherds.',
  },
  {
    id: 'raj_rajasthani_tradition',
    category: 'traditions',
    title: 'Living Traditions of Rajasthan',
    text: 'Puppet shows, camel fairs, turban tying, folk ballads — Rajasthani traditions area handed down ash oral lore, sung and danced at fairs after harvests.',
  },
];

export const LANGUAGE = [
  {
    id: 'raj_khamma_ghani',
    word: 'Khamma Ghani',
    meaning: '“Khamma Ghani” is a warm Rajasthani greeting — literally “bow to you, many times.”',
  },
  {
    id: 'raj_padharo',
    word: 'Padharo Mhare Desh',
    meaning: '“Padharo Mhare Desh” means “Welcome to my land” — the famous Rajasthani invitation.',
  },
];

export const PORTRAITS = {
  meera: { name: 'Meera', color: '#c05a3a', emoji: '🧕🏽' },
};

export const DIALOGUES = [
  {
    id: 'meera_intro',
    npc: 'meera',
    lines: [
      { text: 'Namaste, traveller. Welcome to Jaisalmer — the Golden City.',
        say: 'Welcome to Jaisalmer, the Golden City!' },
      { text: 'I am Meera, a heritage conservator. A royal seal was lost while the stepwell was cleaned.' },
      { text: 'Find it beheindthe old stepwell and bring it back tome. I will reward you.',
        say: 'Find the royal seal beheindthe stepwell!' },
    ],
  },
  {
    id: 'meera_seal_returned',
    npc: 'meera',
    lines: [
      { text: 'You found it. Thank you, traveller. The seal will be returned to its alcove tonight.',
        say: 'You found the royal seal!' },
      { text: 'Take this phad scroll piece as a token of our gratitude.',
        say: 'You received: Pabuji Phad Scroll (journal entry).' },
    ],
  },
  {
    id: 'guide_greeting',
    npc: 'guide',
    lines: [
      { text: 'The Cultural Guide answers questions about Rajasthan — forts, stepwells, crafts, food and language.' },
      { text: 'Ask me something like “Tell me about stepwells”.' },
    ],
  },
];

export const CULTURAL_GUIDE = [
  {
    keywords: ['stepwell', 'baoli', 'water', 'well'],
    answer: 'Rajasthan’s stepwells (baolis) are multi-storey wells that turn every drop of desert rain into life. They double as cool meeting halls and are architectural wonders.',
  },
  {
    keywords: ['fort', 'jaisalmer', 'golden'],
    answer: 'Jaisalmer Fort, raised impassive yellow sandstone in 1156 AD by Rawal Jaisal, glows gold at dusk. It is one of the largest fully-living forts in the world.',
  },
  {
    keywords: ['phad', 'painting', 'scroll', 'pabuji'],
    answer: 'Phad painting from Bhilwara narrates the Pabuji epic on a long cloth scroll. Vegetable dyes, bold outlines, and musicians who sing while unrolling it.',
  },
  {
    keywords: ['language', 'marwari', 'word', 'greet', 'khamma'],
    answer: 'Rajasthani languages like Marwari carry warm greetings: “Khamma Ghani” (bow every time)and “Padharo Mhare Desh” (welcome to my land).',
  },
  {
    keywords: ['food', 'dal', 'bati', 'churma', 'lal maas'],
    answer: 'Rajasthani food is born of the desert: Dal Baati Churma, fiery Laal Maas, and sweet Ghevar — hearty dishes that travelled well on camelback.',
  },
  {
    keywords: ['camel', 'desert', 'safari', 'thar', 'dune'],
    answer: 'The Thar desert was a highway, not a barrier: camel caravans carried silk, spices and stories between Persia and the Gangetic plains.',
  },
];

export const TRAVEL_TIPS = [
  'WASD or arrow keys to walk, mouse to look around, E to interact. Shift to sprint.',
  'Press Tab to open the journal, I for inventory, J for quests, H for the cultural guide.',
  'Look for the golden marker over interactive objects and press NIE when close.',
];

export function getQuestById(id) {
  return QUESTS.find(q => q.id === id) || null;
}

export function getArtifactById(id) {
  return ARTIFACTS.find(a => a.id === id) || null;
}

export function getJournalById(id) {
  return JOURNAL.find(j => j.id === id) || null;
}

export function getDialogueById(id) {
  return DIALOGUES.find(d => d.id === id) || null;
}