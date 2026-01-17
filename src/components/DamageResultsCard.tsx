import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows, Typography } from '@/theme';

interface Move {
  name: string;
  type: string;
  minDamage: number;
  maxDamage: number;
  damagePercent: number;
  koChance: string;
}

interface DamageResultsCardProps {
  attacker?: string;
  defender?: string;
  moves?: Move[];
}

// Mock data for prototype
const MOCK_MOVES: Move[] = [
  {
    name: 'Earthquake',
    type: 'ground',
    minDamage: 156,
    maxDamage: 186,
    damagePercent: 85,
    koChance: 'OHKO',
  },
  {
    name: 'Earth Power',
    type: 'ground',
    minDamage: 142,
    maxDamage: 168,
    damagePercent: 77,
    koChance: '2HKO',
  },
  {
    name: 'Rock Slide',
    type: 'rock',
    minDamage: 89,
    maxDamage: 106,
    damagePercent: 48,
    koChance: '3HKO',
  },
  {
    name: 'U-turn',
    type: 'bug',
    minDamage: 24,
    maxDamage: 29,
    damagePercent: 13,
    koChance: '7HKO',
  },
];

export default function DamageResultsCard({
  attacker = 'Landorus',
  defender = 'Urshifu',
  moves = MOCK_MOVES,
}: DamageResultsCardProps) {
  const getDamageColor = (koChance: string) => {
    if (koChance === 'OHKO') return Colors.damageOHKO;
    if (koChance === '2HKO') return Colors.damage2HKO;
    if (koChance === '3HKO') return Colors.damage3HKO;
    return Colors.damage4HKO;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {attacker} → {defender}
        </Text>
      </View>

      <View style={styles.divider} />

      {moves.map((move, index) => (
        <View key={index} style={styles.moveRow}>
          <View style={styles.moveInfo}>
            <Text style={styles.moveName}>{move.name}</Text>
          </View>
          <View style={styles.damageInfo}>
            <Text style={styles.damageText}>
              {move.minDamage}-{move.maxDamage} HP
            </Text>
            <View style={[styles.koBadge, { backgroundColor: getDamageColor(move.koChance) }]}>
              <Text style={styles.koText}>{move.koChance}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.card,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  damageInfo: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  damageText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
    marginRight: Spacing.sm,
  },
  divider: {
    backgroundColor: Colors.border,
    height: 1,
    marginBottom: Spacing.md,
  },
  header: {
    marginBottom: Spacing.sm,
  },
  headerText: {
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
  },
  koBadge: {
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  koText: {
    color: Colors.textInverse,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  moveInfo: {
    flex: 1,
  },
  moveName: {
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.medium,
  },
  moveRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
});
