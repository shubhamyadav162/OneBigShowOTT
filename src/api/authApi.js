import { auth } from '../lib/firebaseClient';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  updatePassword,
} from 'firebase/auth';

/**
 * Authentication API service
 */
const authApi = {
  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - API response
   */
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, data: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Register a new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} name - User name
   * @returns {Promise} - API response
   */
  register: async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Optionally set display name
      await sendEmailVerification(userCredential.user);
      return { success: true, data: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Send password reset email
   * @param {string} email - User email
   * @returns {Promise} - API response
   */
  forgotPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise} - API response
   */
  resetPassword: async (token, newPassword) => {
    try {
      // Firebase handles reset via email link; client handles action code
      await updatePassword(auth.currentUser, newPassword);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Logout user
   * @returns {Promise} - API response
   */
  logout: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Verify email address
   * @param {string} token - Verification token
   * @returns {Promise} - API response
   */
  verifyEmail: async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        return { success: true };
      }
      return { success: false, error: 'No user signed in' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Refresh authentication token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise} - API response
   */
  refreshToken: async () => {
    try {
      // Firebase handles token refresh internally
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken(true);
        return { success: true, data: token };
      }
      return { success: false, error: 'No user signed in' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

export default authApi; 