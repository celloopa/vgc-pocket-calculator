/**
 * @smogon/calc Wrapper
 * Provides a clean interface to the Smogon damage calculator
 */

import { calculate, Pokemon, Move, Field, Result, GenerationNum } from '@smogon/calc';

// Type imports from @smogon/calc internals
type TypeName =
  | 'Normal'
  | 'Fighting'
  | 'Flying'
  | 'Poison'
  | 'Ground'
  | 'Rock'
  | 'Bug'
  | 'Ghost'
  | 'Steel'
  | 'Fire'
  | 'Water'
  | 'Grass'
  | 'Electric'
  | 'Psychic'
  | 'Ice'
  | 'Dragon'
  | 'Dark'
  | 'Fairy'
  | 'Stellar'
  | '???';

type GameType = 'Singles' | 'Doubles';

/**
 * Pokemon configuration for damage calculation
 */
export interface PokemonConfig {
  name: string;
  level?: number;
  nature?: string;
  ability?: string;
  item?: string;
  teraType?: TypeName;
  ivs?: {
    hp?: number;
    atk?: number;
    def?: number;
    spa?: number;
    spd?: number;
    spe?: number;
  };
  evs?: {
    hp?: number;
    atk?: number;
    def?: number;
    spa?: number;
    spd?: number;
    spe?: number;
  };
  boosts?: {
    atk?: number;
    def?: number;
    spa?: number;
    spd?: number;
    spe?: number;
  };
  status?: 'brn' | 'par' | 'slp' | 'frz' | 'psn' | 'tox';
  curHP?: number;
}

/**
 * Move configuration for damage calculation
 */
export interface MoveConfig {
  name: string;
  isCrit?: boolean;
  hits?: number;
  timesUsed?: number;
  timesUsedWithMetronome?: number;
}

/**
 * Field conditions for damage calculation
 */
export interface FieldConfig {
  // Game type
  gameType?: GameType;

  // Weather
  weather?:
    | 'Sun'
    | 'Rain'
    | 'Sand'
    | 'Snow'
    | 'Hail'
    | 'Harsh Sunshine'
    | 'Heavy Rain'
    | 'Strong Winds';

  // Terrain
  terrain?: 'Electric' | 'Grassy' | 'Psychic' | 'Misty';

  // Field-wide conditions
  isMagicRoom?: boolean; // Items suppressed
  isWonderRoom?: boolean; // Def and SpD swapped
  isGravity?: boolean; // Ground-type immunity removed

  // Ruin abilities (Treasures of Ruin legendaries)
  isBeadsOfRuin?: boolean; // SpD ×0.75
  isSwordOfRuin?: boolean; // Def ×0.75
  isTabletsOfRuin?: boolean; // Atk ×0.75
  isVesselOfRuin?: boolean; // SpA ×0.75

  // Auras
  isFairyAura?: boolean; // Fairy moves ×1.33
  isDarkAura?: boolean; // Dark moves ×1.33
  isAuraBreak?: boolean; // Reverses aura effects

  // Attacker side conditions
  attackerSide?: {
    // Screens
    isReflect?: boolean;
    isLightScreen?: boolean;
    isAuroraVeil?: boolean;

    // Speed and support
    isTailwind?: boolean;
    isHelpingHand?: boolean;

    // Abilities
    isFriendGuard?: boolean;
    isFlowerGift?: boolean;
    isBattery?: boolean;
    isPowerSpot?: boolean;

    // Hazards
    spikes?: number; // 0-3 layers
    isSR?: boolean; // Stealth Rock
    steelsurge?: boolean;

    // G-Max move effects
    vinelash?: boolean;
    wildfire?: boolean;
    cannonade?: boolean;
    volcalith?: boolean;

    // Other
    isSeeded?: boolean;
    isForesight?: boolean;
  };

  // Defender side conditions
  defenderSide?: {
    // Screens
    isReflect?: boolean;
    isLightScreen?: boolean;
    isAuroraVeil?: boolean;

    // Speed and support
    isTailwind?: boolean;

    // Abilities
    isFriendGuard?: boolean;
    isFlowerGift?: boolean;
    isBattery?: boolean;
    isPowerSpot?: boolean;

    // Hazards
    spikes?: number; // 0-3 layers
    isSR?: boolean; // Stealth Rock
    steelsurge?: boolean;

    // G-Max move effects
    vinelash?: boolean;
    wildfire?: boolean;
    cannonade?: boolean;
    volcalith?: boolean;

    // Other
    isSeeded?: boolean;
    isForesight?: boolean;
  };
}

/**
 * Calculate damage for a move
 */
export function calculateDamage(
  attackerConfig: PokemonConfig,
  defenderConfig: PokemonConfig,
  moveConfig: MoveConfig,
  fieldConfig?: FieldConfig,
  gen: GenerationNum = 9
): Result {
  // Create attacker Pokemon
  const attacker = new Pokemon(gen, attackerConfig.name, {
    level: attackerConfig.level ?? 50,
    nature: attackerConfig.nature,
    ability: attackerConfig.ability,
    item: attackerConfig.item,
    teraType: attackerConfig.teraType,
    ivs: attackerConfig.ivs,
    evs: attackerConfig.evs,
    boosts: attackerConfig.boosts,
    status: attackerConfig.status,
    curHP: attackerConfig.curHP,
  });

  // Create defender Pokemon
  const defender = new Pokemon(gen, defenderConfig.name, {
    level: defenderConfig.level ?? 50,
    nature: defenderConfig.nature,
    ability: defenderConfig.ability,
    item: defenderConfig.item,
    teraType: defenderConfig.teraType,
    ivs: defenderConfig.ivs,
    evs: defenderConfig.evs,
    boosts: defenderConfig.boosts,
    status: defenderConfig.status,
    curHP: defenderConfig.curHP,
  });

  // Create move
  const move = new Move(gen, moveConfig.name, {
    isCrit: moveConfig.isCrit,
    hits: moveConfig.hits,
    timesUsed: moveConfig.timesUsed,
    timesUsedWithMetronome: moveConfig.timesUsedWithMetronome,
  });

  // Create field conditions if provided
  let field: Field | undefined;
  if (fieldConfig) {
    field = new Field({
      gameType: fieldConfig.gameType ?? 'Doubles', // Default to doubles for VGC
      weather: fieldConfig.weather,
      terrain: fieldConfig.terrain,

      // Field-wide conditions
      isMagicRoom: fieldConfig.isMagicRoom,
      isWonderRoom: fieldConfig.isWonderRoom,
      isGravity: fieldConfig.isGravity,
      isAuraBreak: fieldConfig.isAuraBreak,
      isFairyAura: fieldConfig.isFairyAura,
      isDarkAura: fieldConfig.isDarkAura,
      isBeadsOfRuin: fieldConfig.isBeadsOfRuin,
      isSwordOfRuin: fieldConfig.isSwordOfRuin,
      isTabletsOfRuin: fieldConfig.isTabletsOfRuin,
      isVesselOfRuin: fieldConfig.isVesselOfRuin,

      // Attacker side
      attackerSide: fieldConfig.attackerSide,

      // Defender side
      defenderSide: fieldConfig.defenderSide,
    });
  }

  // Calculate damage
  return calculate(gen, attacker, defender, move, field);
}

/**
 * Export types and classes from @smogon/calc for advanced usage
 */
export { Pokemon, Move, Field, Result } from '@smogon/calc';
export type { GenerationNum } from '@smogon/calc';
