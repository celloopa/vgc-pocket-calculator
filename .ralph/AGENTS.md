# AGENTS.md - Project Configuration

## Project Overview

**Name**: VGC Pocket Calc
**Type**: Mobile App (cross-platform)
**Language**: TypeScript (strict mode)
**Framework**: React Native + Expo SDK 52+

## Build & Run Commands

### Development
```bash
# Start Expo dev server
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android
```

### Build
```bash
# Build for production (EAS Build)
eas build --platform all

# Local development build
npx expo prebuild
```

### Clean
```bash
# Clear Expo cache
npx expo start --clear

# Full clean
rm -rf node_modules .expo ios android && npm install
```

## Validation Commands (CRITICAL)

These commands form the **backpressure** mechanism. ALL must pass before committing.

### Type Checking
```bash
npx tsc --noEmit
```

### Linting
```bash
npm run lint
```

### Testing
```bash
npm test
```

### Full Validation
```bash
npm run lint && npx tsc --noEmit && npm test
```

## Directory Structure

```
project/
├── src/
│   ├── components/     # React Native UI components
│   ├── screens/        # Screen-level components
│   ├── services/       # Business logic (calculator, data)
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # @smogon/calc wrappers
│   └── types/          # TypeScript type definitions
├── tests/              # Test files (mirrors src/)
├── specs/              # Ralph specifications
├── .ralph/             # Ralph configuration
├── app.json            # Expo configuration
└── IMPLEMENTATION_PLAN.md
```

## Coding Patterns

### File Naming
- Components: `PascalCase.tsx` (e.g., `PokemonInput.tsx`)
- Services: `kebab-case.ts` (e.g., `pokemon-data.ts`)
- Hooks: `useCamelCase.ts` (e.g., `useFavorites.ts`)
- Tests: `*.test.ts` or `*.test.tsx`

### Import Order
1. React/React Native imports
2. Third-party packages
3. Local components (@/components/...)
4. Local services (@/services/...)
5. Types (@/types/...)

### Error Handling
- Use try/catch for async operations
- Return `Result<T, Error>` pattern for services
- Display user-friendly error messages in UI

### State Management
- Local component state: `useState`
- Global app state: Zustand stores
- Persistent storage: MMKV

## Testing Guidelines

- Test files live next to source: `src/services/__tests__/`
- Use Jest + React Native Testing Library
- Test services with unit tests
- Test components with render tests
- Mock `@smogon/calc` for fast tests

## Dependencies

### Core
- `@smogon/calc` - Damage calculation engine
- `expo` - React Native framework
- `react-native-paper` - Material UI components

### State & Storage
- `zustand` - State management
- `react-native-mmkv` - Fast key-value storage

### Utilities
- `fuse.js` - Fuzzy search for Pokemon/moves

## Environment Variables

```bash
# None required for MVP - all data bundled
```

## Known Issues / Tech Debt

- [ ] Verify @smogon/calc works in React Native (may need polyfills)
- [ ] Test bundle size with all Pokemon data included

## Resources

- [@smogon/calc docs](https://github.com/smogon/damage-calc)
- [Expo documentation](https://docs.expo.dev/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
