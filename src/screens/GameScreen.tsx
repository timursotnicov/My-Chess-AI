import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import Background from '../components/background/Background';
import Dragon from '../components/dragon/Dragon';
import { StatsBarGroup } from '../components/ui/StatsBar';
import LevelBadge from '../components/ui/LevelBadge';
import ActionButtons from '../components/ui/ActionButtons';
import FloatingText from '../components/effects/FloatingText';
import ParticleEffect from '../components/effects/ParticleEffect';
import { useGameStore } from '../store/gameStore';
import { useGameLoop } from '../hooks/useGameLoop';
import { useAutoSave } from '../hooks/useAutoSave';
import { useAppState } from '../hooks/useAppState';
import { getBackground } from '../data/backgrounds';
import { getStageForLevel, getStageDefinition } from '../data/levels';
import { getXPProgress } from '../systems/levelSystem';
import { ActionId } from '../types';
import { colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

interface GameScreenProps {
  onOpenSettings: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ onOpenSettings }) => {
  const { t } = useTranslation();
  const dragon = useGameStore((s) => s.dragon);
  const [currentAction, setCurrentAction] = useState<ActionId | null>(null);
  const [floatingTexts, setFloatingTexts] = useState<
    { id: number; text: string; color: string }[]
  >([]);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  // Activate game loops
  useGameLoop();
  useAutoSave();
  useAppState();

  const handleActionPerformed = useCallback((actionId: ActionId) => {
    setCurrentAction(actionId);

    // Show floating text
    const id = Date.now();
    setFloatingTexts((prev) => [
      ...prev,
      { id, text: `+${t(`actions.${actionId}`)}!`, color: colors.textGold },
    ]);

    // Show particles
    setParticles((prev) => [
      ...prev,
      { id, x: width / 2, y: height * 0.4 },
    ]);

    // Reset action after animation
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

  return (
    <View style={styles.container}>
      {/* Background */}
      <Background config={bgConfig} />

      {/* Main content */}
      <SafeAreaView style={styles.safeArea}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <View style={styles.topLeft}>
            <Text style={styles.dragonName}>{dragon.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={onOpenSettings}
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
            mood={dragon.mood}
            currentAction={currentAction}
            onActionAnimationEnd={() => setCurrentAction(null)}
            size={180}
          />

          {/* Floating texts */}
          {floatingTexts.map((ft) => (
            <FloatingText
              key={ft.id}
              text={ft.text}
              color={ft.color}
              onComplete={() => removeFloatingText(ft.id)}
            />
          ))}

          {/* Particles */}
          {particles.map((p) => (
            <ParticleEffect
              key={p.id}
              x={p.x}
              y={p.y}
              onComplete={() => removeParticle(p.id)}
            />
          ))}
        </View>

        {/* Level badge */}
        <LevelBadge
          level={dragon.level}
          xpProgress={xpProgress}
          stageName={t(`stages.${stage}`)}
        />

        {/* Action buttons */}
        <ActionButtons onActionPerformed={handleActionPerformed} />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  topLeft: {
    flex: 1,
  },
  dragonName: {
    fontFamily: 'MedievalSharp',
    fontSize: 22,
    color: colors.textGold,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
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
});

export default GameScreen;
