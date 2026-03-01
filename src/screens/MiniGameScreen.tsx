import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import FireflyCatch from '../components/minigames/FireflyCatch';
import RuneSearch from '../components/minigames/RuneSearch';
import { MiniGameId, MiniGameResult, ResourceType } from '../types';
import { useShelterStore } from '../store/shelterStore';
import { usePetStore } from '../store/petStore';
import { useProfileStore } from '../store/profileStore';
import { addBondXp } from '../systems/bondSystem';
import { colors } from '../theme/colors';

interface MiniGameScreenProps {
  gameId: MiniGameId;
  onComplete: (result: MiniGameResult) => void;
  onBack: () => void;
}

const MiniGameScreen: React.FC<MiniGameScreenProps> = ({ gameId, onComplete, onBack }) => {
  const { t } = useTranslation();
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState<MiniGameResult | null>(null);
  const addResource = useShelterStore((s) => s.addResource);
  const incrementStat = useProfileStore((s) => s.incrementStat);

  const handleGameComplete = (score: number) => {
    const gameResult: MiniGameResult = {
      gameId,
      score,
      rewards: gameId === 'firefly_catch'
        ? [
            { type: 'resource', id: 'herbs', amount: Math.floor(score / 3) },
            { type: 'xp', amount: score * 5 },
            { type: 'bond', amount: Math.floor(score / 2) },
          ]
        : [
            { type: 'resource', id: 'ancient_dust', amount: Math.floor(score / 2) },
            { type: 'xp', amount: score * 8 },
            { type: 'bond', amount: Math.floor(score / 3) },
          ],
      bondXp: Math.floor(score / 2),
    };

    // Apply rewards
    for (const reward of gameResult.rewards) {
      if (reward.type === 'resource' && reward.id && reward.amount) {
        addResource(reward.id as ResourceType, reward.amount);
      }
    }

    incrementStat('miniGamesPlayed');
    setResult(gameResult);
    setGameOver(true);
    onComplete(gameResult);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>{'< '}{t('common.back')}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {t(`minigames.${gameId}`)}
          </Text>
        </View>

        <View style={styles.gameArea}>
          {gameId === 'firefly_catch' && !gameOver && (
            <FireflyCatch onComplete={handleGameComplete} />
          )}
          {gameId === 'rune_search' && !gameOver && (
            <RuneSearch onComplete={handleGameComplete} />
          )}

          {gameOver && result && (
            <View style={styles.resultArea}>
              <Text style={styles.resultTitle}>{t('minigames.complete')}</Text>
              <Text style={styles.resultScore}>
                {t('minigames.score')}: {result.score}
              </Text>
              <View style={styles.rewardsList}>
                {result.rewards.map((reward, i) => (
                  <Text key={i} style={styles.rewardText}>
                    + {reward.amount} {reward.id ?? reward.type}
                  </Text>
                ))}
              </View>
              <TouchableOpacity style={styles.doneBtn} onPress={onBack}>
                <Text style={styles.doneBtnText}>{t('common.done')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  backText: {
    color: colors.textGold,
    fontSize: 16,
    fontFamily: 'Cinzel',
  },
  title: {
    fontFamily: 'MedievalSharp',
    fontSize: 20,
    color: colors.textGold,
  },
  gameArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultArea: {
    alignItems: 'center',
    padding: 30,
  },
  resultTitle: {
    fontFamily: 'MedievalSharp',
    fontSize: 28,
    color: colors.gold,
    marginBottom: 16,
  },
  resultScore: {
    fontFamily: 'MedievalSharp',
    fontSize: 22,
    color: colors.textPrimary,
    marginBottom: 20,
  },
  rewardsList: {
    gap: 6,
    marginBottom: 24,
  },
  rewardText: {
    fontFamily: 'Cinzel',
    fontSize: 14,
    color: colors.arcaneGlow,
  },
  doneBtn: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gold + '60',
  },
  doneBtnText: {
    fontFamily: 'MedievalSharp',
    fontSize: 18,
    color: colors.textGold,
  },
});

export default MiniGameScreen;
