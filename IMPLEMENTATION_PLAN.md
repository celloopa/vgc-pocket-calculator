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
| Total  | 28    |
| Done   | 0     |
| Todo   | 28    |

---

## Phase 0: Research & Validation

### TASK-R01: Validate @smogon/calc in React Native
- **Description**: Create minimal Expo project, install @smogon/calc, verify it runs without errors. Check for polyfill requirements (URL, crypto, etc.)
- **Risk**: Package may use Node.js or browser APIs unavailable in React Native
- **Mitigation**: Use `react-native-polyfill-globals` or `expo-crypto` if needed
- **Acceptance**: Can call `calculate()` and get valid result on iOS simulator and Android emulator

### TASK-R02: Benchmark @smogon/calc bundle size
- **Description**: Measure impact of @smogon/calc on app bundle. All 9 generations of Pokemon data is included.
- **Acceptance**: Document bundle size, identify if tree-shaking or lazy loading needed

### TASK-R03: Research VGC-specific data sources
- **Description**: Identify sources for VGC usage stats, common sets, rental teams. Consider Pikalytics API, Showdown usage stats.
- **Acceptance**: Document available data sources and licensing

### TASK-R04: Competitive analysis - mobile calculators
- **Description**: Test existing mobile Pokemon calculators (if any) on iOS/Android. Identify UX patterns that work well on mobile.
- **Acceptance**: Document findings, screenshots of good/bad UX patterns

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

### TASK-009: Create Pokemon Search Component
- **Description**: Searchable Pokemon selector optimized for mobile:
  - Search bar with instant results
  - Recent Pokemon section
  - Favorites section (star to save)
  - Pokemon sprite preview
- **Files**: `src/components/PokemonSearch.tsx`
- **Acceptance**: Can find and select Pokemon in <3 taps

### TASK-010: Create Pokemon Config Component
- **Description**: Configure selected Pokemon:
  - Nature dropdown (with stat preview)
  - EV spread with presets + custom
  - Ability selector
  - Item selector
  - Tera type selector
  - Stat boost toggles
- **Files**: `src/components/PokemonConfig.tsx`
- **Acceptance**: All config options work, state updates correctly

### TASK-011: Create Move Selector Component
- **Description**: Move selector for attacker:
  - Search by name
  - Filter by type (color-coded chips)
  - Show power, type, category
  - Recent moves section
- **Files**: `src/components/MoveSelector.tsx`
- **Acceptance**: Can select move in <2 taps

### TASK-012: Create Field Conditions Component
- **Description**: Toggle buttons for field state:
  - Weather row (5 options)
  - Terrain row (5 options)
  - Screens toggles
  - Helping Hand toggle
  - Critical hit toggle
- **Files**: `src/components/FieldConditions.tsx`
- **Acceptance**: Single tap toggles, visual feedback clear

### TASK-013: Create Damage Output Component
- **Description**: Clear damage display:
  - Damage range as HP and percentage
  - KO indicator (OHKO, 2HKO, etc.) with probability
  - Damage roll visualization (bar chart)
  - Expandable full description
- **Files**: `src/components/DamageOutput.tsx`
- **Acceptance**: Shows damage clearly, updates instantly

### TASK-014: Create Main Calculator Screen
- **Description**: Assemble components:
  - Attacker card (collapsible)
  - Defender card (collapsible)
  - Move selector
  - Field conditions bar
  - Damage output (always visible)
  - Swap button
- **Files**: `src/screens/CalculatorScreen.tsx`
- **Acceptance**: Full calculation flow works end-to-end

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

*No tasks completed yet*

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
