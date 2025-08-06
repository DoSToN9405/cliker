// MIRA Network Telegram Web App
// Initialize Telegram Web App
let tg = null;
let userData = {
    username: 'Loading...',
    balance: 0,
    points: 0,
    userId: null
};

// Mock data for demonstration
let leaderboardData = [
    { rank: 1, username: "CryptoKing", points: 15420, earnings: "$154.20" },
    { rank: 2, username: "TaskMaster", points: 12850, earnings: "$128.50" },
    { rank: 3, username: "EarnPro", points: 11230, earnings: "$112.30" },
    { rank: 4, username: "AdWatcher", points: 9870, earnings: "$98.70" },
    { rank: 5, username: "PointCollector", points: 8540, earnings: "$85.40" }
];

let historyData = [
    { type: "rewarded_ad", amount: 50, points: 50, timestamp: Date.now() - 3600000, status: "completed" },
    { type: "popup_ad", amount: 25, points: 25, timestamp: Date.now() - 7200000, status: "completed" },
    { type: "withdrawal", amount: -1000, points: -1000, timestamp: Date.now() - 86400000, status: "pending" },
    { type: "rewarded_ad", amount: 75, points: 75, timestamp: Date.now() - 10800000, status: "completed" }
];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeTelegramApp();
    loadUserData();
    updateUI();
    generateLeaderboard();
    generateHistory();
});

// Initialize Telegram Web App
function initializeTelegramApp() {
    try {
        tg = window.Telegram.WebApp;
        if (tg) {
            tg.ready();
            tg.expand();
            
            // Set theme colors
            document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#ffffff');
            document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#000000');
            document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#6c757d');
            document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#667eea');
            document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color || '#ffffff');
            document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', tg.themeParams.secondary_bg_color || '#f8f9fa');
            
            // Get user data from Telegram
            if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
                const user = tg.initDataUnsafe.user;
                userData.userId = user.id;
                userData.username = user.username || user.first_name || 'User';
                
                // Update profile picture if available
                if (user.photo_url) {
                    document.getElementById('profile-pic').style.backgroundImage = `url(${user.photo_url})`;
                    document.getElementById('profile-pic').textContent = '';
                } else {
                    // Use initials
                    const initials = (user.first_name || 'U').charAt(0) + (user.last_name || '').charAt(0);
                    document.getElementById('profile-pic').textContent = initials;
                }
            }
        }
    } catch (error) {
        console.log('Telegram Web App not available, running in standalone mode');
        // Fallback for testing outside Telegram
        userData.username = 'Demo User';
    }
}

// Load user data (in a real app, this would come from a backend)
function loadUserData() {
    // Simulate loading user data
    const savedData = localStorage.getItem('miraUserData');
    if (savedData) {
        const parsed = JSON.parse(savedData);
        userData.balance = parsed.balance || 0;
        userData.points = parsed.points || 0;
    } else {
        // Default values for new users
        userData.balance = 0;
        userData.points = 0;
    }
}

// Save user data
function saveUserData() {
    localStorage.setItem('miraUserData', JSON.stringify({
        balance: userData.balance,
        points: userData.points
    }));
}

// Update UI with current user data
function updateUI() {
    document.getElementById('username').textContent = userData.username;
    document.getElementById('balance-value').textContent = `$${(userData.balance / 100).toFixed(2)}`;
    document.getElementById('points-value').textContent = userData.points;
}

// View navigation
function showView(viewId) {
    // Hide all views
    const views = document.querySelectorAll('.view');
    views.forEach(view => view.classList.remove('active'));
    
    // Show selected view
    document.getElementById(viewId).classList.add('active');
    
    // Update navigation buttons
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => button.classList.remove('active'));
    
    // Find and activate the corresponding nav button
    const activeButton = document.querySelector(`[onclick="showView('${viewId}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Generate leaderboard
function generateLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    
    leaderboardData.forEach((user, index) => {
        const rankClass = index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : '';
        
        const leaderboardItem = document.createElement('div');
        leaderboardItem.className = 'leaderboard-item';
        leaderboardItem.innerHTML = `
            <div class="leaderboard-rank ${rankClass}">${user.rank}</div>
            <div class="leaderboard-info">
                <h4>${user.username}</h4>
                <p>${user.points.toLocaleString()} points</p>
            </div>
            <div class="leaderboard-points">${user.earnings}</div>
        `;
        leaderboardList.appendChild(leaderboardItem);
    });
}

// Generate history
function generateHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    
    historyData.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const icon = item.type === 'rewarded_ad' ? 'fa-rectangle-ad' : 
                    item.type === 'popup_ad' ? 'fa-window-restore' : 
                    item.type === 'withdrawal' ? 'fa-wallet' : 'fa-coins';
        
        const typeText = item.type === 'rewarded_ad' ? 'Rewarded Ad' : 
                        item.type === 'popup_ad' ? 'Popup Ad' : 
                        item.type === 'withdrawal' ? 'Withdrawal' : 'Task';
        
        const amountText = item.amount > 0 ? `+$${(item.amount / 100).toFixed(2)}` : `$${(Math.abs(item.amount) / 100).toFixed(2)}`;
        const pointsText = item.points > 0 ? `+${item.points}` : `${item.points}`;
        
        const statusClass = item.status === 'completed' ? 'success' : item.status === 'pending' ? 'warning' : 'error';
        const statusText = item.status.charAt(0).toUpperCase() + item.status.slice(1);
        
        historyItem.innerHTML = `
            <div class="task-icon">
                <i class="fa-solid ${icon}"></i>
            </div>
            <div class="task-details">
                <h3>${typeText}</h3>
                <p>${amountText} • ${pointsText} points • ${statusText}</p>
            </div>
            <div class="task-arrow">
                <span class="status-${statusClass}">${statusText}</span>
            </div>
        `;
        historyList.appendChild(historyItem);
    });
}

// Ad integration functions
function showRewardedInterstitial() {
    // Simulate ad loading
    const taskCard = event.target.closest('.task-card');
    taskCard.style.opacity = '0.7';
    taskCard.style.pointerEvents = 'none';
    
    // Show loading state
    const arrow = taskCard.querySelector('.task-arrow i');
    arrow.className = 'fa-solid fa-spinner fa-spin';
    
    // Simulate ad completion after 3 seconds
    setTimeout(() => {
        // Reward user
        const reward = 50;
        userData.balance += reward;
        userData.points += reward;
        
        // Add to history
        historyData.unshift({
            type: 'rewarded_ad',
            amount: reward,
            points: reward,
            timestamp: Date.now(),
            status: 'completed'
        });
        
        // Update UI
        updateUI();
        generateHistory();
        saveUserData();
        
        // Reset task card
        taskCard.style.opacity = '1';
        taskCard.style.pointerEvents = 'auto';
        arrow.className = 'fa-solid fa-check';
        
        // Show success message
        showMessage('Success! You earned $0.50 and 50 points!', 'success');
        
        // Reset after 2 seconds
        setTimeout(() => {
            arrow.className = 'fa-solid fa-play';
        }, 2000);
    }, 3000);
}

function showRewardedPopup() {
    // Simulate ad loading
    const taskCard = event.target.closest('.task-card');
    taskCard.style.opacity = '0.7';
    taskCard.style.pointerEvents = 'none';
    
    // Show loading state
    const arrow = taskCard.querySelector('.task-arrow i');
    arrow.className = 'fa-solid fa-spinner fa-spin';
    
    // Simulate ad completion after 2 seconds
    setTimeout(() => {
        // Reward user
        const reward = 25;
        userData.balance += reward;
        userData.points += reward;
        
        // Add to history
        historyData.unshift({
            type: 'popup_ad',
            amount: reward,
            points: reward,
            timestamp: Date.now(),
            status: 'completed'
        });
        
        // Update UI
        updateUI();
        generateHistory();
        saveUserData();
        
        // Reset task card
        taskCard.style.opacity = '1';
        taskCard.style.pointerEvents = 'auto';
        arrow.className = 'fa-solid fa-check';
        
        // Show success message
        showMessage('Success! You earned $0.25 and 25 points!', 'success');
        
        // Reset after 2 seconds
        setTimeout(() => {
            arrow.className = 'fa-solid fa-play';
        }, 2000);
    }, 2000);
}

// Modal functions
function openWithdrawModal() {
    if (userData.balance <= 0) {
        showMessage('No funds available for withdrawal.', 'error');
        return;
    }
    document.getElementById('withdraw-modal').classList.add('active');
}

function closeWithdrawModal() {
    document.getElementById('withdraw-modal').classList.remove('active');
}

function requestWithdraw() {
    if (userData.balance <= 0) {
        showMessage('No funds available for withdrawal.', 'error');
        return;
    }
    
    // Simulate withdrawal request
    const withdrawalAmount = userData.balance;
    userData.balance = 0;
    userData.points = 0;
    
    // Add to history
    historyData.unshift({
        type: 'withdrawal',
        amount: -withdrawalAmount,
        points: -userData.points,
        timestamp: Date.now(),
        status: 'pending'
    });
    
    // Update UI
    updateUI();
    generateHistory();
    saveUserData();
    
    // Close modal
    closeWithdrawModal();
    
    // Show success message
    showMessage(`Withdrawal request submitted for $${(withdrawalAmount / 100).toFixed(2)}. Processing time: 24-48 hours.`, 'success');
}

// Share app function
function shareApp() {
    const shareText = `Join MIRA Network and start earning! Complete tasks and watch ads to earn money.`;
    const shareUrl = 'https://t.me/your_bot_username'; // Replace with your bot username
    
    if (tg && tg.MainButton) {
        // Use Telegram's share functionality
        tg.MainButton.text = "Share App";
        tg.MainButton.show();
        tg.MainButton.onClick(() => {
            tg.sendData(JSON.stringify({
                action: 'share',
                text: shareText,
                url: shareUrl
            }));
        });
    } else {
        // Fallback for web browsers
        if (navigator.share) {
            navigator.share({
                title: 'MIRA Network',
                text: shareText,
                url: shareUrl
            });
        } else {
            // Copy to clipboard
            navigator.clipboard.writeText(`${shareText}\n${shareUrl}`).then(() => {
                showMessage('Share link copied to clipboard!', 'success');
            });
        }
    }
}

// Utility functions
function showMessage(message, type = 'info') {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `${type}-message`;
    messageEl.textContent = message;
    
    // Insert at top of main content
    const mainContent = document.getElementById('main-content');
    mainContent.insertBefore(messageEl, mainContent.firstChild);
    
    // Remove after 5 seconds
    setTimeout(() => {
        messageEl.remove();
    }, 5000);
}

// Handle back button (if available)
if (tg && tg.BackButton) {
    tg.BackButton.onClick(() => {
        // Navigate back to home view
        showView('home-view');
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