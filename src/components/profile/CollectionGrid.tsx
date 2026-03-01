import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CollectionState } from '../../types';
import { COLLECTIONS } from '../../data/collections';
import { colors } from '../../theme/colors';

interface CollectionGridProps {
  collections: CollectionState[];
}

const CollectionGrid: React.FC<CollectionGridProps> = ({ collections }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.grid}>
      {COLLECTIONS.map((colDef) => {
        const colState = collections.find((c) => c.id === colDef.id);
        const found = colState?.foundItems.length ?? 0;
        const total = colDef.itemIds.length;
        const isCompleted = colState?.isCompleted ?? false;

        return (
          <View
            key={colDef.id}
            style={[styles.card, isCompleted && styles.cardCompleted]}
          >
            <Text style={styles.cardTitle}>{t(colDef.nameKey)}</Text>
            <Text style={styles.cardProgress}>
              {found}/{total}
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(found / total) * 100}%` },
                  isCompleted && styles.progressCompleted,
                ]}
              />
            </View>
            {isCompleted && (
              <Text style={styles.completedText}>{t('collections.completed')}</Text>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    gap: 10,
  },
  card: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 10,
    padding: 12,
  },
  cardCompleted: {
    borderColor: colors.gold + '60',
  },
  cardTitle: {
    fontFamily: 'MedievalSharp',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardProgress: {
    fontFamily: 'Cinzel',
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.charcoal,
    borderRadius: 2,
  },
  progressFill: {
    height: 4,
    backgroundColor: colors.arcane,
    borderRadius: 2,
  },
  progressCompleted: {
    backgroundColor: colors.gold,
  },
  completedText: {
    fontFamily: 'Cinzel',
    fontSize: 10,
    color: colors.gold,
    marginTop: 4,
    textAlign: 'right',
  },
});

export default CollectionGrid;
