# Share Feature Documentation

## Overview
The share feature allows users to share their omikuji fortune in multiple ways after it's revealed.

## Features Implemented

### 1. Download as Image 📥
- **Technology**: html2canvas library (CDN)
- **Functionality**: Converts the fortune paper to a high-quality PNG image
- **User Experience**: 
  - Button shows "Generating..." while creating image
  - Automatically downloads with timestamp filename: `omikuji-fortune-YYYY-MM-DD.png`
  - Share section and reset button are temporarily hidden for cleaner image
  - 2x scale for high quality output

### 2. Instagram Sharing 📸
- **Functionality**: Downloads the image and provides instructions
- **User Experience**: 
  - Triggers image download
  - Shows alert with instructions to upload from gallery
  - (Instagram doesn't support direct web sharing)

### 3. WhatsApp Sharing 💬
- **Functionality**: Opens WhatsApp with pre-formatted message
- **Message Includes**:
  - Fortune level (Japanese and English)
  - All 6 fortune categories with their messages
  - Link to the website
- **User Experience**: Opens WhatsApp in new window/app

### 4. X (Twitter) Sharing 🐦
- **Functionality**: Opens Twitter with pre-formatted tweet
- **Tweet Includes**:
  - Fortune level
  - Link to website
  - Hashtags: #omikuji #fortune #Japanese
- **User Experience**: Opens Twitter compose window (550x420px)

### 5. Copy Link 🔗
- **Functionality**: Copies current page URL to clipboard
- **Technology**: 
  - Modern Clipboard API (primary)
  - Fallback for older browsers (textarea method)
- **User Experience**:
  - Button changes to green with "Copied!" message
  - Resets after 2 seconds
  - Fallback alert if clipboard access fails

## Files Modified

### 1. `index.html`
- Added html2canvas CDN link
- Added share section HTML with 5 buttons
- Added share.js script import
- Includes SVG icons for each share method

### 2. `css/style.css`
- Added `.share-section` styling
- Added `.share-buttons` flex layout
- Added individual button styles for each platform:
  - Download: Blue gradient
  - Instagram: Pink/purple gradient
  - WhatsApp: Green gradient
  - X/Twitter: Black gradient
  - Copy Link: Gray gradient (turns green when copied)
- Added responsive styles for mobile (icons only, no text)

### 3. `js/share.js` (NEW)
- `ShareManager` object with all sharing functionality
- `init()`: Initializes and sets up event listeners
- `downloadAsImage()`: Generates and downloads fortune image
- `shareToInstagram()`: Downloads image with instructions
- `shareToWhatsApp()`: Opens WhatsApp with formatted message
- `shareToTwitter()`: Opens Twitter with formatted tweet
- `copyLink()`: Copies URL to clipboard
- `createShareText()`: Formats fortune data for sharing
- `showSuccessMessage()`: Visual feedback for actions

### 4. `README.md`
- Updated features list
- Updated how-to-use section
- Updated technologies list
- Updated file structure

## Responsive Design

### Desktop (>768px)
- All buttons show icons + text
- Buttons arranged in a row with wrapping
- Full padding and spacing

### Mobile (≤768px)
- Buttons show icons only (text hidden)
- Larger icons (24x24px)
- Reduced padding
- Tighter spacing

## Browser Compatibility

### Modern Browsers (Full Support)
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS 14+, Android Chrome)

### Features with Fallbacks
- **Clipboard API**: Falls back to textarea selection method
- **html2canvas**: Works on all modern browsers with canvas support

## User Flow

1. User draws fortune and sees result
2. Share section appears below fortune categories
3. User can choose any sharing method:
   - **Download**: Gets PNG image immediately
   - **Instagram**: Gets image + instructions
   - **WhatsApp**: Opens app with message
   - **Twitter**: Opens compose window
   - **Copy Link**: Gets URL in clipboard
4. Visual feedback confirms action
5. User can share multiple times or draw another fortune

## Styling Details

### Color Scheme
- Download: Blue (#4A90E2)
- Instagram: Gradient (Pink → Purple)
- WhatsApp: Green (#25D366)
- X/Twitter: Black
- Copy Link: Gray (→ Green when copied)

### Animations
- Hover: Slight lift (translateY -2px)
- Active: Press down effect
- Success: Icon change + color change
- All transitions: 0.3s ease

## Technical Notes

### html2canvas Configuration
```javascript
{
    backgroundColor: '#FFFAF0',  // Match paper color
    scale: 2,                     // High quality
    logging: false,               // No console spam
    useCORS: true,                // Load external resources
    allowTaint: true              // Allow cross-origin images
}
```

### Share Text Format
- Emoji for visual appeal
- All fortune categories included
- Clear formatting with line breaks
- Website link at the end

### Security Considerations
- No sensitive data shared
- URL only contains page location
- No user tracking or analytics
- All sharing happens client-side

## Future Enhancements (Optional)

1. **Custom Messages**: Allow users to add personal notes
2. **Image Customization**: Choose background colors/patterns
3. **Social Media Preview**: Generate Open Graph meta tags
4. **Share Analytics**: Track which platforms are most popular
5. **QR Code**: Generate QR code for easy mobile sharing
6. **Email Sharing**: Add email option with formatted message
7. **Print Option**: Add print-friendly version

## Testing Checklist

- [x] Download creates valid PNG image
- [x] Instagram triggers download + shows instructions
- [x] WhatsApp opens with correct message
- [x] Twitter opens with correct tweet
- [x] Copy link works on modern browsers
- [x] Copy link fallback works on older browsers
- [x] Buttons show correct visual feedback
- [x] Mobile responsive (icons only)
- [x] Desktop shows full buttons
- [x] No console errors
- [x] Accessible (ARIA labels)

## Support

If you encounter any issues:
1. Check browser console for errors
2. Verify html2canvas CDN is loading
3. Test clipboard permissions in browser
4. Try different browsers
5. Check mobile vs desktop behavior

---

**Created**: January 2026
**Version**: 1.0.0

