# MIRA Network - Telegram Web App

A modern Telegram Web App for earning money through watching ads and completing tasks. Built with vanilla HTML, CSS, and JavaScript with full Telegram Web App integration.

## Features

### 🏠 Home View
- User profile display with Telegram integration
- Real-time balance and points tracking
- Quick access to tasks and withdrawal
- Modern card-based UI design

### 📋 Tasks View
- Rewarded interstitial ads
- Rewarded popup ads
- Real-time reward tracking
- Ad completion notifications

### 🏆 Leaderboard
- Top earners ranking
- Points and balance display
- Gold, silver, bronze medal system
- Real-time updates

### 📊 History
- Transaction history
- Reward and withdrawal tracking
- Timestamp formatting
- Activity categorization

### 💰 Withdrawal System
- Modal confirmation dialog
- Balance validation
- Telegram bot integration
- Transaction logging

## Technical Features

- **Telegram Web App Integration**: Full integration with Telegram's Web App API
- **Theme Support**: Automatic theme adaptation based on Telegram's theme
- **Responsive Design**: Mobile-first design with touch-friendly interface
- **Ad Integration**: LibTL SDK integration for rewarded ads
- **Real-time Updates**: Dynamic UI updates without page refresh
- **Offline Support**: Graceful fallbacks for testing outside Telegram

## File Structure

```
mira-network/
├── index.html          # Main HTML file
├── style.css           # CSS styles and theming
├── script.js           # JavaScript functionality
└── README.md          # Project documentation
```

## Setup Instructions

### 1. Local Development

1. Clone or download the project files
2. Open `index.html` in a web browser
3. The app will work in test mode with mock data

### 2. Telegram Bot Integration

1. Create a Telegram bot using [@BotFather](https://t.me/botfather)
2. Set up your bot's Web App URL
3. Update the bot username in `script.js` (line 365)
4. Deploy to a web server with HTTPS

### 3. Ad Integration

The app uses LibTL SDK for ads. To configure:

1. Replace the LibTL script tag in `index.html` with your zone
2. Update the ad function calls in `script.js`
3. Test ad functionality in production environment

## Customization

### Theme Colors

The app automatically adapts to Telegram's theme, but you can customize fallback colors in `style.css`:

```css
:root {
  --tg-theme-bg-color: #ffffff;
  --tg-theme-text-color: #000000;
  --tg-theme-button-color: #0088cc;
  /* ... more variables */
}
```

### Ad Rewards

Modify reward amounts in `script.js`:

```javascript
// In showRewardedInterstitial()
const reward = 5.00;  // Change reward amount
const points = 100;   // Change points amount
```

### API Integration

Replace mock data with real API calls:

```javascript
// Replace loadAppData() with real API calls
async function loadAppData() {
  const response = await fetch('/api/user-data');
  appData = await response.json();
  updateUI();
}
```

## Deployment

### Static Hosting

1. Upload all files to your web server
2. Ensure HTTPS is enabled (required for Telegram Web Apps)
3. Update your bot's Web App URL in BotFather

### Recommended Hosting

- **Vercel**: Easy deployment with automatic HTTPS
- **Netlify**: Simple static site hosting
- **GitHub Pages**: Free hosting for public repositories
- **Firebase Hosting**: Google's hosting solution

## Telegram Web App Requirements

- **HTTPS**: Required for all Telegram Web Apps
- **Responsive Design**: Must work on mobile devices
- **Theme Integration**: Should adapt to Telegram's theme
- **Performance**: Fast loading and smooth interactions

## Browser Support

- Chrome/Chromium (recommended)
- Safari (iOS/macOS)
- Firefox
- Edge

## Development Notes

### Testing Outside Telegram

The app includes fallback functionality for testing outside the Telegram environment:

- Mock user data
- Simulated ad interactions
- Test notifications
- Local storage for persistence

### Security Considerations

- Validate all user data from Telegram
- Implement proper CSRF protection
- Use HTTPS in production
- Sanitize user inputs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For support or questions:
- Create an issue in the repository
- Contact the development team
- Check the Telegram Web App documentation

## Changelog

### v1.0.0
- Initial release
- Basic ad integration
- User profile system
- Leaderboard functionality
- Transaction history
- Withdrawal system

---

**Note**: This is a demo/example implementation. For production use, implement proper backend services, database storage, and security measures.
