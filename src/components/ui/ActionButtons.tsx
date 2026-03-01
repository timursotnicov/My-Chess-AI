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
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderTopWidth: 1,
    borderTopColor: colors.gold + '40',
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  buttonWrapper: {
    marginRight: 4,
  },
});

export default ActionButtons;
