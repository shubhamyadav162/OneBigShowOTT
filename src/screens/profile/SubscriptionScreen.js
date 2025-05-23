import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import API services
import subscriptionApi from '../../api/subscriptionApi';

// Import theme
import theme from '../../theme';

// Add default subscription plans fallback
const defaultPlans = [
  {
    id: 'monthly',
    name: '1 Month Plan',
    price: 199,
    billingCycle: 'month',
    features: ['Unlimited access', 'HD streaming'],
  },
  {
    id: 'quarterly',
    name: '3 Month Plan',
    price: 499,
    billingCycle: '3 months',
    features: ['Everything in Monthly', 'Save 16%'],
  },
  {
    id: 'halfyearly',
    name: '6 Month Plan',
    price: 899,
    billingCycle: '6 months',
    features: ['Everything in Quarterly', 'Save 25%'],
  },
  {
    id: 'yearly',
    name: '1 Year Plan',
    price: 1499,
    billingCycle: '12 months',
    features: ['Everything in Half-Yearly', 'Save 37%'],
  },
];

const SubscriptionScreen = () => {
  const navigation = useNavigation();
  
  // State
  const [plans, setPlans] = useState(defaultPlans);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  // Load plans and current subscription
  useEffect(() => {
    // Immediately display default plans without waiting on API
    setPlans(defaultPlans);
    setIsLoading(false);
  }, []);
  
  // Handle plan selection
  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
  };
  
  // Handle continue to payment
  const handleContinue = () => {
    if (!selectedPlan) {
      Alert.alert('Select a Plan', 'Please select a subscription plan to continue.');
      return;
    }
    
    // If this is the current plan, no action needed
    if (currentPlan && currentPlan.planId === selectedPlan) {
      Alert.alert('Current Plan', 'You are already subscribed to this plan.');
      return;
    }
    
    // Navigate to payment screen with selected plan
    navigation.navigate('PaymentMethod', { planId: selectedPlan });
  };
  
  // Handle back button press
  const handleBack = () => {
    navigation.goBack();
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Icon name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Subscription Plans</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.replace('Subscription')}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription Plans</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Current Plan Info */}
        {currentPlan && (
          <View style={styles.currentPlanContainer}>
            <Text style={styles.currentPlanTitle}>Current Plan</Text>
            <Text style={styles.currentPlanName}>{currentPlan.name}</Text>
            <Text style={styles.currentPlanValidity}>
              {currentPlan.status === 'active'
                ? `Valid until ${new Date(currentPlan.expiresAt).toLocaleDateString()}`
                : 'Inactive'}
            </Text>
          </View>
        )}
        
        {/* Plans List */}
        <Text style={styles.sectionTitle}>Available Plans</Text>
        {plans?.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              selectedPlan === plan.id && styles.selectedPlanCard,
              currentPlan && currentPlan.planId === plan.id && styles.currentPlanCard,
            ]}
            onPress={() => handleSelectPlan(plan.id)}
          >
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planPrice}>₹{plan.price}/{plan.billingCycle}</Text>
            </View>
            
            <View style={styles.planFeatures}>
              {plan.features.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <Icon name="check-circle" size={18} color={theme.colors.primary} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
            
            {selectedPlan === plan.id && (
              <View style={styles.selectedIndicator}>
                <Icon name="check-circle" size={24} color={theme.colors.primary} />
              </View>
            )}
            
            {currentPlan && currentPlan.planId === plan.id && (
              <View style={styles.currentPlanBadge}>
                <Text style={styles.currentPlanBadgeText}>Current</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
        
        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedPlan || isProcessing) && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={!selectedPlan || isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.continueButtonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
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
  placeholder: {
    width: 40,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.medium,
  },
  currentPlanContainer: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.large,
  },
  currentPlanTitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.medium,
    marginBottom: theme.spacing.small,
  },
  currentPlanName: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.tiny,
  },
  currentPlanValidity: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.small,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.medium,
  },
  planCard: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedPlanCard: {
    borderColor: theme.colors.primary,
  },
  currentPlanCard: {
    borderColor: theme.colors.success,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
  },
  planName: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
  },
  planPrice: {
    color: theme.colors.accent,
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
  },
  planFeatures: {
    marginTop: theme.spacing.small,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.small,
  },
  featureText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.medium,
    marginLeft: theme.spacing.small,
  },
  selectedIndicator: {
    position: 'absolute',
    bottom: theme.spacing.medium,
    right: theme.spacing.medium,
  },
  currentPlanBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: theme.colors.success,
    borderRadius: theme.borderRadius.small,
    paddingHorizontal: theme.spacing.small,
    paddingVertical: theme.spacing.tiny,
  },
  currentPlanBadgeText: {
    color: '#FFF',
    fontSize: theme.typography.fontSize.tiny,
    fontWeight: theme.typography.fontWeight.bold,
  },
  continueButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    alignItems: 'center',
    marginTop: theme.spacing.large,
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: theme.typography.fontSize.medium,
    fontWeight: theme.typography.fontWeight.bold,
  },
  disabledButton: {
    backgroundColor: theme.colors.inactive,
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
    padding: theme.spacing.large,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.medium,
    textAlign: 'center',
    marginBottom: theme.spacing.medium,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    minWidth: 150,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: theme.typography.fontSize.medium,
    fontWeight: theme.typography.fontWeight.bold,
  },
});

export default SubscriptionScreen; 