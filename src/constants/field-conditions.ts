/**
 * Field Conditions Constants
 * All valid battle conditions from @smogon/calc
 */

// Weather conditions
export const WEATHER_OPTIONS = [
  { id: null, label: 'None', emoji: '⛅' },
  { id: 'Sun', label: 'Sun', emoji: '☀️' },
  { id: 'Rain', label: 'Rain', emoji: '🌧️' },
  { id: 'Sand', label: 'Sand', emoji: '🌪️' },
  { id: 'Snow', label: 'Snow', emoji: '❄️' },
  { id: 'Hail', label: 'Hail', emoji: '🧊' }, // Gen 8 and earlier
  { id: 'Harsh Sunshine', label: 'Harsh Sun', emoji: '🌞' }, // Primal Groudon
  { id: 'Heavy Rain', label: 'Heavy Rain', emoji: '⛈️' }, // Primal Kyogre
  { id: 'Strong Winds', label: 'Strong Winds', emoji: '💨' }, // Mega Rayquaza
] as const;

export type WeatherOption = (typeof WEATHER_OPTIONS)[number];

// Terrain conditions
export const TERRAIN_OPTIONS = [
  { id: null, label: 'None', emoji: '⛅' },
  { id: 'Electric', label: 'Electric', emoji: '⚡' },
  { id: 'Grassy', label: 'Grassy', emoji: '🌱' },
  { id: 'Psychic', label: 'Psychic', emoji: '🧠' },
  { id: 'Misty', label: 'Misty', emoji: '🌫️' },
] as const;

export type TerrainOption = (typeof TERRAIN_OPTIONS)[number];

// Field-wide conditions (Ruin abilities, auras, rooms)
export const FIELD_WIDE_CONDITIONS = [
  // Ruin abilities (Treasures of Ruin legendaries)
  { id: 'isTabletsOfRuin', label: 'Tablets of Ruin', emoji: '📜', effect: 'Atk ×0.75' },
  { id: 'isSwordOfRuin', label: 'Sword of Ruin', emoji: '⚔️', effect: 'Def ×0.75' },
  { id: 'isVesselOfRuin', label: 'Vessel of Ruin', emoji: '🏺', effect: 'SpA ×0.75' },
  { id: 'isBeadsOfRuin', label: 'Beads of Ruin', emoji: '📿', effect: 'SpD ×0.75' },

  // Auras
  { id: 'isFairyAura', label: 'Fairy Aura', emoji: '🧚', effect: 'Fairy ×1.33' },
  { id: 'isDarkAura', label: 'Dark Aura', emoji: '🌑', effect: 'Dark ×1.33' },
  { id: 'isAuraBreak', label: 'Aura Break', emoji: '💔', effect: 'Reverses auras' },

  // Rooms and other field effects
  { id: 'isGravity', label: 'Gravity', emoji: '⬇️', effect: 'Ground all' },
  { id: 'isMagicRoom', label: 'Magic Room', emoji: '✨', effect: 'No items' },
  { id: 'isWonderRoom', label: 'Wonder Room', emoji: '🔄', effect: 'Swap Def/SpD' },
] as const;

export type FieldWideCondition = (typeof FIELD_WIDE_CONDITIONS)[number];

// Side conditions (screens, hazards, etc.)
export const SIDE_CONDITIONS = [
  // Screens
  { id: 'isReflect', label: 'Reflect', emoji: '🛡️', effect: 'Physical ×0.5' },
  { id: 'isLightScreen', label: 'Light Screen', emoji: '💡', effect: 'Special ×0.5' },
  { id: 'isAuroraVeil', label: 'Aurora Veil', emoji: '🌀', effect: 'Both ×0.5' },

  // Speed and support
  { id: 'isTailwind', label: 'Tailwind', emoji: '💨', effect: 'Speed ×2' },
  { id: 'isHelpingHand', label: 'Helping Hand', emoji: '🤝', effect: 'Power ×1.5' },

  // Abilities that affect the field
  { id: 'isFriendGuard', label: 'Friend Guard', emoji: '👥', effect: 'Damage ×0.75' },
  { id: 'isFlowerGift', label: 'Flower Gift', emoji: '🌸', effect: 'Atk/SpD ×1.5' },
  { id: 'isBattery', label: 'Battery', emoji: '🔋', effect: 'SpA ×1.3' },
  { id: 'isPowerSpot', label: 'Power Spot', emoji: '⭐', effect: 'Power ×1.3' },

  // Hazards
  { id: 'isSR', label: 'Stealth Rock', emoji: '🪨', effect: 'Entry hazard' },
  { id: 'steelsurge', label: 'Steelsurge', emoji: '⚙️', effect: 'Steel hazard' },
] as const;

export type SideCondition = (typeof SIDE_CONDITIONS)[number];

// Spikes (special case - 0 to 3 layers)
export const SPIKES_OPTIONS = [
  { layers: 0, label: 'No Spikes', damage: '0%' },
  { layers: 1, label: '1 Layer', damage: '12.5%' },
  { layers: 2, label: '2 Layers', damage: '18.75%' },
  { layers: 3, label: '3 Layers', damage: '25%' },
] as const;

// G-Max move side effects (rare, mostly from Gen 8)
export const GMAX_SIDE_CONDITIONS = [
  { id: 'vinelash', label: 'Vinelash', emoji: '🌿', effect: 'Grass damage/turn' },
  { id: 'wildfire', label: 'Wildfire', emoji: '🔥', effect: 'Fire damage/turn' },
  { id: 'cannonade', label: 'Cannonade', emoji: '💧', effect: 'Water damage/turn' },
  { id: 'volcalith', label: 'Volcalith', emoji: '🪨', effect: 'Rock damage/turn' },
] as const;

export type GMaxSideCondition = (typeof GMAX_SIDE_CONDITIONS)[number];

// VGC-focused quick presets (common field states)
export const FIELD_PRESETS = [
  {
    id: 'clear',
    label: 'Clear Field',
    description: 'No conditions active',
    conditions: {},
  },
  {
    id: 'sun-terrain',
    label: 'Sun + Grassy',
    description: 'Torkoal + Rillaboom setup',
    conditions: {
      weather: 'Sun',
      terrain: 'Grassy',
    },
  },
  {
    id: 'rain-tailwind',
    label: 'Rain + Tailwind',
    description: 'Fast rain offense',
    conditions: {
      weather: 'Rain',
      attackerSide: { isTailwind: true },
    },
  },
  {
    id: 'trick-room',
    label: 'Trick Room',
    description: 'Speed inversion active',
    conditions: {
      isWonderRoom: false, // Trick Room isn't directly in field state, handled by speed calc
    },
  },
  {
    id: 'screens-up',
    label: 'Dual Screens',
    description: 'Reflect + Light Screen',
    conditions: {
      defenderSide: {
        isReflect: true,
        isLightScreen: true,
      },
    },
  },
] as const;

export type FieldPreset = (typeof FIELD_PRESETS)[number];

// Helper to get display label for a condition
export function getConditionLabel(conditionId: string): string {
  const allConditions = [
    ...WEATHER_OPTIONS,
    ...TERRAIN_OPTIONS,
    ...FIELD_WIDE_CONDITIONS,
    ...SIDE_CONDITIONS,
    ...GMAX_SIDE_CONDITIONS,
  ];

  const condition = allConditions.find(c => c.id === conditionId);
  return condition?.label ?? conditionId;
}

// Helper to get emoji for a condition
export function getConditionEmoji(conditionId: string): string {
  const allConditions = [
    ...WEATHER_OPTIONS,
    ...TERRAIN_OPTIONS,
    ...FIELD_WIDE_CONDITIONS,
    ...SIDE_CONDITIONS,
    ...GMAX_SIDE_CONDITIONS,
  ];

  const condition = allConditions.find(c => c.id === conditionId);
  return condition?.emoji ?? '❓';
}
