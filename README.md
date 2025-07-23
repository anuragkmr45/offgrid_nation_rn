# 🌐 Offgrid Nation

> A smart, community-driven app that blends **social networking**, **real-time alerts**, and a **peer-powered marketplace** — all in one.

![Platform](https://img.shields.io/badge/platform-iOS%20|%20Android-blue)
![Expo](https://img.shields.io/badge/Expo-53.0.11-lightgrey)
![TypeScript](https://img.shields.io/badge/TypeScript-✔️-3178c6)
![License: MIT](https://img.shields.io/badge/license-MIT-green)

---

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
| Storage          | AsyncStorage                               |
| Auth             | Firebase Auth, Google, Apple Sign-In       |
| Payments         | Stripe                                     |
| Real-time        | Pusher                                     |
| Routing          | Expo Router                                |
| Forms & Validations | Custom validation, helper utilities     |

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
