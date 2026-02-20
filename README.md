# 🏀 Street Dunk Challenge

An immersive mobile basketball arcade game built with React Native and Expo. Perform high-flying dunks, smooth layups, and precision shots across a dynamic street basketball court.

![Street Dunk Challenge](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.76.5-61DAFB?logo=react)
![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?logo=expo)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎮 Game Features

- **Intuitive Controls**: Simple left/right movement with tap/long-press actions
- **Realistic Animations**: Smooth player movements with dribbling, dunking, layup, and shooting animations
- **Dynamic Gameplay**: Auto-dribbling system with ball physics and realistic trajectories
- **Combo System**: Build combos with successful shots to increase your score multiplier
- **Multiple Shot Types**: 
  - 🔥 Dunks (50+ points) - Epic 360° spins with power aura
  - 🏀 Layups (30+ points) - Graceful close-range shots
  - 🎯 2-Pointers & 3-Pointers (20-30 points) - Distance-based shooting
- **Landscape Mode**: Optimized for horizontal gameplay
- **Beautiful Court Design**: Vibrant orange court with professional basketball markings

## 📱 Screenshots

*Coming soon - Add your gameplay screenshots here*

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
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

## 🎯 How to Play

### Controls
- **⬅️ Left Arrow**: Move player left
- **➡️ Right Arrow**: Move player right
- **⬆️ Up Arrow (Press)**: Dunk (near hoop) or Shoot (away from hoop)
- **⬆️ Up Arrow (Long Press)**: Layup (near hoop)

### Gameplay Tips
- Move close to the hoop for guaranteed dunks and layups
- Build combos by making consecutive successful shots
- Distance affects shooting accuracy - get closer for better chances
- Combo multiplier increases points for each successful shot

## 🛠️ Tech Stack

- **Frontend**: React Native
- **Framework**: Expo SDK 54
- **Graphics**: React Native SVG
- **Animations**: React Native Animated API
- **Language**: JavaScript (ES6+)

## 📦 Project Structure

```
StreetDunkExpo/
├── src/
│   ├── components/
│   │   ├── Ball.js          # Basketball physics and animations
│   │   ├── Court.js         # Court rendering and design
│   │   ├── GameControls.js  # Input controls
│   │   ├── Player.js        # Player character and animations
│   │   └── ScoreBoard.js    # Score display
│   └── screens/
│       └── GameScreen.js    # Main game logic
├── App.js                   # App entry point
├── app.json                 # Expo configuration
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
- **Base Points**: 
  - Dunk: 50 points
  - Layup: 30 points
  - 3-Pointer: 30 points
  - 2-Pointer: 20 points
- **Combo Multiplier**: Increases with consecutive successful shots
- **Accuracy**: Distance-based with combo bonuses

## 🔧 Configuration

The game is configured for landscape orientation. To modify settings, edit `app.json`:

```json
{
  "expo": {
    "orientation": "landscape",
    "ios": {
      "orientation": "landscape"
    },
    "android": {
      "orientation": "landscape"
    }
  }
}
```

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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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
