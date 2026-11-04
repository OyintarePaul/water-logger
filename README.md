# Water Logger

A simple mobile app to track your daily water intake. Tap to log glasses, undo mistakes, and view your last 7 days at a glance.

## Features

- Log and undo glasses of water
- Daily goal of 8 glasses
- 7-day bar chart with tap-to-show labels
- Data persists across app restarts
- Haptic feedback and number animation on each log
- Edge-to-edge layout with Nunito font

## Tech Stack

- [Expo](https://expo.dev) (managed workflow)
- [Expo Router](https://docs.expo.dev/router/introduction) for navigation
- [expo-sqlite/kv-store](https://docs.expo.dev/versions/latest/sdk/sqlite) for local storage
- [react-native-gifted-charts](https://github.com/Abhinandan-Kushwaha/react-native-gifted-charts) for the bar chart
- [@expo-google-fonts/nunito](https://github.com/expo/google-fonts) for the font
- [@react-native-vector-icons/material-design-icons](https://www.npmjs.com/org/react-native-vector-icons) for icons
- [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics) for haptic feedback
- [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated) for animations

## Getting Started

### Prerequisites

- Node.js 18+
- Expo Go app on your Android or iOS device

### Install

```bash
git clone https://github.com/OyintarePaul/water-logger.git
cd water-logger
npm install
npx expo start
```

Scan the QR code with Expo Go to run the app on your device.

## Project Structure

```
app/
  _layout.tsx        # Font loading, edge-to-edge setup
  index.tsx          # Main screen
components/
  weekly-chart.tsx   # 7-day bar chart
lib/
  dates.ts           # Date key helpers
  theme.ts           # Colors, spacing, font names, daily goal
  water-storage.ts   # All reads and writes to the KV store
```

## Testing

Tested on Android using Expo Go. iOS behavior is not verified.
