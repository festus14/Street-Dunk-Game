import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ScoreBoard = ({ score, combo }) => {
  // Format score to look like timer display (0:0 format)
  const formatScore = (score) => {
    const minutes = Math.floor(score / 100);
    const seconds = score % 100;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.scoreBoard}>
        <Text style={styles.label}>SCORE</Text>
        <Text style={styles.scoreText}>{formatScore(score)}</Text>
        {combo > 0 && (
          <Text style={styles.comboText}>x{combo} COMBO</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.02,
    left: 0,
    right: 0,
    zIndex: 5,
    alignItems: 'center',
  },
  scoreBoard: {
    backgroundColor: '#2E4A8B',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#1A2E5B',
    paddingHorizontal: 24,
    paddingVertical: 8,
    minWidth: 140,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  label: {
    color: '#9FB7E0',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  scoreText: {
    color: '#00FF00',
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    textAlign: 'center',
    lineHeight: 32,
  },
  comboText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 2,
  },
});

export default ScoreBoard;