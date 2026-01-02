# おみくじ (Omikuji) - Interactive Fortune Drawing

An interactive website simulating the traditional Japanese omikuji (fortune drawing) experience found at shrines. Draw your fortune with beautiful 3D animations and traditional aesthetics.

## Features

- **3D Interactive Experience**: Shake a realistic omikuji box using Three.js
- **Traditional Fortune System**: Authentic Japanese fortune levels and categories
- **Beautiful Animations**: Smooth transitions from shaking to fortune reveal
- **Mobile Responsive**: Full touch support for mobile devices
- **Accessibility**: Keyboard navigation and screen reader support
- **No Build Required**: Pure HTML/CSS/JS with CDN libraries

## How to Use

1. **Shake the Box**: Click and drag on the omikuji box to shake it
2. **Watch the Stick Emerge**: After enough shaking, a fortune stick will slide out
3. **Unfold Your Fortune**: Click to unfold the paper and reveal your fortune
4. **Draw Again**: Click the button to draw another fortune

## Fortune Levels

The traditional Japanese fortune system includes:
- **大吉 (Daikichi)** - Great Fortune
- **吉 (Kichi)** - Good Fortune
- **中吉 (Chukichi)** - Middle Fortune
- **小吉 (Shokichi)** - Small Fortune
- **末吉 (Suekichi)** - Future Fortune
- **凶 (Kyo)** - Bad Fortune

Each fortune includes guidance for:
- 願事 (Wishes)
- 恋愛 (Love)
- 健康 (Health)
- 仕事 (Business)
- 学問 (Studies)
- 旅行 (Travel)

## Deployment to GitHub Pages

1. Create a new repository on GitHub
2. Push this folder to the repository
3. Go to repository Settings → Pages
4. Select the branch and folder containing `index.html`
5. Your site will be live at `https://[username].github.io/[repository-name]/`

## Technologies Used

- **Three.js** (r128) - 3D graphics and animations
- **Google Fonts** - Noto Serif JP and Crimson Text
- **Vanilla JavaScript** - No frameworks required
- **CSS3** - Modern animations and responsive design

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## File Structure

```
new_year_greetings/
├── index.html          # Main HTML structure
├── css/
│   └── style.css      # Traditional Japanese styling
├── js/
│   ├── main.js        # Application state machine
│   ├── animation.js   # 3D animation controller
│   └── fortunes.js    # Fortune data and logic
└── assets/
    ├── textures/      # (Optional) Additional textures
    └── sounds/        # (Optional) Sound effects
```

## Credits

Created as a New Year 2026 greeting project celebrating Japanese shrine traditions.

## License

Free to use for personal and educational purposes.

