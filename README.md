# Resgatar

Mobile application for the Resgatar Community, providing daily Catholic liturgical readings and contribution management for community members.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
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
- **Self-registration** — new members can create their own account directly from the login screen via a public API endpoint (no authentication token required)

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
    DocTypeToggle/     # CPF / CNPJ segmented toggle (shared across forms)
    Header/
    LiturgySeasonBanner/
    ReadingCard/
    PsalmCard/
    ContributionItem/
    ProfileHeaderCard/
    ModalBase/
    Dialog/
    Skeleton/
      LiturgySkeleton/
      RemoveMemberSkeleton/
    TabBar/
    Svg/
      Logo/
  screens/
    LoginScreen/       # Email + password login; link to RegisterScreen
    RegisterScreen/    # Public self-registration (Formik + Yup)
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
  services/
    api.ts             # Authenticated Axios instance (Bearer token interceptor)
                       # + publicApi instance (no auth — used for registration)
    MemberService.ts
    ChargeService.ts
    LiturgyService.ts
    NotificationService.ts
  context/
    AuthContext.tsx    # login, logout, register, createMember, updateMember, …
    ChargeContext.tsx
  navigation/
    AppNavigator.tsx   # Login + Register (unauthenticated) / Home (authenticated)
    types.ts           # RootStackParamList
  config/
    amplify.ts
    env.ts
  hooks/
    useMaskedField.ts  # useMaskedFieldFromFormik helper
    useCepLookup.ts
  storage/
  theme/
    index.ts
  types/
    Member/
    Charge/
    Liturgy/
    Notification/
  utils/
    helper.ts
    mask.ts            # Masks + validators: CPF, CNPJ, phone, CEP, currency,
                       # date, validateEmailDomain (disposable domain blocklist)
assets/
  images/
    icon.png                    # App icon (1024×1024, RGBA)
    icon-transparent-1024.png   # Logo on transparent bg — used for splash
    notification-icon.png       # White-on-transparent monochrome — Android notifications
    android-icon-foreground.png # Adaptive icon foreground
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
cd resgatar_app
npm install
```

### Configure environment variables

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

For EAS builds, register variables via the EAS CLI:

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

> **After changing `app.config.js` plugins** (splash, notifications, icons), run a clean prebuild before running the app:
>
> ```bash
> npx expo prebuild --clean --platform android
> npx expo run:android
> ```

---

## Production Build

```bash
# Android (.aab for Google Play)
eas build --platform android --profile production

# iOS
eas build --platform ios --profile production
```

### Incrementing the version code

```bash
eas build:version:set --platform android
```

---

## Architecture

### Authentication & Registration flow

```
Unauthenticated
  LoginScreen
    └─ "Registre-se" → RegisterScreen
         └─ publicApi POST /members        (no token — open endpoint)
         └─ on success → back to LoginScreen

  LoginScreen → Amplify signIn (USER_PASSWORD_AUTH)
    └─ on success → MemberService.getMember (authenticated api)
         └─ member stored in Context + AsyncStorage
```

- `api` — authenticated Axios instance; attaches Cognito `idToken` via request interceptor.
- `publicApi` — plain Axios instance with no interceptor; used exclusively for self-registration so unauthenticated users can call the backend without a token.

### Navigation

```
AppNavigator (Stack)
  ├─ LoginScreen       (unauthenticated)
  ├─ RegisterScreen    (unauthenticated)
  └─ Home → BottomTabs (authenticated)
       ├─ DashboardScreen
       ├─ BillsScreen
       ├─ SettingsScreen   (admin role only)
       └─ ProfileScreen
```

### Forms

All forms use **Formik + Yup**. Masked fields (phone, CPF/CNPJ, currency, CEP, date) are wired via the `useMaskedFieldFromFormik` hook so that both the displayed value and the Formik state stay in sync.

The `DocTypeToggle` component provides a consistent CPF / CNPJ segmented control used in:

- `RegisterScreen`
- `ModalCreateMember`
- `ModalEditProfile`

### Email validation

All email fields validate both format and domain. `validateEmailDomain` in `src/utils/mask.ts` maintains a blocklist of 50+ known disposable and fake domains (`mailinator.com`, `tempmail.com`, `yopmail.com`, `test.com`, `mail.com`, etc.). Emails from these domains are rejected with the message _"Domínio de email não permitido"_.

### Theme system

All visual tokens are centralized in `src/theme/index.ts`. Components consume `COLORS`, `SPACING`, `RADIUS`, `TYPOGRAPHY`, and `SHADOW` from this module.

### Android assets

| Asset                    | File                          | Requirement                                                                                     |
| ------------------------ | ----------------------------- | ----------------------------------------------------------------------------------------------- |
| App icon                 | `icon.png`                    | 1024×1024, RGBA                                                                                 |
| Adaptive icon foreground | `android-icon-foreground.png` | 1024×1024, RGBA, safe zone 66%                                                                  |
| **Notification icon**    | `notification-icon.png`       | White (#FFF) on transparent — Android ignores color and uses only the alpha channel             |
| **Splash logo**          | `icon-transparent-1024.png`   | Brown logo on transparent; `expo-splash-screen` composites it over `backgroundColor: "#F5F0E8"` |

> After updating any asset referenced by an `app.config.js` plugin, run `npx expo prebuild --clean` to regenerate native resource files before building.

### Liturgical colors

| Season                       | Accent  |
| ---------------------------- | ------- |
| Verde (Ordinary Time)        | #2E7D32 |
| Roxo (Advent / Lent)         | #7B1FA2 |
| Branco (Feasts)              | #B8860B |
| Vermelho (Passion / Martyrs) | #C62828 |
| Rosa (Laetare / Gaudete)     | #AD1457 |
