import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Rect, Circle, Line, Path, Defs, LinearGradient, Stop, Ellipse } from 'react-native-svg';

const Court = () => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  return (
    <View style={styles.container}>
      <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT} style={styles.court}>
        <Defs>
          {/* Sky gradient - light blue/white like reference */}
          <LinearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#E6F3FF" />
            <Stop offset="100%" stopColor="#B8D4F0" />
          </LinearGradient>
          
          {/* Court floor gradient - bright orange like reference */}
          <LinearGradient id="courtGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FF8C42" />
            <Stop offset="100%" stopColor="#FF7A28" />
          </LinearGradient>
          
          {/* Court border - purple/brown like reference */}
          <LinearGradient id="borderGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#8B4B9C" />
            <Stop offset="100%" stopColor="#6B3A7C" />
          </LinearGradient>
          
          {/* Hoop pole gradient */}
          <LinearGradient id="poleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#4A4A4A" />
            <Stop offset="50%" stopColor="#6A6A6A" />
            <Stop offset="100%" stopColor="#4A4A4A" />
          </LinearGradient>
        </Defs>
        
        {/* Sky background */}
        <Rect 
          width={SCREEN_WIDTH} 
          height={SCREEN_HEIGHT * 0.45} 
          fill="url(#skyGradient)"
        />
        
        {/* Court border/wall - purple like reference */}
        <Rect 
          x={0}
          y={SCREEN_HEIGHT * 0.45} 
          width={SCREEN_WIDTH} 
          height={SCREEN_HEIGHT * 0.08} 
          fill="url(#borderGradient)"
        />
        
        {/* Main court floor - bright orange like reference */}
        <Rect 
          x={SCREEN_WIDTH * 0.05}
          y={SCREEN_HEIGHT * 0.53} 
          width={SCREEN_WIDTH * 0.9} 
          height={SCREEN_HEIGHT * 0.42} 
          fill="url(#courtGradient)"
          stroke="#FFFFFF"
          strokeWidth={3}
        />
        
        {/* LEFT BASKETBALL HOOP SETUP - exactly like reference */}
        {/* Left hoop pole */}
        <Rect 
          x={SCREEN_WIDTH * 0.08} 
          y={SCREEN_HEIGHT * 0.15} 
          width={6} 
          height={SCREEN_HEIGHT * 0.38} 
          fill="url(#poleGradient)"
        />
        
        {/* Left backboard - red border, white inside like reference */}
        <Rect 
          x={SCREEN_WIDTH * 0.05} 
          y={SCREEN_HEIGHT * 0.15} 
          width={15} 
          height={45} 
          fill="#FFFFFF"
          stroke="#E74C3C"
          strokeWidth={3}
        />
        
        {/* Left backboard inner square - blue like reference */}
        <Rect 
          x={SCREEN_WIDTH * 0.052} 
          y={SCREEN_HEIGHT * 0.17} 
          width={11} 
          height={20} 
          fill="none"
          stroke="#3498DB"
          strokeWidth={2}
        />
        
        {/* Left hoop rim - red like reference */}
        <Ellipse 
          cx={SCREEN_WIDTH * 0.085} 
          cy={SCREEN_HEIGHT * 0.22} 
          rx={18} 
          ry={3} 
          fill="none" 
          stroke="#E74C3C" 
          strokeWidth={4}
        />
        
        {/* Left hoop net */}
        {Array.from({ length: 8 }, (_, i) => {
          const x = SCREEN_WIDTH * 0.07 + (i * 3);
          return (
            <Line 
              key={`left-net-${i}`}
              x1={x} 
              y1={SCREEN_HEIGHT * 0.22} 
              x2={x + 1} 
              y2={SCREEN_HEIGHT * 0.22 + 12} 
              stroke="#FFFFFF" 
              strokeWidth={1.5}
              opacity={0.9}
            />
          );
        })}
        
        {/* RIGHT BASKETBALL HOOP SETUP - mirror of left */}
        {/* Right hoop pole */}
        <Rect 
          x={SCREEN_WIDTH * 0.915} 
          y={SCREEN_HEIGHT * 0.15} 
          width={6} 
          height={SCREEN_HEIGHT * 0.38} 
          fill="url(#poleGradient)"
        />
        
        {/* Right backboard */}
        <Rect 
          x={SCREEN_WIDTH * 0.93} 
          y={SCREEN_HEIGHT * 0.15} 
          width={15} 
          height={45} 
          fill="#FFFFFF"
          stroke="#E74C3C"
          strokeWidth={3}
        />
        
        {/* Right backboard inner square */}
        <Rect 
          x={SCREEN_WIDTH * 0.937} 
          y={SCREEN_HEIGHT * 0.17} 
          width={11} 
          height={20} 
          fill="none"
          stroke="#3498DB"
          strokeWidth={2}
        />
        
        {/* Right hoop rim */}
        <Ellipse 
          cx={SCREEN_WIDTH * 0.915} 
          cy={SCREEN_HEIGHT * 0.22} 
          rx={18} 
          ry={3} 
          fill="none" 
          stroke="#E74C3C" 
          strokeWidth={4}
        />
        
        {/* Right hoop net */}
        {Array.from({ length: 8 }, (_, i) => {
          const x = SCREEN_WIDTH * 0.9 + (i * 3);
          return (
            <Line 
              key={`right-net-${i}`}
              x1={x} 
              y1={SCREEN_HEIGHT * 0.22} 
              x2={x + 1} 
              y2={SCREEN_HEIGHT * 0.22 + 12} 
              stroke="#FFFFFF" 
              strokeWidth={1.5}
              opacity={0.9}
            />
          );
        })}
        
        {/* Center court line */}
        <Line 
          x1={SCREEN_WIDTH / 2} 
          y1={SCREEN_HEIGHT * 0.53} 
          x2={SCREEN_WIDTH / 2} 
          y2={SCREEN_HEIGHT * 0.95} 
          stroke="#FFFFFF" 
          strokeWidth={3}
        />
        
        {/* Left three-point arc - like reference */}
        <Path 
          d={`M ${SCREEN_WIDTH * 0.05} ${SCREEN_HEIGHT * 0.53} 
              Q ${SCREEN_WIDTH * 0.22} ${SCREEN_HEIGHT * 0.7} 
              ${SCREEN_WIDTH * 0.05} ${SCREEN_HEIGHT * 0.95}`}
          fill="none" 
          stroke="#FFFFFF" 
          strokeWidth={3}
        />
        
        {/* Right three-point arc */}
        <Path 
          d={`M ${SCREEN_WIDTH * 0.95} ${SCREEN_HEIGHT * 0.53} 
              Q ${SCREEN_WIDTH * 0.78} ${SCREEN_HEIGHT * 0.7} 
              ${SCREEN_WIDTH * 0.95} ${SCREEN_HEIGHT * 0.95}`}
          fill="none" 
          stroke="#FFFFFF" 
          strokeWidth={3}
        />
        
        {/* Left free throw circle */}
        <Circle 
          cx={SCREEN_WIDTH * 0.18} 
          cy={SCREEN_HEIGHT * 0.74} 
          r={25} 
          fill="none" 
          stroke="#FFFFFF" 
          strokeWidth={3}
        />
        
        {/* Right free throw circle */}
        <Circle 
          cx={SCREEN_WIDTH * 0.82} 
          cy={SCREEN_HEIGHT * 0.74} 
          r={25} 
          fill="none" 
          stroke="#FFFFFF" 
          strokeWidth={3}
        />
        
        {/* Center court circle */}
        <Circle 
          cx={SCREEN_WIDTH / 2} 
          cy={SCREEN_HEIGHT * 0.74} 
          r={35} 
          fill="none" 
          stroke="#FFFFFF" 
          strokeWidth={3}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  court: {
    position: 'absolute',
  },
});

export default Court;