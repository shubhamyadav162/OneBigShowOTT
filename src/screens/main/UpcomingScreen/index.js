import React from 'react';
import { StyleSheet, FlatList, Image, Text, Animated, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import theme from '../../theme';

// Sample upcoming web series data
const upcomingSeries = [
  { id: '11', title: 'Rogue Agents', source: require('../../../assets/webimages/1061_64f6d09a0d2a0_360x540.jpg'), year: 2024, episodes: 8, rating: 0, description: 'Upcoming action-packed thriller.' },
  { id: '12', title: 'Parallel Worlds', source: require('../../../assets/webimages/1061_64f6d2f130b4c_360x540.jpg'), year: 2024, episodes: 10, rating: 0, description: 'A sci-fi journey through dimensions.' },
  { id: '13', title: 'Desert Storm', source: require('../../../assets/webimages/1061_64f6d4f999c10_360x540.jpg'), year: 2024, episodes: 6, rating: 0, description: 'A gripping story set in harsh landscapes.' },
  { id: '14', title: 'Neon Nights', source: require('../../../assets/webimages/1061_64f6d51dd6a64_360x540.jpg'), year: 2024, episodes: 12, rating: 0, description: 'A neon-soaked urban mystery.' },
  { id: '15', title: 'Dark Horizons', source: require('../../../assets/webimages/1061_64f6d581a1712_360x540.jpg'), year: 2024, episodes: 8, rating: 0, description: 'Secrets emerge in the dark.' },
];

const UpcomingScreen = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => {
    const scale = React.useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const onPressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start(() => {
        navigation.navigate('WebSeries', {
          screen: 'WebSeriesDetail',
          params: {
            source: item.source,
            id: item.id,
            title: item.title,
            year: item.year,
            episodes: item.episodes,
            rating: item.rating,
            description: item.description,
          },
        });
      });
    };

    return (
      <Animated.View style={[styles.cardContainer, { transform: [{ scale }] }]}>  
        <TouchableOpacity activeOpacity={1} onPressIn={onPressIn} onPressOut={onPressOut}>
          <Image source={item.source} style={styles.image} />
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.header}>Upcoming Web Series</Text>
      <FlatList
        data={upcomingSeries}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    margin: 0,
  },
  list: {
    paddingHorizontal: 0,
  },
  cardContainer: {
    marginBottom: theme.spacing.small,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  image: {
    width: '100%',
    height: 300,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  overlayText: {
    color: '#fff',
    fontSize: theme.typography.fontSize.medium,
    fontWeight: theme.typography.fontWeight.bold,
  },
});

export default UpcomingScreen; 