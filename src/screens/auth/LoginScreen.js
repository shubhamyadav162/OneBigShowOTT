import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AuthContext from '../../context/AuthContext';
import theme from '../../theme';
import LogoMain from '../../../assets/pnglogo.png';
import GoogleSignInButton from '../../components/common/GoogleSignInButton';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showManualLogin, setShowManualLogin] = useState(false);

  const handleEmailLogin = () => {
    // TODO: implement email login logic
    // Simulate successful login
    signIn('emailUser');
  };

  const handleOtherLogin = () => {
    // TODO: navigate to other login methods or screen
    navigation.navigate('Signup');
  };

  const handleGoogleSignIn = (user) => {
    console.log('User signed in with Google:', user.displayName);
    signIn(user.uid);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Image source={LogoMain} style={styles.logoImage} resizeMode="contain" />
          <Text style={styles.subtitle}>Unlimited Web Series</Text>
          <View style={styles.card}>
            {/* Auth options: Sign Up, Login with Email, Continue with Google */}
            <TouchableOpacity onPress={handleOtherLogin} style={styles.signUpButton}>
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowManualLogin(true)} style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Login with Email</Text>
            </TouchableOpacity>
            
            <GoogleSignInButton 
              onSignInComplete={handleGoogleSignIn}
              buttonStyle={styles.socialButton}
              textStyle={styles.loginButtonText}
            />
            
            {/* Manual email/password form */}
            {showManualLogin && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Password"
                    placeholderTextColor={theme.colors.textSecondary}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity>
                    <Icon name="visibility-off" size={24} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleEmailLogin} style={styles.loginButton}>
                  <Text style={styles.loginButtonText}>Sign In</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.large,
  },
  logoImage: {
    width: 200,
    height: 200,
    marginBottom: theme.spacing.large,
  },
  logoText: {
    fontSize: theme.typography.fontSize.xxlarge,
    fontWeight: theme.typography.fontWeight.black,
    color: theme.colors.text,
    marginBottom: theme.spacing.small,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.regular,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.accent,
    marginBottom: theme.spacing.large,
  },
  card: {
    width: '100%',
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.large,
    ...theme.shadows.large,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    color: theme.colors.text,
    marginBottom: theme.spacing.large,
  },
  passwordContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    marginBottom: theme.spacing.large,
  },
  passwordInput: {
    flex: 1,
    color: theme.colors.text,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.medium,
  },
  loginButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
  },
  signUpButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.medium,
  },
  signUpButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
  },
  socialButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.medium,
  },
  otherLogin: {
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
  },
});

export default LoginScreen; 