# おみくじ (Omikuji) - Interactive Fortune Drawing

An interactive website simulating the traditional Japanese omikuji (fortune drawing) experience found at shrines. Draw your fortune with beautiful 3D animations and traditional aesthetics.

## Features

- **3D Interactive Experience**: Shake a realistic omikuji box using Three.js
- **Traditional Fortune System**: Authentic Japanese fortune levels and categories
- **Beautiful Animations**: Smooth transitions from shaking to fortune reveal
- **Share Your Fortune**: Download as image or share on social media
- **Mobile Responsive**: Full touch support for mobile devices
- **Accessibility**: Keyboard navigation and screen reader support
- **No Build Required**: Pure HTML/CSS/JS with CDN libraries

## How to Use

### Desktop
1. **Shake the Box**: Click and drag on the omikuji box to shake it (or press Enter/Space)
2. **Watch the Stick Emerge**: After enough shaking, a fortune stick will slide out
3. **Unfold Your Fortune**: Click on the paper to unfold and reveal your fortune
4. **Share Your Fortune**: Use the share buttons below
5. **Draw Again**: Click the button to draw another fortune

### Mobile
1. **Shake the Box**: Touch and drag on the omikuji box to shake it
2. **Watch the Stick Emerge**: After enough shaking, a fortune stick will slide out
3. **Unfold Your Fortune**: Tap on the paper to unfold and reveal your fortune
4. **Share Your Fortune**: Tap any share button (icons only on mobile)
5. **Draw Again**: Tap the button to draw another fortune

## Share Options

After revealing your fortune, you can share it in multiple ways:

- **📥 Download**: Creates a high-quality PNG image of your fortune (2x resolution)
- **📸 Instagram**: Downloads the image with instructions to post on Instagram
- **💬 WhatsApp**: Opens WhatsApp with your fortune pre-formatted (includes all categories)
- **🐦 X (Twitter)**: Opens Twitter with a pre-written tweet about your fortune
- **🔗 Copy Link**: Copies the website URL to your clipboard for easy sharing

All sharing is done client-side with no data sent to servers. You control what gets shared.

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

## Technical Details

### Technologies Used
- **Three.js** (r128) - 3D graphics and animations
- **html2canvas** (1.4.1) - Fortune image generation for sharing
- **Google Fonts** - Noto Serif JP and Crimson Text for authentic typography
- **Vanilla JavaScript** - No build tools or npm required
- **CSS3** - Modern animations, gradients, and responsive design

### Browser Support
- **Desktop**: Chrome/Edge, Firefox, Safari (latest versions)
- **Mobile**: iOS Safari 14+, Chrome Android (latest)
- **Features**: WebGL, Canvas API, Clipboard API (with fallbacks)

### Responsive Design
- **Desktop (>768px)**: Full experience with text labels on buttons
- **Tablet (768px)**: Optimized layout with adjusted sizing
- **Mobile (<768px)**: Icon-only buttons, touch-optimized interactions
- **Small Mobile (<480px)**: Compact layout for smaller screens

## Deployment to GitHub Pages

1. Create a new repository on GitHub
2. Push this folder to the repository
3. Go to repository Settings → Pages
4. Select the branch and folder containing `index.html`
5. Your site will be live at `https://[username].github.io/[repository-name]/`

## Troubleshooting

### Mobile Issues
- **Can't unfold paper**: Make sure to tap directly on the paper (not dragging)
- **Shaking not working**: Try using a single finger with clear drag gestures
- **Share buttons not working**: Allow pop-ups and clipboard access in browser settings

### Desktop Issues
- **3D box not showing**: Check if WebGL is enabled in your browser
- **Download not working**: Check browser download permissions
- **Copy link fails**: Try the fallback method or use a modern browser

## File Structure

```
japan_omikuji/
├── index.html          # Main HTML structure
├── css/
│   └── style.css      # Traditional Japanese styling
├── js/
│   ├── main.js        # Application state machine
│   ├── animation.js   # 3D animation controller
│   ├── fortunes.js    # Fortune data and logic
│   └── share.js       # Share functionality
└── assets/
    ├── textures/      # (Optional) Additional textures
    └── sounds/        # (Optional) Sound effects
```

## Credits

Created as a New Year 2026 greeting project celebrating Japanese shrine traditions.

## License

Free to use for personal and educational purposes.

