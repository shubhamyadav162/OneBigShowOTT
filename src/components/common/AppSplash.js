import React, { useEffect, useState } from 'react';
import { StyleSheet, StatusBar, View, Image, Text, ActivityIndicator } from 'react-native';
import { hideAsync } from 'expo-splash-screen';

const AppSplash = ({ onPlaybackStatusUpdate }) => {
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadSplash = async () => {
      try {
        // Wait 500ms before hiding native splash
        await new Promise(resolve => setTimeout(resolve, 500));
        
        try {
          // Try to hide the native splash screen
          await hideAsync();
        } catch (e) {
          console.log('Non-critical error hiding native splash:', e);
          // Continue even if there's an error hiding the splash
        }
        
        // Simulate additional loading time (reduced to 1.5 seconds)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Complete the splash screen transition
        onPlaybackStatusUpdate({ didJustFinish: true });
      } catch (error) {
        console.error('Splash screen error:', error);
        setError('Error initializing app');
        
        // Allow a brief moment to show the error then continue
        setTimeout(() => {
          onPlaybackStatusUpdate({ didJustFinish: true });
        }, 1500);
      }
    };
    
    loadSplash();
    
    // Add a safety timeout to ensure splash screen doesn't get stuck
    const safetyTimeout = setTimeout(() => {
      console.log('Safety timeout triggered for splash screen');
      onPlaybackStatusUpdate({ didJustFinish: true });
    }, 4000);
    
    return () => clearTimeout(safetyTimeout);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Use try-catch in the render to prevent errors from crashing the app */}
      {(() => {
        try {
          return (
            <Image 
              source={require('../../../assets/logo_main.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          );
        } catch (e) {
          console.error('Error rendering splash image:', e);
          return (
            <View style={styles.fallbackContainer}>
              <Text style={styles.appName}>Big Show</Text>
            </View>
          );
        }
      })()}
      
      <ActivityIndicator 
        size="large" 
        color="#FFFFFF" 
        style={styles.loader}
      />
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '80%',
    height: '50%',
  },
  fallbackContainer: {
    width: '80%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: '#FF6B6B',
    marginTop: 20,
    fontSize: 16,
  },
});

export default AppSplash; 