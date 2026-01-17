# UI Design Specification

**Last Updated**: 2026-01-16
**Design Direction**: Mobile-first, 2D flat design with strong animation principles

## Design Decisions

### Layout Architecture

- **Card System**: Collapsible cards (expand one at a time)
- **Results Position**: Top of screen (results-first workflow)
- **Selection Method**: Bottom sheet modals
- **Multi-Move Support**: Display 2-4 move calculations simultaneously

### Animation System

- **Library**: Reanimated 3 + Moti (Framer Motion-like API for React Native)
- **Style**: 2D flat animations with strong animation principles
  - Spring physics for natural motion
  - Layout transitions for card expansion
  - Gesture-driven interactions
  - Smooth 60fps performance

### Mobile Features

- ✅ Haptic feedback (selections, toggles, calculations)
- ✅ Quick presets (EV spreads, popular sets)
- ✅ Gesture controls (swipe to swap, swipe up for import)
- ✅ Multi-move comparison (2-4 moves visible simultaneously)

---

## Screen Layout

### Top → Bottom Flow

```
┌─────────────────────────────────────────┐
│                                         │
│         DAMAGE RESULTS (Sticky)         │
│  ┌───────────────────────────────────┐  │
│  │  Landorus → Urshifu               │  │
│  │  ───────────────────────────────  │  │
│  │  Earthquake  │ 156-186 HP (85%)   │  │ ← Tap to expand
│  │  Earth Power │ 142-168 HP (77%)   │  │
│  │  Rock Slide  │  89-106 HP (48%)   │  │
│  │  U-turn      │  24-29  HP (13%)   │  │
│  └───────────────────────────────────┘  │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│       FIELD CONDITIONS BAR              │
│  ☀️ 🌧️ 🌪️ ⚡ 🌱 | 🛡️ 💡 🌀           │ ← Horizontal scrollable chips
│                                         │
├─────────────────────────────────────────┤
│                                         │
│    ▼ ATTACKER: Landorus                │ ← Collapsed card
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  🎯 Landorus (Sprite)             │  │
│  │                                   │  │
│  │  Nature: Jolly    Item: Scarf    │  │
│  │  Ability: Intimidate             │  │
│  │                                   │  │
│  │  EVs: 252 Atk / 4 Def / 252 Spe  │  │ ← Tap preset or "Custom"
│  │  [Preset ▼] [Custom]             │  │
│  │                                   │  │
│  │  Tera: Flying 🦅                  │  │
│  │                                   │  │
│  │  Attack: +1  Sp.Atk: 0  Speed: 0 │  │ ← Stat boost toggles
│  └───────────────────────────────────┘  │
│                                         │
│    ▶ DEFENDER: Urshifu-Rapid-Strike    │ ← Collapsed card
│                                         │
├─────────────────────────────────────────┤
│                                         │
│         [⚡ Quick Actions]              │
│   [⇅ Swap] [🔄 Reset] [📋 Import]      │
│                                         │
└─────────────────────────────────────────┘
```

---

## Component Specifications

### 1. Damage Results Card (Top, Sticky)

**Collapsed State** (default):

- Shows attacker → defender names with sprites
- Lists 2-4 moves with damage ranges
- KO indicator per move (OHKO/2HKO with %)
- Tap any row to expand

**Expanded State**:

- Selected move highlighted
- Full damage bar visualization (min/max rolls)
- Detailed calculation description
- Copy button for sharing

**Animations**:

- Spring animation when expanding/collapsing
- Slide in from top on calculation update
- Haptic feedback on tap

### 2. Field Conditions Bar

**Layout**:

- Horizontal scrollable chip row
- Two sections: Weather/Terrain | Screens/Modifiers
- Active chips highlighted with color
- Single-tap toggle

**Chips**:

- Weather: ☀️ Sun, 🌧️ Rain, 🌪️ Sand, ❄️ Snow, ⛅ None
- Terrain: ⚡ Electric, 🌱 Grassy, 🧠 Psychic, 🌫️ Misty, ⛅ None
- Screens: 🛡️ Reflect, 💡 Light Screen, 🌀 Aurora Veil
- Modifiers: 🤝 Helping Hand, 💥 Crit

**Animations**:

- Pop animation on toggle (scale 1.0 → 1.15 → 1.0)
- Color transition (inactive → active)
- Haptic feedback

### 3. Attacker/Defender Cards

**Collapsed State**:

- Show Pokemon name + sprite thumbnail
- Chevron indicator (▶ collapsed, ▼ expanded)
- Tap anywhere to expand

**Expanded State**:

- Full Pokemon configuration
- Bottom sheet for selectors (Pokemon, Nature, Ability, Item, Tera)
- Quick preset buttons for EVs
- Stat boost toggles with +/- buttons

**Animations**:

- Layout animation when expanding (height: 60 → 300)
- Only one card expanded at a time (expanding one collapses the other)
- Spring physics for natural motion

**Gesture**:

- Swipe left/right on card to swap attacker ↔ defender

### 4. Move Selector (Bottom Sheet)

**Trigger**: Tap "Select Moves" button in attacker card

**Layout**:

- Search bar at top
- Type filter chips (scrollable horizontal)
- Multi-select checkboxes (select 2-4 moves)
- Recent moves section
- "Apply" button at bottom

**Animations**:

- Sheet slides up from bottom (spring animation)
- Backdrop blur/dim
- Selected moves show checkmark animation

### 5. Pokemon Selector (Bottom Sheet)

**Trigger**: Tap Pokemon name/sprite in card

**Layout**:

- Search bar with instant results
- Tabs: Recent | Favorites | All
- Grid view with sprites + names
- Star icon to favorite

**Animations**:

- Sheet slides up from bottom
- Search results fade in
- Sprite hover effect (subtle scale)

**Gesture**:

- Swipe down to dismiss

---

## Animation Principles

### Core Principles

1. **Natural Motion**: Use spring physics (not linear easing)
2. **Purposeful**: Every animation serves a functional purpose
3. **Responsive**: Gesture-driven where possible
4. **Performant**: 60fps, run on UI thread (Reanimated)
5. **Delightful**: Subtle haptics + smooth transitions

### Key Animations

**Card Expansion/Collapse**:

```typescript
// Using Moti
<MotiView
  animate={{
    height: expanded ? 300 : 60,
  }}
  transition={{
    type: 'spring',
    damping: 20,
    stiffness: 200,
  }}
/>
```

**Chip Toggle**:

```typescript
<MotiView
  animate={{
    scale: active ? 1 : 0.95,
    backgroundColor: active ? '#3B82F6' : '#E5E7EB',
  }}
  transition={{ type: 'spring' }}
/>
```

**Bottom Sheet Entry**:

```typescript
<MotiView
  from={{ translateY: 1000 }}
  animate={{ translateY: 0 }}
  exit={{ translateY: 1000 }}
  transition={{
    type: 'spring',
    damping: 25,
  }}
/>
```

**Damage Result Update**:

```typescript
// Slide in from top when calculation updates
<MotiView
  animate={{ translateY: 0, opacity: 1 }}
  transition={{ type: 'timing', duration: 300 }}
/>
```

---

## Gesture Controls

| Gesture                           | Action                   |
| --------------------------------- | ------------------------ |
| Swipe left/right on attacker card | Swap attacker ↔ defender |
| Swipe left/right on defender card | Swap attacker ↔ defender |
| Swipe up from bottom              | Open import screen       |
| Swipe down on bottom sheet        | Dismiss sheet            |
| Long press on Pokemon             | Quick favorite toggle    |

---

## Color Palette - Pokemon Themed Playful

### Primary Colors

- **Background**: Soft cream `#FFF8E7` (light mode) / Deep navy `#1A1D2E` (dark mode)
- **Card Background**: Pure white `#FFFFFF` with subtle shadow
- **Text Primary**: Dark slate `#2D3748`
- **Text Secondary**: Medium gray `#718096`

### Pokemon Type Colors (Official)

Reference: https://bulbapedia.bulbagarden.net/wiki/Category:Type_color_templates

| Type     | Color        | Hex       |
| -------- | ------------ | --------- |
| Normal   | Gray         | `#A8A878` |
| Fire     | Orange-Red   | `#F08030` |
| Water    | Blue         | `#6890F0` |
| Electric | Yellow       | `#F8D030` |
| Grass    | Green        | `#78C850` |
| Ice      | Light Blue   | `#98D8D8` |
| Fighting | Dark Red     | `#C03028` |
| Poison   | Purple       | `#A040A0` |
| Ground   | Tan          | `#E0C068` |
| Flying   | Purple-Blue  | `#A890F0` |
| Psychic  | Pink         | `#F85888` |
| Bug      | Yellow-Green | `#A8B820` |
| Rock     | Tan-Brown    | `#B8A038` |
| Ghost    | Purple       | `#705898` |
| Dragon   | Purple-Blue  | `#7038F8` |
| Dark     | Dark Brown   | `#705848` |
| Steel    | Gray         | `#B8B8D0` |
| Fairy    | Pink         | `#EE99AC` |

### UI Accent Colors

- **Active/Selected**: Pokeball Red `#EF4444`
- **Success/Confirm**: Grass Green `#10B981`
- **Warning**: Electric Yellow `#FBBF24`
- **Info**: Water Blue `#3B82F6`

### Damage Indicators (Using Type Colors)

- **OHKO**: Fire Red `#F08030` (high damage)
- **2HKO**: Electric Yellow `#F8D030` (moderate)
- **3HKO**: Grass Green `#78C850` (low-moderate)
- **4HKO+**: Water Blue `#6890F0` (low damage)

### Shadows & Borders

- **Card Shadow**: Soft shadow with slight color tint (based on Pokemon's primary type)
- **Border Radius**: 16px (playful, rounded)
- **Chip Border Radius**: 20px (pill shape)

---

## Accessibility Considerations (Future Phase)

- Sufficient color contrast (WCAG AA)
- Touch targets ≥ 44x44pt
- VoiceOver/TalkBack support
- Reduce motion option (disable animations)
- Haptics toggle in settings

---

## Technical Stack

| Layer         | Library                      | Purpose                                   |
| ------------- | ---------------------------- | ----------------------------------------- |
| Animation     | Reanimated 3                 | Core animation engine                     |
| Animation API | Moti                         | Framer-like declarative API               |
| Gestures      | React Native Gesture Handler | Swipe, long press, drag                   |
| Bottom Sheets | @gorhom/bottom-sheet         | Native-feeling modals                     |
| Haptics       | expo-haptics                 | Selection, impact, notification feedback  |
| UI Components | React Native Paper           | Base components (Button, Chip, TextInput) |

---

## Design Decisions (Finalized)

✅ **Multi-move count**: 4 moves (matches Pokemon's move limit, full coverage analysis)
✅ **Animation library**: Both Moti (simple) + Reanimated (complex gestures)
✅ **Visual style**: Pokemon-themed playful (type colors, rounded corners, sprite-forward)

## Open Questions

1. **Damage bar visualization**: Show for all 4 moves or only expanded?
2. **Quick preset options**: Which EV spreads are most common for VGC?

---

## Next Steps

- [ ] Create wireframes/mockups for key screens
- [ ] Define exact animation timing values (spring damping, stiffness)
- [ ] Choose color palette
- [ ] Design sprite/icon assets
- [ ] Prototype multi-move comparison layout
