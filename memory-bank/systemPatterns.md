# System Patterns: BigShow OTT Mobile App & Super Admin Dashboard

## Architecture / आर्किटेक्चर
- Expo / React Native front-end for mobile platforms
- Firebase backend (Auth, Firestore, Storage, Functions, Hosting)
- Supabase backend for subscription management
- Custom API client (axios) for server interactions (e.g., local dev server at 127.0.0.1:54321)
- Cloud Functions handling secure playback URLs और backend automation
- CDN integration for media delivery (bunny.net)
- Redux store for global state management

## Key Technical Decisions / मुख्य तकनीकी निर्णय
- Expo चुनना cross-platform mobile विकास के लिए
- Firebase services user/auth/content management के लिए
- Supabase subscription workflows के लिए specialized backend
- Redux & redux-thunk global state synchronization के लिए
- Offline-first approach और retry mechanisms for asset loading
- Axios interceptors with AsyncStorage for auth token management
- GitHub Actions for CI/CD और automated deployments

## Design Patterns / डिज़ाइन पैटर्न
- Separation of concerns: screens, contexts (AuthContext), API services, utils
- Secure-by-default: Firebase Auth & security rules, Supabase token management
- Offline-first data caching और retry logic
- Centralized state management with Redux
- Composable UI components for consistency (common components folder)
- ErrorBoundary for safe error handling

## Component Relationships / कंपोनेंट्स के संबंध
- App.js <-> AuthContext (authentication flows)
- Screens <-> API client (axios) / Firebase client / Supabase client
- Cloud Functions <-> Firebase services (Firestore, Storage)
- Redux store <-> UI components via react-redux bindings
- Expo Asset Loader <-> Media playback (expo-av)

---

*यह फाइल सिस्टम आर्किटेक्चर और patterns को define करती है।* 