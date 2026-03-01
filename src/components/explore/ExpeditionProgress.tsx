import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Expedition } from '../../types';
import { getExpeditionProgress, isExpeditionComplete } from '../../systems/explorationSystem';
import { colors } from '../../theme/colors';

interface ExpeditionProgressProps {
  expedition: Expedition;
  onComplete: () => void;
}

const ExpeditionProgress: React.FC<ExpeditionProgressProps> = ({ expedition, onComplete }) => {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(getExpeditionProgress(expedition));

  useEffect(() => {
    const interval = setInterval(() => {
      const p = getExpeditionProgress(expedition);
      setProgress(p);
    }, 1000);
    return () => clearInterval(interval);
  }, [expedition]);

  const complete = isExpeditionComplete(expedition);
  const remaining = Math.max(0, expedition.duration - (Date.now() - expedition.startTime));
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.status}>
          {complete ? t('explore.expedition_complete') : t(`explore.status_${expedition.status}`)}
        </Text>
        {!complete && (
          <Text style={styles.timer}>
            {minutes}:{String(seconds).padStart(2, '0')}
          </Text>
        )}
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      {complete && (
        <TouchableOpacity style={styles.collectBtn} onPress={onComplete}>
          <Text style={styles.collectBtnText}>{t('explore.collect_rewards')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.arcane + '40',
    borderRadius: 10,
    padding: 12,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  status: {
    fontFamily: 'MedievalSharp',
    fontSize: 14,
    color: colors.arcaneGlow,
  },
  timer: {
    fontFamily: 'Cinzel',
    fontSize: 14,
    color: colors.textPrimary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.charcoal,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    backgroundColor: colors.arcane,
    borderRadius: 4,
  },
  collectBtn: {
    marginTop: 10,
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gold + '60',
  },
  collectBtnText: {
    fontFamily: 'MedievalSharp',
    fontSize: 15,
    color: colors.textGold,
  },
});

export default ExpeditionProgress;
