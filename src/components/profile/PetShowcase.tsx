import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Dragon from '../dragon/Dragon';
import { DragonState } from '../../types';
import { getStageForLevel } from '../../data/levels';
import { getBondTier } from '../../systems/bondSystem';
import { colors } from '../../theme/colors';

interface PetShowcaseProps {
  dragon: DragonState;
}

const PetShowcase: React.FC<PetShowcaseProps> = ({ dragon }) => {
  const { t } = useTranslation();
  const stage = getStageForLevel(dragon.level);
  const bondTier = getBondTier(dragon.bond.level);

  return (
    <View style={styles.container}>
      <View style={styles.dragonArea}>
        <Dragon
          mood={dragon.mood as string}
          currentAction={null}
          onActionAnimationEnd={() => {}}
          size={150}
        />
      </View>

      <Text style={styles.name}>{dragon.name}</Text>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{t('profile.level')}</Text>
          <Text style={styles.infoValue}>{dragon.level}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{t('profile.stage')}</Text>
          <Text style={styles.infoValue}>{t(`stages.${stage}`)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{t('profile.bond')}</Text>
          <Text style={styles.infoValue}>{t(`bond.${bondTier}`)}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{t('profile.age')}</Text>
          <Text style={styles.infoValue}>{dragon.age}d</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{t('profile.color')}</Text>
          <Text style={styles.infoValue}>{dragon.appearance.colorVariant}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{t('profile.mood')}</Text>
          <Text style={styles.infoValue}>{t(`moods.${dragon.mood}`)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  dragonArea: {
    marginBottom: 12,
  },
  name: {
    fontFamily: 'MedievalSharp',
    fontSize: 24,
    color: colors.textGold,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontFamily: 'Cinzel',
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: 'MedievalSharp',
    fontSize: 15,
    color: colors.textPrimary,
  },
});

export default PetShowcase;
