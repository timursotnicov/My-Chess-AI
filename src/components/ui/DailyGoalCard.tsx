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
        <View style={styles.streakBadge}>
          <Text style={styles.streak}>
            🔥 {streak}
          </Text>
        </View>
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
          <View style={styles.progressShine} />
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
    backgroundColor: 'rgba(16, 16, 30, 0.8)',
    borderWidth: 1,
    borderColor: colors.gold + '25',
    borderRadius: 12,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontFamily: 'MedievalSharp',
    fontSize: 15,
    color: colors.textGold,
  },
  streakBadge: {
    backgroundColor: 'rgba(212, 90, 42, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.emberGlow + '30',
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
    marginBottom: 8,
  },
  progressText: {
    fontFamily: 'Cinzel',
    fontSize: 11,
    color: colors.textSecondary,
    minWidth: 28,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    backgroundColor: colors.gold,
    borderRadius: 3,
  },
  progressShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    gap: 8,
  },
  goalCheck: {
    fontSize: 13,
    color: colors.textDim,
    width: 16,
    textAlign: 'center',
  },
  goalCheckDone: {
    color: colors.gold,
  },
  goalText: {
    fontFamily: 'Cinzel',
    fontSize: 11,
    color: colors.textSecondary,
    flex: 1,
  },
  goalTextDone: {
    color: colors.textDim,
    textDecorationLine: 'line-through',
  },
});

export default DailyGoalCard;
