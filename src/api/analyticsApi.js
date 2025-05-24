import { db } from '../lib/firebaseClient';
import { collection, addDoc, serverTimestamp, query, where, getCountFromServer, getDocs } from 'firebase/firestore';

const analyticsApi = {
  /**
   * Log an analytics event
   * @param {string} eventType - Type of event (e.g., 'video_view', 'watch_time', 'video_complete', 'subscribe')
   * @param {object} payload - Event-specific data (must include userId, contentId, secondsWatched if applicable)
   */
  logEvent: async (eventType, payload) => {
    try {
      await addDoc(collection(db, 'analytics_events'), {
        eventType,
        ...payload,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('AnalyticsApi.logEvent error', error);
    }
  },

  /**
   * Fetch overview metrics for the dashboard
   * @returns {Promise<object>} Metrics: totalViews, activeUsers, avgWatchTime, completionRate, topContent, newSubscribers
   */
  getOverview: async () => {
    try {
      // Total Views
      const totalViewsQuery = query(
        collection(db, 'analytics_events'),
        where('eventType', '==', 'video_view')
      );
      const totalViewsSnap = await getCountFromServer(totalViewsQuery);
      const totalViews = totalViewsSnap.data().count;

      // Active Users (past 30 days)
      const activeSince = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const activeUsersQuery = query(
        collection(db, 'analytics_events'),
        where('timestamp', '>=', activeSince)
      );
      const activeUsersSnap = await getDocs(activeUsersQuery);
      const activeUsersSet = new Set(activeUsersSnap.docs.map(d => d.data().userId));
      const activeUsers = activeUsersSet.size;

      // Average Watch Time
      const watchTimeQuery = query(
        collection(db, 'analytics_events'),
        where('eventType', '==', 'watch_time')
      );
      const watchTimeSnap = await getDocs(watchTimeQuery);
      const watchTimes = watchTimeSnap.docs.map(d => d.data().secondsWatched || 0);
      const avgWatchTime = watchTimes.length
        ? watchTimes.reduce((sum, t) => sum + t, 0) / watchTimes.length
        : 0;

      // Completion Rate
      const completeQuery = query(
        collection(db, 'analytics_events'),
        where('eventType', '==', 'video_complete')
      );
      const completeSnap = await getCountFromServer(completeQuery);
      const completes = completeSnap.data().count;
      const completionRate = totalViews > 0 ? Math.round((completes / totalViews) * 100) : 0;

      // Top Content (by views)
      const viewDocs = await getDocs(totalViewsQuery);
      const counts = {};
      viewDocs.docs.forEach(d => {
        const cId = d.data().contentId;
        counts[cId] = (counts[cId] || 0) + 1;
      });
      let topContent = '';
      let maxCount = 0;
      Object.entries(counts).forEach(([cId, cnt]) => {
        if (cnt > maxCount) {
          maxCount = cnt;
          topContent = cId;
        }
      });

      // New Subscribers
      const subQuery = query(
        collection(db, 'analytics_events'),
        where('eventType', '==', 'subscribe')
      );
      const subSnap = await getCountFromServer(subQuery);
      const newSubscribers = subSnap.data().count;

      return { totalViews, activeUsers, avgWatchTime: Math.round(avgWatchTime), completionRate, topContent, newSubscribers };
    } catch (error) {
      console.error('AnalyticsApi.getOverview error', error);
      return { totalViews: 0, activeUsers: 0, avgWatchTime: 0, completionRate: 0, topContent: '', newSubscribers: 0 };
    }
  },
};

export default analyticsApi; 