import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Colors, BorderRadius, Spacing, Typography } from '@/theme';

interface ChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function Chip({ label, active, onPress }: ChipProps) {
  return (
    <Pressable onPress={onPress}>
      <View
        style={[
          styles.chip,
          { backgroundColor: active ? Colors.chipActive : Colors.chipInactive },
        ]}
      >
        <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
      </View>
    </Pressable>
  );
}

export default function FieldConditionsBar() {
  const [weather, setWeather] = useState<string | null>(null);
  const [terrain, setTerrain] = useState<string | null>(null);
  const [reflect, setReflect] = useState(false);
  const [lightScreen, setLightScreen] = useState(false);
  const [helpingHand, setHelpingHand] = useState(false);

  const weatherOptions = [
    { id: 'sun', label: '☀️ Sun' },
    { id: 'rain', label: '🌧️ Rain' },
    { id: 'sand', label: '🌪️ Sand' },
    { id: 'snow', label: '❄️ Snow' },
  ];

  const terrainOptions = [
    { id: 'electric', label: '⚡ Electric' },
    { id: 'grassy', label: '🌱 Grassy' },
    { id: 'psychic', label: '🧠 Psychic' },
    { id: 'misty', label: '🌫️ Misty' },
  ];

  const handleWeatherToggle = (id: string) => {
    setWeather(weather === id ? null : id);
  };

  const handleTerrainToggle = (id: string) => {
    setTerrain(terrain === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Weather chips */}
        {weatherOptions.map(option => (
          <Chip
            key={option.id}
            label={option.label}
            active={weather === option.id}
            onPress={() => handleWeatherToggle(option.id)}
          />
        ))}

        <View style={styles.separator} />

        {/* Terrain chips */}
        {terrainOptions.map(option => (
          <Chip
            key={option.id}
            label={option.label}
            active={terrain === option.id}
            onPress={() => handleTerrainToggle(option.id)}
          />
        ))}

        <View style={styles.separator} />

        {/* Screen chips */}
        <Chip label="🛡️ Reflect" active={reflect} onPress={() => setReflect(!reflect)} />
        <Chip
          label="💡 Light Screen"
          active={lightScreen}
          onPress={() => setLightScreen(!lightScreen)}
        />

        <View style={styles.separator} />

        {/* Modifier chips */}
        <Chip
          label="🤝 Helping Hand"
          active={helpingHand}
          onPress={() => setHelpingHand(!helpingHand)}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.pill,
  },
  chipText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.chipText,
  },
  chipTextActive: {
    color: Colors.chipTextActive,
  },
  separator: {
    width: 1,
    height: 32,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.xs,
  },
});
