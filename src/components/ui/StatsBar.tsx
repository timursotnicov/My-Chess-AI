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
  glowColor?: string;
  icon?: string;
}

const STAT_COLORS: Record<string, { fill: string; glow: string }> = {
  hunger: { fill: colors.hungerGreenBright, glow: '#7CDB7C' },
  thirst: { fill: colors.thirstBlueBright, glow: '#8CE0FF' },
  happiness: { fill: colors.happinessAmberBright, glow: '#FFD070' },
  energy: { fill: colors.energyOrangeBright, glow: '#FFA850' },
  health: { fill: colors.healthRedBright, glow: '#FF6060' },
};

const StatsBar: React.FC<StatsBarProps> = ({
  label,
  value,
  maxValue = 100,
  color,
  glowColor,
  icon,
}) => {
  const percentage = Math.max(0, Math.min(100, (value / maxValue) * 100));
  const isCritical = percentage <= 20;
  const isLow = percentage <= 40;

  const fillStyle = useAnimatedStyle(() => ({
    width: withTiming(`${percentage}%` as any, { duration: 400 }),
  }));

  const barColor = isCritical ? colors.healthRedBright : color;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <Text style={[styles.label, isCritical && styles.labelCritical]}>{label}</Text>
        <Text style={[styles.value, isCritical && styles.valueCritical]}>
          {Math.round(value)}
        </Text>
      </View>
      <View style={[styles.barBg, isCritical && styles.barBgCritical]}>
        <Animated.View
          style={[
            styles.barFill,
            { backgroundColor: barColor },
            fillStyle,
          ]}
        >
          <View style={[styles.barShine, { backgroundColor: (glowColor ?? barColor) + '40' }]} />
        </Animated.View>
        {isCritical && <View style={styles.criticalPulse} />}
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
      {/* Decorative corner accents */}
      <View style={[styles.cornerAccent, styles.cornerTL]} />
      <View style={[styles.cornerAccent, styles.cornerTR]} />
      <View style={[styles.cornerAccent, styles.cornerBL]} />
      <View style={[styles.cornerAccent, styles.cornerBR]} />

      {statEntries.map(({ key, icon }) => {
        const statColor = STAT_COLORS[key] ?? { fill: colors.gold, glow: colors.gold };
        return (
          <StatsBar
            key={key}
            label={labels[key as keyof typeof labels]}
            value={stats[key as keyof typeof stats]}
            color={statColor.fill}
            glowColor={statColor.glow}
            icon={icon}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 3,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  icon: {
    fontSize: 14,
    marginRight: 6,
  },
  label: {
    fontFamily: 'Cinzel',
    fontSize: 12,
    color: colors.textPrimary,
    flex: 1,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  labelCritical: {
    color: colors.healthRedBright,
  },
  value: {
    fontFamily: 'Cinzel',
    fontSize: 12,
    color: colors.textGold,
    minWidth: 30,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  valueCritical: {
    color: colors.healthRedBright,
  },
  barBg: {
    height: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: colors.gold + '30',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  barBgCritical: {
    borderColor: colors.healthRedBright + '60',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderRadius: 6,
  },
  criticalPulse: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.healthRedBright + '15',
    borderRadius: 7,
  },
  group: {
    padding: 12,
    backgroundColor: 'rgba(10, 10, 20, 0.65)',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.gold + '35',
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cornerAccent: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderColor: colors.gold + '60',
  },
  cornerTL: {
    top: -1,
    left: -1,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 12,
  },
  cornerTR: {
    top: -1,
    right: -1,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 12,
  },
  cornerBL: {
    bottom: -1,
    left: -1,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: 12,
  },
  cornerBR: {
    bottom: -1,
    right: -1,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 12,
  },
});

export default StatsBar;
