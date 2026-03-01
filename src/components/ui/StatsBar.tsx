import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';

interface StatsBarProps {
  label: string;
  value: number;
  maxValue?: number;
  color: string;
  icon?: string;
}

const STAT_COLORS: Record<string, string> = {
  hunger: colors.hungerGreen,
  thirst: colors.thirstBlue,
  happiness: colors.happinessAmberBright,
  energy: colors.energyOrangeBright,
  health: colors.healthRedBright,
};

const StatsBar: React.FC<StatsBarProps> = ({
  label,
  value,
  maxValue = 100,
  color,
  icon,
}) => {
  const percentage = Math.max(0, Math.min(100, (value / maxValue) * 100));
  const isCritical = percentage <= 20;

  const fillStyle = useAnimatedStyle(() => ({
    width: withTiming(`${percentage}%` as any, { duration: 300 }),
    backgroundColor: isCritical ? colors.healthRed : color,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{Math.round(value)}</Text>
      </View>
      <View style={styles.barBg}>
        <Animated.View style={[styles.barFill, fillStyle]} />
      </View>
    </View>
  );
};

interface StatsBarGroupProps {
  stats: {
    hunger: number;
    thirst: number;
    happiness: number;
    energy: number;
    health: number;
  };
  labels: {
    hunger: string;
    thirst: string;
    happiness: string;
    energy: string;
    health: string;
  };
}

export const StatsBarGroup: React.FC<StatsBarGroupProps> = ({
  stats,
  labels,
}) => {
  const statEntries: { key: string; icon: string }[] = [
    { key: 'health', icon: '❤️' },
    { key: 'hunger', icon: '🍖' },
    { key: 'thirst', icon: '💧' },
    { key: 'happiness', icon: '😊' },
    { key: 'energy', icon: '⚡' },
  ];

  return (
    <View style={styles.group}>
      {statEntries.map(({ key, icon }) => (
        <StatsBar
          key={key}
          label={labels[key as keyof typeof labels]}
          value={stats[key as keyof typeof stats]}
          color={STAT_COLORS[key] ?? colors.gold}
          icon={icon}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  icon: {
    fontSize: 12,
    marginRight: 4,
  },
  label: {
    fontFamily: 'Cinzel',
    fontSize: 11,
    color: colors.textPrimary,
    flex: 1,
  },
  value: {
    fontFamily: 'Cinzel',
    fontSize: 11,
    color: colors.textGold,
    minWidth: 25,
    textAlign: 'right',
  },
  barBg: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.charcoal,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  group: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gold + '40',
  },
});

export default StatsBar;
