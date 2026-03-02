import React, { useState, useCallback, useEffect, useRef } from 'react';
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
import CelebrationOverlay from '../components/effects/CelebrationOverlay';
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
import { eventBus } from '../systems/eventBus';
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
  const [celebration, setCelebration] = useState<{
    visible: boolean;
    type: 'level_up' | 'evolution';
    title: string;
    subtitle?: string;
  }>({ visible: false, type: 'level_up', title: '' });

  // Listen for level-up and evolution events
  useEffect(() => {
    const unsubLevel = eventBus.on('level_up', (event) => {
      const level = event.payload.level as number;
      setCelebration({
        visible: true,
        type: 'level_up',
        title: `${t('celebration.level_up')} ${level}!`,
        subtitle: `+${event.payload.xpGained ?? ''} XP`,
      });
    });

    const unsubEvolution = eventBus.on('stage_evolved', (event) => {
      const newStage = event.payload.newStage as string;
      setCelebration({
        visible: true,
        type: 'evolution',
        title: t('celebration.evolution'),
        subtitle: t(`stages.${newStage}`),
      });
    });

    return () => {
      unsubLevel();
      unsubEvolution();
    };
  }, [t]);

  useGameLoop();
  useAutoSave();
  useAppState();
  useDailyReset();

  const handleActionPerformed = useCallback((actionId: ActionId) => {
    setCurrentAction(actionId);
    const id = Date.now();
    setFloatingTexts((prev) => [
      ...prev,
      { id, text: `+${t(`actions.${actionId}`)}!`, color: '#FFD875' },
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

      {/* Dark vignette overlay for better readability */}
      <View style={styles.vignette} />

      <SafeAreaView style={styles.safeArea}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <View style={styles.topLeft}>
            <Text style={styles.dragonName}>{dragon.name}</Text>
            <View style={styles.topMeta}>
              <TraitBadge trait={dragon.personality.dominantTrait} />
              <View style={styles.bondBadge}>
                <Text style={styles.bondText}>
                  {t(`bond.${bondTier}`)} {dragon.bond.level}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => setSettingsVisible(true)}
          >
            <View style={styles.settingsCircle}>
              <Text style={styles.settingsIcon}>{'⚙️'}</Text>
            </View>
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
          {/* Dragon glow aura */}
          <View style={styles.dragonGlow} />

          <Dragon
            mood={dragon.mood as string}
            currentAction={currentAction}
            onActionAnimationEnd={() => setCurrentAction(null)}
            size={200}
            stage={stage}
          />

          {/* Platform under dragon */}
          <View style={styles.platform}>
            <View style={styles.platformTop} />
            <View style={styles.platformBase} />
          </View>

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

      {/* Level-up / Evolution celebration */}
      <CelebrationOverlay
        visible={celebration.visible}
        type={celebration.type}
        title={celebration.title}
        subtitle={celebration.subtitle}
        onComplete={() => setCelebration((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.abyss,
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 30,
    borderColor: 'rgba(0,0,0,0.15)',
    borderRadius: 0,
    // This creates a soft vignette effect around edges
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  topLeft: {
    flex: 1,
  },
  topMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  dragonName: {
    fontFamily: 'MedievalSharp',
    fontSize: 24,
    color: '#FFD875',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 6,
  },
  bondBadge: {
    backgroundColor: 'rgba(200, 168, 78, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gold + '30',
  },
  bondText: {
    fontFamily: 'Cinzel',
    fontSize: 11,
    color: colors.goldDim,
  },
  settingsBtn: {
    padding: 4,
  },
  settingsCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(10, 10, 20, 0.5)',
    borderWidth: 1,
    borderColor: colors.gold + '25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 18,
  },
  statsArea: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  dragonArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragonGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.arcaneGlow + '08',
    shadowColor: colors.arcaneGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
  },
  platform: {
    alignItems: 'center',
    marginTop: -20,
  },
  platformTop: {
    width: 120,
    height: 8,
    backgroundColor: 'rgba(80, 60, 40, 0.5)',
    borderRadius: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  platformBase: {
    width: 100,
    height: 4,
    backgroundColor: 'rgba(60, 45, 30, 0.3)',
    borderRadius: 50,
    marginTop: -1,
  },
  dailyArea: {
    paddingHorizontal: 16,
    marginBottom: 6,
  },
});

export default HomeScreen;
