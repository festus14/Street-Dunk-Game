# 🏀 Street Dunk Challenge

An immersive mobile basketball arcade game built with React Native and Expo. Perform high-flying dunks, smooth layups, and precision shots across a dynamic street basketball court — or sit back and let the AI play it for you in **Auto Mode**.

![Street Dunk Challenge](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?logo=react)
![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?logo=expo)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎮 Game Features

- **Two Game Modes**: Manual (timer-based) and Auto Mode (moves-based AI play)
- **Difficulty Levels**: Easy / Medium / Hard for both modes
- **Intuitive Controls**: Simple left/right movement with tap/long-press actions
- **Realistic Animations**: Smooth player movements with dribbling, dunking, layup, and shooting animations
- **Dynamic Gameplay**: Auto-dribbling system with ball physics and realistic trajectories
- **Combo System**: Build combos with successful shots to increase your score multiplier
- **Multiple Shot Types**:
  - 🔥 Dunks (50+ points) — Epic 360° spins with power aura
  - 🏀 Layups (30+ points) — Graceful close-range shots
  - 🎯 2-Pointers & 3-Pointers (20–30 points) — Distance-based shooting
- **Tip-off Reset**: Player and ball return to mid-court after every successful score
- **Final Score Modal**: Game ends with a recap and one-tap "Play Again"
- **Landscape Mode**: Optimized for horizontal gameplay
- **Beautiful Court Design**: Vibrant orange court with professional basketball markings

## 📱 Screenshots

*Coming soon — Add your gameplay screenshots here*

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo Go app on your mobile device
- For iOS: macOS with Xcode
- For Android: Android Studio

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/street-dunk-challenge.git
cd street-dunk-challenge
```

2. Navigate to the project directory:
```bash
cd StreetDunkExpo
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npx expo start
```

5. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

> **iOS Simulator tip**: the app is locked to landscape but the simulator often opens in portrait. Press **Cmd+→** in the simulator window to rotate it once.

## 🎯 How to Play

### Game Modes

When the game starts, a difficulty modal appears with an **AUTO MODE** toggle.

**Manual Mode (toggle OFF — timer based)**

| Difficulty | Time |
|------------|------|
| Easy   | 60s |
| Medium | 30s |
| Hard   | 10s |

**Auto Mode (toggle ON — moves based)**

The AI plays for you. Difficulty buttons display *moves* instead of seconds:

| Difficulty | Moves |
|------------|-------|
| Easy   | 50 |
| Medium | 30 |
| Hard   | 20 |

The AI rolls a random action each tick from `['moveRight', 'moveLeft', 'shoot', 'dunk', 'layup']` (`ACTIONS` in `src/screens/GameScreen.js`).

### Controls (manual mode)

- **◀ Left Arrow**: Move player left
- **▶ Right Arrow**: Move player right
- **▲ Up Arrow (Tap)**: Dunk if near hoop, otherwise shoot
- **▲ Up Arrow (Long Press)**: Layup if near hoop, otherwise shoot

### Gameplay Tips

- Move close to the hoop for guaranteed dunks and layups
- Build combos by making consecutive successful shots
- Distance affects shooting accuracy — get closer for better chances
- Combo multiplier increases points for each successful shot
- In auto mode, **efficient play unlocks three-pointers** (see scoring section)

## 🛠️ Tech Stack

- **Frontend**: React Native 0.81.5
- **Framework**: Expo SDK 54
- **Graphics**: React Native SVG (court, ball, player are all SVG)
- **Animations**: React Native Reanimated v4 (with `react-native-worklets/plugin`)
- **Gestures**: react-native-gesture-handler
- **Layout**: react-native-safe-area-context
- **Language**: JavaScript (ES6+)

## 📦 Project Structure

```
StreetDunkExpo/
├── src/
│   ├── components/
│   │   ├── Ball.js          # Basketball physics and animations
│   │   ├── Court.js         # Court rendering and design
│   │   ├── GameControls.js  # Movement + action buttons
│   │   ├── Player.js        # Player character and animations
│   │   └── ScoreBoard.js    # Score, combo, time/moves, AUTO badge
│   └── screens/
│       └── GameScreen.js    # Main game logic, modals, AI loop
├── App.js                   # App entry point
├── app.json                 # Expo configuration (landscape lock)
├── babel.config.js          # babel-preset-expo + worklets plugin
└── package.json             # Dependencies
```

## 🎨 Features in Detail

### Player Animations
- **Running**: Dynamic leg movement with speed lines
- **Dribbling**: Realistic ball bouncing with body lean
- **Dunking**: 360° spin with explosive jump and power aura
- **Layup**: Smooth arc with arm extension
- **Shooting**: Proper shooting form with follow-through

### Ball Physics
- **Dribbling**: Realistic bounce timing and height
- **Trajectories**: Different arcs for dunks, layups, and shots
- **Spinning**: Proper rotation based on action type
- **Shadows**: Dynamic shadow effects for depth

### Scoring System

**Base points**:

- **Dunk**: 50 + (combo × 10)
- **Layup**: 30 + (combo × 5)
- **3-Pointer**: 30 + (combo × 8)
- **2-Pointer**: 20 + (combo × 5)

**Combo decay**: combo resets after 8 seconds of inactivity, or on a missed shot.

**Manual mode shoot accuracy** — probabilistic, scaling 50% → 85% based on distance from nearest hoop and current combo:

```js
const baseAccuracy  = Math.max(0.5, 1 - distance / (SCREEN_WIDTH * 0.7));
const comboBonus    = Math.min(0.2, combo * 0.03);
const finalAccuracy = Math.min(0.85, baseAccuracy + comboBonus);
const isSuccessful  = Math.random() < finalAccuracy;
```

**Auto mode shoot accuracy** — fully deterministic, tiered by distance:

| Distance from nearest hoop | Outcome |
|----------------------------|---------|
| < 20% screen width          | Always score |
| 20–40% screen width         | Score if **combo ≥ 2** |
| ≥ 40% (three-pointer range) | Score if **combo ≥ 4 OR ≥ 60% of starting moves remaining** |

### Auto Mode Move Costs

Each AI action consumes moves from the budget — paid whether the attempt scores or not:

| Action | Cost |
|--------|------|
| Move L / R                      | 1 |
| Shoot (success or miss)         | 1 |
| Layup attempt (success or fail) | 3 |
| Dunk attempt (success or fail)  | 5 |

Dunks and layups attempted away from a hoop are **failed attempts** — the cost is paid but no points are scored. The "back to center" reset after a successful score is **free**.

The game ends when moves reach 0.

## 🔧 Configuration

The game is locked to landscape orientation in `app.json`:

```json
{
  "expo": {
    "orientation": "landscape",
    "ios": { "supportsTablet": true },
    "android": { "backgroundColor": "#1a1a2e" }
  }
}
```

> Don't add duplicate `ios` or `android` keys — JSON parsers keep only the last one, silently dropping any earlier overrides.

## ⚠️ Setup Notes & Gotchas

These are issues we hit while bringing this project up — if you fork it, you may run into them too.

### 1. Match `expo` to the rest of the SDK

If `npm install` resolves an old `expo` (e.g. SDK 49) but the rest of the deps are SDK 54+ (React 19, RN 0.81, `babel-preset-expo` ~54), Metro will crash on startup with:

```
Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './src/lib/TerminalReporter'
is not defined by "exports" in node_modules/metro/package.json
```

**Fix**: pin `expo` to `~54.0.0` in `package.json`, then:

```bash
rm -rf node_modules package-lock.json
npm install
```

> ⚠️ Don't run `npx expo install --fix` to fix this — it aligns the *other* packages to the installed `expo` version, which would downgrade everything to SDK 49.

### 2. Reanimated v4 uses a different babel plugin

In `babel.config.js`:

```js
plugins: ['react-native-worklets/plugin']  // not 'react-native-reanimated/plugin'
```

After changing this, restart Metro with `npx expo start --clear` to wipe the transform cache.

### 3. iOS Modal crash with landscape lock

If you present a `<Modal>` in an app locked to landscape, iOS will throw `NSException` ("Supported orientations has no common orientation with the application") and the process aborts. The fix is to declare matching orientations on each modal:

```jsx
<Modal
  visible={...}
  transparent
  animationType="fade"
  supportedOrientations={['landscape', 'landscape-left', 'landscape-right']}
>
```

### 4. Avoid heavy/black Unicode arrows in `<Text>`

`⬅` (U+2B05), `➡` (U+27A1), `⬆` (U+2B06) are emoji-style glyphs that aren't in the iOS system text font and render as `?` placeholders. Use the basic arrows `← → ↑` or filled triangles `◀ ▶ ▲` instead.

### 5. Centering glyphs in circular buttons on Android

Android adds invisible font padding around glyphs that pushes them off-center inside small circles. Apply:

```js
{
  textAlign: 'center',
  textAlignVertical: 'center',
  includeFontPadding: false,
}
```

Avoid setting `lineHeight === fontSize` on a glyph that doesn't fit perfectly — it can shift the character above the visual center.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Future Enhancements

- [ ] Multiplayer mode
- [ ] Character customization
- [ ] Multiple court themes
- [ ] Power-ups and special moves
- [ ] Leaderboards and achievements
- [ ] Sound effects and background music
- [ ] Tournament mode
- [ ] Trick shot challenges
- [ ] Probabilistic miss chance for dunks/layups
- [ ] Visible AI strategy indicator (which action it's about to roll)

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Inspired by classic basketball arcade games
- Built with React Native and Expo
- Special thanks to the React Native community

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

**Made with ❤️ and 🏀**
