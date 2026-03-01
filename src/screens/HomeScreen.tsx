import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import Background from '../components/background/Background';
import Dragon from '../components/dragon/Dragon';
import { StatsBarGroup } from '../components/ui/StatsBar';
import LevelBadge from '../components/ui/LevelBadge';
import ActionButtons from '../components/ui/ActionButtons';
import FloatingText from '../components/effects/FloatingText';
import ParticleEffect from '../components/effects/ParticleEffect';
import WelcomeBackModal from '../components/ui/WelcomeBackModal';
import DailyGoalCard from '../components/ui/DailyGoalCard';
import TraitBadge from '../components/ui/TraitBadge';
import { usePetStore } from '../store/petStore';
import { useDailyStore } from '../store/dailyStore';
import { useGameLoop } from '../hooks/useGameLoop';
import { useAutoSave } from '../hooks/useAutoSave';
import { useAppState } from '../hooks/useAppState';
import { useDailyReset } from '../hooks/useDailyReset';
import { getBackground } from '../data/backgrounds';
import { getStageForLevel, getStageDefinition } from '../data/levels';
import { getXPProgress } from '../systems/levelSystem';
import { getBondTier } from '../systems/bondSystem';
import { ActionId } from '../types';
import { colors } from '../theme/colors';
import StatsScreen from './StatsScreen';

const { width, height } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const dragon = usePetStore((s) => s.dragon);
  const daily = useDailyStore((s) => s.daily);
  const [currentAction, setCurrentAction] = useState<ActionId | null>(null);
  const [floatingTexts, setFloatingTexts] = useState<
    { id: number; text: string; color: string }[]
  >([]);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);

  useGameLoop();
  useAutoSave();
  useAppState();
  useDailyReset();

  const handleActionPerformed = useCallback((actionId: ActionId) => {
    setCurrentAction(actionId);
    const id = Date.now();
    setFloatingTexts((prev) => [
      ...prev,
      { id, text: `+${t(`actions.${actionId}`)}!`, color: colors.textGold },
    ]);
    setParticles((prev) => [
      ...prev,
      { id, x: width / 2, y: height * 0.4 },
    ]);
    setTimeout(() => setCurrentAction(null), 2500);
  }, [t]);

  const removeFloatingText = useCallback((id: number) => {
    setFloatingTexts((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const removeParticle = useCallback((id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  if (!dragon) return null;

  const stage = getStageForLevel(dragon.level);
  const stageDef = getStageDefinition(stage);
  const bgConfig = getBackground(stageDef.backgroundId);
  const xpProgress = getXPProgress(dragon.level, dragon.experience);
  const bondTier = getBondTier(dragon.bond.level);

  return (
    <View style={styles.container}>
      <Background config={bgConfig} />

      <SafeAreaView style={styles.safeArea}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <View style={styles.topLeft}>
            <Text style={styles.dragonName}>{dragon.name}</Text>
            <View style={styles.topMeta}>
              <TraitBadge trait={dragon.personality.dominantTrait} />
              <Text style={styles.bondText}>
                {t(`bond.${bondTier}`)} ({dragon.bond.level})
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => setSettingsVisible(true)}
          >
            <Text style={styles.settingsIcon}>{'⚙️'}</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsArea}>
          <StatsBarGroup
            stats={dragon.stats}
            labels={{
              hunger: t('stats.hunger'),
              thirst: t('stats.thirst'),
              happiness: t('stats.happiness'),
              energy: t('stats.energy'),
              health: t('stats.health'),
            }}
          />
        </View>

        {/* Dragon area */}
        <View style={styles.dragonArea}>
          <Dragon
            mood={dragon.mood as string}
            currentAction={currentAction}
            onActionAnimationEnd={() => setCurrentAction(null)}
            size={180}
          />

          {floatingTexts.map((ft) => (
            <FloatingText
              key={ft.id}
              text={ft.text}
              color={ft.color}
              onComplete={() => removeFloatingText(ft.id)}
            />
          ))}

          {particles.map((p) => (
            <ParticleEffect
              key={p.id}
              x={p.x}
              y={p.y}
              onComplete={() => removeParticle(p.id)}
            />
          ))}
        </View>

        {/* Daily goals summary */}
        {daily.dailyGoals.length > 0 && (
          <View style={styles.dailyArea}>
            <DailyGoalCard
              goals={daily.dailyGoals}
              streak={daily.loginStreak}
            />
          </View>
        )}

        {/* Level badge */}
        <LevelBadge
          level={dragon.level}
          xpProgress={xpProgress}
          stageName={t(`stages.${stage}`)}
        />

        {/* Action buttons */}
        <ActionButtons onActionPerformed={handleActionPerformed} />
      </SafeAreaView>

      {/* Settings Modal */}
      <Modal
        visible={settingsVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <StatsScreen
          onClose={() => setSettingsVisible(false)}
          onResetGame={() => setSettingsVisible(false)}
        />
      </Modal>

      {/* Welcome Back Modal */}
      <WelcomeBackModal
        visible={showWelcomeBack}
        findings={daily.offlineFindings}
        onClose={() => setShowWelcomeBack(false)}
      />
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  topLeft: {
    flex: 1,
  },
  topMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  dragonName: {
    fontFamily: 'MedievalSharp',
    fontSize: 22,
    color: colors.textGold,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  bondText: {
    fontFamily: 'Cinzel',
    fontSize: 11,
    color: colors.moonlightDim,
  },
  settingsBtn: {
    padding: 8,
  },
  settingsIcon: {
    fontSize: 24,
  },
  statsArea: {
    paddingHorizontal: 16,
    marginTop: 4,
  },
  dragonArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dailyArea: {
    paddingHorizontal: 16,
    marginBottom: 4,
  },
});

export default HomeScreen;
