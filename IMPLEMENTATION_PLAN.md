# Implementation Plan

Generated: 2026-01-16T19:30:00Z
Specs analyzed: Research phase - analyzing existing tools

## Project Vision

**Mobile-first VGC doubles damage calculator** for quick calculations during battles.
- Cross-platform (iOS + Android) via React Native/Expo
- Use alongside Pokemon Showdown or mobile battlesims
- Leverage `@smogon/calc` for battle math (MIT licensed, TypeScript, all data included)
- Focus on speed and usability, not feature parity with web calculators

## Status Summary

| Status | Count |
|--------|-------|
| Total  | 14    |
| Done   | 0     |
| Todo   | 14    |

---

## Phase 1: Foundation

### TASK-001: Initialize Expo React Native Project
- **Description**: Set up project with `npx create-expo-app@latest --template blank-typescript`. Configure tsconfig.json with strict mode, add ESLint + Prettier.
- **Files**: `package.json`, `tsconfig.json`, `app.json`, `.eslintrc.js`, `.prettierrc`
- **Acceptance**: `npm run start` launches Expo dev server, TypeScript compiles without errors

### TASK-002: Integrate @smogon/calc Package
- **Description**: Install `@smogon/calc` and verify it works in React Native environment. Create a simple test that calculates damage between two Pokemon.
- **Files**: `package.json`, `src/lib/calculator.ts`, `src/lib/__tests__/calculator.test.ts`
- **Acceptance**: Can import and call `calculate()` function, returns valid damage ranges

### TASK-003: Configure AGENTS.md with Project Stack
- **Description**: Document the chosen tech stack and commands in `.ralph/AGENTS.md`
- **Files**: `.ralph/AGENTS.md`
- **Tech Stack**:
  - Language: TypeScript (strict mode)
  - Framework: React Native + Expo SDK 52+
  - UI: React Native Paper (Material Design)
  - State: Zustand
  - Storage: MMKV
  - Testing: Jest + React Native Testing Library
- **Commands**:
  - Dev: `npx expo start`
  - Build: `npx expo build`
  - Test: `npm test`
  - Lint: `npm run lint`
- **Acceptance**: AGENTS.md fully documents build/test/lint commands

---

## Phase 2: Core Calculator Logic

### TASK-004: Create Pokemon Selection Service
- **Description**: Wrap @smogon/calc's Pokemon data for efficient searching. Include species list, base stats, types, abilities. Support fuzzy search by name.
- **Files**: `src/services/pokemon-data.ts`, `src/services/__tests__/pokemon-data.test.ts`
- **Acceptance**: Can search "Ursaluna" and get both forms, returns base stats and abilities

### TASK-005: Create Move Selection Service
- **Description**: Wrap @smogon/calc's Move data. Include move list with power, type, category, priority. Support filtering by Pokemon's learnset.
- **Files**: `src/services/move-data.ts`, `src/services/__tests__/move-data.test.ts`
- **Acceptance**: Can get valid moves for a Pokemon, filter by type/category

### TASK-006: Create Calculation Service
- **Description**: High-level wrapper around @smogon/calc's `calculate()`. Handle common VGC scenarios:
  - Spread move modifier (0.75x)
  - Stat boosts (-6 to +6)
  - Weather (Sun, Rain, Sand, Snow)
  - Terrain (Electric, Grassy, Psychic, Misty)
  - Common items (Choice Band/Specs, Life Orb, Assault Vest)
  - Common abilities (Intimidate modifier, etc.)
- **Files**: `src/services/calculation.ts`, `src/services/__tests__/calculation.test.ts`
- **Acceptance**: Calculate damage with field effects, returns min/max damage and KO probability

---

## Phase 3: Mobile UI

### TASK-007: Create Pokemon Input Component
- **Description**: Searchable Pokemon selector with:
  - Search bar with fuzzy matching
  - Quick access to recent/favorite Pokemon
  - Nature dropdown
  - EV spread presets (252/252/4 common spreads)
  - Tera type selector
- **Files**: `src/components/PokemonInput.tsx`, `src/components/PokemonSearch.tsx`
- **Acceptance**: Can quickly select a Pokemon and configure stats

### TASK-008: Create Move Input Component
- **Description**: Move selector optimized for quick selection:
  - Search by move name
  - Filter by move type/category
  - Show move power and type at a glance
- **Files**: `src/components/MoveInput.tsx`
- **Acceptance**: Can select moves quickly, shows relevant move info

### TASK-009: Create Field Conditions Component
- **Description**: Toggle buttons for common field states:
  - Weather (4 options + clear)
  - Terrain (4 options + none)
  - Screens (Reflect, Light Screen, Aurora Veil)
  - Helping Hand toggle
  - Stat boost quick selectors
- **Files**: `src/components/FieldConditions.tsx`
- **Acceptance**: Can toggle field effects with single taps

### TASK-010: Create Damage Output Component
- **Description**: Clear, readable damage display:
  - Damage range as percentage
  - Number of hits to KO (OHKO, 2HKO, etc.)
  - Damage roll spread visualization
  - Full calculation breakdown (expandable)
- **Files**: `src/components/DamageOutput.tsx`
- **Acceptance**: Shows damage clearly, KO info prominent

### TASK-011: Create Main Calculator Screen
- **Description**: Assemble components into main calculation flow:
  - Attacker section (Pokemon + Move)
  - Defender section (Pokemon)
  - Field conditions bar
  - Damage output display
  - Swap attacker/defender button
- **Files**: `src/screens/CalculatorScreen.tsx`
- **Acceptance**: Full calculation flow works end-to-end

---

## Phase 4: Quality of Life

### TASK-012: Implement Team Import (Showdown Format)
- **Description**: Parse Pokemon Showdown team export format to quickly load Pokemon configurations.
- **Files**: `src/services/team-import.ts`, `src/screens/ImportScreen.tsx`
- **Acceptance**: Can paste Showdown team export and select Pokemon from it

### TASK-013: Implement Favorites/Recent Pokemon
- **Description**: Store recently used and favorited Pokemon in MMKV for quick access.
- **Files**: `src/services/storage.ts`, `src/hooks/useFavorites.ts`
- **Acceptance**: Recent Pokemon appear first in search, favorites persist across sessions

### TASK-014: Add Offline Support
- **Description**: Ensure all Pokemon/Move data is bundled and calculator works fully offline.
- **Files**: Verification task - test in airplane mode
- **Acceptance**: Full functionality with no network connection

---

## Low Priority (Future)

- [ ] Dark mode / theme support
- [ ] Matchup analysis (1v4 team coverage)
- [ ] Speed tier calculator
- [ ] Damage range sharing (deep links)
- [ ] Widget for quick calculations
- [ ] Apple Watch / Wear OS companion

---

## Completed Tasks

*No tasks completed yet*

---

## Research Notes

### Chosen Technology Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Calculation Engine | `@smogon/calc` | MIT license, TypeScript, all Pokemon data included, battle-tested |
| Mobile Framework | React Native + Expo | Cross-platform, TypeScript support, OTA updates |
| UI Library | React Native Paper | Material Design, good mobile UX patterns |
| State Management | Zustand | Lightweight, TypeScript-friendly |
| Storage | MMKV | 30x faster than AsyncStorage |

### Why Not Fork NCP Calculator?

The [NCP VGC Calculator](https://nerd-of-now.github.io/NCP-VGC-Damage-Calculator/) is vanilla JavaScript + jQuery, designed for browser. Would require significant rewrite for mobile. Better to use the well-structured `@smogon/calc` TypeScript package directly.

### Key @smogon/calc Usage

```typescript
import { calculate, Pokemon, Move, Field, Generations } from '@smogon/calc';

const gen = Generations.get(9); // Gen 9 (Scarlet/Violet)
const attacker = new Pokemon(gen, 'Flutter Mane', {
  nature: 'Timid',
  evs: { spa: 252, spe: 252 },
  item: 'Choice Specs',
  teraType: 'Fairy',
});
const defender = new Pokemon(gen, 'Urshifu', {
  nature: 'Jolly',
  evs: { hp: 4, atk: 252, spe: 252 },
});
const move = new Move(gen, 'Moonblast');
const field = new Field({ gameType: 'Doubles' }); // Applies 0.75x spread

const result = calculate(gen, attacker, defender, move, field);
console.log(result.damage); // [min, max] damage range
console.log(result.desc()); // Human-readable description
```

### External Resources

- [Smogon Damage Calculator](https://calc.pokemonshowdown.com/) - Reference implementation
- [@smogon/calc on npm](https://www.npmjs.com/package/@smogon/calc) - Core package
- [Pikalytics Calculator](https://github.com/pikalytics/pikalytics-calc) - VGC-focused fork
- [React Native Expo Docs](https://docs.expo.dev/guides/typescript/) - TypeScript setup
- [React Native Paper](https://callstack.github.io/react-native-paper/) - UI components
