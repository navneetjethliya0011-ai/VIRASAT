# VIRASAT

**Virtual Immersive Recreation of Ancient Stories, Art & Traditions**

> "History should not just be read. It should be experienced."

VIRASAT is an immersive browser-based 3D heritage adventure game about Indian history, culture, architecture, languages, arts and traditions. The first fully playable region is **Rajasthan**.

## Commands

```bash
npm install     # install dependencies
npm run dev      # local development server
npm run build    # production build (output: dist/)
npm run preview   # preview the production build
```

No environment variables are required. The game runs entirely client-side. The AI Cultural Guide is optional and built around a curated knowledge base — no backend, no API keys.



## Game Structure

The game is data-driven: quests, artifacts, knowledge entries, language words, regions, dialogues and puzzles live in `src/data/` as structured data. This makes it straight-forward to expand VIRASAT to new regions later without rewriting the engine.



## Notes on Cultural Accuracy

- All historical and cultural claims in the Knowledge Journal are based on established, widely-documented heritage of Rajasthan (sites like Jaisalmer and Chittorgarh, stepwell traditions, Pabuji phad painting, Rajasthani vocal traditions, etc).
- The main quest and characters are clearly fictional gameplay narrative set in a plausible heritage landscape — they are game fiction, not presented as historical fact.



## How the AI Cultural Guide works

The in-game guide answers questions about the region using a curated knowledge base stored in `src/data/knowledge.js`. It cannot fabricate new facts — if a question falls outside its curated entries, it says so honestly and suggests exploring the world instead.



## Deployment

Static hosting anywhere (GitHub Pages, Netlify, Vercel, any static server). Asset paths are relative (`base: './'`), race no localhost or runtime-dependent URLs are hardcoded.
