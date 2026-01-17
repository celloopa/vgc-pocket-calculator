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
  weather?: 'Sun' | 'Rain' | 'Sand' | 'Snow' | 'Harsh Sunshine' | 'Heavy Rain' | 'Strong Winds';
  terrain?: 'Electric' | 'Grassy' | 'Psychic' | 'Misty';
  gameType?: GameType;
  attackerSide?: {
    reflect?: boolean;
    lightScreen?: boolean;
    auroraVeil?: boolean;
    tailwind?: boolean;
    helpingHand?: boolean;
  };
  defenderSide?: {
    reflect?: boolean;
    lightScreen?: boolean;
    auroraVeil?: boolean;
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
      attackerSide: {
        isReflect: fieldConfig.attackerSide?.reflect,
        isLightScreen: fieldConfig.attackerSide?.lightScreen,
        isAuroraVeil: fieldConfig.attackerSide?.auroraVeil,
        isTailwind: fieldConfig.attackerSide?.tailwind,
        isHelpingHand: fieldConfig.attackerSide?.helpingHand,
      },
      defenderSide: {
        isReflect: fieldConfig.defenderSide?.reflect,
        isLightScreen: fieldConfig.defenderSide?.lightScreen,
        isAuroraVeil: fieldConfig.defenderSide?.auroraVeil,
      },
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
