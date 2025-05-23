import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import contentApi from '../../api/contentApi';
import theme from '../../theme';

const ContentDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { contentId } = route.params;
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const response = await contentApi.getContentDetails(contentId);
      if (response.success) {
        setContent(response.data);
      } else {
        setError(response.error);
      }
      setLoading(false);
    };
    fetchDetails();
  }, [contentId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {content.imageUrl && <Image source={{ uri: content.imageUrl }} style={styles.image} />}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{content.title}</Text>
        <Text style={styles.description}>{content.description}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('VideoPlayer', { source: 'https://shorturl.at/WP2Vj', title: content.title })
          }
        >
          <Text style={styles.buttonText}>Watch Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 200,
  },
  detailsContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ContentDetailsScreen; 