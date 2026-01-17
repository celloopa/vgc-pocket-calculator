# Mobile VGC Damage Calculator Specification

## Overview

A mobile-first damage calculator for Pokemon VGC (Video Game Championships) doubles format. Designed for quick calculations during live battles, to be used alongside Pokemon Showdown or mobile battlesims.

## Core Requirements

### Calculation Engine

- [x] Use `@smogon/calc` package (MIT license) for all damage calculations
- [ ] Support Generation 9 (Scarlet/Violet) mechanics
- [ ] Support Terastallization
- [ ] Support doubles mechanics:
  - [ ] Spread move damage reduction (0.75x)
  - [ ] Helping Hand modifier
  - [ ] Friend Guard modifier

### Pokemon Configuration

- [ ] Select Pokemon by name (fuzzy search)
- [ ] Configure nature (25 options)
- [ ] Set EV spread with presets:
  - 252/252/4 offensive spreads
  - Bulky spreads (252 HP / 252 Def or SpD)
  - Custom input
- [ ] Set IV spread (default 31 all, adjustable)
- [ ] Select ability from species' available abilities
- [ ] Select held item
- [ ] Select Tera type (18 types + None)
- [ ] Set stat modifiers (-6 to +6)

### Move Selection

- [ ] Select move by name (fuzzy search)
- [ ] Filter moves by:
  - Type (18 types)
  - Category (Physical/Special/Status)
- [ ] Show move info: power, type, category, priority

### Field Conditions

- [ ] Weather:
  - None, Sun, Rain, Sand, Snow
- [ ] Terrain:
  - None, Electric, Grassy, Psychic, Misty
- [ ] Screens:
  - Reflect, Light Screen, Aurora Veil
- [ ] Other:
  - Helping Hand (attacker side)
  - Critical hit toggle

### Damage Output

- [ ] Damage range (min-max HP)
- [ ] Damage percentage (min-max %)
- [ ] KO probability:
  - OHKO, 2HKO, 3HKO, etc.
  - Percentage chance to KO
- [ ] Full calculation description (expandable)

## UX Requirements

### Speed Priority

- [ ] Pokemon selection: < 3 taps from search to selected
- [ ] Move selection: < 2 taps
- [ ] Field toggle: single tap
- [ ] Calculation: instant (< 100ms)

### Quick Access

- [ ] Recent Pokemon list (last 10 used)
- [ ] Favorite Pokemon (user-saved)
- [ ] Common EV spreads as presets
- [ ] Swap attacker/defender with single tap

### Data Import

- [ ] Parse Pokemon Showdown team export format
- [ ] Auto-populate Pokemon stats from paste

### Offline Support

- [ ] All Pokemon data bundled in app
- [ ] Full functionality without network

## Technical Requirements

### Platform

- iOS 14+
- Android 10+
- React Native with Expo

### Performance

- App launch: < 2 seconds
- Calculation: < 100ms
- Search results: < 50ms

### Storage

- Favorites persisted locally (MMKV)
- Recent Pokemon persisted locally
- No account/cloud sync required (MVP)

## Non-Requirements (Out of Scope for MVP)

- Team builder / team storage
- Matchup matrix (1v4 coverage)
- Speed tier calculator
- Damage calc sharing
- Multi-language support
- Accessibility (a11y) - future phase

## Acceptance Criteria

1. **Basic Calculation**: User can calculate damage between two Pokemon with a move
2. **Field Effects**: Weather and terrain affect calculation correctly
3. **Doubles Mode**: Spread moves deal 0.75x damage by default
4. **Quick Input**: Pokemon can be selected in under 5 seconds
5. **Offline**: Calculator works with airplane mode enabled
6. **Cross-Platform**: Runs on both iOS and Android devices
