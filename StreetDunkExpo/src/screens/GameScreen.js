import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Court from '../components/Court';
import Player from '../components/Player';
import Ball from '../components/Ball';
import ScoreBoard from '../components/ScoreBoard';
import GameControls from '../components/GameControls';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const GameScreen = () => {
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [gameState, setGameState] = useState('ready'); // ready, running, dribbling, dunking, layup, shooting
  const [playerPosition, setPlayerPosition] = useState({ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT * 0.8 });
  const [ballPosition, setBallPosition] = useState({ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT * 0.75 });
  const [direction, setDirection] = useState('right');
  const [isMoving, setIsMoving] = useState(null);
  const [nearHoop, setNearHoop] = useState(null); // 'left', 'right', or null
  
  const moveIntervalRef = useRef(null);

  // Check if player is near a hoop (updated for new court layout)
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
  }, [playerPosition]);

  // Auto-dribble when moving
  useEffect(() => {
    if (isMoving && gameState !== 'dunking' && gameState !== 'layup' && gameState !== 'shooting') {
      setGameState('dribbling');
    } else if (!isMoving && gameState === 'dribbling') {
      setGameState('ready');
    }
  }, [isMoving, gameState]);

  const handleMoveLeft = () => {
    if (gameState === 'dunking' || gameState === 'layup' || gameState === 'shooting') return;
    
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
    if (gameState === 'dunking' || gameState === 'layup' || gameState === 'shooting') return;
    
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

  // Stop movement when component unmounts
  useEffect(() => {
    return () => {
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
      }
    };
  }, []);

  const handleDunk = () => {
    if (gameState === 'dunking' || gameState === 'layup' || gameState === 'shooting') return;
    
    if (nearHoop) {
      setGameState('dunking');
      
      // Move ball to hoop position
      const hoopX = nearHoop === 'left' ? SCREEN_WIDTH * 0.085 : SCREEN_WIDTH * 0.915;
      setBallPosition({ x: hoopX, y: SCREEN_HEIGHT * 0.22 });
      
      setTimeout(() => {
        const dunkPoints = 50 + (combo * 10);
        setScore(prev => prev + dunkPoints);
        setCombo(prev => prev + 3);
        setGameState('ready');
        setPlayerPosition({ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT * 0.8 });
        setBallPosition({ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT * 0.75 });
      }, 1300);
    } else {
      handleShoot();
    }
  };

  const handleLayup = () => {
    if (gameState === 'dunking' || gameState === 'layup' || gameState === 'shooting') return;
    
    if (nearHoop) {
      setGameState('layup');
      
      // Move ball to hoop position
      const hoopX = nearHoop === 'left' ? SCREEN_WIDTH * 0.085 : SCREEN_WIDTH * 0.915;
      setBallPosition({ x: hoopX, y: SCREEN_HEIGHT * 0.22 });
      
      setTimeout(() => {
        const layupPoints = 30 + (combo * 5);
        setScore(prev => prev + layupPoints);
        setCombo(prev => prev + 2);
        setGameState('ready');
        setPlayerPosition({ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT * 0.8 });
        setBallPosition({ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT * 0.75 });
      }, 800);
    } else {
      handleShoot();
    }
  };

  const handleShoot = () => {
    if (gameState === 'dunking' || gameState === 'layup' || gameState === 'shooting') return;
    
    setGameState('shooting');
    
    // Determine closest hoop
    const leftHoopX = SCREEN_WIDTH * 0.085;
    const rightHoopX = SCREEN_WIDTH * 0.915;
    const distanceToLeft = Math.abs(playerPosition.x - leftHoopX);
    const distanceToRight = Math.abs(playerPosition.x - rightHoopX);
    const targetHoop = distanceToLeft < distanceToRight ? 'left' : 'right';
    const hoopX = targetHoop === 'left' ? leftHoopX : rightHoopX;
    
    // Calculate shooting accuracy
    const distance = Math.min(distanceToLeft, distanceToRight);
    const baseAccuracy = Math.max(0.5, 1 - (distance / (SCREEN_WIDTH * 0.7)));
    const comboBonus = Math.min(0.2, combo * 0.03);
    const finalAccuracy = Math.min(0.85, baseAccuracy + comboBonus);
    const isSuccessful = Math.random() < finalAccuracy;
    
    // Animate ball to hoop
    setBallPosition({ x: hoopX, y: SCREEN_HEIGHT * 0.22 });
    
    setTimeout(() => {
      if (isSuccessful) {
        const isThreePointer = distance > SCREEN_WIDTH * 0.4;
        const shootPoints = isThreePointer ? 30 + (combo * 8) : 20 + (combo * 5);
        setScore(prev => prev + shootPoints);
        setCombo(prev => prev + (isThreePointer ? 2 : 1));
        setPlayerPosition({ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT * 0.8 });
        setBallPosition({ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT * 0.75 });
      } else {
        setCombo(0);
        setBallPosition({ x: playerPosition.x, y: playerPosition.y - 20 });
      }
      setGameState('ready');
    }, 1000);
  };

  // Reset combo after inactivity
  useEffect(() => {
    let comboTimer;
    if (gameState === 'ready' && combo > 0) {
      comboTimer = setTimeout(() => {
        setCombo(0);
      }, 8000);
    }
    return () => clearTimeout(comboTimer);
  }, [gameState, combo]);

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F3FF',
  },
});

export default GameScreen;