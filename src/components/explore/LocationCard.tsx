import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LocationDefinition, LocationState } from '../../types';
import { colors } from '../../theme/colors';

interface LocationCardProps {
  definition: LocationDefinition;
  state: LocationState;
  isExpeditionActive: boolean;
  onExplore: () => void;
}

const LocationCard: React.FC<LocationCardProps> = ({
  definition,
  state,
  isExpeditionActive,
  onExplore,
}) => {
  const { t } = useTranslation();
  const isLocked = !state.isUnlocked;

  return (
    <View style={[styles.card, isLocked && styles.cardLocked]}>
      <View style={styles.header}>
        <Text style={[styles.name, isLocked && styles.textLocked]}>
          {isLocked ? '???' : t(definition.nameKey)}
        </Text>
        {!isLocked && (
          <Text style={styles.visits}>
            {t('explore.visits')}: {state.visitCount}
          </Text>
        )}
      </View>

      {!isLocked && (
        <>
          <Text style={styles.description}>{t(definition.descriptionKey)}</Text>

          {/* Progress bar */}
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>{t('explore.explored')}:</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${state.explorationProgress}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.floor(state.explorationProgress)}%
            </Text>
          </View>

          {/* Resources available */}
          <View style={styles.resourceRow}>
            <Text style={styles.resourceLabel}>{t('explore.resources')}:</Text>
            <Text style={styles.resourceList}>
              {definition.resources.join(', ')}
            </Text>
          </View>

          {/* Explore button */}
          <TouchableOpacity
            style={[
              styles.exploreBtn,
              isExpeditionActive && styles.exploreBtnActive,
            ]}
            onPress={onExplore}
            disabled={isExpeditionActive}
          >
            <Text style={styles.exploreBtnText}>
              {isExpeditionActive
                ? t('explore.exploring')
                : t('explore.start_expedition')}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {isLocked && (
        <Text style={styles.lockInfo}>
          {t('explore.unlock_req', {
            level: definition.unlockLevel,
            bond: definition.unlockBond,
          })}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 10,
    padding: 14,
  },
  cardLocked: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontFamily: 'MedievalSharp',
    fontSize: 17,
    color: colors.textPrimary,
  },
  textLocked: {
    color: colors.textDim,
  },
  visits: {
    fontFamily: 'Cinzel',
    fontSize: 11,
    color: colors.textSecondary,
  },
  description: {
    fontFamily: 'Cinzel',
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  progressLabel: {
    fontFamily: 'Cinzel',
    fontSize: 11,
    color: colors.textSecondary,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.charcoal,
    borderRadius: 3,
  },
  progressFill: {
    height: 6,
    backgroundColor: colors.arcane,
    borderRadius: 3,
  },
  progressText: {
    fontFamily: 'Cinzel',
    fontSize: 11,
    color: colors.gold,
    width: 32,
    textAlign: 'right',
  },
  resourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  resourceLabel: {
    fontFamily: 'Cinzel',
    fontSize: 11,
    color: colors.textSecondary,
  },
  resourceList: {
    fontFamily: 'Cinzel',
    fontSize: 11,
    color: colors.moonlight,
  },
  exploreBtn: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gold + '40',
  },
  exploreBtnActive: {
    backgroundColor: colors.charcoal,
    borderColor: colors.arcane + '40',
  },
  exploreBtnText: {
    fontFamily: 'MedievalSharp',
    fontSize: 15,
    color: colors.textGold,
  },
  lockInfo: {
    fontFamily: 'Cinzel',
    fontSize: 12,
    color: colors.textDim,
    marginTop: 6,
    textAlign: 'center',
  },
});

export default LocationCard;
