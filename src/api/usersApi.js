import { db } from '../utils/firebase';
import { collection, doc, setDoc, serverTimestamp, onSnapshot, getDocs } from 'firebase/firestore';

const usersApi = {
  /**
   * Create or update a user profile in Firestore
   * @param {object} user - User data (uid, email, name, optional role, status)
   */
  createUserProfile: async ({ uid, email, name, role = 'Viewer', status = 'Active' }) => {
    try {
      await setDoc(doc(db, 'users', uid), {
        uid,
        email,
        name,
        role,
        status,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('usersApi.createUserProfile error', error);
    }
  },

  /**
   * Subscribe to real-time updates of the users collection
   * @param {function} callback - Called with array of user profiles
   * @returns {function} unsubscribe
   */
  subscribeToUsers: (callback) => {
    const q = collection(db, 'users');
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(users);
      },
      (error) => {
        console.error('usersApi.subscribeToUsers error', error);
      }
    );
    return unsubscribe;
  },

  /**
   * Fetch all user profiles once
   * @returns {Promise<Array>} Array of user profiles
   */
  getUsers: async () => {
    try {
      const snap = await getDocs(collection(db, 'users'));
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('usersApi.getUsers error', error);
      return [];
    }
  },
};

export default usersApi; 