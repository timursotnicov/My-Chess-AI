import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import PetShowcase from '../components/profile/PetShowcase';
import TraitsList from '../components/profile/TraitsList';
import CollectionGrid from '../components/profile/CollectionGrid';
import { usePetStore } from '../store/petStore';
import { useProfileStore } from '../store/profileStore';
import { useInventoryStore } from '../store/inventoryStore';
import { colors } from '../theme/colors';

const ProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const dragon = usePetStore((s) => s.dragon);
  const profile = useProfileStore((s) => s.profile);
  const collections = useInventoryStore((s) => s.collections);

  if (!dragon) return null;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.title}>{t('profile.title')}</Text>

          {/* Pet showcase */}
          <PetShowcase dragon={dragon} />

          {/* Personality traits */}
          <TraitsList personality={dragon.personality} />

          {/* Stats */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>{t('profile.statistics')}</Text>
            <View style={styles.statsGrid}>
              <StatItem label={t('profile.actions_performed')} value={profile.actionsPerformed} />
              <StatItem label={t('profile.expeditions')} value={profile.expeditionsCompleted} />
              <StatItem label={t('profile.items_collected')} value={profile.itemsCollected} />
              <StatItem label={t('profile.minigames')} value={profile.miniGamesPlayed} />
              <StatItem label={t('profile.highest_bond')} value={profile.highestBond} />
              <StatItem label={t('profile.rooms_upgraded')} value={profile.roomsUpgraded} />
            </View>
          </View>

          {/* Collections */}
          <View style={styles.collectionsSection}>
            <Text style={styles.sectionTitle}>{t('profile.collections')}</Text>
            <CollectionGrid collections={collections} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const StatItem: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.abyss,
  },
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontFamily: 'MedievalSharp',
    fontSize: 24,
    color: colors.textGold,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'MedievalSharp',
    fontSize: 18,
    color: colors.textGold,
    marginBottom: 10,
    marginTop: 20,
  },
  statsSection: {
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statItem: {
    width: '47%',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'MedievalSharp',
    fontSize: 24,
    color: colors.gold,
  },
  statLabel: {
    fontFamily: 'Cinzel',
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  collectionsSection: {
    marginTop: 8,
  },
});

export default ProfileScreen;
