import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../theme';

const NotificationScreen = ({ navigation }) => {
  const handleBack = () => navigation.goBack();

  // Dummy notifications list
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Welcome to BigShow', message: 'Thank you for joining! Explore our latest content & series.', date: '2025-04-17T10:00:00Z' },
    { id: '2', title: 'New Feature Released', message: 'We have added video downloads! Check it out in content details.', date: '2025-04-20T08:20:00Z' },
    { id: '3', title: 'Payment Successful', message: 'Your payment for ₹499 was successful. Enjoy uninterrupted streaming.', date: '2025-05-01T15:45:00Z' },
    { id: '4', title: 'Subscription Expiring', message: 'Your 3 Month Plan expires on 2025-06-01. Renew to continue.', date: '2025-05-10T09:00:00Z' },
    { id: '5', title: 'New Episode Available', message: 'Episode 5 of "Mystery Tales" is now live. Watch now!', date: '2025-05-17T12:34:00Z' },
  ]);

  // Clear all notifications
  const clearAll = () => setNotifications([]);

  // Render notification item
  const renderNotification = ({ item }) => (
    <View style={styles.notificationCard}>
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <Text style={styles.notificationDate}>{new Date(item.date).toLocaleString()}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
          <Ionicons name="trash-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You're all caught up!</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.medium,
    height: 60,
  },
  backButton: {
    padding: theme.spacing.small,
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
  },
  clearButton: {
    padding: theme.spacing.small,
  },
  listContainer: {
    padding: theme.spacing.medium,
  },
  notificationCard: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
  },
  notificationTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.medium,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.small,
  },
  notificationMessage: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.regular,
    marginBottom: theme.spacing.small,
  },
  notificationDate: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.small,
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.medium,
  },
});

export default NotificationScreen; 