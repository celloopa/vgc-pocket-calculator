/**
 * Tests for Pokemon Data Service
 */

import { PokemonDataService, getPokemonDataService } from '../pokemon-data';

describe('PokemonDataService', () => {
  let service: PokemonDataService;

  beforeAll(() => {
    service = getPokemonDataService();
  });

  describe('getAllSpecies', () => {
    it('should load all Pokemon species', () => {
      const allSpecies = service.getAllSpecies();
      expect(allSpecies.length).toBeGreaterThan(0);
      expect(allSpecies.length).toBeGreaterThan(1000); // Gen 9 has 1000+ species
    });

    it('should have valid species data', () => {
      const allSpecies = service.getAllSpecies();
      const pikachu = allSpecies.find(s => s.id === 'pikachu');

      expect(pikachu).toBeDefined();
      expect(pikachu?.name).toBe('Pikachu');
      expect(pikachu?.types).toContain('Electric');
      expect(pikachu?.baseStats.hp).toBeGreaterThan(0);
      expect(pikachu?.abilities).toBeDefined();
    });
  });

  describe('getSpeciesById', () => {
    it('should get Pokemon by ID', () => {
      const charizard = service.getSpeciesById('charizard');

      expect(charizard).toBeDefined();
      expect(charizard?.name).toBe('Charizard');
      expect(charizard?.types).toEqual(['Fire', 'Flying']);
    });

    it('should return undefined for invalid ID', () => {
      const invalid = service.getSpeciesById('notarealmon');
      expect(invalid).toBeUndefined();
    });

    it('should get alternate forms by ID', () => {
      const bloodmoon = service.getSpeciesById('ursalunabloodmoon');

      expect(bloodmoon).toBeDefined();
      expect(bloodmoon?.name).toBe('Ursaluna-Bloodmoon');
      expect(bloodmoon?.isForm).toBe(true);
      expect(bloodmoon?.baseFormId).toBe('ursaluna');
    });
  });

  describe('getSpeciesByName', () => {
    it('should get Pokemon by name', () => {
      const landorus = service.getSpeciesByName('Landorus-Therian');

      expect(landorus).toBeDefined();
      expect(landorus?.name).toBe('Landorus-Therian');
    });

    it('should handle names with hyphens', () => {
      const urshifu = service.getSpeciesByName('Urshifu-Rapid-Strike');

      expect(urshifu).toBeDefined();
      expect(urshifu?.id).toBe('urshifurapidstrike');
    });

    it('should normalize names (case-insensitive, remove special chars)', () => {
      const hooh = service.getSpeciesByName('Ho-Oh');
      expect(hooh).toBeDefined();
      expect(hooh?.name).toBe('Ho-Oh');
    });
  });

  describe('searchSpecies', () => {
    it('should search Pokemon by name', () => {
      const results = service.searchSpecies('Pikachu');

      expect(results.length).toBeGreaterThan(0);
      const pikachu = results.find(s => s.name === 'Pikachu');
      expect(pikachu).toBeDefined();
    });

    it('should return both Ursaluna forms when searching for Ursaluna (acceptance criteria)', () => {
      const results = service.searchSpecies('Ursaluna');

      // Should find at least 2 results (base form + Bloodmoon)
      expect(results.length).toBeGreaterThanOrEqual(2);

      const baseForm = results.find(s => s.name === 'Ursaluna');
      const bloodmoon = results.find(s => s.name === 'Ursaluna-Bloodmoon');

      expect(baseForm).toBeDefined();
      expect(bloodmoon).toBeDefined();
    });

    it('should perform fuzzy search', () => {
      // Typo: "Lanorus" instead of "Landorus"
      const results = service.searchSpecies('Lanorus');

      expect(results.length).toBeGreaterThan(0);
      const landorus = results.find(s => s.name.includes('Landorus'));
      expect(landorus).toBeDefined();
    });

    it('should handle partial matches', () => {
      const results = service.searchSpecies('Char');

      expect(results.length).toBeGreaterThan(0);
      const charizard = results.find(s => s.name === 'Charizard');
      expect(charizard).toBeDefined();
    });

    it('should return empty array for empty query', () => {
      const results = service.searchSpecies('');
      expect(results).toEqual([]);
    });

    it('should complete search in less than 50ms (acceptance criteria)', () => {
      const start = performance.now();
      service.searchSpecies('Ursaluna');
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(50);
    });

    it('should respect limit parameter', () => {
      const results = service.searchSpecies('a', 5);
      expect(results.length).toBeLessThanOrEqual(5);
    });
  });

  describe('getFormsOf', () => {
    it('should get all forms of a Pokemon', () => {
      const forms = service.getFormsOf('ursaluna');

      expect(forms.length).toBeGreaterThanOrEqual(2);
      expect(forms.some(f => f.name === 'Ursaluna')).toBe(true);
      expect(forms.some(f => f.name === 'Ursaluna-Bloodmoon')).toBe(true);
    });

    it('should return empty array for invalid base ID', () => {
      const forms = service.getFormsOf('notarealmon');
      expect(forms).toEqual([]);
    });

    it('should handle Pokemon without alternate forms', () => {
      const forms = service.getFormsOf('pikachu');
      expect(forms.length).toBeGreaterThanOrEqual(1);
      expect(forms[0].name).toBe('Pikachu');
    });
  });

  describe('filterByType', () => {
    it('should filter Pokemon by type', () => {
      const fireTypes = service.filterByType('Fire');

      expect(fireTypes.length).toBeGreaterThan(0);
      fireTypes.forEach(pokemon => {
        expect(pokemon.types).toContain('Fire');
      });
    });

    it('should be case-insensitive', () => {
      const results1 = service.filterByType('fire');
      const results2 = service.filterByType('Fire');
      const results3 = service.filterByType('FIRE');

      expect(results1.length).toBe(results2.length);
      expect(results2.length).toBe(results3.length);
    });
  });

  describe('getAllTypes', () => {
    it('should return all Pokemon types', () => {
      const types = service.getAllTypes();

      expect(types.length).toBeGreaterThanOrEqual(18); // 18 types in Pokemon
      expect(types).toContain('Fire');
      expect(types).toContain('Water');
      expect(types).toContain('Grass');
      expect(types).toContain('Electric');
      expect(types).toContain('Fairy');
    });

    it('should return sorted types', () => {
      const types = service.getAllTypes();
      const sorted = [...types].sort();
      expect(types).toEqual(sorted);
    });
  });

  describe('getSpeciesCount', () => {
    it('should return correct species count', () => {
      const count = service.getSpeciesCount();
      const allSpecies = service.getAllSpecies();

      expect(count).toBe(allSpecies.length);
      expect(count).toBeGreaterThan(1000);
    });
  });

  describe('form handling', () => {
    it('should correctly identify forms', () => {
      const landorus = service.getSpeciesById('landorus');
      const landorusTherian = service.getSpeciesById('landorustherian');

      expect(landorus?.isForm).toBe(false);
      expect(landorusTherian?.isForm).toBe(true);
      expect(landorusTherian?.baseFormId).toBe('landorus');
    });

    it('should not treat Pokemon with hyphens in their name as forms', () => {
      const hooh = service.getSpeciesByName('Ho-Oh');
      const nidoranF = service.getSpeciesByName('Nidoran-F');

      expect(hooh?.isForm).toBe(false);
      expect(nidoranF?.isForm).toBe(false);
    });
  });

  describe('singleton pattern', () => {
    it('should return same instance from getPokemonDataService', () => {
      const instance1 = getPokemonDataService();
      const instance2 = getPokemonDataService();

      expect(instance1).toBe(instance2);
    });
  });

  describe('performance', () => {
    it('should load species data quickly on initialization', () => {
      const start = performance.now();
      const newService = new PokemonDataService(9);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(1000); // Should load in under 1 second
      expect(newService.getSpeciesCount()).toBeGreaterThan(0);
    });
  });
});
