import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  Linking,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import subscriptionApi from '../../api/subscriptionApi';
import theme from '../../theme';

const paymentMethods = [
  { id: 'card', name: 'Credit / Debit Card', icon: 'credit-card' },
  { id: 'upi', name: 'UPI', icon: 'account-balance-wallet' },
  { id: 'netbanking', name: 'Net Banking', icon: 'public' },
  { id: 'wallet', name: 'Wallet', icon: 'account-balance-wallet' },
];

const { width } = Dimensions.get('window');
const cardWidth = (width - theme.spacing.medium * 3) / 2;

const PaymentMethodScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const planId = route.params?.planId;

  const [plan, setPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [formData, setFormData] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!planId) {
      Alert.alert('Error', 'No plan selected / योजना निर्धारित नहीं हुई।');
      navigation.goBack();
    }
  }, [planId]);

  useEffect(() => {
    const loadPlan = async () => {
      const resp = await subscriptionApi.getSubscriptionPlans();
      if (resp.success) {
        const found = resp.data.plans.find(p => p.id === planId);
        setPlan(found);
      } else {
        Alert.alert('Error', resp.error);
        navigation.goBack();
      }
      setLoadingPlan(false);
    };
    loadPlan();
  }, [planId]);

  if (loadingPlan) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  const validateInputs = () => {
    switch (selectedMethod) {
      case 'card':
        return (
          formData.cardNumber &&
          formData.expiry &&
          formData.cvv &&
          formData.cardName
        );
      case 'upi':
        return formData.upiId;
      case 'netbanking':
        return formData.bankName && formData.accountNumber;
      case 'wallet':
        return formData.walletId;
      default:
        return false;
    }
  };

  const handlePay = async () => {
    if (!selectedMethod) {
      Alert.alert('Select Method', 'कृपया भुगतान विधि चुनें / Please select a payment method.');
      return;
    }
    if (!validateInputs()) {
      Alert.alert(
        'Incomplete Details',
        'सभी जानकारियाँ भरें / Please fill in all required fields.'
      );
      return;
    }
    setIsProcessing(true);
    try {
      const paymentDetails = { method: selectedMethod, details: formData };
      const resp = await subscriptionApi.subscribeToPlan(planId, paymentDetails);
      if (resp.success && resp.data.paymentUrl) {
        Linking.openURL(resp.data.paymentUrl);
      } else {
        Alert.alert('Payment Error', resp.error || 'Failed to initiate payment.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'कुछ गलत हो गया / Something went wrong.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderMethod = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.methodCard,
        { width: cardWidth },
        selectedMethod === item.id && styles.selectedMethodCard,
      ]}
      onPress={() => setSelectedMethod(item.id)}
      activeOpacity={0.8}
    >
      <Icon
        name={item.icon}
        size={36}
        color={
          selectedMethod === item.id
            ? theme.colors.primary
            : theme.colors.textSecondary
        }
      />
      <Text
        style={[
          styles.methodText,
          selectedMethod === item.id && { color: theme.colors.primary },
        ]}
      >
        {item.name}
      </Text>
      {selectedMethod === item.id && (
        <View style={styles.methodCheck}>
          <Icon name="check-circle" size={20} color={theme.colors.primary} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Method</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.planInfo}>
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.planPrice}>
            ₹{plan.price}/{plan.billingCycle}
          </Text>
        </View>
        <Text style={styles.chooseText}>
          अनुरोध विधि चुनें / Choose a Method
        </Text>
        <FlatList
          data={paymentMethods}
          renderItem={renderMethod}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: theme.spacing.large }}
        />
        {selectedMethod === 'card' && (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Card Number"
              keyboardType="numeric"
              value={formData.cardNumber}
              onChangeText={text =>
                setFormData(prev => ({ ...prev, cardNumber: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Expiry (MM/YY)"
              keyboardType="numeric"
              value={formData.expiry}
              onChangeText={text =>
                setFormData(prev => ({ ...prev, expiry: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="CVV"
              keyboardType="numeric"
              secureTextEntry
              value={formData.cvv}
              onChangeText={text =>
                setFormData(prev => ({ ...prev, cvv: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Name on Card"
              value={formData.cardName}
              onChangeText={text =>
                setFormData(prev => ({ ...prev, cardName: text }))
              }
            />
          </View>
        )}
        {selectedMethod === 'upi' && (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Enter UPI ID"
              value={formData.upiId}
              onChangeText={text =>
                setFormData(prev => ({ ...prev, upiId: text }))
              }
            />
          </View>
        )}
        {selectedMethod === 'netbanking' && (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Bank Name"
              value={formData.bankName}
              onChangeText={text =>
                setFormData(prev => ({ ...prev, bankName: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Account Number"
              keyboardType="numeric"
              value={formData.accountNumber}
              onChangeText={text =>
                setFormData(prev => ({ ...prev, accountNumber: text }))
              }
            />
          </View>
        )}
        {selectedMethod === 'wallet' && (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Wallet ID / Number"
              value={formData.walletId}
              onChangeText={text =>
                setFormData(prev => ({ ...prev, walletId: text }))
              }
            />
          </View>
        )}
      </ScrollView>
      <TouchableOpacity
        style={[
          styles.payBtn,
          (!validateInputs() || isProcessing) && styles.disabledBtn,
        ]}
        onPress={handlePay}
        disabled={!validateInputs() || isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.payBtnText}>Pay Now</Text>
        )}
      </TouchableOpacity>
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
    paddingVertical: theme.spacing.small,
  },
  backBtn: {
    padding: theme.spacing.small,
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
  },
  placeholder: {
    width: theme.spacing.large,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing.medium,
  },
  planInfo: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.large,
  },
  planName: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
  },
  planPrice: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
  },
  chooseText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.medium,
    marginBottom: theme.spacing.medium,
    textAlign: 'center',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: theme.spacing.medium,
  },
  methodCard: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.small,
    marginBottom: theme.spacing.small,
  },
  selectedMethodCard: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  methodText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.small,
    marginTop: theme.spacing.small,
    textAlign: 'center',
  },
  methodCheck: {
    position: 'absolute',
    top: theme.spacing.small,
    right: theme.spacing.small,
  },
  form: {
    marginTop: theme.spacing.medium,
    marginBottom: theme.spacing.large,
  },
  input: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.small,
    padding: theme.spacing.small,
    color: theme.colors.text,
    marginBottom: theme.spacing.small,
  },
  payBtn: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.medium,
    margin: theme.spacing.medium,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
  },
  payBtnText: {
    color: '#FFF',
    fontSize: theme.typography.fontSize.medium,
    fontWeight: theme.typography.fontWeight.bold,
  },
  disabledBtn: {
    backgroundColor: theme.colors.inactive,
  },
});

export default PaymentMethodScreen; 