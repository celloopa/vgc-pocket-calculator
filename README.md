# VGC Pocket Calc

A mobile-first damage calculator for Pokemon VGC (Video Game Championships) doubles format.

## 🎯 Project Vision

**VGC Pocket Calc** is designed for competitive Pokemon players who need quick, accurate damage calculations during live battles. Built with React Native and Expo for cross-platform compatibility (iOS + Android).

### Key Features (Planned)

- ⚡ **Lightning Fast**: Calculate damage in under 3 taps
- 📱 **Mobile Optimized**: Native feel with haptic feedback and intuitive gestures
- 🔌 **Fully Offline**: All Pokemon data bundled, no internet required
- 🎮 **VGC Focused**: Doubles mechanics, field conditions, and common scenarios
- 📋 **Team Import**: Paste Pokemon Showdown teams directly
- 💾 **Smart History**: Favorites and recent Pokemon for quick access

## 🏗️ Technology Stack

| Layer                  | Technology          | Rationale                                           |
| ---------------------- | ------------------- | --------------------------------------------------- |
| **Calculation Engine** | `@smogon/calc`      | MIT licensed, TypeScript, all Gen 1-9 data included |
| **Mobile Framework**   | React Native + Expo | Cross-platform with OTA updates                     |
| **UI Library**         | React Native Paper  | Material Design, mobile-first components            |
| **State Management**   | Zustand             | Lightweight, TypeScript-friendly                    |
| **Local Storage**      | MMKV                | 30x faster than AsyncStorage                        |
| **Search**             | Fuse.js             | Lightweight fuzzy search                            |

## 📊 Project Status

**Current Phase**: Phase 0 - Research & Validation ✅

- [x] TASK-R01: Validate @smogon/calc in React Native
- [x] TASK-R02: Benchmark @smogon/calc bundle size
- [x] TASK-R03: Research VGC-specific data sources
- [x] TASK-R04: Competitive analysis - mobile calculators

**Next Phase**: Phase 1 - Foundation

See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for detailed roadmap.

## 🔬 Research Findings

### @smogon/calc Compatibility

✅ Excellent React Native compatibility prospects:

- Zero runtime dependencies
- Self-contained TypeScript package
- Works in server and browser environments
- **No polyfills needed**

### Bundle Size

- **Package size**: 3.13 MB (includes all 9 generations)
- **Assessment**: Acceptable for offline-first mobile app
- Optimization options available if needed

### Competitive Landscape

Analyzed existing mobile calculators:

- **iOS Damage Calculator** (4.8★) - Clean UX, offline, PokePaste support
- **VS SV Calculator** (4.5★) - Multi-calc view, saved sets

**Our differentiators**:

- Better VGC doubles support
- Clearer UX for physical/special attacks
- No ads, free and open
- Collapsible cards for space efficiency

## 🚀 Development Roadmap

### Phase 1: Foundation (Upcoming)

- Initialize Expo project
- Integrate @smogon/calc
- Set up React Native Paper UI
- Configure navigation

### Phase 2: Core Calculator

- Pokemon data service with fuzzy search
- Move data service
- Calculation service (doubles, weather, terrain)
- State management with Zustand

### Phase 3: Mobile UI

- Pokemon search component
- Pokemon config (EVs, nature, items)
- Move selector
- Field conditions toggles
- Damage output display
- Main calculator screen

### Phase 4: Quality of Life

- Team import (Showdown format)
- Persistent storage (favorites, recents)
- Haptic feedback
- Dark mode

### Phase 5: Platform Polish

- iOS optimizations (safe areas, animations)
- Android optimizations (Material You)
- Performance optimization (60fps)
- Offline verification

### Phase 6: Distribution

- EAS Build configuration
- TestFlight (iOS)
- Google Play Internal Testing (Android)
- App Store metadata and screenshots

## 📝 Documentation

- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) - Detailed task breakdown and research findings
- [specs/mobile-calculator.md](./specs/mobile-calculator.md) - Feature specifications

## 🤝 Contributing

This project is in early development. Contributions welcome once Phase 1 is complete.

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- **@smogon/calc** - Calculation engine ([smogon/damage-calc](https://github.com/smogon/damage-calc))
- **Pikalytics** - VGC usage data and inspiration
- **Pokemon Showdown** - Team format standard

---

Built with ❤️ for the VGC community
