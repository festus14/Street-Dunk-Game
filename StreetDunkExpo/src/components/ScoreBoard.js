import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ScoreBoard = ({ score, combo, timeRemaining }) => {
  const formatScore = (score) => {
    const minutes = Math.floor(score / 100);
    const seconds = score % 100;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const lowTime = timeRemaining > 0 && timeRemaining <= 5;

  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.scoreBoard}>
        <Text style={styles.label}>SCORE</Text>
        <Text style={styles.scoreText}>{formatScore(score)}</Text>
        {combo > 0 && (
          <Text style={styles.comboText}>x{combo} COMBO</Text>
        )}
      </View>
      {timeRemaining > 0 && (
        <View style={[styles.timerBox, lowTime && styles.timerBoxLow]}>
          <Text style={styles.timerLabel}>TIME</Text>
          <Text style={[styles.timerText, lowTime && styles.timerTextLow]}>
            {formatTime(timeRemaining)}
          </Text>
        </View>
      )}
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
  timerBox: {
    marginTop: 6,
    backgroundColor: '#1A2E5B',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0E1A38',
    paddingHorizontal: 16,
    paddingVertical: 4,
    alignItems: 'center',
    minWidth: 100,
  },
  timerBoxLow: {
    backgroundColor: '#5B1A1A',
    borderColor: '#3A0E0E',
  },
  timerLabel: {
    color: '#9FB7E0',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  timerTextLow: {
    color: '#FF6B6B',
  },
});

export default ScoreBoard;