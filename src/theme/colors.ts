/**
 * Pokemon Type Colors (Official)
 * Reference: https://bulbapedia.bulbagarden.net/wiki/Category:Type_color_templates
 */
export const PokemonTypeColors = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
} as const;

export type PokemonType = keyof typeof PokemonTypeColors;

/**
 * Light Theme Colors
 */
export const LightTheme = {
  // Background colors
  background: '#FFF8E7', // Soft cream
  cardBackground: '#FFFFFF',
  surface: '#F5F5F5',

  // Text colors
  textPrimary: '#2D3748', // Dark slate
  textSecondary: '#718096', // Medium gray
  textTertiary: '#A0AEC0',
  textInverse: '#FFFFFF',

  // UI accent colors
  active: '#EF4444', // Pokeball red
  success: '#10B981', // Grass green
  warning: '#FBBF24', // Electric yellow
  info: '#3B82F6', // Water blue
  error: '#DC2626',

  // Damage indicators (using type colors)
  damageOHKO: PokemonTypeColors.fire, // Fire red
  damage2HKO: PokemonTypeColors.electric, // Electric yellow
  damage3HKO: PokemonTypeColors.grass, // Grass green
  damage4HKO: PokemonTypeColors.water, // Water blue

  // Borders and shadows
  border: '#E2E8F0',
  borderActive: '#CBD5E0',
  shadow: 'rgba(0, 0, 0, 0.1)',

  // Chip states
  chipInactive: '#E5E7EB',
  chipActive: '#3B82F6',
  chipText: '#374151',
  chipTextActive: '#FFFFFF',
} as const;

/**
 * Dark Theme Colors (Future)
 */
export const DarkTheme = {
  background: '#1A1D2E', // Deep navy
  cardBackground: '#252836',
  surface: '#1F2937',

  textPrimary: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  textInverse: '#1F2937',

  active: '#F87171',
  success: '#34D399',
  warning: '#FCD34D',
  info: '#60A5FA',
  error: '#EF4444',

  damageOHKO: PokemonTypeColors.fire,
  damage2HKO: PokemonTypeColors.electric,
  damage3HKO: PokemonTypeColors.grass,
  damage4HKO: PokemonTypeColors.water,

  border: '#374151',
  borderActive: '#4B5563',
  shadow: 'rgba(0, 0, 0, 0.4)',

  chipInactive: '#374151',
  chipActive: '#3B82F6',
  chipText: '#D1D5DB',
  chipTextActive: '#FFFFFF',
} as const;

/**
 * Current theme (default to light)
 */
export const Colors = LightTheme;

export type Theme = typeof LightTheme;
