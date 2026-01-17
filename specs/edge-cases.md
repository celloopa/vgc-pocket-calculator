# Edge Cases & UX Considerations

**Last Updated**: 2026-01-16

This document explores edge cases and how the UI should handle them gracefully.

---

## 1. Long Pokemon Names

### Problem

Some Pokemon have very long names that can break layouts:

- "Ursaluna-Bloodmoon" (19 chars)
- "Iron Leaves" (11 chars + space)
- "Wo-Chien" (8 chars + hyphen)
- "Walking Wake" (12 chars + space)

### Solutions

**Option A: Truncate with ellipsis**

```
Ursaluna-Blo... → Urshifu
```

❌ Loses clarity, hard to differentiate forms

**Option B: Two-line layout (Recommended)**

```
┌─────────────────────────┐
│  ATTACKER               │
│  Ursaluna-              │
│  Bloodmoon   ⭐         │
└─────────────────────────┘
```

✅ Full name visible, clean layout

**Option C: Abbreviate form names**

```
Ursaluna-BM → Urshifu-RS
```

✅ Compact but requires users to know abbreviations

**Recommendation**: Use **Option B** for collapsed cards, full name visible on expanded cards.

---

## 2. Very High Damage (>100% HP)

### Problem

Moves can deal more damage than defender's max HP:

- 200 damage to 100 HP Pokemon = 200%
- Overkill makes damage bars look weird

### Example

```
Earthquake: 245-289 HP (210-248%)
```

### Solutions

**Option A: Cap damage bar at 100%**

```
████████████████████ 210% (Bar full)
```

❌ Misleading - doesn't show how much overkill

**Option B: Show overkill visually (Recommended)**

```
████████████████████▓▓▓▓▓▓▓▓ 210%
                    ↑ Overflow in different shade
```

✅ Clear visual that damage exceeds 100%

**Option C: Show multiplier**

```
████████████████████ 210% (2.1x overkill)
```

✅ Clear but adds extra text

**Recommendation**: **Option B** - Use gradient or different shade to show overflow beyond 100%.

---

## 3. Very Low Damage (<5% HP)

### Problem

Some moves deal minimal damage:

- U-turn: 12-15 HP (3-4%)
- Fake Out: 8-10 HP (2-3%)

### Example

```
U-turn: 12-15 HP (3-4%)
█░░░░░░░░░░░░░░░░░░░ 27HKO
```

### Solutions

**Option A: Minimum bar width**

```
██░░░░░░░░░░░░░░░░░ 3% (Always show at least 2 segments)
```

✅ Visible but proportionally misleading

**Option B: Dot indicator (Recommended)**

```
●░░░░░░░░░░░░░░░░░░ 3%
```

✅ Clearly shows "minimal damage"

**Option C: Gray out low damage moves**

```
U-turn: 12-15 HP (3-4%) [Not viable]
```

❌ Hides information

**Recommendation**: **Option B** - Use dot for <5% damage, maintains visual hierarchy.

---

## 4. Missing Sprites

### Problem

@smogon/calc may not have sprites for:

- Brand new Pokemon (DLC releases)
- Regional forms
- Custom formats (hackmons)

### Solutions

**Option A: Type icon fallback (Recommended)**

```
┌─────────────┐
│   🌍        │ ← Ground type icon
│  Landorus   │
└─────────────┘
```

✅ Clean, uses Pokemon's primary type

**Option B: Placeholder image**

```
┌─────────────┐
│   [?]       │ ← Gray pokeball
│  Landorus   │
└─────────────┘
```

✅ Universal but less informative

**Option C: First letter avatar**

```
┌─────────────┐
│    L        │ ← Large letter in type color
│  Landorus   │
└─────────────┘
```

✅ Readable but less visually appealing

**Recommendation**: **Option A** - Type icon fallback maintains visual consistency.

---

## 5. Long Move Names

### Problem

Move names vary in length:

- "Earthquake" (10 chars) ✓
- "Thunder" (7 chars) ✓
- "Giga Impact" (11 chars + space) ✓
- "Expanding Force" (15 chars + space) ⚠️
- "Psyshock" (8 chars) ✓

### Current Layout

```
🌍 Earthquake    156-186 HP (85-101%)  🔥 OHKO 50%
```

### Solutions

**Option A: Fixed-width columns**

```
🌍 Earthquake    156-186 HP    85-101%    🔥 OHKO
💧 Expanding...  142-168 HP    77-91%     ⚡ 2HKO
```

❌ Truncation loses clarity

**Option B: Two-line layout for long names (Recommended)**

```
🌍 Earthquake         156-186 HP (85-101%)  🔥 OHKO 50%

💧 Expanding Force    142-168 HP (77-91%)   ⚡ 2HKO
```

✅ Full name visible, slightly taller card

**Option C: Abbreviate move names**

```
Expanding Force → Exp. Force
```

❌ Inconsistent, requires guessing

**Recommendation**: **Option B** - Allow rows to expand for long names (max 2 lines).

---

## 6. Zero Damage (Immunity)

### Problem

Some matchups deal 0 damage:

- Electric move vs Ground type
- Normal move vs Ghost type
- Burn on Magic Guard Pokemon

### Example

```
Thunderbolt: 0 HP (0%)
```

### Solutions

**Option A: Show "IMMUNE" text (Recommended)**

```
⚡ Thunderbolt    IMMUNE    Ground resists Electric
```

✅ Clear, educational

**Option B: Empty damage bar**

```
⚡ Thunderbolt    0 HP (0%)
░░░░░░░░░░░░░░░░░░░░░░░░
```

❌ Visually boring, unclear why

**Option C: Strike-through with icon**

```
⚡ Thunderbolt    ❌ No effect
```

✅ Clear but less informative

**Recommendation**: **Option A** - Show "IMMUNE" with brief reason (type immunity, ability, etc.).

---

## 7. Screen Size Variations

### Devices to Support

- **iPhone SE (3rd gen)**: 375 x 667pt (small)
- **iPhone 15 Pro**: 393 x 852pt (standard)
- **iPhone 15 Pro Max**: 430 x 932pt (large)
- **iPad Mini**: 744 x 1133pt (tablet)
- **Android (small)**: 360 x 640dp
- **Android (large)**: 412 x 915dp

### Problems

- **Small screens**: 4-move results may require scrolling
- **Large screens**: Too much whitespace, underutilized
- **Tablets**: Should we show side-by-side layout?

### Solutions

**Small Screens (iPhone SE, <380pt width)**

- Compact damage bars (shorter)
- Collapse field conditions by default
- Show 3 moves visible, 4th requires scroll

**Standard Screens (380-430pt width)**

- Default layout (as designed)
- All 4 moves visible

**Large Screens / Tablets (>430pt width)**

- Show attacker and defender side-by-side
- Damage results in center column
- More breathing room

**Recommendation**: Use responsive breakpoints with `useWindowDimensions()`.

---

## 8. Complex Stat Boosts UI

### Problem

Showing stat boosts for 6 stats (-6 to +6 each) takes a lot of space:

```
Atk: [-] [-2] [+]  Def: [-] [0] [+]  SpA: [-] [+1] [+]
SpD: [-] [0] [+]   Spe: [-] [0] [+]  Acc: [-] [0] [+]
```

### Solutions

**Option A: Compact chip toggles (Recommended)**

```
Stat Boosts:
[Atk +1] [Def 0] [SpA 0] [SpD 0] [Spe 0]
↑ Tap to cycle: 0 → +1 → +2 → ... → +6 → -6 → ... → 0
```

✅ Compact, one tap to change

**Option B: Slider per stat**

```
Atk:  -6 ━━━●━━━ +6
Def:  -6 ━━━●━━━ +6
```

❌ Takes too much vertical space

**Option C: Dropdown per stat**

```
Atk: [+1 ▼]  Def: [0 ▼]  SpA: [0 ▼]
```

✅ Compact but requires extra tap

**Option D: Most common presets only**

```
[No Boosts] [+1 Atk] [+1 SpA] [+1 Spe] [Intimidate -1] [Custom]
```

✅ Fastest for common scenarios
❌ Still need custom for complex situations

**Recommendation**: **Option D** + **Option A** fallback. Show preset chips for common cases (+1 Atk, +1 SpA, +1 Spe, -1 Atk from Intimidate), and "Custom" button opens bottom sheet with individual stat controls.

---

## 9. No Moves Selected

### Problem

When user hasn't selected any moves yet, what shows in damage results?

### Solutions

**Option A: Placeholder text (Recommended)**

```
┌─────────────────────────────────────┐
│  Select moves to calculate damage   │
│                                     │
│  [Select Moves]                     │
└─────────────────────────────────────┘
```

✅ Clear call-to-action

**Option B: Show empty state with animation**

```
┌─────────────────────────────────────┐
│         💥                          │
│   No moves selected                 │
│   Tap below to choose moves         │
└─────────────────────────────────────┘
```

✅ Playful, visually interesting

**Option C: Auto-select 4 most common moves**

```
Automatically show:
- Earthquake
- Rock Slide
- U-turn
- Protect
```

❌ Assumes user intent, potentially confusing

**Recommendation**: **Option B** - Friendly empty state with clear guidance.

---

## 10. All 4 Moves Deal Similar Damage

### Problem

If all moves deal ~90-100 HP, damage bars look identical:

```
Earthquake:    92-109 HP (95%)  ████████████████████
Earth Power:   90-106 HP (93%)  ████████████████████
Rock Slide:    88-104 HP (91%)  ███████████████████░
U-turn:        85-101 HP (88%)  ███████████████████░
```

### Solutions

**Option A: Zoom in on range (Recommended)**

```
Damage Range: 85-110 HP (scale bar to this range)

Earthquake:    92-109 HP  ████████████████████░░░░
Earth Power:   90-106 HP  ████████████████░░░░░░░░
Rock Slide:    88-104 HP  ██████████████░░░░░░░░░░
U-turn:        85-101 HP  ████████████░░░░░░░░░░░░
                          85               110
```

✅ Shows relative differences clearly

**Option B: Show percentage difference from strongest**

```
Earthquake:    92-109 HP  (0%)     ← Strongest
Earth Power:   90-106 HP  (-2%)
Rock Slide:    88-104 HP  (-4%)
U-turn:        85-101 HP  (-7%)
```

✅ Clear comparison

**Option C: Keep as-is**

```
All bars look similar, user compares numbers
```

❌ Harder to compare visually

**Recommendation**: **Option A** - Dynamic range scaling for damage bars when all moves are close.

---

## 11. Multi-Hit Moves

### Problem

Moves like Bullet Seed hit 2-5 times:

- "Bullet Seed hits 2-5 times"
- Damage shown is total (all hits combined)
- User may want per-hit damage

### Example

```
Bullet Seed: 120-145 HP (65-78%) [2-5 hits]
```

### Solutions

**Option A: Show total + hit count (Recommended)**

```
🌱 Bullet Seed       120-145 HP (65-78%)    🔥 OHKO 50%
   (2-5 hits × 24-29 per hit)
```

✅ Shows both total and per-hit

**Option B: Toggle view**

```
🌱 Bullet Seed  [Total: 120-145] [Per Hit: 24-29] ← Tap to switch
```

✅ Flexible but adds interaction

**Option C: Expandable details only**

```
🌱 Bullet Seed       120-145 HP (65-78%)
Tap to see: "2-5 hits, 24-29 HP per hit"
```

✅ Keeps main view clean

**Recommendation**: **Option A** - Show per-hit damage as secondary line for multi-hit moves.

---

## 12. Field Condition Conflicts

### Problem

Some field conditions are mutually exclusive:

- Can't have Sun + Rain + Sand + Snow simultaneously
- Can't have Electric Terrain + Grassy Terrain

### Solutions

**Option A: Radio button behavior (Recommended)**

```
When user taps "Sun", auto-deselect Rain/Sand/Snow
When user taps "Grassy", auto-deselect other terrains
```

✅ Prevents invalid states automatically

**Option B: Show warning**

```
User taps Sun (while Rain is active):
Toast: "Sun replaced Rain"
```

✅ Informative but extra UI noise

**Option C: Allow conflicts, show error on calculate**

```
User can select Sun + Rain
Error: "Invalid field state"
```

❌ Frustrating, requires fixing

**Recommendation**: **Option A** - Radio button behavior for weather/terrain groups.

---

## 13. Long EV Spread Descriptions

### Problem

Custom EV spreads can be verbose:

```
HP: 252  Atk: 0  Def: 252  SpA: 0  SpD: 4  Spe: 0
```

### Solutions

**Option A: Shorthand notation (Recommended)**

```
252 HP / 4 SpD / 252 Spe
(Only show non-zero values)
```

✅ Compact, matches Showdown format

**Option B: Visual bars**

```
HP:  ████████████████ 252
Def: ████████████████ 252
SpD: █ 4
```

✅ Visual but takes more space

**Recommendation**: **Option A** - Shorthand notation for display.

---

## 14. Damage Probability Edge Cases

### Problem

KO probability can be complex:

- "87.5% chance to OHKO" (14/16 rolls)
- "56.25% chance to 2HKO" (9/16 rolls)
- What if it's exactly 50%?

### Solutions

**Option A: Show percentage + fraction (Recommended)**

```
OHKO 87.5% (14/16 rolls)
```

✅ Precise and educational

**Option B: Round to nearest 5%**

```
OHKO ~85%
```

❌ Loses precision

**Option C: Use descriptive terms**

```
OHKO (Likely)      → 75-99%
OHKO (Possible)    → 25-74%
OHKO (Unlikely)    → 1-24%
OHKO (Guaranteed)  → 100%
```

✅ Easier to understand but less precise

**Recommendation**: **Option A** for expanded view, **Option C** for collapsed chips.

---

## 15. Tera Type Selection When Already Terastallized

### Problem

In actual battles, you can only Tera once per battle. Should the app:

- Allow changing Tera type freely (calculator mode)?
- Lock Tera type once selected (simulator mode)?

### Solutions

**Option A: Always allow changes (Recommended)**

```
User can toggle Tera type on/off freely
Acts as "what-if" calculator
```

✅ Maximum flexibility for planning

**Option B: Add "Reset" button**

```
Once Tera'd, show warning: "Already Tera'd, reset battle?"
```

❌ Adds complexity for no benefit

**Recommendation**: **Option A** - This is a calculator, not a simulator. Allow free toggling.

---

## Summary of Recommendations

| Edge Case                | Solution                                                     |
| ------------------------ | ------------------------------------------------------------ |
| Long Pokemon names       | Two-line layout on collapsed cards                           |
| Very high damage (>100%) | Overflow gradient on damage bar                              |
| Very low damage (<5%)    | Dot indicator instead of tiny bar                            |
| Missing sprites          | Type icon fallback                                           |
| Long move names          | Two-line rows (max)                                          |
| Zero damage (immunity)   | Show "IMMUNE" with reason                                    |
| Screen sizes             | Responsive breakpoints (small/standard/large)                |
| Stat boost UI            | Preset chips + custom bottom sheet                           |
| No moves selected        | Friendly empty state with CTA                                |
| Similar damage values    | Dynamic range scaling on bars                                |
| Multi-hit moves          | Show per-hit damage as sub-line                              |
| Field conflicts          | Radio button behavior (auto-deselect)                        |
| Long EV spreads          | Shorthand notation (252 HP / 4 SpD / 252 Spe)                |
| Damage probability       | Percentage + fraction in details, descriptive terms in chips |
| Tera flexibility         | Free toggling (calculator mode)                              |

---

## Next Steps

- [ ] Create mockups incorporating these edge cases
- [ ] Define animation timings for state transitions
- [ ] Update component specifications with edge case handling
- [ ] Test designs on small/large screen sizes
