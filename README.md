# MIRA Network - Telegram Web App

A modern, mobile-first Telegram Web App for task-based earning and rewards. Users can complete tasks, watch ads, and withdraw their earnings.

## Features

- **Multi-view Interface**: Home, Tasks, Leaderboard, and History views
- **Telegram Integration**: Full Telegram Web App API integration with theme support
- **Ad Integration**: Simulated rewarded ads and popup ads
- **User Management**: Balance tracking, points system, and withdrawal requests
- **Leaderboard**: Real-time ranking system for top earners
- **Activity History**: Complete transaction and task history
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark Mode Support**: Automatic theme adaptation based on Telegram settings

## File Structure

```
mira-network/
├── index.html          # Main HTML file
├── style.css           # CSS styles and responsive design
├── script.js           # JavaScript functionality and Telegram integration
└── README.md           # Project documentation
```

## Setup Instructions

### 1. Local Development

1. Clone or download the project files
2. Open `index.html` in a web browser for testing
3. The app will run in standalone mode for development

### 2. Telegram Bot Integration

1. Create a Telegram bot using [@BotFather](https://t.me/botfather)
2. Set up your bot's Web App URL to point to your hosted version
3. Configure the bot's menu button to launch the Web App

### 3. Deployment

#### Option A: GitHub Pages
1. Push your code to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Use the provided URL as your Web App URL

#### Option B: Netlify/Vercel
1. Connect your repository to Netlify or Vercel
2. Deploy automatically on push
3. Use the provided URL as your Web App URL

#### Option C: Traditional Hosting
1. Upload files to your web server
2. Ensure HTTPS is enabled (required for Telegram Web Apps)
3. Use your domain URL as the Web App URL

## Configuration

### Telegram Web App Settings

Update the following in `script.js`:

```javascript
// Replace with your bot's username
const shareUrl = 'https://t.me/your_bot_username';
```

### Ad Integration

The current implementation uses simulated ads. To integrate real ad networks:

1. Replace the ad functions in `script.js`
2. Integrate with your preferred ad network (AdMob, Facebook Audience Network, etc.)
3. Update reward calculations based on your ad network's payout structure

### Backend Integration

For production use, you'll need to:

1. Set up a backend API for user data management
2. Replace localStorage with server-side data storage
3. Implement real payment processing for withdrawals
4. Add user authentication and security measures

## Features in Detail

### Home View
- User profile display with Telegram integration
- Current balance and points display
- Quick action buttons for tasks and withdrawals

### Tasks View
- Available earning tasks
- Ad integration (currently simulated)
- Real-time reward tracking

### Leaderboard View
- Top earners ranking
- Points and earnings display
- Gold, silver, bronze medal system

### History View
- Complete transaction history
- Task completion records
- Withdrawal request tracking

### Withdrawal System
- Modal confirmation dialog
- Balance validation
- Request processing simulation

## Customization

### Colors and Themes
The app automatically adapts to Telegram's theme colors. You can customize the fallback colors in `style.css`:

```css
:root {
  --tg-theme-bg-color: #ffffff;
  --tg-theme-text-color: #000000;
  --tg-theme-button-color: #667eea;
  /* ... other colors */
}
```

### Ad Rewards
Modify reward amounts in `script.js`:

```javascript
// Rewarded interstitial ad reward
const reward = 50; // $0.50

// Popup ad reward  
const reward = 25; // $0.25
```

### Task Types
Add new task types by:
1. Adding new task cards in `index.html`
2. Creating corresponding functions in `script.js`
3. Updating the history generation logic

## Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## Mobile Optimization

The app is optimized for mobile devices with:
- Touch-friendly interface
- Responsive design
- Mobile-optimized navigation
- Fast loading times

## Security Considerations

For production deployment:
- Implement proper user authentication
- Add CSRF protection
- Use HTTPS only
- Validate all user inputs
- Implement rate limiting
- Add proper error handling

## License

This project is open source and available under the MIT License.

## Support

For questions or issues:
1. Check the Telegram Web App documentation
2. Review the code comments for implementation details
3. Test thoroughly in the Telegram environment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Note**: This is a demonstration implementation. For production use, implement proper backend services, real ad integration, and security measures.
