import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MotiView } from 'moti';
import { Colors, BorderRadius, Spacing, Typography } from '@/theme';
import {
  WEATHER_OPTIONS,
  TERRAIN_OPTIONS,
  FIELD_WIDE_CONDITIONS,
  SIDE_CONDITIONS,
  SPIKES_OPTIONS,
} from '@/constants/field-conditions';

interface ChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function Chip({ label, active, onPress }: ChipProps) {
  return (
    <Pressable onPress={onPress}>
      <MotiView
        style={[styles.chip, { backgroundColor: active ? Colors.chipActive : Colors.chipInactive }]}
        animate={{
          scale: active ? 1 : 1,
        }}
        transition={{
          type: 'timing',
          duration: 150,
        }}
      >
        <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
      </MotiView>
    </Pressable>
  );
}

interface SectionHeaderProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
}

function SectionHeader({ title, expanded, onToggle }: SectionHeaderProps) {
  return (
    <Pressable onPress={onToggle} style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.chevron}>{expanded ? '▼' : '▶'}</Text>
    </Pressable>
  );
}

export default function FieldConditionsBar() {
  // Weather & Terrain (mutually exclusive within category)
  const [weather, setWeather] = useState<string | null>(null);
  const [terrain, setTerrain] = useState<string | null>(null);

  // Side conditions (toggles)
  const [sideConditions, setSideConditions] = useState<Record<string, boolean>>({});

  // Field-wide conditions (toggles)
  const [fieldConditions, setFieldConditions] = useState<Record<string, boolean>>({});

  // Spikes layers (0-3)
  const [spikesLayers, setSpikesLayers] = useState(0);

  // Expanded sections
  const [expandedSections, setExpandedSections] = useState({
    weatherTerrain: true,
    screens: true,
    fieldWide: false,
    hazards: false,
  });

  // Filter out "None" option for display
  const weatherOptions = WEATHER_OPTIONS.filter(opt => opt.id !== null);
  const terrainOptions = TERRAIN_OPTIONS.filter(opt => opt.id !== null);

  // Split side conditions into categories
  const screens = SIDE_CONDITIONS.filter(c =>
    ['isReflect', 'isLightScreen', 'isAuroraVeil'].includes(String(c.id))
  );
  const speedSupport = SIDE_CONDITIONS.filter(c =>
    ['isTailwind', 'isHelpingHand'].includes(String(c.id))
  );
  const allySupport = SIDE_CONDITIONS.filter(c =>
    ['isFriendGuard', 'isFlowerGift', 'isBattery', 'isPowerSpot'].includes(String(c.id))
  );
  const hazards = SIDE_CONDITIONS.filter(c => ['isSR', 'steelsurge'].includes(String(c.id)));

  const handleWeatherToggle = (id: string | null) => {
    setWeather(weather === id ? null : id);
  };

  const handleTerrainToggle = (id: string | null) => {
    setTerrain(terrain === id ? null : id);
  };

  const toggleSideCondition = (id: string) => {
    setSideConditions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleFieldCondition = (id: string) => {
    setFieldConditions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <View style={styles.container}>
      {/* Weather & Terrain - Always visible */}
      <SectionHeader
        title="Weather & Terrain"
        expanded={expandedSections.weatherTerrain}
        onToggle={() => toggleSection('weatherTerrain')}
      />
      {expandedSections.weatherTerrain && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Weather chips */}
          {weatherOptions.map(option => (
            <Chip
              key={option.id ?? 'none-weather'}
              label={`${option.emoji} ${option.label}`}
              active={weather === option.id}
              onPress={() => handleWeatherToggle(option.id)}
            />
          ))}

          <View style={styles.separator} />

          {/* Terrain chips */}
          {terrainOptions.map(option => (
            <Chip
              key={option.id ?? 'none-terrain'}
              label={`${option.emoji} ${option.label}`}
              active={terrain === option.id}
              onPress={() => handleTerrainToggle(option.id)}
            />
          ))}
        </ScrollView>
      )}

      {/* Screens & Support */}
      <SectionHeader
        title="Screens & Support"
        expanded={expandedSections.screens}
        onToggle={() => toggleSection('screens')}
      />
      {expandedSections.screens && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Screens */}
          {screens.map(condition => (
            <Chip
              key={condition.id}
              label={`${condition.emoji} ${condition.label}`}
              active={!!sideConditions[String(condition.id)]}
              onPress={() => toggleSideCondition(String(condition.id))}
            />
          ))}

          <View style={styles.separator} />

          {/* Speed & Support */}
          {speedSupport.map(condition => (
            <Chip
              key={condition.id}
              label={`${condition.emoji} ${condition.label}`}
              active={!!sideConditions[String(condition.id)]}
              onPress={() => toggleSideCondition(String(condition.id))}
            />
          ))}

          <View style={styles.separator} />

          {/* Ally Support */}
          {allySupport.map(condition => (
            <Chip
              key={condition.id}
              label={`${condition.emoji} ${condition.label}`}
              active={!!sideConditions[String(condition.id)]}
              onPress={() => toggleSideCondition(String(condition.id))}
            />
          ))}
        </ScrollView>
      )}

      {/* Field-Wide Effects (Ruin, Auras, Rooms) */}
      <SectionHeader
        title="Field Effects"
        expanded={expandedSections.fieldWide}
        onToggle={() => toggleSection('fieldWide')}
      />
      {expandedSections.fieldWide && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {FIELD_WIDE_CONDITIONS.map(condition => (
            <Chip
              key={condition.id}
              label={`${condition.emoji} ${condition.label}`}
              active={!!fieldConditions[String(condition.id)]}
              onPress={() => toggleFieldCondition(String(condition.id))}
            />
          ))}
        </ScrollView>
      )}

      {/* Hazards (Stealth Rock, Spikes, Steelsurge) */}
      <SectionHeader
        title="Hazards"
        expanded={expandedSections.hazards}
        onToggle={() => toggleSection('hazards')}
      />
      {expandedSections.hazards && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Entry Hazards */}
          {hazards.map(condition => (
            <Chip
              key={condition.id}
              label={`${condition.emoji} ${condition.label}`}
              active={!!sideConditions[String(condition.id)]}
              onPress={() => toggleSideCondition(String(condition.id))}
            />
          ))}

          <View style={styles.separator} />

          {/* Spikes (0-3 layers) */}
          {SPIKES_OPTIONS.map(option => (
            <Chip
              key={option.layers}
              label={`Spikes ${option.label}`}
              active={spikesLayers === option.layers}
              onPress={() => setSpikesLayers(option.layers)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chevron: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.xs,
  },
  chip: {
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  chipText: {
    color: Colors.chipText,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  chipTextActive: {
    color: Colors.chipTextActive,
  },
  container: {
    backgroundColor: Colors.background,
    paddingVertical: Spacing.md,
  },
  scrollContent: {
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  sectionHeader: {
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  separator: {
    backgroundColor: Colors.border,
    height: 32,
    marginHorizontal: Spacing.xs,
    width: 1,
  },
});
