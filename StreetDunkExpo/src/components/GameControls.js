import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const GameControls = ({
  onMoveLeft, 
  onMoveRight, 
  onDunk, 
  onLayup, 
  onShoot, 
  gameState, 
  isMoving, 
  stopMovement, 
  nearHoop 
}) => {
  
  const handleDunkPress = () => {
    if (nearHoop) {
      onDunk();
    } else {
      onShoot();
    }
  };

  const handleDunkLongPress = () => {
    if (nearHoop) {
      onLayup();
    } else {
      onShoot();
    }
  };

  return (
    <View style={styles.container}>
      {/* Left side - Movement controls */}
      <View style={styles.leftControls}>
        <TouchableOpacity 
          style={[
            styles.moveButton,
            isMoving === 'left' && styles.activeButton
          ]}
          onPressIn={onMoveLeft}
          onPressOut={stopMovement}
        >
          <Text style={styles.moveButtonText}>◀</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.moveButton,
            isMoving === 'right' && styles.activeButton
          ]}
          onPressIn={onMoveRight}
          onPressOut={stopMovement}
        >
          <Text style={styles.moveButtonText}>▶</Text>
        </TouchableOpacity>
      </View>
      
      {/* Right side - Action control (up arrow) */}
      <View style={styles.rightControls}>
        <TouchableOpacity 
          style={[
            styles.actionButton,
            (gameState === 'dunking' || gameState === 'layup' || gameState === 'shooting') && styles.actionActive
          ]}
          onPress={handleDunkPress}
          onLongPress={handleDunkLongPress}
          delayLongPress={500}
        >
          <Text style={styles.actionButtonText}>▲</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    zIndex: 3,
  },
  leftControls: {
    flexDirection: 'row',
    gap: 15,
  },
  rightControls: {
    alignItems: 'center',
  },
  moveButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#3498DB',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  actionButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E74C3C',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  activeButton: {
    backgroundColor: '#27AE60',
    transform: [{ scale: 1.1 }],
  },
  actionActive: {
    backgroundColor: '#C0392B',
    transform: [{ scale: 1.05 }],
  },
  moveButtonText: {
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  actionButtonText: {
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});

export default GameControls;