import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PersonalityState, PersonalityAxis } from '../../types';
import { getAxisInfo } from '../../data/personalities';
import { colors } from '../../theme/colors';

interface TraitsListProps {
  personality: PersonalityState;
}

const AXES: PersonalityAxis[] = [
  'brave_cautious',
  'loyal_independent',
  'playful_proud',
  'curious_shadowy',
];

const TraitsList: React.FC<TraitsListProps> = ({ personality }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('profile.personality')}</Text>
      <View style={styles.dominantRow}>
        <Text style={styles.dominantLabel}>{t('profile.dominant_trait')}:</Text>
        <Text style={styles.dominantValue}>
          {t(`personality.${personality.dominantTrait}`)}
        </Text>
      </View>

      {AXES.map((axis) => {
        const value = personality.traits[axis];
        const { positive, negative } = getAxisInfo(axis);
        const normalized = (value + 100) / 200; // 0..1

        return (
          <View key={axis} style={styles.axisRow}>
            <Text style={styles.traitLabel}>
              {negative.icon} {t(negative.nameKey)}
            </Text>
            <View style={styles.axisBar}>
              <View style={styles.axisBarBg}>
                <View
                  style={[
                    styles.axisMarker,
                    { left: `${normalized * 100}%` },
                  ]}
                />
                <View style={styles.axisCenter} />
              </View>
            </View>
            <Text style={styles.traitLabel}>
              {t(positive.nameKey)} {positive.icon}
            </Text>
          </View>
        );
      })}

      {personality.quirks.length > 0 && (
        <View style={styles.quirksRow}>
          <Text style={styles.quirksLabel}>{t('profile.quirks')}:</Text>
          <Text style={styles.quirksValue}>
            {personality.quirks.map((q) => t(`quirks.${q}`)).join(', ')}
          </Text>
        </View>
      )}
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
    marginTop: 12,
  },
  title: {
    fontFamily: 'MedievalSharp',
    fontSize: 18,
    color: colors.textGold,
    marginBottom: 10,
  },
  dominantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  dominantLabel: {
    fontFamily: 'Cinzel',
    fontSize: 12,
    color: colors.textSecondary,
  },
  dominantValue: {
    fontFamily: 'MedievalSharp',
    fontSize: 16,
    color: colors.arcaneGlow,
  },
  axisRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  traitLabel: {
    fontFamily: 'Cinzel',
    fontSize: 10,
    color: colors.textSecondary,
    width: 70,
    textAlign: 'center',
  },
  axisBar: {
    flex: 1,
    height: 20,
    justifyContent: 'center',
  },
  axisBarBg: {
    height: 4,
    backgroundColor: colors.charcoal,
    borderRadius: 2,
    position: 'relative',
  },
  axisCenter: {
    position: 'absolute',
    left: '50%',
    top: -3,
    width: 1,
    height: 10,
    backgroundColor: colors.textDim,
  },
  axisMarker: {
    position: 'absolute',
    top: -5,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.arcane,
    borderWidth: 2,
    borderColor: colors.arcaneGlow,
    marginLeft: -7,
  },
  quirksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  quirksLabel: {
    fontFamily: 'Cinzel',
    fontSize: 11,
    color: colors.textSecondary,
  },
  quirksValue: {
    fontFamily: 'Cinzel',
    fontSize: 11,
    color: colors.moonlight,
    flex: 1,
  },
});

export default TraitsList;
