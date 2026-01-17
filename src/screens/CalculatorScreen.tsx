import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors, Spacing, BorderRadius, Typography } from '@/theme';
import DamageResultsCard from '@/components/DamageResultsCard';
import FieldConditionsBar from '@/components/FieldConditionsBar';
import PokemonCard from '@/components/PokemonCard';

export default function CalculatorScreen() {
  const [expandedCard, setExpandedCard] = useState<'attacker' | 'defender' | null>('attacker');

  const handleCardToggle = (card: 'attacker' | 'defender') => {
    setExpandedCard(expandedCard === card ? null : card);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Damage Results - sticky at top */}
        <DamageResultsCard />

        {/* Field Conditions Bar */}
        <FieldConditionsBar />

        {/* Pokemon Cards */}
        <View style={styles.cardsContainer}>
          <PokemonCard
            role="attacker"
            expanded={expandedCard === 'attacker'}
            onToggle={() => handleCardToggle('attacker')}
          />

          <PokemonCard
            role="defender"
            expanded={expandedCard === 'defender'}
            onToggle={() => handleCardToggle('defender')}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Pressable style={styles.actionButton}>
            <Text style={styles.actionButtonText}>⇅ Swap</Text>
          </Pressable>

          <Pressable style={styles.actionButton}>
            <Text style={styles.actionButtonText}>🔄 Reset</Text>
          </Pressable>

          <Pressable style={styles.actionButton}>
            <Text style={styles.actionButtonText}>📋 Import</Text>
          </Pressable>
        </View>

        {/* Spacer for bottom */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.xl,
  },
  cardsContainer: {
    marginTop: Spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  bottomSpacer: {
    height: Spacing.xxxl,
  },
});
