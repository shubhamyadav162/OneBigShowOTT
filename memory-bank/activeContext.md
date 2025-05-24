# Active Context: BigShow OTT Mobile App & Super Admin Dashboard

## Current Work Focus / वर्तमान कार्य फोकस
- Expo React Native mobile app skeleton तैयार है
- Firebase client (`src/utils/firebase.ts`) और Supabase client (`src/api/supabase.js`) सेटअप किया गया
- Authentication flows (AuthContext, Firebase Auth State) implement किए गए
- Navigation stacks (`AuthNavigator`, `MainNavigator`) configure किए गए
- Basic screens for auth, content, admin, profile बनाए गए
- Asset loading retry mechanism और splash screen logic implement किया गया

## Recent Changes / हाल की प्रगति
- Firebase ऐप initialization और Auth state handling लॉजिक जोड़ा गया
- Supabase client placeholder implement किया गया
- Axios API client (`src/api/client.js`) setup with interceptors for token management
- Redux dependencies install किए गए (store configuration remaining)
- UI components (common icons, buttons, cards, rows) बनाए गए
- Local Cloud Function code (`/functions/get-playback-url`) local config तैयार किया गया

## Next Steps / अगले कदम
1. Configure Supabase URL और anon key in environment configuration
2. Implement Redux store and integrate with App.js और screens
3. Create और deploy Firestore collections, indexes, security rules
4. Deploy Cloud Functions to Firebase and configure triggers
5. Implement subscription flows via Supabase endpoints और integrate करें
6. Add analytics और performance monitoring (Firebase Analytics, Performance)
7. Build और test admin screens with real data
8. Automate CI/CD pipeline with GitHub Actions

## Active Decisions / सक्रिय निर्णय
- Expo CLI चुना गया cross-platform development के लिए
- Firebase & Supabase दोनों को backend के लिए use किया जा रहा है
- Redux global state management के लिए integrate किया जाएगा
- Axios interceptors के साथ AsyncStorage based auth token flow maintain किया जाएगा
- UI components को re-usable बनाए रखा जाएगा for consistency

---

*यह फाइल current state और next steps को track करती है।* 