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
  actionButton: {
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    flex: 1,
    paddingVertical: Spacing.md,
  },
  actionButtonText: {
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  bottomSpacer: {
    height: Spacing.xxxl,
  },
  cardsContainer: {
    marginTop: Spacing.md,
  },
  container: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'space-evenly',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  scrollContent: {
    paddingTop: Spacing.xl,
  },
  scrollView: {
    flex: 1,
  },
});
