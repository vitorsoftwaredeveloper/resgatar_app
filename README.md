# Resgatar

Mobile application for the Resgatar Community, providing daily Catholic liturgical readings and contribution management for community members.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development Build](#development-build)
- [Production Build](#production-build)
- [Architecture](#architecture)

---

## Overview

Resgatar is a React Native application built with Expo that serves the members of the Resgatar Catholic community. The app provides access to daily liturgical readings fetched from an external API, contribution tracking with PIX payment integration, push notifications, and administrative tools for community managers.

---

## Features

**For all members**

- Daily Catholic liturgical readings (First Reading, Psalm, Second Reading, Gospel, Prayer of the Day)
- Liturgical season banner with dynamic color based on the current liturgical period
- Monthly contribution history with paid and pending status
- PIX payment via QR Code with automatic payment confirmation polling
- Profile management with personal data editing and password update
- Push notification support for contribution reminders

**For administrators**

- Create new community members
- Remove existing members
- Reset member passwords
- Send push notifications to all members

---

## Tech Stack

| Layer            | Technology                                       |
| ---------------- | ------------------------------------------------ |
| Framework        | React Native 0.81.5 + Expo SDK 54                |
| Language         | TypeScript (strict mode)                         |
| State management | React Context API                                |
| Authentication   | AWS Amplify v6 + Amazon Cognito                  |
| HTTP client      | Axios with Bearer token interceptor              |
| Animations       | React Native Reanimated v4                       |
| Forms            | Formik + Yup                                     |
| Navigation       | React Navigation v7 (Bottom Tabs + Native Stack) |
| Icons            | Lucide React Native                              |
| QR Code          | react-native-qrcode-svg                          |
| Notifications    | expo-notifications                               |
| Build service    | EAS Build (Expo Application Services)            |
| Liturgy API      | liturgia.up.railway.app                          |

---

## Project Structure

```
src/
  components/          # Reusable UI components
    Button/
    Input/
    Header/
    LiturgySeasonBanner/
    ReadingCard/
    PsalmCard/
    ContributionItem/
    ProfileHeaderCard/
    ModalBase/
    Dialog/
    Skeleton/          # Loading skeletons (Reanimated withRepeat)
      LiturgySkeleton/
      RemoveMemberSkeleton/
    TabBar/
    Svg/
      Logo/
  screens/             # Application screens
    LoginScreen/
    DashboardScreen/
    BillsScreen/
      PixPaymentModal/
    ProfileScreen/
      ModalEditProfile/
      ModalUpdatePassword/
    SettingsScreen/    # Admin only
      ModalRemoveMember/
      ModalChangePasswordMember/
      ModalSendNotification/
    LoadingScreen/
  services/            # API service layer
    api.ts             # Axios instance with auth interceptor
    MemberService.ts
    ChargeService.ts
    LiturgyService.ts
    NotificationService.ts
  context/             # React Context providers
    AuthContext.tsx
    ChargeContext.tsx
  navigation/
    AppNavigator.tsx
  config/
    amplify.ts         # AWS Amplify configuration
    env.ts             # Environment variable exports
  hooks/
  storage/
  theme/
    index.ts           # COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOW
  types/
    Member/
    Charge/
    Liturgy/
    Notification/
  utils/
    helper.ts
scripts/
  generate-env.js      # EAS build hook — generates .env from EAS secrets
docs/
  screenshots/
```

---

## Demo

<video src="docs/screenshots/movie.mp4" controls width="320"></video>

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`
- Android Studio (for Android emulator) or a physical device

### Installation

```bash
git clone https://github.com/vitorsoftwaredeveloper/resgatar_app.git
cd resgatar_app/resgatar_app
npm install
```

### Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

---

## Environment Variables

| Variable                      | Description                                         |
| ----------------------------- | --------------------------------------------------- |
| `COGNITO_USER_POOL_ID`        | Amazon Cognito User Pool ID                         |
| `COGNITO_USER_POOL_CLIENT_ID` | Cognito App Client ID                               |
| `COGNITO_REGION`              | AWS region (e.g. `us-east-1`)                       |
| `API_BASE_URL`                | Base URL of the backend REST API                    |
| `API_BASE_URL_AUTH`           | Base URL for authentication endpoints               |
| `NODE_ENV`                    | Runtime environment (`development` or `production`) |

For EAS builds, these variables must be registered as EAS environment variables. `NODE_ENV` is declared directly in `eas.json`. All others must be registered via the EAS CLI:

```bash
eas env:create --environment production --name COGNITO_USER_POOL_ID --value "<value>" --visibility sensitive
eas env:create --environment production --name COGNITO_USER_POOL_CLIENT_ID --value "<value>" --visibility sensitive
eas env:create --environment production --name COGNITO_REGION --value "us-east-1" --visibility plaintext
eas env:create --environment production --name API_BASE_URL --value "<value>" --visibility sensitive
eas env:create --environment production --name API_BASE_URL_AUTH --value "<value>" --visibility sensitive
```

The `scripts/generate-env.js` hook runs automatically after `npm install` during every EAS build and writes the `.env` file from the registered variables. If any required variable is missing, the build fails immediately with a descriptive error.

---

## Development Build

```bash
# Start Metro bundler
npx expo start

# Run on Android (requires connected device or emulator)
npx expo run:android

# Run on iOS
npx expo run:ios
```

---

## Production Build

Build for Android (generates `.aab` for Google Play):

```bash
eas build --platform android --profile production
```

Build for iOS:

```bash
eas build --platform ios --profile production
```

After the build completes, download the artifact from the Expo dashboard and upload it to the Google Play Console or Apple App Store Connect.

### Incrementing the version code

The version code is managed remotely by EAS (`appVersionSource: "remote"`). Increment it before a new release:

```bash
eas build:version:set --platform android
```

---

## Architecture

### Authentication flow

1. The user submits credentials on the Login screen.
2. `AuthContext.login` calls AWS Amplify `signIn` with the `USER_PASSWORD_AUTH` flow.
3. On success, `MemberService.getMember` fetches the member record from the backend API using the Cognito JWT access token.
4. The member data is stored in React Context and persisted to AsyncStorage for session restoration on app relaunch.

### Navigation

```
AppNavigator (Stack)
  LoginScreen           (unauthenticated)
  BottomTabs            (authenticated)
    DashboardScreen
    BillsScreen
    SettingsScreen      (admin role only)
    ProfileScreen
```

### Theme system

All visual tokens are centralized in `src/theme/index.ts`. Components must consume `COLORS`, `SPACING`, `RADIUS`, `TYPOGRAPHY`, and `SHADOW` from this module. Hardcoded values are not permitted.

### Liturgical colors

The dashboard dynamically adapts its accent color based on the liturgical season returned by the API:

| Season                       | Accent color |
| ---------------------------- | ------------ |
| Verde (Ordinary Time)        | #2E7D32      |
| Roxo (Advent / Lent)         | #7B1FA2      |
| Branco (Feasts)              | #B8860B      |
| Vermelho (Passion / Martyrs) | #C62828      |
| Rosa (Laetare / Gaudete)     | #AD1457      |
