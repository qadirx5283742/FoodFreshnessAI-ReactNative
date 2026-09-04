# FoodFreshnessAI (Expo / React Native)

Detect food freshness from images on-device using a TensorFlow Lite model. This Expo-managed React Native app provides a camera-first scanning flow, on-device inference (TFLite), local persistence of scans and images, and a polished mobile UX including notifications and haptics.

## Features

- On-device image analysis using a TensorFlow Lite model (services/TfliteService.ts)
- Camera scanning workflow with live capture (app/scan.tsx)
- Freshness scoring and friendly interpretation (Fresh / Spoiled)
- Save scan results and images to local storage (services/DatabaseService.ts, services/StorageService.ts)
- Product details and scan history (app/product-details.tsx)
- User profile and settings (app/edit-profile.tsx, app/settings.tsx)
- Help & Support screen (app/help-support.tsx)
- Theme support and global ThemeContext (context/ThemeContext.tsx)
- Authentication and user context (context/AuthContext.tsx)
- Local notifications and haptic feedback (services/NotificationService.ts, services/HapticService.ts)
- Robust UI components and error boundary (components/*)
- Expo + EAS build configuration (app.json, eas.json)

## Quick demo (Screenshots)

![](./assets/screenshots/scan.png)

Replace the image above with real screenshots in assets/screenshots/ when available.

## Stack

- Language: TypeScript (primary)
- Framework: Expo (Expo-managed React Native)
- Notable libraries: expo-camera, expo-router, TensorFlow Lite integration, Expo Notifications, EAS

## Project structure (top-level)

```
app/                     # File-based screens (expo-router)
components/              # Reusable UI components
services/                # App services: Tflite, DB, Storage, Notifications, Haptics
context/                 # React Context providers (Auth, Theme)
constants/               # Colors, constants
utils/                   # Helpers (logger, auth errors)
app.json, eas.json       # Expo & EAS configuration
package.json, tsconfig.json
```

### How it fits together
The Scan screen captures an image, which is analyzed by services/TfliteService.ts (on-device inference). Results are saved through services/DatabaseService.ts and services/StorageService.ts. UI screens (app/product-details.tsx, app/settings.tsx) read saved scans and display history. NotificationService and HapticService provide user feedback.

## Requirements

- Node.js (LTS)
- npm or yarn
- Expo CLI (optional: npm i -g expo-cli or use npx)
- (Optional) EAS CLI for building standalone apps (npm i -g eas-cli)

## Install

```bash
git clone https://github.com/qadirx5283742/FoodFreshnessAI-ReactNative.git
cd FoodFreshnessAI-ReactNative
npm install
# or
# yarn
```

## Run (development)

```bash
npx expo start
# or
npm run start
```

Open the project in Expo Go (limited features) or run on a simulator/emulator. Grant camera and storage permissions when prompted.

## Build (standalone)

This repository includes an `eas.json`. To build standalone apps with native module parity (recommended for TFLite behavior parity):

1. Install EAS CLI and authenticate: `npm i -g eas-cli` then `eas login`
2. Configure app signing and credentials as required by EAS
3. Run a build:

```bash
eas build --platform android
# or
eas build --platform ios
```

Note: Some native features (TFLite, certain notification/haptic behavior) may behave differently in Expo Go vs a standalone build.

## Configuration & Environment

- Camera permissions are required for the Scan screen.
- The TFLite model must be present in the app assets and the path must match what services/TfliteService.ts expects.
- DatabaseService handles local persistence; no external backend is required for core features.

## Notable files

- `app/scan.tsx` — Camera and scanning workflow
- `services/TfliteService.ts` — Model loading & inference
- `services/DatabaseService.ts` — Persistence of scan records
- `services/StorageService.ts` — Image saving & retrieval
- `context/AuthContext.tsx` — Authentication state
- `app/product-details.tsx` — Detail & history UI
- `components/ErrorBoundary.tsx` — Global UI error handling

## Troubleshooting

- Camera permission denied: ensure the app (or Expo Go) has camera permission in OS settings.
- TFLite inference errors: verify the model file exists in assets and TfliteService preprocessing matches model input.
- Image save failures: ensure storage permissions are granted and file paths are valid for the target platform.

## Development notes

- The codebase is TypeScript-first — enable strict type checking in your editor for the best experience.
- When changing the TFLite model, update input preprocessing and output interpretation in `services/TfliteService.ts`.
- Use EAS builds for full native parity when testing features that depend on native modules.

## Contributing

1. Fork the repository and create a branch for your feature/bugfix.
2. Follow the existing TypeScript & React Native style.
3. Add tests where appropriate and update documentation.
4. Open a pull request with a clear description and screenshots for UI changes.

## License

No license file detected. If you want this project to be open source, add a LICENSE (for example, MIT) to clarify terms.

## Maintainer

Repository owner: `qadirx5283742` — open issues or PRs on GitHub.
