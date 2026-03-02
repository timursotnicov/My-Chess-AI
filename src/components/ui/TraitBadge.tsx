import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PersonalityTrait } from '../../types';
import { getPersonalityInfo } from '../../data/personalities';
import { colors } from '../../theme/colors';

interface TraitBadgeProps {
  trait: PersonalityTrait;
}

const TraitBadge: React.FC<TraitBadgeProps> = ({ trait }) => {
  const { t } = useTranslation();
  const info = getPersonalityInfo(trait);

  return (
    <View style={styles.badge}>
      <Text style={styles.icon}>{info?.icon || '❓'}</Text>
      <Text style={styles.text}>{t(`personality.${trait}`)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 45, 112, 0.5)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.arcaneGlow + '30',
  },
  icon: {
    fontSize: 11,
  },
  text: {
    fontFamily: 'Cinzel',
    fontSize: 10,
    color: colors.arcaneGlow,
  },
});

export default TraitBadge;
