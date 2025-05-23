# Firebase Integration for BigShop OTT Super Admin Dashboard / Firebase एकीकरण

## Table of Contents / विषय सूची
1. Project Overview / परियोजना अवलोकन  
2. Firebase Services Overview / Firebase सेवाओं का अवलोकन  
   - Authentication / प्रमाणीकरण  
   - Firestore / डेटाबेस  
   - Storage / भंडारण  
   - Hosting / होस्टिंग  
   - Cloud Functions / क्लाउड फ़ंक्शन्स  
   - Analytics & Monitoring / विश्लेषण और निगरानी  
   - Backup & Export / बैकअप और निर्यात  
3. Firebase Project Setup / Firebase प्रोजेक्ट सेटअप  
4. Directory Structure / निर्देशिका संरचना  
5. Firebase CLI Commands / CLI कमांड्स  
6. Security Rules / सुरक्षा नियम  
7. Environment Variables / पर्यावरण चरों  
8. CDN Integration with bunny.net / bunny.net CDN एकीकरण  
9. CI/CD & GitHub Actions / निरंतर विकास व परिनियोजन  
10. Billing & Cost Monitoring / बिलिंग और लागत निगरानी  
11. Next Steps / अगले कदम

---

## 1. Project Overview / परियोजना अवलोकन
**English:**  
The BigShop OTT Super Admin Dashboard is a React/Next.js web application that allows admins to upload and manage web series, thumbnails, metadata, and other assets in real time—without requiring mobile app updates.  
**Hindi:**  
BigShop OTT सुपर एडमिन डैशबोर्ड एक React/Next.js आधारित वेब एप्लिकेशन है, जिससे एडमिन लाइव तरीके से वेब सीरीज़, थंबनेल, मेटाडेटा व अन्य फ़ाइलें अपलोड और मैनेज कर सकते हैं, बिना मोबाइल ऐप अपडेट के।

## 2. Firebase Services Overview / Firebase सेवाओं का अवलोकन

### 2.1 Authentication / प्रमाणीकरण  
- Firebase Auth (Email/Google/GitHub/Social)  
- Secure sign-in flows, Multi-factor authentication support  

### 2.2 Firestore (NoSQL Database) / डेटाबेस  
- Collections: `series`, `episodes`, `users`, `analytics`  
- Realtime listeners for immediate UI updates  
- Offline persistence support  

### 2.3 Storage / भंडारण  
- Buckets for thumbnails, cover images, video files  
- Storage Security Rules for access control  
- Automatic resumable uploads  

### 2.4 Hosting / होस्टिंग  
- Deploy static React/Next.js dashboard on Firebase Hosting  
- Global CDN and SSL by default  

### 2.5 Cloud Functions / क्लाउड फ़ंक्शन्स  
- Serverless REST APIs for custom operations  
- Firestore triggers (e.g., on `series` creation) for background jobs like video transcoding  
- Scheduled functions for maintenance tasks  

### 2.6 Analytics & Monitoring / विश्लेषण और निगरानी  
- Google Analytics for user behavior insights  
- Crashlytics for real-time crash reporting  
- Performance Monitoring for UI and network performance  

### 2.7 Backup & Export / बैकअप और निर्यात  
- Automated Firestore exports to Cloud Storage  
- Lifecycle rules to clean up old backups  
- Versioned backup folder structure  

## 3. Firebase Project Setup / Firebase प्रोजेक्ट सेटअप
1. `firebase login` – Authenticate your CLI.  
2. `firebase init hosting firestore functions storage` – Initialize services.  
3. Configure project alias: `firebase use --add` (e.g., `bigshop-ott-dev`, `bigshop-ott-prod`).  
4. Enable Auth providers and Firestore in the Firebase Console.  
5. Set up Storage buckets and specify public/ private paths.  
6. Define Firestore indexes and security rules as code.  

## 4. Directory Structure / निर्देशिका संरचना
```bash
/admin-dashboard  
├── public       # Static assets  
├── src  
│   ├── components  
│   ├── pages       # Next.js pages + API routes  
│   ├── utils       # Firebase helper functions  
│   └── styles      
├── functions      # Cloud Functions code  
├── .firebaserc    # Project aliases  
├── firebase.json  # Hosting & functions config  
└── .env.local     # Environment variables  
```

## 5. Firebase CLI Commands / CLI कमांड्स
- `firebase deploy --only hosting`  
- `firebase deploy --only functions`  
- `firebase deploy --only firestore:rules,firestore:indexes`  
- `firebase emulators:start` (Local testing)  

## 6. Security Rules / सुरक्षा नियम
- **firestore.rules**: Define role-based access for collections (`admins`, `users`).  
- **storage.rules**: Control read/write permissions on media files.  
- Use `allow` and `match` statements to granularly secure data.  

## 7. Environment Variables / पर्यावरण चरों
Use a `.env.local` file for sensitive keys:  
```
NEXT_PUBLIC_FIREBASE_API_KEY=...  
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...  
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...  
FIREBASE_CLIENT_EMAIL=...  
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...  
```  

## 7.1 Service Account Credentials / सेवा खाता प्रमाणपत्र
इस सेक्शन में आपके सर्विस अकाउंट JSON क्रेडेंशियल्स होंगे जिन्हें आप Cloud Functions या बैकएंड सर्विसेज़ में उपयोग कर सकते हैं:

```json
{
  "type": "service_account",
  "project_id": "bigshow-ott",
  "private_key_id": "b0da97aae2c594c7e14fb95024236f6ad06572bd",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCinZsLs1OeqEGD\nX/I26A5oKt5+w8C11oCtqYImQqo2Cn9FQlQEYMK1HZ6Z8Tr7owoooTXYuQPeYRjg\nhSD9cLorIEOGrVL0OaaKHMSp6jCIuTYCnJrxKj6dwRWam32X9VaG79QG77533YvN\nABP2S0+mG9QGvQBo0bm1pXwTCz0fguxCwj3AAulg7Lhh3Q53bNciXcnMd9sXWUlZ\noFIJVFNHWSnG1Ylzk5i7xGnh572CaRzSOnXT8Z6S/BiE3VhEKZGbfAf0NDhC+Kso\nFg6Qa5yvH/MVSqiINotbAt8lpRbKoU4wBAtWimq72N7Fxk3jtohZChIkLIeJpJ4o\nddOp7b2xAgMBAAECgf8JLuWT+UDZyYAmLpNctTc+2X99Tk6gFzxIl9qBBw5x5g0V\nmMC1BXeFzeA2KWquDUvUBQ+K52v8jO1KNDTu7EFanvqRltJOHv5XzlicpbGsm5Sv\nLfoQpHR+8AbCy8tSyunGzccknSNMX4e4fjP9OjBGq6Z7CAKRLZ7n9FvPcrCfPsMV\nqCk9nyI8Cp76ZDfgwWXLdrahLsMZ3xc1K1AYvGZrbPDSIVHq8zoIl4WQjXWgfScl\nH0nidQawbSTIODe03/OBkaBF4qF5VfyvER4WbdUZqhX7v4PEAPy0f1jjZA1VF9xA\nwAEEWBZh4kRBy/+NcswGDfaTd4ONSIY8vwg/WFsCgYEA1ROE9PDIXFQ3+ZpefeIj\nydAVAf/wyWnB9ZpGTC9CLQwq8e2K//Uc7ijK4TPQp7HJaJpa9yg8Gpq194Y6NWUq\nRDGp6tnXbUQdx4RivFenZOMdVd3+yK7uU3dPbwuxwUHwuVCImMbjMgd3oc1Hqx04\nEzwmqgacrMMrIj0sHkBk7j8CgYEAw1/M4PKvBIF2qRtuthUJVjbAHXJm/7TXblXu\nRR6b901n0EjyXHiiL6vMYXIIwhhefFfwka+LflUtMcWm2q62J4lb0OKokKdJuqNp\niJuegXD1IbEMmSfH+pefFzT2Mx3GZZ2962fiHLQgbr4O6thKAAgxa5xHJV4zln8z\nnAKaOA8CgYBtdMN+GBq040aF4DjeLcb4qv2/szx8GunaQtAN3tD91xxQfxhCeCXO\nagIeQcHUA05Vf8Vu5apKeGM1rixEtZ1KvsBstk8mADHUBju6SMTi3JB7RbjWWpZv\nJgEWKEm93yPL7oTdBn47ev6Hja5dRntB1kp+WTsuvGtyAT6io621fQKBgQC/jKeU\nTJtncX7jYa/z+UAENP26YTW2spkc5kcLoW0M0+lafoqQOv3YezmQuHr5wWaxxo5o\nZ5H+NIhw6fYjJXQV40gPzomx+TICOMD5XInVIuhTNgDCEAyzFgC2ggh4KVMgwb04\nlctMlRXPPavmeFRlH6NEfB4M9wThIql45dxJ5QKBgQDF6Mfc0HWQwEyO+tnxvuu8\neEtm/HyXorscCbUl074DtUrdSuvFsjGcrrKoT0y/dms142Xp0IPMjhFE/V7kZ3EL\nTsYmV4KspoxTusJL4IX+Ht00mOCGcNNzU1lYmB5Zs5ZvzfJM46XsrOsNsrk2OvfD\n+8PMBSmyDRDt7BwuwAEXKw==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@bigshow-ott.iam.gserviceaccount.com",
  "client_id": "110560903230407970667",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40bigshow-ott.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
```

## 8. CDN Integration with bunny.net / bunny.net CDN एकीकरण
1. In bunny.net Dashboard, create a Pull Zone.  
2. Set origin URL to your Firebase Storage bucket endpoint (e.g., `https://firebasestorage.googleapis.com/v0/b/<bucket>`).  
3. Configure custom CNAME (e.g., `cdn.bigshopott.com`).  
4. Use CDN URLs in Dashboard & Mobile App for all media assets.  

## 9. CI/CD & GitHub Actions / निरंतर विकास व परिनियोजन
Create `.github/workflows/firebase.yml`:  
```yaml
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
```  

## 10. Billing & Cost Monitoring / बिलिंग और लागत निगरानी
- Firebase Spark Plan free tier limits.  
- Use GCP Console Budgets & Alerts to monitor usage.  
- Set alerts for high storage (>4 GB) or egress traffic.  

## 11. Next Steps / अगले कदम
1. Implement React UI components for series upload & editing.  
2. Write TypeScript helpers in `/utils/firebase.ts`.  
3. Develop Cloud Functions for complex business logic (e.g., notify on new upload).  
4. Configure automated Firestore exports & backups.  
5. Test end-to-end in staging environment.  
6. Deploy Mobile App update with Firebase integration.  
7. Monitor performance and iterate.

---

*Generated by AI Assistant in bilingual format to guide complete Firebase integration for BigShop OTT Super Admin Dashboard.* 