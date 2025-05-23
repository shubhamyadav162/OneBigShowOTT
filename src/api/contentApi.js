import { db } from '../lib/firebaseClient';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  limit as limitFn,
} from 'firebase/firestore';

/**
 * Content API service using Firestore
 */
const contentApi = {
  /**
   * Get featured content for the home screen
   * @returns {Promise} - API response
   */
  getFeaturedContent: async () => {
    try {
      const snap = await getDocs(query(collection(db, 'series'), limitFn(10)));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get recommended content based on user preferences
   * @returns {Promise} - API response
   */
  getRecommendedContent: async () => {
    // For now, return featured content
    return contentApi.getFeaturedContent();
  },

  /**
   * Get trending content
   * @returns {Promise} - API response
   */
  getTrendingContent: async () => {
    // For now, return featured content
    return contentApi.getFeaturedContent();
  },

  /**
   * Get content by category
   * @param {string} categoryId - Category ID
   * @param {number} page - Page number for pagination
   * @param {number} limit - Number of items per page
   * @returns {Promise} - API response
   */
  getContentByCategory: async (categoryId, page = 1, limit = 20) => {
    try {
      const snap = await getDocs(
        query(
          collection(db, 'series'),
          where('genre', '==', categoryId),
          limitFn(limit)
        )
      );
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get all categories
   * @returns {Promise} - API response
   */
  getCategories: async () => {
    try {
      const snap = await getDocs(collection(db, 'series'));
      const genres = Array.from(
        new Set(snap.docs.map(d => d.data().genre))
      );
      return { success: true, data: genres };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Search content by title, description, or cast
   * @param {string} queryStr - Search query
   * @returns {Promise} - API response
   */
  searchContent: async (queryStr) => {
    try {
      const snap = await getDocs(collection(db, 'series'));
      const data = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(item =>
          item.title.toLowerCase().includes(queryStr.toLowerCase()) ||
          item.description.toLowerCase().includes(queryStr.toLowerCase())
        );
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get content details by ID
   * @param {string} contentId - Content ID
   * @returns {Promise} - API response
   */
  getContentDetails: async (contentId) => {
    try {
      const docSnap = await getDoc(doc(db, 'series', contentId));
      if (!docSnap.exists()) {
        return { success: false, error: 'Content not found' };
      }
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get episodes for a series
   * @param {string} seriesId - Series ID
   * @returns {Promise} - API response
   */
  getEpisodes: async (seriesId) => {
    try {
      const snap = await getDocs(collection(db, 'series', seriesId, 'episodes'));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get episode details by ID
   * @param {string} seriesId - Series ID
   * @param {string} episodeId - Episode ID
   * @returns {Promise} - API response
   */
  getEpisodeDetails: async (seriesId, episodeId) => {
    try {
      const docSnap = await getDoc(doc(db, 'series', seriesId, 'episodes', episodeId));
      if (!docSnap.exists()) {
        return { success: false, error: 'Episode not found' };
      }
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get similar content recommendations
   * @param {string} contentId - Content ID
   * @param {number} limit - Number of recommendations to fetch
   * @returns {Promise} - API response
   */
  getSimilarContent: async (contentId, limit = 10) => {
    try {
      const mainSnap = await getDoc(doc(db, 'series', contentId));
      if (!mainSnap.exists()) {
        return { success: false, error: 'Content not found' };
      }
      const genre = mainSnap.data().genre;
      const snap = await getDocs(
        query(
          collection(db, 'series'),
          where('genre', '==', genre),
          limitFn(limit)
        )
      );
      const data = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(item => item.id !== contentId);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get cast and crew details for content
   * @returns {Promise} - API response
   */
  getCastCrew: async () => {
    // Cast and crew not implemented in Firestore
    return { success: true, data: [] };
  },
};

export default contentApi; 