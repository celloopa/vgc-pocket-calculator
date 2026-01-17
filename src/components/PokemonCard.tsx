import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows, Typography, Layout } from '@/theme';

interface PokemonCardProps {
  role: 'attacker' | 'defender';
  pokemonName?: string;
  nature?: string;
  item?: string;
  ability?: string;
  evSpread?: string;
  expanded?: boolean;
  onToggle?: () => void;
}

export default function PokemonCard({
  role,
  pokemonName = role === 'attacker' ? 'Landorus' : 'Urshifu',
  nature = 'Jolly',
  item = 'Choice Scarf',
  ability = 'Intimidate',
  evSpread = '252 Atk / 4 Def / 252 Spe',
  expanded = false,
  onToggle,
}: PokemonCardProps) {
  const [localExpanded, setLocalExpanded] = useState(expanded);
  const isExpanded = onToggle ? expanded : localExpanded;

  const handlePress = () => {
    if (onToggle) {
      onToggle();
    } else {
      setLocalExpanded(!localExpanded);
    }
  };

  const chevron = isExpanded ? '▼' : '▶';
  const roleLabel = role.toUpperCase();

  return (
    <Pressable onPress={handlePress}>
      <View
        style={[
          styles.container,
          { height: isExpanded ? Layout.cardExpanded : Layout.cardCollapsed },
        ]}
      >
        {/* Header - always visible */}
        <View style={styles.header}>
          <Text style={styles.chevron}>{chevron}</Text>
          <View style={styles.headerContent}>
            <Text style={styles.roleLabel}>{roleLabel}</Text>
            <Text style={styles.pokemonName}>{pokemonName}</Text>
          </View>
        </View>

        {/* Expanded content */}
        {isExpanded && (
          <View style={styles.expandedContent}>
            {/* Pokemon sprite placeholder */}
            <View style={styles.spriteContainer}>
              <View style={[styles.spritePlaceholder, { backgroundColor: Colors.info }]}>
                <Text style={styles.spriteText}>{pokemonName[0]}</Text>
              </View>
            </View>

            {/* Pokemon details */}
            <View style={styles.detailsGrid}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Nature:</Text>
                <Text style={styles.detailValue}>{nature}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Item:</Text>
                <Text style={styles.detailValue}>{item}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Ability:</Text>
                <Text style={styles.detailValue}>{ability}</Text>
              </View>
            </View>

            {/* EV Spread */}
            <View style={styles.evSection}>
              <Text style={styles.sectionLabel}>EVs</Text>
              <View style={styles.evPresets}>
                <View style={[styles.preset, styles.presetActive]}>
                  <Text style={styles.presetTextActive}>{evSpread}</Text>
                </View>
              </View>
            </View>

            {/* Stat Boosts */}
            <View style={styles.boostSection}>
              <Text style={styles.sectionLabel}>Stat Boosts</Text>
              <View style={styles.boostRow}>
                <View style={styles.boostChip}>
                  <Text style={styles.boostText}>Atk: +1</Text>
                </View>
                <View style={styles.boostChip}>
                  <Text style={styles.boostText}>Def: 0</Text>
                </View>
                <View style={styles.boostChip}>
                  <Text style={styles.boostText}>Spe: 0</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.card,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    padding: Spacing.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevron: {
    fontSize: Typography.fontSize.md,
    color: Colors.textSecondary,
    marginRight: Spacing.sm,
  },
  headerContent: {
    flex: 1,
  },
  roleLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pokemonName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  expandedContent: {
    marginTop: Spacing.lg,
  },
  spriteContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  spritePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spriteText: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textInverse,
  },
  detailsGrid: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  evSection: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  evPresets: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  preset: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.chipInactive,
  },
  presetActive: {
    backgroundColor: Colors.chipActive,
  },
  presetTextActive: {
    fontSize: Typography.fontSize.xs,
    color: Colors.chipTextActive,
    fontWeight: Typography.fontWeight.medium,
  },
  boostSection: {
    marginBottom: Spacing.sm,
  },
  boostRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  boostChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface,
  },
  boostText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
});
