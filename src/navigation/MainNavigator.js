import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet, Text, Image } from 'react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from '../screens/main/HomeScreen';
import SearchScreen from '../screens/main/SearchScreen';
import ProfileScreen from '../screens/main/ProfileScreenNew';
import WebSeriesScreen from '../screens/main/WebSeriesScreen';
import WebSeriesDetailScreen from '../screens/main/WebSeriesDetailScreen';
import UpcomingScreen from '../screens/main/UpcomingScreen';

// Import content screens
import ContentDetailsScreen from '../screens/content/ContentDetailsScreen';
import VideoPlayerScreen from '../screens/content/VideoPlayerScreen';
import EpisodesScreen from '../screens/content/EpisodesScreen';
import CastCrewScreen from '../screens/content/CastCrewScreen';

// Import profile screens
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import SubscriptionScreen from '../screens/profile/SubscriptionScreen';
import PaymentMethodScreen from '../screens/profile/PaymentMethodScreen';
import PaymentHistoryScreen from '../screens/profile/PaymentHistoryScreen';
import ManageDevicesScreen from '../screens/profile/ManageDevicesScreen';
import WatchlistScreen from '../screens/profile/WatchlistScreen';
import NotificationScreen from '../screens/profile/NotificationScreen';
import HelpCenterScreen from '../screens/profile/HelpCenterScreen';
import PrivacyPolicyScreen from '../screens/profile/PrivacyPolicyScreen';
import RefundPolicyScreen from '../screens/profile/RefundPolicyScreen';
import TermsAndConditionsScreen from '../screens/profile/TermsAndConditionsScreen';

// Import theme
import theme from '../theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Stack
const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="ContentDetails" component={ContentDetailsScreen} />
      <Stack.Screen 
        name="VideoPlayer" 
        component={VideoPlayerScreen} 
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen name="Episodes" component={EpisodesScreen} />
      <Stack.Screen name="CastCrew" component={CastCrewScreen} />
    </Stack.Navigator>
  );
};

// Upcoming Stack
const UpcomingStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="UpcomingMain" component={UpcomingScreen} />
      <Stack.Screen name="WebSeriesDetail" component={WebSeriesDetailScreen} options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="Episodes" component={EpisodesScreen} />
      <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CastCrew" component={CastCrewScreen} />
    </Stack.Navigator>
  );
};

// Web Series Stack
const WebSeriesStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="WebSeriesMain" component={WebSeriesScreen} />
      <Stack.Screen name="WebSeriesDetail" component={WebSeriesDetailScreen} options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="Episodes" component={EpisodesScreen} />
      <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CastCrew" component={CastCrewScreen} />
    </Stack.Navigator>
  );
};

// Profile Stack
const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Subscription" component={SubscriptionScreen} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
      <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />
      <Stack.Screen name="ManageDevices" component={ManageDevicesScreen} />
      <Stack.Screen name="Watchlist" component={WatchlistScreen} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="RefundPolicy" component={RefundPolicyScreen} />
      <Stack.Screen name="TermsConditions" component={TermsAndConditionsScreen} />
    </Stack.Navigator>
  );
};

// Helper to hide tab bar on VideoPlayer screen
const getTabBarVisibility = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? '';
  return routeName === 'VideoPlayer' ? 'none' : 'flex';
};

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#E50914',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          display: getTabBarVisibility(route),
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.background,
          paddingTop: 5,
          height: 60,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Upcoming') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'WebSeries') {
            iconName = focused ? 'tv' : 'tv-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Upcoming" component={UpcomingStack} />
      <Tab.Screen name="WebSeries" component={WebSeriesStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 40,
  },
  focusedIconContainer: {
    transform: [{ scale: 1.1 }],
  },
  iconText: {
    color: theme.colors.primary,
    fontSize: 10,
    marginTop: 2,
  },
  focusedText: {
    color: '#FFFFFF',
  },
  
  // Home icon
  homeIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  houseBody: {
    width: 16,
    height: 12,
    backgroundColor: '#E50914',
    borderRadius: 2,
    position: 'absolute',
    bottom: 2,
  },
  houseRoof: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderLeftColor: 'transparent',
    borderRightWidth: 12,
    borderRightColor: 'transparent',
    borderBottomWidth: 12,
    borderBottomColor: '#E50914',
    position: 'absolute',
    top: 0,
  },
  
  // Calendar icon
  calendarIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
  },
  calendarTop: {
    width: 16,
    height: 4,
    backgroundColor: '#E50914',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  calendarBody: {
    width: 16,
    height: 16,
    backgroundColor: '#E50914',
    borderRadius: 2,
  },
  
  // TV icon
  tvIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
  },
  tvScreen: {
    width: 18,
    height: 14,
    backgroundColor: '#E50914',
    borderRadius: 3,
  },
  tvStand: {
    width: 8,
    height: 6,
    backgroundColor: '#E50914',
    marginTop: 1,
  },
  
  // Profile icon
  profileIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
  },
  profileHead: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E50914',
  },
  profileBody: {
    width: 18,
    height: 10,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    backgroundColor: '#E50914',
    marginTop: 2,
  },
});

export default MainNavigator; 