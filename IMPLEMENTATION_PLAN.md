# Implementation Plan

Generated: 2026-01-16T19:45:00Z
Specs analyzed: specs/mobile-calculator.md

## Project Vision

**VGC Pocket Calc** - Mobile-first VGC doubles damage calculator for quick calculations during battles.
- Cross-platform (iOS + Android) via React Native/Expo
- Use alongside Pokemon Showdown or mobile battlesims
- Leverage `@smogon/calc` for battle math (MIT licensed, TypeScript, all data included)
- Focus on speed and usability, not feature parity with web calculators

## Status Summary

| Status | Count |
|--------|-------|
| Total  | 29    |
| Done   | 4     |
| Todo   | 25    |

**Phase 0 Research**: ✅ Complete (4/4 tasks)
**Phase 1 Foundation**: 📋 Todo (4 tasks - TASK-001 to TASK-004)
**Phase 2 Core Logic**: 📋 Todo (4 tasks - TASK-005 to TASK-008)
**Phase 3 Mobile UI**: 📋 Todo (9 tasks - TASK-009 to TASK-017) ⭐ UI design complete!

---

## 🎯 NEXT ITERATION: BUILD MODE - Quick Prototype

**Goal**: Create visual layout prototype (no functionality)
**Rationale**: User wants to "see what the app looks like" before full implementation
**Mode**: BUILD (not research)

### Prototype Scope (Iteration 3)

**Build These**:
1. ✅ TASK-001: Initialize Expo React Native Project
2. ✅ TASK-009: Set up Animation & Gesture Libraries (Moti + Reanimated)
3. ✅ TASK-010: Create Design System & Theme (colors, tokens)
4. 🎨 **Layout Skeleton** (not in task list - prototype only):
   - Damage Results Card placeholder (top, sticky)
   - Field Conditions Bar placeholder (horizontal chips)
   - Collapsible Attacker/Defender cards (with spring animation)
   - Quick action buttons (bottom)
   - Test expand/collapse interaction
   - Verify responsive layout on different screen sizes

**Skip in Prototype**:
- ❌ @smogon/calc integration (TASK-002)
- ❌ Data services (TASK-005, 006)
- ❌ Bottom sheets (use inline dropdowns temporarily)
- ❌ Sprites (use colored boxes with type icons)
- ❌ Real calculations (show mock damage numbers)
- ❌ State management (use local component state)

**Outcome**:
- See layout hierarchy in action
- Test card animations on device
- Validate "results-first" workflow
- Check screen space utilization
- Get feel for Pokemon-themed colors

**Design References**:
- `specs/ui-design.md` - Complete UI specification
- `specs/edge-cases.md` - Edge case handling
- `.ralph/RESEARCH_SUMMARY.md` - Research findings

**Kanban**: Tasks in project "pokemon-vgc-doubles_calculator" (ID: a76c80ac-176f-486b-a2a5-f77563536ba4)

---

## Phase 0: Research & Validation

### TASK-R01: Validate @smogon/calc in React Native

**Status**: ✅ Research Complete

**Findings**:
- **Excellent compatibility prospects**: @smogon/calc has NO runtime dependencies (only `@types/node` as dev dependency)
- Package is designed to work in both server and browser environments, explicitly supporting Node.js usage
- No polyfills needed by default since package is self-contained
- TypeScript-based implementation with strong type safety
- Available entry points: `dist/index.js` (main), `@smogon/calc/adaptable` (for custom data layers)

**Potential Polyfills** (only if issues arise):
- `react-native-url-polyfill` - for URL API if needed
- `react-native-polyfill-globals` - for Buffer, process, crypto if needed
- `expo-crypto` - for crypto operations if needed
- Note: These are precautionary - the package should work without polyfills

**Risks/Blockers**:
- None identified during research
- Package architecture suggests strong React Native compatibility

**Recommendations**:
- Proceed with TASK-001 and TASK-002 to validate with actual implementation
- Test calculation functions immediately after installation
- Monitor bundle size impact during integration

**Sources**:
- [GitHub - smogon/damage-calc](https://github.com/smogon/damage-calc)
- [@smogon/calc - npm](https://www.npmjs.com/package/@smogon/calc)
- [React Native Polyfill Globals](https://github.com/acostalima/react-native-polyfill-globals)
- [Web3Auth Metro Polyfill Issues](https://web3auth.io/docs/troubleshooting/metro-issues)

### TASK-R02: Benchmark @smogon/calc bundle size

**Status**: ✅ Research Complete

**Findings**:
- **Package size**: 3.13 MB (npm package size)
- Includes all 9 generations of Pokemon data (Gen 1-9)
- Data includes: Pokemon species, moves, abilities, items, battle mechanics
- Minified production build available: `production.min.js`
- Supports bundlers: Webpack, Rollup, Parcel

**Bundle Optimization Options**:
1. **Use adaptable entry point**: `@smogon/calc/adaptable`
   - Allows custom data layer integration
   - Can use `@pkmn/data` to avoid duplicate data
   - Recommended for apps that already include Pokemon data

2. **Tree-shaking potential**:
   - Package supports modern bundlers
   - Can potentially reduce size by importing only needed generations
   - Requires testing to confirm effectiveness

3. **Lazy loading strategy** (future consideration):
   - Could load generation data on-demand
   - JSON files can be sliced into horizontal deltas and vertical slices
   - More complex implementation, consider for v2 if size is issue

**Impact Assessment**:
- For mobile app focused on Gen 9 VGC: 3.13 MB is acceptable
- All data bundled = full offline functionality (critical requirement)
- Modern phones can handle this size without performance issues
- Trade-off: Size vs complete offline experience is worth it

**Recommendations**:
- Use standard entry point initially (`@smogon/calc`)
- Accept 3.13 MB for MVP to ensure offline functionality
- Monitor actual impact during TASK-021 (Performance Optimization)
- If size becomes issue, explore adaptable entry point in Phase 5

**Sources**:
- [@smogon/calc - npm](https://www.npmjs.com/package/@smogon/calc)
- [GitHub - smogon/damage-calc](https://github.com/smogon/damage-calc)
- [Bundlephobia](https://bundlephobia.com)

### TASK-R03: Research VGC-specific data sources

**Status**: ✅ Research Complete

**Findings**:

#### Usage Stats Sources

1. **Pikalytics** (https://pikalytics.com)
   - **Pros**: VGC-focused, current formats (VGC 2026 Regulation F active), weighted by Glicko rating
   - **Cons**: No public API available (internal API not exposed)
   - **Data**: Pokemon usage %, common movesets, items, abilities, EV spreads
   - **Access**: Web scraping only (not recommended for MVP)
   - **Licensing**: Unknown, no public API terms
   - **Additional**: Pokedex pages (e.g., https://www.pikalytics.com/pokedex) show detailed per-Pokemon data:
     - Move frequencies with percentages
     - EV spreads with natures
     - Held items with usage %
     - Abilities with usage %
     - Top teammates
     - Filterable by rating tier (0+, 1500+, 1630+, 1760+)

2. **Pokemon Showdown Stats** (https://smogon.com/stats/)
   - **Pros**: Official text files, freely downloadable, includes VGC formats
   - **Cons**: Monthly updates only, format names vary by regulation
   - **Data**: Usage stats at different rating tiers (1500, 1630, 1760)
   - **Access**: Direct file downloads (e.g., `/stats/2026-01/gen9vgc2026-1760.txt`)
   - **Licensing**: Public domain / freely available
   - **Format**: Plain text files with Pokemon usage percentages

3. **Babiri.net API** (babiri.net)
   - **Pros**: RESTful API, VGC and OU formats, daily updates from Showdown replays
   - **Cons**: Not official, relies on replay scraping
   - **Endpoints**:
     - `/api/teams` - Recent recorded teams
     - `/api/teams?pokemon=[NAME]` - Teams with specific Pokemon
     - `/api/teams?date=[YYYY-MM-DD]` - Teams from specific date
     - `/api/usage?pokemon=[NAME]` - Usage history for Pokemon
   - **Access**: Public API, no auth required
   - **Licensing**: Open source (check GitHub for details)

4. **VGC Community Spreadsheet**
   - **URL**: https://docs.google.com/spreadsheets/d/1axlwmzPA49rYkqXh7zHvAtSP-TKbM0ijGYBPRflLSWw/edit
   - **Pros**: Community-curated Pokemon sets with EVs
   - **Cons**: Manual updates, no API access
   - **Data**: Pokemon sets filterable by "has EVs"
   - **Access**: Public Google Sheets (view only)
   - **Use case**: Reference for common EV spreads and competitive sets

#### Rental Teams Sources

1. **VGC Pastes** (https://falinks-teambuilder.com/pastes/vgc/)
   - Large repository of VGC teams in Showdown paste format
   - 1150+ teams for current regulation
   - Free to access, no API

2. **Victory Road** (https://victoryroad.pro/sv-rental-teams/)
   - Curated rental teams with creator credits
   - Showdown paste format + in-game rental codes
   - Free to access, no API

3. **Pikalytics Team Builder** (https://pikalytics.com/team)
   - Team builder with import/export to Showdown/Pokepaste
   - No API for team data

**Recommendations for MVP**:
- **Skip external data integration for MVP** - focus on core calculator functionality
- **Phase 1**: Use @smogon/calc's built-in Pokemon/move data only
- **Future enhancement**: Add usage stats integration using Babiri.net API or Showdown stats files
- **Team import**: Support Showdown paste format (TASK-015) - no API needed

**Post-MVP Enhancement Priority**:
1. Showdown paste import (highest priority, already planned in TASK-015)
2. Babiri.net API integration for usage stats (nice-to-have)
3. Showdown stats file parsing (alternative to Babiri)
4. VGC Pastes integration (low priority)

**Sources**:
- [Pikalytics](https://www.pikalytics.com/)
- [Pokemon Showdown Stats](https://www.smogon.com/stats/)
- [Babiri.net GitHub](https://github.com/kelvinkoon/babiri_v1)
- [VGC Pastes](https://www.falinks-teambuilder.com/pastes/vgc/)
- [Victory Road Rental Teams](https://victoryroad.pro/sv-rental-teams/)

### TASK-R04: Competitive analysis - mobile calculators

**Status**: ✅ Research Complete

**Findings**:

#### Existing Mobile Apps

1. **Damage Calculator (iOS)** by Fadi Hareth
   - **Platform**: iOS (App Store)
   - **Rating**: 4.8/5 stars (27 reviews)
   - **Generation Support**: Gen 9 (Scarlet/Violet) with Terastallization
   - **Price**: Free, no ads
   - **Key Features**:
     - Damage + Speed calculator
     - Custom build creation/management
     - PokePaste import/export
     - Completely offline
     - Dark mode
   - **User Praise**: "Amazing for mobile platforms where others are clunky", "Easy to use and intuitive"
   - **User Requests**: Older generation support, more berry options, Sitrus Berry
   - **Last Update**: February 2025 (iOS 26.0+ fixes, Legends Z-A Mega forms)

2. **VS SV Damage Calculator (Android)** by project97
   - **Platform**: Android (Google Play)
   - **Rating**: 4.5/5 stars (289 reviews)
   - **Generation Support**: Scarlet/Violet
   - **Key Features**:
     - Calculate 4 damages simultaneously
     - Register 1000 custom Pokemon sets
     - 539 pre-loaded common battle sets
     - Auto-updates with app updates
   - **User Praise**: "Shows calcs for multiple moves at once", "Best feature is saving specific sets"
   - **User Complaints**: "Doesn't account for certain abilities/items correctly", "No option to remove ads", "No import from Showdown"

3. **Other Options**:
   - **VGC Damage Calculator** (Android) - Outdated (Ultra Sun/Moon era, 2017-2018 VGC)
   - **Web-based calculators** (Showdown, Pikalytics, VGC Multi Calc) - Work on mobile browsers but not optimized

#### UX Patterns That Work Well

**Good Patterns**:
1. ✅ **Multiple simultaneous calculations** (VS SV) - shows 4 move damages at once
2. ✅ **Saved Pokemon sets** (both apps) - quick access to common builds
3. ✅ **PokePaste import** (iOS app) - fast team loading
4. ✅ **Offline functionality** (iOS app) - no network required
5. ✅ **Dark mode** (iOS app) - better for tournaments
6. ✅ **Speed calculator integration** (iOS app) - related tool in same app
7. ✅ **Pre-loaded common sets** (VS SV) - reduces manual entry

**Bad Patterns / Problems**:
1. ❌ **Ads without removal option** (VS SV) - intrusive experience
2. ❌ **Missing abilities/items** (VS SV) - incomplete calc results
3. ❌ **No Showdown import** (VS SV) - manual entry required
4. ❌ **Unclear UI elements** (user complaints) - "no way to switch Attack/Special Attack"
5. ❌ **Limited berry selection** (iOS app) - only super-effective reducers
6. ❌ **Single generation only** (both apps) - Gen 9 only
7. ❌ **No basic/unevolved Pokemon** (complaints) - missing calc options

#### Competitive Gaps (Opportunities)

**Our app can differentiate by**:
1. **Better doubles support** - VS SV and iOS app don't emphasize VGC-specific features
2. **Clearer UX** - address confusion about Physical/Special toggles
3. **Complete item/ability support** - avoid VS SV's accuracy issues
4. **No ads** - free and clean like iOS app
5. **Collapsible cards** - save screen space on mobile
6. **Favorites + Recent Pokemon** - faster access than VS SV's 1000-slot system
7. **VGC field conditions bar** - dedicated weather/terrain/screens UI

**Avoid These Mistakes**:
- Don't use intrusive ads
- Ensure all Gen 9 abilities/items are supported
- Make Physical/Special attack toggles obvious
- Support basic/unevolved Pokemon (some players use LC or custom formats)
- Include comprehensive berry selection

**Recommendations for Design**:
1. **Adopt multi-calc approach** (from VS SV) - show damage for 4 moves at once
2. **Implement saved sets** (both apps) - but with better organization via Favorites/Recent
3. **Support PokePaste import** (from iOS app) - already planned in TASK-015
4. **Use collapsible cards** - maximize visible damage output
5. **Add quick-toggle field conditions** - single-tap weather/terrain
6. **Include swap button** - instant attacker/defender flip
7. **Haptic feedback** - make mobile interactions feel native

**Sources**:
- [Damage Calculator - iOS App Store](https://apps.apple.com/us/app/damage-calculator/id1554958775)
- [VS SV Damage Calculator - Google Play](https://play.google.com/store/apps/details?id=project97.vs)
- [APK Mirror - VS SV Reviews](https://apkgk.com/project97.vs)
- [Pokemon Damage Calculator UX Issues](https://github.com/Admiral-Billy/Pokerogue-App/issues/72)

---

## Phase 1: Foundation

### TASK-001: Initialize Expo React Native Project
- **Description**: Set up project with `npx create-expo-app@latest --template blank-typescript`. Configure:
  - tsconfig.json with strict mode
  - ESLint + Prettier
  - Path aliases (@/components, @/services, etc.)
  - Jest for testing
- **Files**: `package.json`, `tsconfig.json`, `app.json`, `.eslintrc.js`, `.prettierrc`, `babel.config.js`
- **Acceptance**: `npx expo start` launches dev server, TypeScript compiles without errors

### TASK-002: Integrate @smogon/calc Package
- **Description**: Install `@smogon/calc` and any required polyfills. Create wrapper module.
- **Files**: `package.json`, `src/lib/calculator.ts`, `src/lib/__tests__/calculator.test.ts`
- **Acceptance**: Can import and call `calculate()` function, returns valid damage ranges

### TASK-003: Set up React Native Paper UI
- **Description**: Install and configure react-native-paper with custom theme (Pokemon-inspired colors).
- **Files**: `src/theme/index.ts`, `App.tsx`
- **Acceptance**: Paper components render correctly, theme applied

### TASK-004: Configure Navigation
- **Description**: Set up expo-router for navigation between screens (Calculator, Import, Settings).
- **Files**: `app/` directory structure
- **Acceptance**: Can navigate between screens

---

## Phase 2: Core Calculator Logic

### TASK-005: Create Pokemon Data Service
- **Description**: Wrap @smogon/calc's Pokemon data for efficient searching. Include:
  - Species list with base stats, types, abilities
  - Fuzzy search by name (using fuse.js)
  - Form handling (Ursaluna, Ursaluna-Bloodmoon, etc.)
- **Files**: `src/services/pokemon-data.ts`, `src/services/__tests__/pokemon-data.test.ts`
- **Acceptance**: Search "Ursaluna" returns both forms, <50ms search time

### TASK-006: Create Move Data Service
- **Description**: Wrap @smogon/calc's Move data. Include:
  - Move list with power, type, category, priority
  - Filter by Pokemon's learnset (Gen 9)
  - Fuzzy search by name
- **Files**: `src/services/move-data.ts`, `src/services/__tests__/move-data.test.ts`
- **Acceptance**: Can get valid moves for a Pokemon, filter by type/category

### TASK-007: Create Calculation Service
- **Description**: High-level wrapper around @smogon/calc's `calculate()`. Handle:
  - Doubles mode (spread move 0.75x)
  - Stat boosts (-6 to +6)
  - Weather (Sun, Rain, Sand, Snow)
  - Terrain (Electric, Grassy, Psychic, Misty)
  - Items (Choice Band/Specs, Life Orb, Assault Vest, etc.)
  - Abilities (Intimidate, Huge Power, etc.)
  - Terastallization
- **Files**: `src/services/calculation.ts`, `src/services/__tests__/calculation.test.ts`
- **Acceptance**: Calculations match Smogon calculator results

### TASK-008: Create State Management Store
- **Description**: Set up Zustand store for calculator state:
  - Attacker Pokemon config
  - Defender Pokemon config
  - Selected move
  - Field conditions
  - Calculation result
- **Files**: `src/stores/calculator-store.ts`
- **Acceptance**: State updates trigger recalculation

---

## Phase 3: Mobile UI

**Design System**: Pokemon-themed playful style with flat 2D animations, using Moti + Reanimated for animations.
**Key Features**: 4-move comparison, collapsible cards, bottom sheet modals, gesture controls, haptic feedback.
**Reference**: `specs/ui-design.md` and `specs/edge-cases.md`

### TASK-009: Set up Animation & Gesture Libraries
- **Description**: Install and configure animation foundation:
  - React Native Reanimated 3
  - Moti (Framer Motion-like API)
  - React Native Gesture Handler
  - @gorhom/bottom-sheet
  - expo-haptics
- **Files**: `package.json`, `babel.config.js`, theme setup
- **Acceptance**: Libraries installed, sample animation renders smoothly

### TASK-010: Create Design System & Theme
- **Description**: Implement Pokemon-themed design system:
  - Color palette (Pokemon type colors, damage indicators)
  - Typography system
  - Spacing and layout tokens
  - Border radius values (16px cards, 20px pills)
  - Type color mappings (all 18 types)
  - Item sprite loading utilities
- **Files**: `src/theme/colors.ts`, `src/theme/tokens.ts`, `src/utils/sprites.ts`
- **Acceptance**: Theme tokens available, type colors render correctly

### TASK-011: Create Pokemon Search Bottom Sheet
- **Description**: Bottom sheet modal for Pokemon selection:
  - Search bar with fuzzy search (instant results)
  - Tabs: Recent | Favorites | All
  - Grid layout with sprites + names
  - Star icon for favorites
  - Type icon fallback for missing sprites
  - Swipe down to dismiss
  - Spring animation on open/close
- **Files**: `src/components/PokemonSearchSheet.tsx`
- **Acceptance**: Search works, favorites persist, animations smooth

### TASK-012: Create Collapsible Pokemon Card
- **Description**: Expandable Pokemon configuration card:
  - Collapsed: Pokemon name + sprite + chevron (60pt height)
  - Expanded: Full config (300pt height)
  - Spring layout animation (damping: 20, stiffness: 200)
  - Nature selector (bottom sheet)
  - EV preset chips: [252/252/4] [Bulky] [Custom]
  - Ability/Item/Tera selectors (bottom sheets)
  - Stat boost presets: [No Boosts] [+1 Atk] [+1 SpA] [+1 Spe] [Intimidate -1] [Custom]
  - Handle long Pokemon names (two-line layout)
  - Type-based card shadow
  - Swipe left/right to swap with other card
- **Files**: `src/components/PokemonCard.tsx`, `src/components/StatBoostSheet.tsx`
- **Acceptance**: Expand/collapse smooth, only one card expanded at a time, swipe gesture works

### TASK-013: Create Move Selector Bottom Sheet (Multi-Select)
- **Description**: Multi-select bottom sheet for choosing 4 moves:
  - Search bar with instant filtering
  - Type filter chips (horizontal scroll, Pokemon type colors)
  - Multi-select checkboxes (max 4 moves)
  - Show move: name, type icon, power, category (Phys/Spec)
  - Recent moves section
  - Handle long move names (two-line rows)
  - Multi-hit moves show hit count
  - "Apply" button to confirm
  - Spring animation on entry
- **Files**: `src/components/MoveSelectSheet.tsx`
- **Acceptance**: Can select 4 moves, filter works, checkboxes clear

### TASK-014: Create Field Conditions Bar
- **Description**: Horizontal scrollable chip bar for field state:
  - Weather chips: ☀️ Sun, 🌧️ Rain, 🌪️ Sand, ❄️ Snow, ⛅ None
  - Terrain chips: ⚡ Electric, 🌱 Grassy, 🧠 Psychic, 🌫️ Misty, ⛅ None
  - Screen toggles: 🛡️ Reflect, 💡 Light Screen, 🌀 Aurora Veil
  - Modifier toggles: 🤝 Helping Hand, 💥 Crit
  - Radio button behavior (auto-deselect for weather/terrain)
  - Pop animation on toggle (scale 1.0 → 1.15 → 1.0)
  - Haptic feedback on tap
  - Pill shape (20px border radius)
- **Files**: `src/components/FieldConditionsBar.tsx`
- **Acceptance**: Single tap toggle, mutually exclusive groups work, haptics feel good

### TASK-015: Create Damage Results Card (4-Move Comparison)
- **Description**: Top-positioned damage results display:
  - Show 4 moves with damage ranges simultaneously
  - Each row: Type icon, move name, damage HP, damage %, KO indicator
  - Damage bars with type-based colors (Fire=OHKO, Electric=2HKO, Grass=3HKO, Water=4HKO+)
  - Handle edge cases:
    - Very high damage (>100%): overflow gradient
    - Very low damage (<5%): dot indicator
    - Similar damage: dynamic range scaling
    - Zero damage: "IMMUNE" with reason
    - Multi-hit moves: per-hit sub-line
  - Tap row to expand for full calculation description
  - Slide-in animation on calculation update
  - Haptic feedback on calculation complete
- **Files**: `src/components/DamageResultsCard.tsx`, `src/components/DamageRow.tsx`
- **Acceptance**: 4 moves visible, damage bars accurate, edge cases handled gracefully

### TASK-016: Create Main Calculator Screen
- **Description**: Assemble all components with proper layout:
  - Top: Damage Results Card (sticky, always visible)
  - Below: Field Conditions Bar (horizontal scroll)
  - Below: Attacker Card (collapsible)
  - Below: Defender Card (collapsible)
  - Bottom: Quick Actions ([⇅ Swap] [🔄 Reset] [📋 Import])
  - Only one Pokemon card expanded at a time
  - Results-first workflow (damage at top)
  - Responsive breakpoints (small: <380pt, standard: 380-430pt, large: >430pt)
  - Empty state when no moves selected (friendly CTA)
  - Swap gesture (swipe left/right on cards)
- **Files**: `src/screens/CalculatorScreen.tsx`
- **Acceptance**: Full flow works, gestures smooth, responsive on different screen sizes

### TASK-017: Implement Sprite Loading System
- **Description**: Load and cache Pokemon/item sprites:
  - Integrate @smogon/calc sprite data
  - Type icon fallback for missing sprites
  - Item sprite loading (Choice Scarf, Life Orb, etc.)
  - Lazy loading with placeholder
  - Cache sprites in memory
  - Handle sprite load errors gracefully
- **Files**: `src/services/sprite-loader.ts`, `src/hooks/useSprite.ts`
- **Acceptance**: Sprites load quickly, fallbacks work, no crashes on missing sprites

---

## Phase 4: Quality of Life

### TASK-015: Implement Team Import
- **Description**: Parse Pokemon Showdown team paste format:
  - Detect Pokemon, nature, EVs, IVs, ability, item, moves
  - Handle team of 6
  - Quick select from imported team
- **Files**: `src/services/team-import.ts`, `src/screens/ImportScreen.tsx`
- **Acceptance**: Can paste Showdown export and load Pokemon

### TASK-016: Implement Persistent Storage
- **Description**: Use MMKV for fast local storage:
  - Recent Pokemon (last 20)
  - Favorite Pokemon (unlimited)
  - Recent moves (last 20)
  - App settings
- **Files**: `src/services/storage.ts`, `src/hooks/useStorage.ts`
- **Acceptance**: Data persists across app restarts

### TASK-017: Add Haptic Feedback
- **Description**: Add subtle haptics for better mobile feel:
  - Selection feedback
  - Toggle feedback
  - Calculation complete
- **Files**: Update components with `expo-haptics`
- **Acceptance**: Haptics feel natural, can be disabled in settings

### TASK-018: Implement Dark Mode
- **Description**: Support system dark mode preference with manual override:
  - Dark theme colors
  - Persist preference
- **Files**: `src/theme/dark.ts`, `src/hooks/useTheme.ts`
- **Acceptance**: Theme switches correctly, persists

---

## Phase 5: iOS & Android Polish

### TASK-019: iOS-Specific Optimizations
- **Description**: Polish for iOS:
  - Safe area handling (notch, home indicator)
  - iOS-style animations
  - Keyboard avoiding view
  - App icon (1024x1024)
  - Launch screen
- **Files**: `ios/`, `app.json` iOS config
- **Acceptance**: Feels native on iPhone

### TASK-020: Android-Specific Optimizations
- **Description**: Polish for Android:
  - Material You dynamic colors (Android 12+)
  - Back button handling
  - Adaptive icon
  - Splash screen
  - Edge-to-edge display
- **Files**: `android/`, `app.json` Android config
- **Acceptance**: Feels native on Android

### TASK-021: Performance Optimization
- **Description**: Ensure smooth 60fps:
  - Profile with Flipper
  - Memoize expensive calculations
  - Optimize list rendering (FlashList)
  - Reduce re-renders
- **Acceptance**: No frame drops, calculation <100ms

### TASK-022: Offline Verification
- **Description**: Verify full offline functionality:
  - All Pokemon data bundled
  - No network requests required
  - Graceful error handling
- **Acceptance**: Works in airplane mode

---

## Phase 6: Distribution

### TASK-023: Configure EAS Build
- **Description**: Set up Expo Application Services:
  - eas.json configuration
  - Build profiles (development, preview, production)
  - Credentials management
- **Files**: `eas.json`
- **Acceptance**: Can run `eas build` successfully

### TASK-024: TestFlight Distribution (iOS)
- **Description**: Set up iOS beta testing:
  - Apple Developer account setup
  - App Store Connect configuration
  - TestFlight internal testing
  - Privacy policy URL
- **Acceptance**: Build available on TestFlight

### TASK-025: Google Play Internal Testing (Android)
- **Description**: Set up Android beta testing:
  - Google Play Console setup
  - Internal testing track
  - App signing
- **Acceptance**: Build available on Play Store internal track

### TASK-026: App Store Metadata
- **Description**: Prepare store listings:
  - App name, description, keywords
  - Screenshots (6.5" iPhone, 5.5" iPhone, Android phone, tablet)
  - Feature graphic (Android)
  - Privacy policy
- **Files**: Store assets in `assets/store/`
- **Acceptance**: Metadata ready for submission

---

## Future Enhancements (Post-MVP)

- [ ] Matchup matrix (1v4 team coverage)
- [ ] Speed tier calculator
- [ ] Damage calc sharing (deep links)
- [ ] Widget for quick calculations (iOS/Android)
- [ ] Apple Watch companion
- [ ] VGC usage stats integration (Pikalytics)
- [ ] Team builder with rental code import
- [ ] Multi-language support
- [ ] Accessibility (VoiceOver/TalkBack)

---

## Completed Tasks

### Phase 0: Research & Validation ✅

**TASK-R01: Validate @smogon/calc in React Native** (Completed: 2026-01-16)
- Research confirmed excellent compatibility prospects
- No runtime dependencies, self-contained package
- TypeScript-based, works in server and browser environments
- Polyfills likely not needed

**TASK-R02: Benchmark @smogon/calc bundle size** (Completed: 2026-01-16)
- Package size: 3.13 MB (includes all 9 generations)
- Size is acceptable for offline-first mobile app
- Optimization options identified (adaptable entry point, tree-shaking)
- Recommendation: Use standard entry point for MVP

**TASK-R03: Research VGC-specific data sources** (Completed: 2026-01-16)
- Identified 4 usage stats sources (Pikalytics, Showdown Stats, Babiri.net API, Community Spreadsheet)
- Identified 3 rental team sources (VGC Pastes, Victory Road, Pikalytics Team Builder)
- Recommendation: Skip external data for MVP, focus on built-in @smogon/calc data
- Future enhancements prioritized: Showdown paste import, Babiri.net API integration

**TASK-R04: Competitive analysis - mobile calculators** (Completed: 2026-01-16)
- Analyzed 2 main competitors: iOS Damage Calculator (4.8★) and VS SV Calculator (4.5★)
- Identified 7 good UX patterns to adopt (multi-calc, saved sets, PokePaste import, etc.)
- Identified 7 bad patterns to avoid (ads, missing features, unclear UI, etc.)
- Competitive gaps identified: Better doubles support, clearer UX, VGC-specific features
- 7 design recommendations documented for implementation phases

---

## Research Notes

### Technology Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Calculation | `@smogon/calc` | MIT license, TypeScript, all Pokemon data |
| Mobile | React Native + Expo | Cross-platform, OTA updates |
| UI | React Native Paper | Material Design, mobile patterns |
| State | Zustand | Lightweight, TypeScript-friendly |
| Storage | MMKV | 30x faster than AsyncStorage |
| Search | Fuse.js | Lightweight fuzzy search |

### iOS & Android Requirements

| Requirement | iOS | Android |
|-------------|-----|---------|
| Developer Account | Apple Developer ($99/year) | Google Play ($25 one-time) |
| Min OS Version | iOS 14+ | Android 10+ (API 29) |
| Testing | TestFlight (100 internal, 10k external) | Internal track (100), Closed/Open (unlimited) |
| Build Format | IPA | AAB (not APK for Play Store) |
| Review Time | ~24-48 hours | ~few hours to days |

### EAS Build Commands

```bash
# Development build (for testing)
eas build --profile development --platform all

# Preview build (for stakeholders)
eas build --profile preview --platform all

# Production build (for stores)
eas build --profile production --platform all

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

### Potential Polyfills Needed

Based on research, @smogon/calc may need:
- None confirmed - test in TASK-R01
- If URL issues: `react-native-url-polyfill`
- If crypto issues: `expo-crypto`

### External Resources

- [Smogon Damage Calculator](https://github.com/smogon/damage-calc) - Core library
- [Expo Docs](https://docs.expo.dev/) - React Native framework
- [EAS Build Docs](https://docs.expo.dev/build/introduction/) - Cloud builds
- [EAS Submit Docs](https://docs.expo.dev/submit/introduction/) - Store submission
- [React Native Paper](https://callstack.github.io/react-native-paper/) - UI components
- [React Native Performance](https://reactnative.dev/docs/performance) - Optimization guide
