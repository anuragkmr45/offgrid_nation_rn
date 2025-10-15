# 🌐 Offgrid Nation

> A smart, community-driven app that blends **social networking**, **real-time alerts**, and a **peer-powered marketplace** — all in one.

![Platform](https://img.shields.io/badge/platform-iOS%20|%20Android-blue)
![Expo](https://img.shields.io/badge/Expo-53.0.11-lightgrey)
![TypeScript](https://img.shields.io/badge/TypeScript-✔️-3178c6)
![License: MIT](https://img.shields.io/badge/license-MIT-green)

---

## 📲 Get the app

<p align="center">
  <!-- Android -->
  <a href="https://play.google.com/store/apps/details?id=com.anuragkmr45.offgridnation&hl=en" target="_blank" rel="noopener noreferrer">
    <img
      alt="Get it on Google Play"
      src="https://img.shields.io/badge/Android-Get%20it%20on%20Google%20Play-3DDC84?logo=android&logoColor=white"
    />
  </a>
  &nbsp;&nbsp;
  <!-- iOS (temporarily points to the same Play link, per your note) -->
  <a href="https://play.google.com/store/apps/details?id=com.anuragkmr45.offgridnation&hl=en" target="_blank" rel="noopener noreferrer">
    <img
      alt="Download on the App Store"
      src="https://img.shields.io/badge/iOS-Get%20it%20on%20the%20App%20Store-000000?logo=apple&logoColor=white"
    />
  </a>
</p>

## 📱 Features

### 🔐 Authentication
- Username/password login
- Google & Apple sign-in
- OTP-based registration
- Forgot password flow

### 📰 Post Feed
- Reels, image, video, and text posts
- Tweet-like link-only or text+link posts
- Like, dislike, comment, reply
- Share posts within the app (chat) or externally
- Optimized infinite scroll & pagination

### 🔍 Search
- Discover users and trending topics
- Search with filters and keyword matching

### 💬 Real-Time Chat
- 1:1 chat via **Pusher**
- Infinite scroll with pagination
- Share posts in conversation
- Real-time push notifications

### 💎 Premium Features
- IOS in-app purchase
- Premium-only posts
- Only premium users can comment/like/reply
- Integrated with Stripe for secure payments

### 🛒 Marketplace
- Post and explore products for sale
- Geo-location based discovery
- Sorting, filtering, and product search
- Chat with sellers directly

### 👤 User Profiles & Social
- Public/private profiles
- Follow/unfollow users
- Edit personal profile
- View followers, following, and user posts
- In-app notification center

---

## 🧑‍💻 Tech Stack

| Category         | Stack                                      |
| ---------------- | ------------------------------------------ |
| Framework        | React Native (Expo)                        |
| Language         | TypeScript                                 |
| State Management | Redux Toolkit, RTK Query, Redux Persist    |
| App Storage      | AsyncStorage                               |
| Auth             | Firebase Auth, Google, Apple Sign-In       |
| Payments         | IAP, Stripe                                |
| Real-time        | Pusher                                     |
| Routing          | Expo Router                                |

---

## ⚙️ Installation

### Requirements
- Node.js ≥ 18
- Expo CLI
- Android Studio / Xcode (for emulators)
- EAS CLI (`npm i -g eas-cli`)

```bash
git clone https://github.com/your-org/offgrid-nation-rn.git
cd offgrid-nation-rn
npm install


📦 offgrid-nation-rn
├── app/                        # Routes & Screens
│   ├── auth/                   # Login/Register/OTP flows
│   ├── root/                   # Feed, Chat, Marketplace
│   └── settings/               # Settings & Support
├── components/                # UI Components (modals, chat, post, etc.)
├── features/                  # RTK Query slices and hooks
├── store/                     # Redux setup
├── utils/                     # Utilities & helpers
├── constants/                 # Theming and global config
├── assets/                    # Fonts & static files
├── scripts/                   # Custom scripts
├── .env.*                     # Environment configs
└── app.config.js              # Expo configuration
```

## Sample envs 

```
# === Public (bundled in the app). Use only values you're OK exposing. ===
EXPO_PUBLIC_BASE_URL=https://apiv2.theoffgridnation.com

# Firebase (web keys are public but should be restricted in the Firebase console)
EXPO_PUBLIC_FIREBASE_API_KEY=<your-firebase-api-key>
EXPO_PUBLIC_FIREBASE_APP_ID=<your-firebase-app-id>
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=offgrid-nation.firebaseapp.com
EXPO_PUBLIC_FIREBASE_DB_URL=https://offgrid-nation-default-rtdb.asia-southeast1.firebasedatabase.app
EXPO_PUBLIC_FIREBASE_PROJECT_ID=offgrid-nation
EXPO_PUBLIC_FIREBASE_SENDER_ID=<your-firebase-sender-id>
EXPO_PUBLIC_FIREBASE_STORAGE=offgrid-nation.firebasestorage.app

# Google OAuth
EXPO_PUBLIC_IOS_CLIENT_ID=<your-ios-client-id>.apps.googleusercontent.com
EXPO_PUBLIC_OAUTH_WEB_CLIENT_ID=<your-web-client-id>.apps.googleusercontent.com

# Pusher (public key; lock down in Pusher dashboard)
EXPO_PUBLIC_PUSHER_CLUSTER=us3
EXPO_PUBLIC_PUSHER_KEY=<your-pusher-key>

# YouTube Data API (restrict by referrers / bundle IDs)
EXPO_PUBLIC_YOUTUBE_API_KEY=<your-youtube-api-key>

# Sentry (DSN can be public; auth token must NOT be here)
EXPO_PUBLIC_SENTRY_DSN=<your-sentry-dsn>

# RevenueCat
EXPO_PUBLIC_RC_IOS_KEY=<your-revenuecat-ios-public-key>
```