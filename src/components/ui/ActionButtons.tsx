import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import MedievalButton from './MedievalButton';
import { usePetStore } from '../../store/petStore';
import { getAvailableActions } from '../../systems/actionSystem';
import { ActionId, ActionDefinition } from '../../types';
import { formatCooldown } from '../../utils/time';
import { colors } from '../../theme/colors';

interface ActionButtonsProps {
  onActionPerformed?: (actionId: ActionId) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onActionPerformed }) => {
  const { t } = useTranslation();
  const dragon = usePetStore((s) => s.dragon);
  const performDragonAction = usePetStore((s) => s.performDragonAction);
  const canDoAction = usePetStore((s) => s.canDoAction);
  const getActionCooldown = usePetStore((s) => s.getActionCooldown);
  const [, setTick] = useState(0);

  // Force re-render every second for cooldown timers
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!dragon) return null;

  const available = getAvailableActions(dragon.level, dragon.stage);

  const handlePress = (actionId: ActionId) => {
    const success = performDragonAction(actionId);
    if (success) {
      onActionPerformed?.(actionId);
    }
  };

  return (
    <View style={styles.container}>
      {/* Decorative top line */}
      <View style={styles.topLine}>
        <View style={styles.lineLeft} />
        <View style={styles.lineDiamond} />
        <View style={styles.lineRight} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {available.map((action: ActionDefinition) => {
          const check = canDoAction(action.id);
          const cooldownMs = getActionCooldown(action.id);
          const onCooldown = cooldownMs > 0;
          const subtitle = onCooldown ? formatCooldown(cooldownMs) : undefined;

          return (
            <View key={action.id} style={styles.buttonWrapper}>
              <MedievalButton
                title={t(`actions.${action.id}`)}
                icon={action.icon}
                onPress={() => handlePress(action.id)}
                disabled={!check.success}
                size="small"
                subtitle={subtitle}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(10, 10, 20, 0.6)',
    paddingVertical: 10,
    paddingTop: 0,
  },
  topLine: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  lineLeft: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gold + '30',
  },
  lineDiamond: {
    width: 8,
    height: 8,
    backgroundColor: colors.gold + '50',
    transform: [{ rotate: '45deg' }],
    marginHorizontal: 8,
  },
  lineRight: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gold + '30',
  },
  scrollContent: {
    paddingHorizontal: 14,
    gap: 10,
  },
  buttonWrapper: {
    marginRight: 2,
  },
});

export default ActionButtons;
