// Telegram Web App initialization
let tg = null;
let userData = {
    id: null,
    username: null,
    firstName: null,
    lastName: null,
    photoUrl: null
};

let appData = {
    balance: 0,
    points: 0,
    history: [],
    leaderboard: []
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeTelegramWebApp();
    loadUserData();
    loadAppData();
    setupEventListeners();
});

// Initialize Telegram Web App
function initializeTelegramWebApp() {
    try {
        tg = window.Telegram.WebApp;
        if (tg) {
            tg.ready();
            tg.expand();
            
            // Set theme
            document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#ffffff');
            document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#000000');
            document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#999999');
            document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#0088cc');
            document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color || '#ffffff');
            document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', tg.themeParams.secondary_bg_color || '#f8f9fa');
            
            // Get user data
            if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
                userData = {
                    id: tg.initDataUnsafe.user.id,
                    username: tg.initDataUnsafe.user.username,
                    firstName: tg.initDataUnsafe.user.first_name,
                    lastName: tg.initDataUnsafe.user.last_name,
                    photoUrl: tg.initDataUnsafe.user.photo_url
                };
            }
        }
    } catch (error) {
        console.error('Telegram Web App initialization failed:', error);
        // Fallback for testing outside Telegram
        userData = {
            id: 123456789,
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
            photoUrl: null
        };
    }
}

// Load user data
function loadUserData() {
    const usernameElement = document.getElementById('username');
    const profilePicElement = document.getElementById('profile-pic');
    
    if (userData.username) {
        usernameElement.textContent = `@${userData.username}`;
    } else if (userData.firstName) {
        usernameElement.textContent = `${userData.firstName} ${userData.lastName || ''}`.trim();
    } else {
        usernameElement.textContent = 'User';
    }
    
    if (userData.photoUrl) {
        profilePicElement.style.backgroundImage = `url(${userData.photoUrl})`;
        profilePicElement.style.backgroundSize = 'cover';
        profilePicElement.style.backgroundPosition = 'center';
        profilePicElement.textContent = '';
    } else {
        // Generate initials
        const initials = (userData.firstName || 'U').charAt(0) + (userData.lastName || 'S').charAt(0);
        profilePicElement.textContent = initials.toUpperCase();
    }
}

// Load app data (simulate API calls)
function loadAppData() {
    // Simulate loading data
    setTimeout(() => {
        appData = {
            balance: 25.50,
            points: 1250,
            history: [
                {
                    id: 1,
                    type: 'reward',
                    title: 'Rewarded Ad Completed',
                    description: 'Watched interstitial ad',
                    amount: 5.00,
                    points: 100,
                    timestamp: new Date(Date.now() - 3600000)
                },
                {
                    id: 2,
                    type: 'withdrawal',
                    title: 'Withdrawal Request',
                    description: 'Pending withdrawal',
                    amount: -15.00,
                    points: -300,
                    timestamp: new Date(Date.now() - 86400000)
                }
            ],
            leaderboard: [
                { id: 1, username: '@earner1', points: 5000, balance: 250.00 },
                { id: 2, username: '@earner2', points: 4200, balance: 210.00 },
                { id: 3, username: '@earner3', points: 3800, balance: 190.00 },
                { id: 4, username: '@earner4', points: 3200, balance: 160.00 },
                { id: 5, username: '@earner5', points: 2800, balance: 140.00 }
            ]
        };
        
        updateUI();
        loadLeaderboard();
        loadHistory();
    }, 1000);
}

// Update UI with current data
function updateUI() {
    const balanceElement = document.getElementById('balance-value');
    const pointsElement = document.getElementById('points-value');
    
    balanceElement.textContent = `$${appData.balance.toFixed(2)}`;
    pointsElement.textContent = appData.points.toLocaleString();
}

// Setup event listeners
function setupEventListeners() {
    // Add any additional event listeners here
}

// Navigation functions
function showView(viewId) {
    // Hide all views
    const views = document.querySelectorAll('.view');
    views.forEach(view => view.classList.remove('active'));
    
    // Show target view
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.add('active');
    }
    
    // Update navigation buttons
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => button.classList.remove('active'));
    
    // Find and activate corresponding nav button
    const activeButton = document.querySelector(`[onclick="showView('${viewId}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Ad functionality
function showRewardedInterstitial() {
    if (typeof show_9657195 !== 'undefined') {
        show_9657195();
        
        // Simulate ad completion
        setTimeout(() => {
            const reward = 5.00;
            const points = 100;
            
            appData.balance += reward;
            appData.points += points;
            
            // Add to history
            appData.history.unshift({
                id: Date.now(),
                type: 'reward',
                title: 'Rewarded Interstitial Completed',
                description: 'Watched full-screen ad',
                amount: reward,
                points: points,
                timestamp: new Date()
            });
            
            updateUI();
            loadHistory();
            
            // Show success message
            showNotification('Ad completed! +$' + reward.toFixed(2) + ' earned', 'success');
        }, 3000);
    } else {
        // Fallback for testing
        showNotification('Ad SDK not available', 'error');
    }
}

function showRewardedPopup() {
    if (typeof show_9657195 !== 'undefined') {
        show_9657195();
        
        // Simulate ad completion
        setTimeout(() => {
            const reward = 2.50;
            const points = 50;
            
            appData.balance += reward;
            appData.points += points;
            
            // Add to history
            appData.history.unshift({
                id: Date.now(),
                type: 'reward',
                title: 'Rewarded Popup Completed',
                description: 'Watched popup ad',
                amount: reward,
                points: points,
                timestamp: new Date()
            });
            
            updateUI();
            loadHistory();
            
            // Show success message
            showNotification('Ad completed! +$' + reward.toFixed(2) + ' earned', 'success');
        }, 2000);
    } else {
        // Fallback for testing
        showNotification('Ad SDK not available', 'error');
    }
}

// Modal functions
function openWithdrawModal() {
    const modal = document.getElementById('withdraw-modal');
    modal.classList.add('active');
}

function closeWithdrawModal() {
    const modal = document.getElementById('withdraw-modal');
    modal.classList.remove('active');
}

function requestWithdraw() {
    if (appData.balance <= 0) {
        showNotification('No balance available for withdrawal', 'error');
        closeWithdrawModal();
        return;
    }
    
    // Simulate withdrawal request
    const withdrawalAmount = appData.balance;
    const withdrawalPoints = appData.points;
    
    appData.balance = 0;
    appData.points = 0;
    
    // Add to history
    appData.history.unshift({
        id: Date.now(),
        type: 'withdrawal',
        title: 'Withdrawal Requested',
        description: 'Pending processing',
        amount: -withdrawalAmount,
        points: -withdrawalPoints,
        timestamp: new Date()
    });
    
    updateUI();
    loadHistory();
    closeWithdrawModal();
    
    showNotification('Withdrawal request submitted!', 'success');
    
    // Notify Telegram bot (if available)
    if (tg && tg.sendData) {
        tg.sendData(JSON.stringify({
            action: 'withdrawal_request',
            amount: withdrawalAmount,
            userId: userData.id
        }));
    }
}

// Load leaderboard data
function loadLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    if (!leaderboardList) return;
    
    leaderboardList.innerHTML = '';
    
    appData.leaderboard.forEach((user, index) => {
        const rankClass = index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : '';
        
        const leaderboardItem = document.createElement('div');
        leaderboardItem.className = 'leaderboard-item';
        leaderboardItem.innerHTML = `
            <div class="rank ${rankClass}">${index + 1}</div>
            <div class="user-info">
                <h4>${user.username}</h4>
                <p>${user.points.toLocaleString()} points</p>
            </div>
            <div class="points">$${user.balance.toFixed(2)}</div>
        `;
        
        leaderboardList.appendChild(leaderboardItem);
    });
}

// Load history data
function loadHistory() {
    const historyList = document.getElementById('history-list');
    if (!historyList) return;
    
    historyList.innerHTML = '';
    
    appData.history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const icon = item.type === 'reward' ? 'fa-solid fa-gift' : 'fa-solid fa-wallet';
        const amountClass = item.amount >= 0 ? 'success' : 'error';
        const amountSign = item.amount >= 0 ? '+' : '';
        
        historyItem.innerHTML = `
            <div class="icon">
                <i class="${icon}"></i>
            </div>
            <div class="details">
                <h4>${item.title}</h4>
                <p>${item.description} • ${formatTimestamp(item.timestamp)}</p>
            </div>
            <div class="amount ${amountClass}">
                ${amountSign}$${Math.abs(item.amount).toFixed(2)}
            </div>
        `;
        
        historyList.appendChild(historyItem);
    });
}

// Utility functions
function formatTimestamp(timestamp) {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return timestamp.toLocaleDateString();
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#0088cc'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 3000;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Share app function
function shareApp() {
    const shareText = 'Check out MIRA Network - Earn money by watching ads and completing tasks!';
    const shareUrl = 'https://t.me/your_bot_username'; // Replace with your bot username
    
    if (tg && tg.shareUrl) {
        tg.shareUrl(shareUrl, shareText);
    } else if (navigator.share) {
        navigator.share({
            title: 'MIRA Network',
            text: shareText,
            url: shareUrl
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(`${shareText}\n${shareUrl}`).then(() => {
            showNotification('Link copied to clipboard!', 'success');
        });
    }
}

// Handle back button (if available)
if (tg && tg.BackButton) {
    tg.BackButton.onClick(() => {
        // Handle back navigation
        const activeView = document.querySelector('.view.active');
        if (activeView && activeView.id !== 'home-view') {
            showView('home-view');
        }
    });
}

// Export functions for global access
window.showView = showView;
window.showRewardedInterstitial = showRewardedInterstitial;
window.showRewardedPopup = showRewardedPopup;
window.openWithdrawModal = openWithdrawModal;
window.closeWithdrawModal = closeWithdrawModal;
window.requestWithdraw = requestWithdraw;
window.shareApp = shareApp;