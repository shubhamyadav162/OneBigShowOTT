/* eslint-disable react/jsx-no-duplicate-props */
import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  StatusBar,
  Platform,
  PanResponder,
  useWindowDimensions,
} from 'react-native';
import { Video } from 'expo-av';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as Brightness from 'expo-brightness';
import Slider from '@react-native-community/slider';

// Import API services
import contentApi from '../../api/contentApi';
import analyticsApi from '../../api/analyticsApi';
import { auth } from '../../lib/firebaseClient';

// Import theme
import theme from '../../theme';

const VideoPlayerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { contentId, episodeId, title, continueWatching, source } = route.params || {};
  
  // use dynamic dimensions for proper overlay positioning
  const { width, height } = useWindowDimensions();
  
  // Video player state
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isBuffering, setIsBuffering] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoTitle, setVideoTitle] = useState(title || '');
  const [videoError, setVideoError] = useState(null);
  
  // Control the visibility of controls with timeout
  const controlsTimeoutRef = useRef(null);
  
  // Brightness and volume adjustment state and refs
  const [internalBrightness, setInternalBrightness] = useState(1);
  const [internalVolume, setInternalVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [muted, setMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [showBrightnessOverlay, setShowBrightnessOverlay] = useState(false);
  const [showVolumeOverlay, setShowVolumeOverlay] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const overlayTimeoutRef = useRef(null);
  const startBrightnessRef = useRef(internalBrightness);
  const startVolumeRef = useRef(internalVolume);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  // Overlay height for brightness/volume
  const OVERLAY_HEIGHT = 200;
  
  // Gesture handler for taps (to toggle controls) and vertical swipes (brightness/volume)
  const panResponder = PanResponder.create({
    // Only activate gestures when controls are hidden
    onStartShouldSetPanResponder: () => !showControls,
    onPanResponderGrant: (evt, gestureState) => {
      // Record start positions and brightness/volume
      startXRef.current = gestureState.x0;
      startYRef.current = gestureState.y0;
      startBrightnessRef.current = internalBrightness;
      startVolumeRef.current = internalVolume;
    },
    onPanResponderMove: (evt, gestureState) => {
      const { dx, dy } = gestureState;
      // Only consider vertical movement beyond small threshold
      if (Math.abs(dy) < 10 || Math.abs(dy) < Math.abs(dx)) return;
      // Show overlay for brightness or volume
      if (startXRef.current < width / 2) {
        setShowBrightnessOverlay(true);
        setShowVolumeOverlay(false);
      } else {
        setShowVolumeOverlay(true);
        setShowBrightnessOverlay(false);
      }
      if (overlayTimeoutRef.current) clearTimeout(overlayTimeoutRef.current);
      const change = -dy / height;
      if (startXRef.current < width / 2) {
        let newBrightness = startBrightnessRef.current + change;
        newBrightness = Math.max(0, Math.min(1, newBrightness));
        setInternalBrightness(newBrightness);
        Brightness.setBrightnessAsync(newBrightness).catch(() => {});
      } else {
        let newVolume = startVolumeRef.current + change;
        newVolume = Math.max(0, Math.min(1, newVolume));
        setInternalVolume(newVolume);
        if (videoRef.current) videoRef.current.setVolumeAsync(newVolume);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      const dx = gestureState.moveX - startXRef.current;
      const dy = gestureState.moveY - startYRef.current;
      // Small tap toggles controls
      if (Math.hypot(dx, dy) < 10) handleVideoPress();
      // Hide any overlays after delay
      overlayTimeoutRef.current = setTimeout(() => {
        setShowBrightnessOverlay(false);
        setShowVolumeOverlay(false);
      }, 1000);
    },
  });
  
  // Load video details
  useEffect(() => {
    const loadVideoDetails = async () => {
      try {
        let response;
        
        // If episode ID is provided, fetch episode details
        if (episodeId) {
          response = await contentApi.getEpisodeDetails(contentId, episodeId);
          if (response.success) {
            setVideoUrl(response.data.videoUrl);
            setVideoTitle(response.data.title);
            analyticsApi.logEvent('video_view', { userId: auth.currentUser?.uid, contentId: contentId, secondsWatched: 0 });
          }
        } 
        // Otherwise, fetch content details
        else {
          response = await contentApi.getContentDetails(contentId);
          if (response.success) {
            setVideoUrl(response.data.videoUrl);
            setVideoTitle(response.data.title);
            analyticsApi.logEvent('video_view', { userId: auth.currentUser?.uid, contentId: contentId, secondsWatched: 0 });
          }
        }
        
        if (!response.success) {
          setVideoError('Failed to load video. Please try again.');
        }
      } catch (error) {
        console.error('Error loading video:', error);
        setVideoError('Failed to load video. Please try again.');
      }
    };
    
    // If a source param is provided, use it directly
    if (source) {
      setVideoUrl(source);
      setVideoTitle(title || '');
      setIsBuffering(false);
      analyticsApi.logEvent('video_view', { userId: auth.currentUser?.uid, contentId: contentId, secondsWatched: 0 });
    } else {
      loadVideoDetails();
    }
    
    // Lock screen to landscape
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    };
    lockOrientation();
    
    // Request brightness permission and set initial brightness
    (async () => {
      const { status } = await Brightness.requestPermissionsAsync();
      if (status === 'granted') {
        const current = await Brightness.getBrightnessAsync();
        setInternalBrightness(current);
        startBrightnessRef.current = current;
      }
    })();
    
    // Handle continue watching position
    if (continueWatching && continueWatching.position) {
      setCurrentTime(continueWatching.position);
    }
    
    // Clean up on unmount
    return () => {
      // Return to portrait orientation
      const unlockOrientation = async () => {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      };
      unlockOrientation();
      
      // Clear any timeouts
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [contentId, episodeId, continueWatching, source, title]);
  
  // Handle press on video to show/hide controls
  const handleVideoPress = () => {
    if (isLocked) return;
    setShowControls(!showControls);
    
    // Auto-hide controls after 5 seconds if showing
    if (!showControls) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 5000);
    }
  };
  
  // Handle play/pause
  const togglePlayPause = async () => {
    if (isPlaying) {
      analyticsApi.logEvent('watch_time', { userId: auth.currentUser?.uid, contentId: contentId, secondsWatched: currentTime });
    }
    setIsPlaying(prev => !prev);
  };
  
  // New functions: rewind 10s, fast-forward 10s, mute toggle, speed toggle
  const handleRewind = async () => {
    if (videoRef.current) {
      const newTime = Math.max(0, currentTime - 10);
      await videoRef.current.setPositionAsync(newTime * 1000);
      setCurrentTime(newTime);
    }
  };
  const handleFastForward = async () => {
    if (videoRef.current) {
      const newTime = Math.min(duration, currentTime + 10);
      await videoRef.current.setPositionAsync(newTime * 1000);
      setCurrentTime(newTime);
    }
  };
  const toggleMute = async () => {
    const newMuted = !muted;
    setMuted(newMuted);
    if (videoRef.current) {
      await videoRef.current.setIsMutedAsync(newMuted);
    }
  };
  const toggleSpeed = async () => {
    const rates = [0.5, 1, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    const newRate = rates[nextIndex];
    setPlaybackRate(newRate);
    if (videoRef.current) {
      await videoRef.current.setRateAsync(newRate, true);
    }
  };
  
  // Handle seek
  const handleSeek = async (value) => {
    if (videoRef.current) {
      await videoRef.current.setPositionAsync(value * 1000);
    }
    setCurrentTime(value);
  };
  
  // Handle video load
  const handleLoad = async (status) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis / 1000);
      setIsBuffering(false);

      // Resume from continue-watching position
      if (continueWatching && continueWatching.position) {
        await videoRef.current.setPositionAsync(continueWatching.position * 1000);
      }
    } else if (status.error) {
      console.error('Video loading error:', status.error);
      setVideoError(`Failed to load video: ${status.error}`);
    }
  };
  
  // Handle playback status update
  const handlePlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      setCurrentTime(status.positionMillis / 1000);
      setIsBuffering(status.isBuffering);
      
      // Handle video end
      if (status.didJustFinish && !status.isLooping) {
        analyticsApi.logEvent('video_complete', { userId: auth.currentUser?.uid, contentId: contentId, secondsWatched: Math.floor(status.durationMillis / 1000) });
        setTimeout(() => {
          navigation.goBack();
        }, 2000);
      }
    }
  };
  
  // Handle back
  const handleBack = () => {
    navigation.goBack();
  };
  
  // Format time for display (converts seconds to MM:SS format)
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // New functions: loop toggle and Picture-in-Picture
  const toggleLoop = async () => {
    const newLoop = !isLooping;
    setIsLooping(newLoop);
    if (videoRef.current) {
      await videoRef.current.setIsLoopingAsync(newLoop);
    }
  };
  const handlePictureInPicture = async () => {
    if (videoRef.current && videoRef.current.presentPictureInPictureAsync) {
      await videoRef.current.presentPictureInPictureAsync();
    }
  };
  
  // Handle screen lock/unlock
  const toggleLock = () => {
    setIsLocked(prevLocked => {
      const newLocked = !prevLocked;
      setShowControls(!newLocked);
      return newLocked;
    });
  };
  
  // Show error state
  if (videoError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{videoError}</Text>
        <TouchableOpacity style={styles.errorButton} onPress={handleBack}>
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Show loading state if no video URL yet
  if (!videoUrl) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Video Player */}
      <View style={styles.videoContainer} {...panResponder.panHandlers}>
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={styles.video}
          resizeMode="contain"
          shouldPlay={isPlaying}
          rate={playbackRate}
          isMuted={muted}
          isLooping={isLooping}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          onLoad={handleLoad}
          onError={({ error }) => setVideoError(`Failed to load video: ${error}`)}
          volume={internalVolume}
        />
        {/* Brightness dim overlay */}
        <View style={[styles.brightnessOverlay, { opacity: 1 - internalBrightness }]} pointerEvents="none" />
        {/* Custom brightness and volume indicators */}
        {showBrightnessOverlay && (
          <View style={[
            styles.customOverlay,
            { left: 20, top: '50%', marginTop: -OVERLAY_HEIGHT/2, height: OVERLAY_HEIGHT, width: 60 }
          ]}>
            <Icon name="brightness-medium" size={30} color="#FFF" />
            <Slider
              style={styles.verticalSlider}
              value={internalBrightness}
              step={0.01}
              minimumValue={0}
              maximumValue={1}
              onValueChange={(value) => {
                setInternalBrightness(value);
                Brightness.setBrightnessAsync(value).catch(() => {});
              }}
              onSlidingComplete={(value) => {
                let finalVal = value < 0.02 ? 0 : value > 0.98 ? 1 : parseFloat(value.toFixed(2));
                setInternalBrightness(finalVal);
                Brightness.setBrightnessAsync(finalVal).catch(() => {});
              }}
              minimumTrackTintColor="#FFF"
              maximumTrackTintColor="rgba(255,255,255,0.3)"
              thumbTintColor="#FFF"
            />
          </View>
        )}
        {showVolumeOverlay && (
          <View style={[
            styles.customOverlay,
            { right: 20, top: '50%', marginTop: -OVERLAY_HEIGHT/2, height: OVERLAY_HEIGHT, width: 60 }
          ]}>
            <Icon name={internalVolume === 0 ? 'volume-off' : internalVolume < 0.5 ? 'volume-down' : 'volume-up'} size={30} color="#FFF" />
            <Slider
              style={styles.verticalSlider}
              value={internalVolume}
              step={0.01}
              minimumValue={0}
              maximumValue={1}
              onValueChange={(value) => {
                setInternalVolume(value);
                if (videoRef.current) {
                  videoRef.current.setVolumeAsync(value);
                }
              }}
              onSlidingComplete={(value) => {
                let finalVal = value < 0.02 ? 0 : value > 0.98 ? 1 : parseFloat(value.toFixed(2));
                setInternalVolume(finalVal);
                if (videoRef.current) {
                  videoRef.current.setVolumeAsync(finalVal);
                }
              }}
              minimumTrackTintColor="#FFF"
              maximumTrackTintColor="rgba(255,255,255,0.3)"
              thumbTintColor="#FFF"
            />
          </View>
        )}
        {/* Buffering Indicator */}
        {isBuffering && (
          <View style={styles.bufferingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        )}
        {isLocked && (
          <View style={styles.unlockContainer}>
            <TouchableOpacity onPress={toggleLock}>
              <Icon name="lock-open" size={30} color="#FFF" />
            </TouchableOpacity>
          </View>
        )}
        
        {/* Video Controls */}
        {showControls && (
          <TouchableWithoutFeedback onPress={handleVideoPress}>
            <View style={styles.controlsContainer}>
              {/* Top Bar with Title and Back Button */}
              <View style={styles.topBar}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                  <Icon name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.videoTitle} numberOfLines={1}>
                  {videoTitle}
                </Text>
                <View style={styles.placeholder} />
              </View>
              
              {/* Center Controls: rewind, play/pause, fast-forward */}
              <View style={styles.centerControls}>
                <TouchableOpacity onPress={handleRewind}>
                  <Icon name="replay-10" size={36} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.playPauseButton}
                  onPress={togglePlayPause}
                >
                  <Icon
                    name={isPlaying ? 'pause' : 'play-arrow'}
                    size={48}
                    color="#FFF"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleFastForward}>
                  <Icon name="forward-10" size={36} color="#FFF" />
                </TouchableOpacity>
              </View>
              
              {/* Extra Controls: Lock, Mute, Speed, Loop */}
              <View style={styles.extraControls}>
                <TouchableOpacity onPress={toggleLock} style={{ marginRight: 12 }}>
                  <Icon name={isLocked ? 'lock' : 'lock-open'} size={24} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleMute} style={{ marginRight: 12 }}>
                  <Icon name={muted ? 'volume-off' : 'volume-up'} size={24} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleSpeed} style={{ marginRight: 12 }}>
                  <Text style={styles.speedText}>{playbackRate}x</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleLoop}>
                  <Icon name={isLooping ? 'repeat-one' : 'repeat'} size={24} color="#FFF" />
                </TouchableOpacity>
              </View>
              
              {/* Bottom Progress Bar */}
              <View style={styles.bottomBar}>
                <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                <Slider
                  style={styles.progressBar}
                  minimumValue={0}
                  maximumValue={duration}
                  value={currentTime}
                  onValueChange={handleSeek}
                  minimumTrackTintColor={theme.colors.primary}
                  maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                  thumbTintColor={theme.colors.primary}
                />
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  customOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
  },
  verticalSlider: {
    width: 200,
    height: 40,
    transform: [{ rotate: '-90deg' }],
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  controlsContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  videoTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  placeholder: {
    width: 40,
  },
  centerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  progressBar: {
    flex: 1,
    height: 40,
    marginHorizontal: 8,
  },
  timeText: {
    color: '#FFF',
    fontSize: 14,
  },
  bufferingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  errorText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  errorButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  errorButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  brightnessOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  extraControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  unlockContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  speedText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 12,
  },
});

export default VideoPlayerScreen; 