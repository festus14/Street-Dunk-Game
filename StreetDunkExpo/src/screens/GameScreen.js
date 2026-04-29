import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Modal, TouchableOpacity } from 'react-native';
import Court from '../components/Court';
import Player from '../components/Player';
import Ball from '../components/Ball';
import ScoreBoard from '../components/ScoreBoard';
import GameControls from '../components/GameControls';

const DIFFICULTIES = [
  { label: 'Easy', seconds: 60, moves: 50, color: '#27AE60' },
  { label: 'Medium', seconds: 30, moves: 30, color: '#F39C12' },
  { label: 'Hard', seconds: 10, moves: 20, color: '#E74C3C' },
];

const ACTIONS = ['moveRight', 'moveLeft', 'shoot', 'dunk', 'layup'];

const MOVE_COSTS = {
  move: 1,
  shoot: 1,
  layup: 3,
  dunk: 5,
};

const AUTO_ACCURACY = {
  dunk: 0.75,
  layup: 0.85,
};

const COMBO_FATIGUE = {
  threshold: 5,
  perCombo: 0.05,
  floorDunk: 0.4,
  floorLayup: 0.5,
};

const autoAccuracy = (combo, base, floor) => {
  const fatigue = Math.max(0, combo - COMBO_FATIGUE.threshold) * COMBO_FATIGUE.perCombo;
  return Math.max(floor, base - fatigue);
};

const GameScreen = () => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const INITIAL_PLAYER = { x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT * 0.8 };
  const INITIAL_BALL = { x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT * 0.75 };

  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [gameState, setGameState] = useState('ready');
  const [playerPosition, setPlayerPosition] = useState(INITIAL_PLAYER);
  const [ballPosition, setBallPosition] = useState(INITIAL_BALL);
  const [direction, setDirection] = useState('right');
  const [isMoving, setIsMoving] = useState(null);
  const [nearHoop, setNearHoop] = useState(null);

  const [showStartModal, setShowStartModal] = useState(true);
  const [showEndModal, setShowEndModal] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [movesRemaining, setMovesRemaining] = useState(0);
  const [startingMoves, setStartingMoves] = useState(0);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [autoToggle, setAutoToggle] = useState(false);

  const moveIntervalRef = useRef(null);
  const autoHandlersRef = useRef({});
  const autoStateRef = useRef({});

  const isPlaying = !showStartModal && !showEndModal && (
    isAutoMode ? movesRemaining > 0 : timeRemaining > 0
  );

  const deductMoves = (cost) => {
    if (!isAutoMode) return;
    setMovesRemaining(prev => Math.max(0, prev - cost));
  };

  useEffect(() => {
    const leftHoopX = SCREEN_WIDTH * 0.085;
    const rightHoopX = SCREEN_WIDTH * 0.915;
    const hoopRange = 90;

    if (Math.abs(playerPosition.x - leftHoopX) < hoopRange) {
      setNearHoop('left');
    } else if (Math.abs(playerPosition.x - rightHoopX) < hoopRange) {
      setNearHoop('right');
    } else {
      setNearHoop(null);
    }
  }, [playerPosition, SCREEN_WIDTH]);

  useEffect(() => {
    if (isMoving && gameState !== 'dunking' && gameState !== 'layup' && gameState !== 'shooting') {
      setGameState('dribbling');
    } else if (!isMoving && gameState === 'dribbling') {
      setGameState('ready');
    }
  }, [isMoving, gameState]);

  useEffect(() => {
    if (!isPlaying || isAutoMode) return;
    const id = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [isPlaying, isAutoMode]);

  useEffect(() => {
    if (showStartModal || showEndModal) return;
    const gameOver = isAutoMode ? movesRemaining <= 0 : timeRemaining === 0;
    if (gameOver) {
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
        moveIntervalRef.current = null;
      }
      setIsMoving(null);
      setShowEndModal(true);
    }
  }, [timeRemaining, movesRemaining, showStartModal, showEndModal, isAutoMode]);

  const handleMoveLeft = () => {
    if (!isPlaying) return;
    if (gameState === 'dunking' || gameState === 'layup' || gameState === 'shooting') return;

    deductMoves(MOVE_COSTS.move);
    setDirection('left');
    setIsMoving('left');

    moveIntervalRef.current = setInterval(() => {
      setPlayerPosition(prev => {
        const newX = Math.max(SCREEN_WIDTH * 0.1, prev.x - 12);
        setBallPosition(prevBall => ({ ...prevBall, x: newX }));
        return { ...prev, x: newX };
      });
    }, 30);
  };

  const handleMoveRight = () => {
    if (!isPlaying) return;
    if (gameState === 'dunking' || gameState === 'layup' || gameState === 'shooting') return;

    deductMoves(MOVE_COSTS.move);
    setDirection('right');
    setIsMoving('right');

    moveIntervalRef.current = setInterval(() => {
      setPlayerPosition(prev => {
        const newX = Math.min(SCREEN_WIDTH * 0.9, prev.x + 12);
        setBallPosition(prevBall => ({ ...prevBall, x: newX }));
        return { ...prev, x: newX };
      });
    }, 30);
  };

  const stopMovement = () => {
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
    setIsMoving(null);
  };

  useEffect(() => {
    return () => {
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
      }
    };
  }, []);

  const handleDunk = () => {
    if (!isPlaying) return;
    if (gameState === 'dunking' || gameState === 'layup' || gameState === 'shooting') return;

    deductMoves(MOVE_COSTS.dunk);
    if (!nearHoop) return;

    setGameState('dunking');

    const isSuccessful = isAutoMode
      ? Math.random() < autoAccuracy(combo, AUTO_ACCURACY.dunk, COMBO_FATIGUE.floorDunk)
      : true;

    const hoopX = nearHoop === 'left' ? SCREEN_WIDTH * 0.085 : SCREEN_WIDTH * 0.915;
    setBallPosition({ x: hoopX, y: SCREEN_HEIGHT * 0.22 });

    setTimeout(() => {
      setGameState('ready');
      if (isSuccessful) {
        const dunkPoints = 50 + (combo * 10);
        setScore(prev => prev + dunkPoints);
        setCombo(prev => prev + 3);
        setPlayerPosition(INITIAL_PLAYER);
        setBallPosition(INITIAL_BALL);
      } else {
        setCombo(0);
        setBallPosition({ x: playerPosition.x, y: playerPosition.y - 20 });
      }
    }, 1300);
  };

  const handleLayup = () => {
    if (!isPlaying) return;
    if (gameState === 'dunking' || gameState === 'layup' || gameState === 'shooting') return;

    deductMoves(MOVE_COSTS.layup);
    if (!nearHoop) return;

    setGameState('layup');

    const isSuccessful = isAutoMode
      ? Math.random() < autoAccuracy(combo, AUTO_ACCURACY.layup, COMBO_FATIGUE.floorLayup)
      : true;

    const hoopX = nearHoop === 'left' ? SCREEN_WIDTH * 0.085 : SCREEN_WIDTH * 0.915;
    setBallPosition({ x: hoopX, y: SCREEN_HEIGHT * 0.22 });

    setTimeout(() => {
      setGameState('ready');
      if (isSuccessful) {
        const layupPoints = 30 + (combo * 5);
        setScore(prev => prev + layupPoints);
        setCombo(prev => prev + 2);
        setPlayerPosition(INITIAL_PLAYER);
        setBallPosition(INITIAL_BALL);
      } else {
        setCombo(0);
        setBallPosition({ x: playerPosition.x, y: playerPosition.y - 20 });
      }
    }, 800);
  };

  const handleShoot = () => {
    if (!isPlaying) return;
    if (gameState === 'dunking' || gameState === 'layup' || gameState === 'shooting') return;

    deductMoves(MOVE_COSTS.shoot);
    setGameState('shooting');

    const leftHoopX = SCREEN_WIDTH * 0.085;
    const rightHoopX = SCREEN_WIDTH * 0.915;
    const distanceToLeft = Math.abs(playerPosition.x - leftHoopX);
    const distanceToRight = Math.abs(playerPosition.x - rightHoopX);
    const targetHoop = distanceToLeft < distanceToRight ? 'left' : 'right';
    const hoopX = targetHoop === 'left' ? leftHoopX : rightHoopX;

    const distance = Math.min(distanceToLeft, distanceToRight);
    let isSuccessful;
    if (isAutoMode) {
      if (distance < SCREEN_WIDTH * 0.2) isSuccessful = true;
      else if (distance < SCREEN_WIDTH * 0.4) isSuccessful = combo >= 2;
      else isSuccessful = combo >= 4 || movesRemaining >= startingMoves * 0.6;
    } else {
      const baseAccuracy = Math.max(0.5, 1 - (distance / (SCREEN_WIDTH * 0.7)));
      const comboBonus = Math.min(0.2, combo * 0.03);
      const finalAccuracy = Math.min(0.85, baseAccuracy + comboBonus);
      isSuccessful = Math.random() < finalAccuracy;
    }

    setBallPosition({ x: hoopX, y: SCREEN_HEIGHT * 0.22 });

    setTimeout(() => {
      if (isSuccessful) {
        const isThreePointer = distance > SCREEN_WIDTH * 0.4;
        const shootPoints = isThreePointer ? 30 + (combo * 8) : 20 + (combo * 5);
        setScore(prev => prev + shootPoints);
        setCombo(prev => prev + (isThreePointer ? 2 : 1));
        setPlayerPosition(INITIAL_PLAYER);
        setBallPosition(INITIAL_BALL);
      } else {
        setCombo(0);
        setBallPosition({ x: playerPosition.x, y: playerPosition.y - 20 });
      }
      setGameState('ready');
    }, 1000);
  };

  useEffect(() => {
    let comboTimer;
    if (gameState === 'ready' && combo > 0) {
      comboTimer = setTimeout(() => {
        setCombo(0);
      }, 8000);
    }
    return () => clearTimeout(comboTimer);
  }, [gameState, combo]);

  const handleDifficultySelect = (difficulty) => {
    setScore(0);
    setCombo(0);
    setGameState('ready');
    setPlayerPosition(INITIAL_PLAYER);
    setBallPosition(INITIAL_BALL);
    if (autoToggle) {
      setMovesRemaining(difficulty.moves);
      setStartingMoves(difficulty.moves);
      setTimeRemaining(0);
    } else {
      setTimeRemaining(difficulty.seconds);
      setMovesRemaining(0);
      setStartingMoves(0);
    }
    setIsAutoMode(autoToggle);
    setShowStartModal(false);
  };

  const handleRestart = () => {
    setIsAutoMode(false);
    setShowEndModal(false);
    setShowStartModal(true);
  };

  autoHandlersRef.current = {
    handleMoveLeft,
    handleMoveRight,
    handleShoot,
    handleDunk,
    handleLayup,
    stopMovement,
  };
  autoStateRef.current = { gameState };

  useEffect(() => {
    if (!isAutoMode || !isPlaying) return;

    let cancelled = false;
    let pendingTimeout = null;

    const schedule = (delay) => {
      if (cancelled) return;
      pendingTimeout = setTimeout(tick, delay);
    };

    const performMove = (handler) => {
      handler();
      const moveFor = 250 + Math.random() * 400;
      pendingTimeout = setTimeout(() => {
        autoHandlersRef.current.stopMovement();
        schedule(150);
      }, moveFor);
    };

    const tick = () => {
      if (cancelled) return;
      const { gameState: gs } = autoStateRef.current;
      const h = autoHandlersRef.current;

      if (gs === 'dunking' || gs === 'layup' || gs === 'shooting') {
        schedule(300);
        return;
      }

      const actionId = Math.floor(Math.random() * ACTIONS.length);
      switch (ACTIONS[actionId]) {
        case 'moveRight':
          performMove(h.handleMoveRight);
          break;
        case 'moveLeft':
          performMove(h.handleMoveLeft);
          break;
        case 'shoot':
          h.handleShoot();
          schedule(1300);
          break;
        case 'dunk':
          h.handleDunk();
          schedule(1600);
          break;
        case 'layup':
          h.handleLayup();
          schedule(1100);
          break;
      }
    };

    schedule(500);

    return () => {
      cancelled = true;
      if (pendingTimeout) clearTimeout(pendingTimeout);
    };
  }, [isAutoMode, isPlaying]);

  return (
    <View style={styles.container}>
      <Court />
      <Player
        position={playerPosition}
        gameState={gameState}
        direction={direction}
      />
      <Ball
        position={ballPosition}
        gameState={gameState}
      />
      <ScoreBoard
        score={score}
        combo={Math.floor(combo)}
        timeRemaining={timeRemaining}
        movesRemaining={movesRemaining}
        isAutoMode={isAutoMode}
      />
      <GameControls
        onMoveLeft={handleMoveLeft}
        onMoveRight={handleMoveRight}
        onDunk={handleDunk}
        onLayup={handleLayup}
        onShoot={handleShoot}
        gameState={gameState}
        isMoving={isMoving}
        stopMovement={stopMovement}
        nearHoop={nearHoop}
      />

      <Modal
        visible={showStartModal}
        transparent
        animationType="fade"
        supportedOrientations={['landscape', 'landscape-left', 'landscape-right']}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Choose Difficulty</Text>
            <Text style={styles.modalSubtitle}>Score as much as you can</Text>
            <TouchableOpacity
              style={[styles.autoToggle, autoToggle && styles.autoToggleOn]}
              onPress={() => setAutoToggle(prev => !prev)}
              activeOpacity={0.8}
            >
              <Text style={styles.autoToggleLabel}>AUTO MODE</Text>
              <View style={[styles.autoTogglePill, autoToggle && styles.autoTogglePillOn]}>
                <Text style={styles.autoTogglePillText}>{autoToggle ? 'ON' : 'OFF'}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.difficultyRow}>
              {DIFFICULTIES.map(d => (
                <TouchableOpacity
                  key={d.label}
                  style={[styles.difficultyButton, { backgroundColor: d.color }]}
                  onPress={() => handleDifficultySelect(d)}
                >
                  <Text style={styles.difficultyLabel}>{d.label}</Text>
                  <Text style={styles.difficultySeconds}>
                    {autoToggle ? `${d.moves} moves` : `${d.seconds}s`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showEndModal}
        transparent
        animationType="fade"
        supportedOrientations={['landscape', 'landscape-left', 'landscape-right']}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Time's Up!</Text>
            <Text style={styles.finalScoreLabel}>FINAL SCORE</Text>
            <Text style={styles.finalScoreValue}>{score}</Text>
            <TouchableOpacity style={styles.playAgainButton} onPress={handleRestart}>
              <Text style={styles.playAgainText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F3FF',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 28,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2E4A8B',
    minWidth: 320,
    maxWidth: 480,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: 1,
  },
  modalSubtitle: {
    color: '#9FB7E0',
    fontSize: 13,
    marginBottom: 18,
  },
  difficultyRow: {
    flexDirection: 'row',
    gap: 12,
  },
  difficultyButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 90,
  },
  difficultyLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  difficultySeconds: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 2,
    opacity: 0.9,
  },
  autoToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0E1A38',
    borderWidth: 1,
    borderColor: '#2E4A8B',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 14,
    minWidth: 220,
  },
  autoToggleOn: {
    backgroundColor: '#3A1A5B',
    borderColor: '#8E44AD',
  },
  autoToggleLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  autoTogglePill: {
    backgroundColor: '#2E4A8B',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 3,
    minWidth: 48,
    alignItems: 'center',
  },
  autoTogglePillOn: {
    backgroundColor: '#8E44AD',
  },
  autoTogglePillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  finalScoreLabel: {
    color: '#9FB7E0',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: 8,
  },
  finalScoreValue: {
    color: '#00FF00',
    fontSize: 56,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginTop: 4,
    marginBottom: 18,
  },
  playAgainButton: {
    backgroundColor: '#3498DB',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  playAgainText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default GameScreen;
