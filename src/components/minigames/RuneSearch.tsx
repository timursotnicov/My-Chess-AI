import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';

const RUNE_SYMBOLS = ['🔮', '⚡', '🌙', '🔥', '💎', '🌟', '🗡️', '🛡️'];
const GRID_SIZE = 4;
const MAX_MOVES = 20;

interface RuneSearchProps {
  onComplete: (score: number) => void;
}

const RuneSearch: React.FC<RuneSearchProps> = ({ onComplete }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [revealedCards, setRevealedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  // Generate shuffled grid
  const grid = useMemo(() => {
    const symbols = RUNE_SYMBOLS.slice(0, (GRID_SIZE * GRID_SIZE) / 2);
    const pairs = [...symbols, ...symbols];
    return pairs.sort(() => Math.random() - 0.5);
  }, [gameStarted]);

  const totalPairs = (GRID_SIZE * GRID_SIZE) / 2;

  const startGame = () => {
    setGameStarted(true);
    setRevealedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setIsChecking(false);
  };

  const handleCardPress = (index: number) => {
    if (isChecking) return;
    if (revealedCards.includes(index)) return;
    if (matchedPairs.includes(index)) return;

    const newRevealed = [...revealedCards, index];
    setRevealedCards(newRevealed);

    if (newRevealed.length === 2) {
      setMoves((prev) => prev + 1);
      setIsChecking(true);

      const [first, second] = newRevealed;
      if (grid[first] === grid[second]) {
        // Match found
        setMatchedPairs((prev) => {
          const updated = [...prev, first, second];
          if (updated.length === GRID_SIZE * GRID_SIZE) {
            // All matched
            const score = Math.max(1, totalPairs - Math.floor(moves / 2));
            setTimeout(() => onComplete(score), 500);
          }
          return updated;
        });
        setRevealedCards([]);
        setIsChecking(false);
      } else {
        // No match
        setTimeout(() => {
          setRevealedCards([]);
          setIsChecking(false);

          if (moves + 1 >= MAX_MOVES) {
            const pairsFound = matchedPairs.length / 2;
            onComplete(pairsFound);
          }
        }, 800);
      }
    }
  };

  if (!gameStarted) {
    return (
      <View style={styles.startArea}>
        <Text style={styles.startTitle}>{'🔮'}</Text>
        <Text style={styles.startDesc}>Match the rune pairs!</Text>
        <TouchableOpacity style={styles.startBtn} onPress={startGame}>
          <Text style={styles.startBtnText}>Start</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HUD */}
      <View style={styles.hud}>
        <Text style={styles.hudText}>
          Pairs: {matchedPairs.length / 2}/{totalPairs}
        </Text>
        <Text style={styles.hudText}>
          Moves: {moves}/{MAX_MOVES}
        </Text>
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        {grid.map((symbol, index) => {
          const isRevealed = revealedCards.includes(index);
          const isMatched = matchedPairs.includes(index);

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.card,
                isRevealed && styles.cardRevealed,
                isMatched && styles.cardMatched,
              ]}
              onPress={() => handleCardPress(index)}
              disabled={isMatched}
            >
              <Text style={styles.cardSymbol}>
                {isRevealed || isMatched ? symbol : '❓'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 10,
  },
  startArea: {
    alignItems: 'center',
    gap: 16,
  },
  startTitle: {
    fontSize: 60,
  },
  startDesc: {
    fontFamily: 'MedievalSharp',
    fontSize: 18,
    color: colors.textPrimary,
  },
  startBtn: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gold + '60',
  },
  startBtnText: {
    fontFamily: 'MedievalSharp',
    fontSize: 20,
    color: colors.textGold,
  },
  hud: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  hudText: {
    fontFamily: 'MedievalSharp',
    fontSize: 16,
    color: colors.gold,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: GRID_SIZE * 72,
    gap: 6,
  },
  card: {
    width: 66,
    height: 80,
    backgroundColor: colors.charcoal,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.arcane + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardRevealed: {
    backgroundColor: colors.arcaneDim,
    borderColor: colors.arcane,
  },
  cardMatched: {
    backgroundColor: colors.forestGreen,
    borderColor: colors.mossGreen,
    opacity: 0.7,
  },
  cardSymbol: {
    fontSize: 28,
  },
});

export default RuneSearch;
