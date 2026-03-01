import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import MedievalButton from '../components/ui/MedievalButton';
import MedievalFrame from '../components/ui/MedievalFrame';
import { usePetStore } from '../store/petStore';
import { useSettingsStore } from '../store/settingsStore';
import { calculateAge } from '../systems/timeSystem';
import { getStageForLevel } from '../data/levels';
import { getBondTier } from '../systems/bondSystem';
import { deleteSave } from '../utils/storage';
import { colors } from '../theme/colors';

interface StatsScreenProps {
  onClose: () => void;
  onResetGame: () => void;
}

const StatsScreen: React.FC<StatsScreenProps> = ({ onClose, onResetGame }) => {
  const { t } = useTranslation();
  const dragon = usePetStore((s) => s.dragon);
  const { language, setLanguage, soundEnabled, toggleSound } =
    useSettingsStore();

  if (!dragon) return null;

  const age = calculateAge(dragon.createdAt);
  const stage = getStageForLevel(dragon.level);
  const bondTier = getBondTier(dragon.bond.level);

  const handleReset = () => {
    Alert.alert(t('settings.reset'), t('settings.resetConfirm'), [
      { text: t('settings.no'), style: 'cancel' },
      {
        text: t('settings.yes'),
        style: 'destructive',
        onPress: async () => {
          await deleteSave();
          onResetGame();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('settings.title')}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>{'✕'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <MedievalFrame style={styles.section}>
            <Text style={styles.sectionTitle}>{dragon.name}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('stats.level')}:</Text>
              <Text style={styles.infoValue}>{dragon.level}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('stats.stage')}:</Text>
              <Text style={styles.infoValue}>{t(`stages.${stage}`)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('stats.age')}:</Text>
              <Text style={styles.infoValue}>
                {age} {t('stats.days')}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('stats.bond')}:</Text>
              <Text style={styles.infoValue}>
                {t(`bond.${bondTier}`)} ({dragon.bond.level})
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('stats.personality')}:</Text>
              <Text style={styles.infoValue}>
                {t(`personality.${dragon.personality.dominantTrait}`)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('stats.experience')}:</Text>
              <Text style={styles.infoValue}>{dragon.experience} XP</Text>
            </View>
          </MedievalFrame>

          <MedievalFrame style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
            <View style={styles.langRow}>
              <MedievalButton
                title="Русский"
                onPress={() => setLanguage('ru')}
                variant={language === 'ru' ? 'gold' : 'secondary'}
                size="small"
              />
              <View style={{ width: 8 }} />
              <MedievalButton
                title="English"
                onPress={() => setLanguage('en')}
                variant={language === 'en' ? 'gold' : 'secondary'}
                size="small"
              />
            </View>
          </MedievalFrame>

          <MedievalFrame style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.sound')}</Text>
            <MedievalButton
              title={soundEnabled ? '🔊 ON' : '🔇 OFF'}
              onPress={toggleSound}
              variant={soundEnabled ? 'gold' : 'secondary'}
              size="small"
            />
          </MedievalFrame>

          <View style={styles.dangerZone}>
            <MedievalButton
              title={t('settings.reset')}
              onPress={handleReset}
              variant="secondary"
              size="medium"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.abyss,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gold + '30',
  },
  title: {
    fontFamily: 'MedievalSharp',
    fontSize: 24,
    color: colors.textGold,
  },
  closeBtn: {
    padding: 8,
  },
  closeText: {
    fontSize: 22,
    color: colors.textPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  section: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontFamily: 'MedievalSharp',
    fontSize: 18,
    color: colors.textGold,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  infoLabel: {
    fontFamily: 'Cinzel',
    fontSize: 13,
    color: colors.textSecondary,
  },
  infoValue: {
    fontFamily: 'Cinzel',
    fontSize: 13,
    color: colors.textGold,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dangerZone: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default StatsScreen;
