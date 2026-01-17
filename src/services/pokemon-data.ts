/**
 * Pokemon Data Service
 * Provides efficient access to Pokemon species data with fuzzy search
 */

import { Generations } from '@smogon/calc';
import Fuse from 'fuse.js';

/**
 * Generation number type (1-9)
 */
export type GenerationNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * Pokemon species information
 */
export interface PokemonSpecies {
  id: string;
  name: string;
  types: string[];
  baseStats: {
    hp: number;
    atk: number;
    def: number;
    spa: number;
    spd: number;
    spe: number;
  };
  abilities: Record<string, string>;
  isForm: boolean;
  baseFormId?: string;
}

/**
 * Pokemon Data Service class
 */
export class PokemonDataService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private gen: any; // Generation type not exported from @smogon/calc
  private speciesList: PokemonSpecies[];
  private fuse: Fuse<PokemonSpecies>;

  constructor(generationNum: GenerationNum = 9) {
    this.gen = Generations.get(generationNum);
    this.speciesList = this.loadSpecies();
    this.fuse = new Fuse(this.speciesList, {
      keys: ['name', 'id'],
      threshold: 0.3, // Fuzzy matching threshold (0 = exact, 1 = match anything)
      ignoreLocation: true, // Don't care where in the string the match is
      minMatchCharLength: 2, // Minimum characters to match
    });
  }

  /**
   * Load all Pokemon species from @smogon/calc
   */
  private loadSpecies(): PokemonSpecies[] {
    const species: PokemonSpecies[] = [];

    for (const smogonSpecies of this.gen.species) {
      // Determine if this is an alternate form
      const isForm =
        smogonSpecies.name.includes('-') &&
        !smogonSpecies.name.match(/^(Ho-Oh|Nidoran-[FM]|Porygon-Z|Jangmo-o|Hakamo-o|Kommo-o)$/);

      // Extract base form ID for forms (e.g., "Landorus-Therian" -> "landorus")
      let baseFormId: string | undefined;
      if (isForm) {
        // Get the base name (before the first hyphen) and convert to ID format
        const baseName = smogonSpecies.name.split('-')[0];
        baseFormId = baseName.toLowerCase().replace(/[^a-z0-9]/g, '');
      }

      species.push({
        id: smogonSpecies.id,
        name: smogonSpecies.name,
        types: smogonSpecies.types,
        baseStats: {
          hp: smogonSpecies.baseStats.hp,
          atk: smogonSpecies.baseStats.atk,
          def: smogonSpecies.baseStats.def,
          spa: smogonSpecies.baseStats.spa,
          spd: smogonSpecies.baseStats.spd,
          spe: smogonSpecies.baseStats.spe,
        },
        abilities: smogonSpecies.abilities,
        isForm,
        baseFormId,
      });
    }

    return species;
  }

  /**
   * Get all Pokemon species
   */
  getAllSpecies(): PokemonSpecies[] {
    return this.speciesList;
  }

  /**
   * Get a specific Pokemon by ID
   */
  getSpeciesById(id: string): PokemonSpecies | undefined {
    return this.speciesList.find(s => s.id === id);
  }

  /**
   * Get a specific Pokemon by name
   */
  getSpeciesByName(name: string): PokemonSpecies | undefined {
    const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return this.speciesList.find(s => s.id === normalizedName);
  }

  /**
   * Search Pokemon by name with fuzzy matching
   * Returns all forms if base form is matched (e.g., "Ursaluna" returns both forms)
   */
  searchSpecies(query: string, limit: number = 20): PokemonSpecies[] {
    if (!query.trim()) {
      return [];
    }

    // Perform fuzzy search
    const results = this.fuse.search(query, { limit: limit * 2 }); // Get extra results for form grouping
    const matches = results.map(r => r.item);

    // Group forms together
    const seen = new Set<string>();
    const grouped: PokemonSpecies[] = [];

    for (const species of matches) {
      // Skip if we've already added this base form
      const key = species.baseFormId || species.id;
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);

      // Add the matched species
      grouped.push(species);

      // If this is a base form, also add all its alternate forms
      if (!species.isForm) {
        const forms = this.speciesList.filter(
          s => s.baseFormId === species.id && s.id !== species.id
        );
        grouped.push(...forms);
      }
    }

    return grouped.slice(0, limit);
  }

  /**
   * Get all forms of a Pokemon (including base form)
   */
  getFormsOf(baseId: string): PokemonSpecies[] {
    const baseForm = this.getSpeciesById(baseId);
    if (!baseForm) {
      return [];
    }

    const forms = this.speciesList.filter(s => s.baseFormId === baseId);
    return [baseForm, ...forms];
  }

  /**
   * Get Pokemon count
   */
  getSpeciesCount(): number {
    return this.speciesList.length;
  }

  /**
   * Filter species by type
   */
  filterByType(type: string): PokemonSpecies[] {
    const normalizedType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    return this.speciesList.filter(s => s.types.includes(normalizedType));
  }

  /**
   * Get all unique types
   */
  getAllTypes(): string[] {
    const types = new Set<string>();
    for (const species of this.speciesList) {
      species.types.forEach(t => types.add(t));
    }
    return Array.from(types).sort();
  }
}

// Singleton instance for Gen 9 (VGC)
let instance: PokemonDataService | null = null;

/**
 * Get the singleton Pokemon Data Service instance for Gen 9
 */
export function getPokemonDataService(): PokemonDataService {
  if (!instance) {
    instance = new PokemonDataService(9);
  }
  return instance;
}

/**
 * Create a new Pokemon Data Service for a specific generation
 */
export function createPokemonDataService(gen: GenerationNum): PokemonDataService {
  return new PokemonDataService(gen);
}
