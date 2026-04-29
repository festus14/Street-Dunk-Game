import './src/webSetup';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import GameScreen from './src/screens/GameScreen';

const isWeb = Platform.OS === 'web';

const App = () => {
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    if (!isWeb) return;
    document.documentElement.style.cssText =
      'margin:0;padding:0;height:100%;background:#000;overflow:hidden';
    document.body.style.cssText =
      'margin:0;padding:0;height:100%;background:#000;overflow:hidden';
  }, []);

  if (isWeb) {
    return (
      <View style={webStyles.outer}>
        <View style={[webStyles.gameBox, { width, height }]}>
          <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
              <GameScreen />
            </SafeAreaView>
          </SafeAreaProvider>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <GameScreen />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
});

const webStyles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameBox: {
    overflow: 'hidden',
    backgroundColor: '#1a1a2e',
  },
});

export default App;
