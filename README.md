# ✅ To‑Do Liste (Vue 3)

Ein schnelles, zugängliches und lokal persistentes To‑Do Tool mit Vue 3 (Composition API), Tailkit/Tailwind und einem dezenten Three.js‑Partikelhintergrund. Enthält Filter, Drag & Drop, sanfte Animationen und eine dezente CSS‑Löschanimation.

## Features
- Aufgaben hinzufügen, abhaken, löschen
- Lokale Persistenz via `localStorage`
- Filter: Alle | Offen | Erledigt
- Drag & Drop zum Neuordnen
- Sanfte TransitionGroup‑Animationen; dezente CSS‑Löschanimation beim Entfernen
- Barrierearm: Tastaturbedienung, Fokus‑Styles, Reduced‑Motion‑Support
- Dezenter Three.js‑Hintergrund im Marken‑Theme (#183857)

## Tech‑Stack
- Vue 3 + Composition API
- Tailwind CSS (Tailkit) für UI
- Three.js für den Hintergrund
- Vite als Dev‑Server und Bundler

## Schnellstart
Voraussetzung: Node 18+

```bash
npm install
npm run dev
```

Lokal unter: http://localhost:5173

## Live Demo
Live: https://todo-gules-omega.vercel.app/

## Build & Preview
```bash
npm run build
npm run preview
```

Das Produktionsbundle liegt in `dist/`.

## Projektstruktur
- `src/components/TodoApp.vue` – UI, Filter, Drag & Drop, Animationen
- `src/components/ThreeBackground.vue` – Partikelhintergrund
- `src/composables/useTodos.js` – State, Aktionen, Persistenz
- `src/assets/tailkit.css` – Tailwind/Tailkit Setup
- `index.html` – Titel, Favicons, Theme‑Color

## Bedienung
- Neue Aufgabe über das Eingabefeld hinzufügen (Enter oder Button)
- Checkbox hakt Aufgabe ab
- Drag & Drop zum Umordnen
- „Erledigte löschen“ entfernt alle erledigten Aufgaben

## Barrierefreiheit
- Fokus‑Ringe und ausreichender Kontrast
- Unterstützt `prefers-reduced-motion`

## Lizenz
MIT (sofern nicht anders deklariert). Siehe Repository.

## Danksagung
- Tailkit, Vue, Vite, Three.js