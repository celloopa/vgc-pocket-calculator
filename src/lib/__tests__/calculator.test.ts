/**
 * Tests for @smogon/calc wrapper
 */

import { calculateDamage, PokemonConfig, MoveConfig, FieldConfig } from '../calculator';

describe('calculateDamage', () => {
  it('should calculate basic damage for a move', () => {
    const attacker: PokemonConfig = {
      name: 'Landorus-Therian',
      level: 50,
      nature: 'Jolly',
      ability: 'Intimidate',
      item: 'Choice Scarf',
      evs: { atk: 252, spe: 252, hp: 4 },
    };

    const defender: PokemonConfig = {
      name: 'Urshifu-Rapid-Strike',
      level: 50,
      nature: 'Jolly',
      ability: 'Unseen Fist',
      evs: { atk: 252, spe: 252, hp: 4 },
    };

    const move: MoveConfig = {
      name: 'Earthquake',
    };

    const result = calculateDamage(attacker, defender, move);

    expect(result).toBeDefined();
    expect(result.damage).toBeDefined();
    // Damage can be a number or an array
    if (Array.isArray(result.damage)) {
      expect(result.damage.length).toBeGreaterThan(0);
    } else {
      expect(typeof result.damage).toBe('number');
    }
  });

  it('should calculate damage with field conditions', () => {
    const attacker: PokemonConfig = {
      name: 'Urshifu-Rapid-Strike',
      level: 50,
      ability: 'Unseen Fist',
      evs: { atk: 252, spe: 252, hp: 4 },
    };

    const defender: PokemonConfig = {
      name: 'Incineroar',
      level: 50,
      ability: 'Intimidate',
      evs: { hp: 252, def: 252, spd: 4 },
    };

    const move: MoveConfig = {
      name: 'Surging Strikes',
    };

    const field: FieldConfig = {
      gameType: 'Doubles',
      weather: 'Rain',
      attackerSide: {
        helpingHand: true,
      },
    };

    const result = calculateDamage(attacker, defender, move, field);

    expect(result).toBeDefined();
    expect(result.damage).toBeDefined();
  });

  it('should calculate damage with stat boosts', () => {
    const attacker: PokemonConfig = {
      name: 'Flutter Mane',
      level: 50,
      nature: 'Timid',
      ability: 'Protosynthesis',
      item: 'Booster Energy',
      evs: { spa: 252, spe: 252, hp: 4 },
      boosts: { spa: 1 }, // +1 Special Attack
    };

    const defender: PokemonConfig = {
      name: 'Amoonguss',
      level: 50,
      nature: 'Calm',
      ability: 'Regenerator',
      evs: { hp: 252, spd: 252, def: 4 },
    };

    const move: MoveConfig = {
      name: 'Shadow Ball',
    };

    const result = calculateDamage(attacker, defender, move);

    expect(result).toBeDefined();
    expect(result.damage).toBeDefined();
    if (Array.isArray(result.damage)) {
      expect(result.damage[0]).toBeGreaterThan(0);
    } else {
      expect(result.damage).toBeGreaterThan(0);
    }
  });

  it('should calculate critical hit damage', () => {
    const attacker: PokemonConfig = {
      name: 'Kingambit',
      level: 50,
      nature: 'Adamant',
      ability: 'Defiant',
      item: 'Black Glasses',
      evs: { hp: 252, atk: 252, spd: 4 },
    };

    const defender: PokemonConfig = {
      name: 'Gholdengo',
      level: 50,
      nature: 'Timid',
      ability: 'Good as Gold',
      evs: { spa: 252, spe: 252, hp: 4 },
    };

    const move: MoveConfig = {
      name: 'Sucker Punch',
      isCrit: true,
    };

    const result = calculateDamage(attacker, defender, move);

    expect(result).toBeDefined();
    expect(result.damage).toBeDefined();
  });

  it('should handle terastallization', () => {
    const attacker: PokemonConfig = {
      name: 'Rillaboom',
      level: 50,
      nature: 'Adamant',
      ability: 'Grassy Surge',
      item: 'Assault Vest',
      evs: { hp: 252, atk: 252, spd: 4 },
      teraType: 'Fire',
    };

    const defender: PokemonConfig = {
      name: 'Kartana',
      level: 50,
      nature: 'Jolly',
      ability: 'Beast Boost',
      evs: { atk: 252, spe: 252, hp: 4 },
    };

    const move: MoveConfig = {
      name: 'Fake Out',
    };

    const result = calculateDamage(attacker, defender, move);

    expect(result).toBeDefined();
    expect(result.damage).toBeDefined();
  });

  it('should calculate multi-hit move damage', () => {
    const attacker: PokemonConfig = {
      name: 'Breloom',
      level: 50,
      nature: 'Jolly',
      ability: 'Technician',
      item: 'Focus Sash',
      evs: { atk: 252, spe: 252, hp: 4 },
    };

    const defender: PokemonConfig = {
      name: 'Tyranitar',
      level: 50,
      nature: 'Adamant',
      ability: 'Sand Stream',
      evs: { hp: 252, atk: 252, spd: 4 },
    };

    const move: MoveConfig = {
      name: 'Bullet Seed',
      hits: 4, // 4 hits
    };

    const result = calculateDamage(attacker, defender, move);

    expect(result).toBeDefined();
    expect(result.damage).toBeDefined();
  });
});
