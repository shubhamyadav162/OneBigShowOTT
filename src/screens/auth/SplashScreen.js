import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../../theme';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Navigate to Welcome screen after 2.5 seconds
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient
      colors={['rgba(138,43,226,0.4)', 'rgba(0,0,0,0.8)']}
      start={{ x: 0.5, y: 0.5 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Big Show</Text>
        <Text style={styles.tagline}>Your ultimate streaming experience</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.colors.accent,
    letterSpacing: 1.2,
  },
  tagline: {
    marginTop: 12,
    fontSize: 16,
    color: theme.colors.textSecondary,
    opacity: 0.8,
  },
});

export default SplashScreen; 