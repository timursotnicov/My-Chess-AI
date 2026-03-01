import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { DailyGoal } from '../../types';
import { colors } from '../../theme/colors';

interface DailyGoalCardProps {
  goals: DailyGoal[];
  streak: number;
}

const DailyGoalCard: React.FC<DailyGoalCardProps> = ({ goals, streak }) => {
  const { t } = useTranslation();
  const completed = goals.filter((g) => g.isCompleted).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('daily.goals')}</Text>
        <Text style={styles.streak}>
          🔥 {streak} {t('daily.streak')}
        </Text>
      </View>

      <View style={styles.progressSummary}>
        <Text style={styles.progressText}>
          {completed}/{goals.length}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${goals.length > 0 ? (completed / goals.length) * 100 : 0}%` },
            ]}
          />
        </View>
      </View>

      {goals.map((goal) => (
        <View key={goal.id} style={styles.goalRow}>
          <Text style={[styles.goalCheck, goal.isCompleted && styles.goalCheckDone]}>
            {goal.isCompleted ? '✓' : '○'}
          </Text>
          <Text
            style={[styles.goalText, goal.isCompleted && styles.goalTextDone]}
          >
            {t(goal.descriptionKey)} ({goal.progress}/{goal.target})
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 10,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontFamily: 'MedievalSharp',
    fontSize: 14,
    color: colors.textGold,
  },
  streak: {
    fontFamily: 'Cinzel',
    fontSize: 11,
    color: colors.emberGlow,
  },
  progressSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  progressText: {
    fontFamily: 'Cinzel',
    fontSize: 11,
    color: colors.textSecondary,
  },
  progressBar: {
    flex: 1,
    height: 3,
    backgroundColor: colors.charcoal,
    borderRadius: 2,
  },
  progressFill: {
    height: 3,
    backgroundColor: colors.gold,
    borderRadius: 2,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    gap: 6,
  },
  goalCheck: {
    fontSize: 12,
    color: colors.textDim,
  },
  goalCheckDone: {
    color: colors.gold,
  },
  goalText: {
    fontFamily: 'Cinzel',
    fontSize: 10,
    color: colors.textSecondary,
    flex: 1,
  },
  goalTextDone: {
    color: colors.textDim,
    textDecorationLine: 'line-through',
  },
});

export default DailyGoalCard;
