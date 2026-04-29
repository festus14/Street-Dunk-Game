import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, useWindowDimensions } from 'react-native';
import Svg, { Circle, Path, Defs, RadialGradient, Stop } from 'react-native-svg';

const Ball = ({ position, gameState }) => {
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  const ballAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shadowAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (gameState === 'dribbling') {
      // Enhanced dribbling with realistic physics
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(bounceAnim, {
              toValue: -20,
              duration: 180,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 0.85,
              duration: 90,
              useNativeDriver: true,
            }),
            Animated.timing(shadowAnim, {
              toValue: 0.5,
              duration: 180,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(bounceAnim, {
              toValue: 0,
              duration: 180,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1.15,
              duration: 90,
              useNativeDriver: true,
            }),
            Animated.timing(shadowAnim, {
              toValue: 1.2,
              duration: 180,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 90,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Continuous spin while dribbling
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 360,
          duration: 500,
          useNativeDriver: true,
        })
      ).start();
    } else if (gameState === 'dunking') {
      // Epic dunk trajectory with power effects
      const hoopY = SCREEN_HEIGHT * 0.2;
      
      // Power glow effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      Animated.sequence([
        // High arc to hoop with spin
        Animated.parallel([
          Animated.timing(ballAnim, {
            toValue: { 
              x: 0,
              y: hoopY - position.y - 30
            },
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.4,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        // Slam through hoop
        Animated.parallel([
          Animated.timing(ballAnim, {
            toValue: { 
              x: 0,
              y: hoopY - position.y + 15
            },
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        // Reset
        Animated.timing(ballAnim, {
          toValue: { x: 0, y: 0 },
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Intense spin during dunk
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 360,
          duration: 80,
          useNativeDriver: true,
        })
      ).start();

      // Reset effects after dunk
      setTimeout(() => {
        spinAnim.setValue(0);
        glowAnim.setValue(0);
      }, 1300);
    } else if (gameState === 'layup') {
      // Smooth layup trajectory
      const hoopY = SCREEN_HEIGHT * 0.2;
      
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ballAnim, {
            toValue: { 
              x: 0,
              y: hoopY - position.y - 15
            },
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(ballAnim, {
            toValue: { 
              x: 0,
              y: hoopY - position.y + 8
            },
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        // Reset
        Animated.timing(ballAnim, {
          toValue: { x: 0, y: 0 },
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Moderate spin for layup
      Animated.timing(spinAnim, {
        toValue: 180,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        spinAnim.setValue(0);
      });
    } else if (gameState === 'shooting') {
      // Shooting trajectory with arc
      const hoopY = SCREEN_HEIGHT * 0.2;
      
      Animated.sequence([
        // High arc shot
        Animated.parallel([
          Animated.timing(ballAnim, {
            toValue: { 
              x: 0,
              y: hoopY - position.y - 40
            },
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.3,
            duration: 450,
            useNativeDriver: true,
          }),
        ]),
        // Drop to hoop
        Animated.parallel([
          Animated.timing(ballAnim, {
            toValue: { 
              x: 0,
              y: hoopY - position.y + 10
            },
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
        // Reset
        Animated.timing(ballAnim, {
          toValue: { x: 0, y: 0 },
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Perfect shooting spin
      Animated.timing(spinAnim, {
        toValue: 360,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        spinAnim.setValue(0);
      });
    }
  }, [gameState]);

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          left: position.x - 15,
          top: position.y - 15,
          transform: [
            { translateX: ballAnim.x },
            { translateY: Animated.add(ballAnim.y, bounceAnim) },
            { rotate: spinAnim.interpolate({
              inputRange: [0, 360],
              outputRange: ['0deg', '360deg']
            })},
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      {/* Ball shadow */}
      <Animated.View 
        style={[
          styles.shadow,
          {
            opacity: shadowAnim,
            transform: [
              { scaleX: scaleAnim },
              { scaleY: shadowAnim.interpolate({
                inputRange: [0.5, 1.2],
                outputRange: [1.5, 1]
              })}
            ]
          }
        ]}
      />
      
      {/* Power glow effect for dunks */}
      {gameState === 'dunking' && (
        <Animated.View 
          style={[
            styles.glow,
            {
              opacity: glowAnim,
            }
          ]}
        />
      )}
      
      <Svg width={30} height={30}>
        <Defs>
          {/* Enhanced basketball gradient */}
          <RadialGradient id="ballGradient" cx="30%" cy="30%">
            <Stop offset="0%" stopColor="#F39C12" />
            <Stop offset="40%" stopColor="#E67E22" />
            <Stop offset="80%" stopColor="#D35400" />
            <Stop offset="100%" stopColor="#A0522D" />
          </RadialGradient>
        </Defs>
        
        {/* Basketball sphere */}
        <Circle 
          cx={15} 
          cy={15} 
          r={12} 
          fill="url(#ballGradient)"
          stroke="#A0522D"
          strokeWidth={1.5}
        />
        
        {/* Basketball seam lines */}
        <Path 
          d="M 3 15 Q 15 5 27 15 Q 15 25 3 15"
          stroke="#A0522D" 
          strokeWidth={2}
          fill="none"
        />
        <Path 
          d="M 15 3 Q 5 15 15 27 Q 25 15 15 3"
          stroke="#A0522D" 
          strokeWidth={2}
          fill="none"
        />
        
        {/* Enhanced highlight for 3D effect */}
        <Circle 
          cx={18} 
          cy={11} 
          r={3} 
          fill="#F1C40F"
          opacity={0.4}
        />
        <Circle 
          cx={19} 
          cy={10} 
          r={1.5} 
          fill="#FFFFFF"
          opacity={0.6}
        />
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1,
  },
  shadow: {
    position: 'absolute',
    bottom: -15,
    left: 5,
    width: 20,
    height: 5,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 10,
  },
  glow: {
    position: 'absolute',
    top: -5,
    left: -5,
    width: 40,
    height: 40,
    backgroundColor: '#F39C12',
    borderRadius: 20,
    opacity: 0.3,
  },
});

export default Ball;