// App State Management
class MiraApp {
    constructor() {
        this.userData = {
            username: 'Loading...',
            balance: 0.00,
            points: 0,
            profilePic: 'EE'
        };
        
        this.leaderboardData = [];
        this.historyData = [];
        this.currentView = 'home-view';
        
        this.init();
    }
    
    init() {
        this.loadUserData();
        this.initializeLeaderboard();
        this.initializeHistory();
        this.setupEventListeners();
        this.initializeTelegram();
        this.loadAds();
    }
    
    // User Data Management
    loadUserData() {
        // Try to load from localStorage first
        const savedData = localStorage.getItem('mira-user-data');
        if (savedData) {
            this.userData = { ...this.userData, ...JSON.parse(savedData) };
        }
        
        // Try to get Telegram user data if available
        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe.user) {
            const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
            this.userData.username = tgUser.first_name + (tgUser.last_name ? ' ' + tgUser.last_name : '');
            this.userData.profilePic = (tgUser.first_name.charAt(0) + (tgUser.last_name ? tgUser.last_name.charAt(0) : '')).toUpperCase();
        } else {
            // Fallback to demo data
            this.userData.username = 'Demo User';
            this.userData.profilePic = 'DU';
        }
        
        this.updateUI();
    }
    
    saveUserData() {
        localStorage.setItem('mira-user-data', JSON.stringify(this.userData));
    }
    
    updateUI() {
        // Update username and profile
        const usernameEl = document.getElementById('username');
        const profilePicEl = document.getElementById('profile-pic');
        const balanceEl = document.getElementById('balance-value');
        const pointsEl = document.getElementById('points-value');
        
        if (usernameEl) usernameEl.textContent = this.userData.username;
        if (profilePicEl) profilePicEl.textContent = this.userData.profilePic;
        if (balanceEl) balanceEl.textContent = `$${this.userData.balance.toFixed(2)}`;
        if (pointsEl) pointsEl.textContent = this.userData.points.toLocaleString();
    }
    
    // Points and Balance Management
    addPoints(amount) {
        this.userData.points += amount;
        this.userData.balance += amount * 0.001; // 1 point = $0.001
        this.updateUI();
        this.saveUserData();
        this.addToHistory('Points Earned', `+${amount} points`, new Date());
        this.showNotification(`+${amount} points earned!`, 'success');
    }
    
    // History Management
    addToHistory(action, details, timestamp) {
        const historyItem = {
            id: Date.now(),
            action,
            details,
            timestamp,
            amount: details.includes('+') ? details : null
        };
        
        this.historyData.unshift(historyItem);
        if (this.historyData.length > 50) {
            this.historyData = this.historyData.slice(0, 50);
        }
        
        localStorage.setItem('mira-history', JSON.stringify(this.historyData));
        this.renderHistory();
    }
    
    initializeHistory() {
        const savedHistory = localStorage.getItem('mira-history');
        if (savedHistory) {
            this.historyData = JSON.parse(savedHistory);
        } else {
            // Add some demo history
            this.historyData = [
                {
                    id: 1,
                    action: 'Welcome Bonus',
                    details: '+100 points',
                    timestamp: new Date(Date.now() - 86400000),
                    amount: '+100'
                }
            ];
        }
        this.renderHistory();
    }
    
    renderHistory() {
        const historyList = document.getElementById('history-list');
        if (!historyList) return;
        
        if (this.historyData.length === 0) {
            historyList.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-clock-rotate-left"></i>
                    <h3>No Activity Yet</h3>
                    <p>Your recent activity will appear here</p>
                </div>
            `;
            return;
        }
        
        historyList.innerHTML = this.historyData.map(item => `
            <div class="history-item">
                <div class="history-icon">
                    <i class="fa-solid ${this.getHistoryIcon(item.action)}"></i>
                </div>
                <div class="history-details">
                    <div class="action">${item.action}</div>
                    <div class="time">${this.formatTime(item.timestamp)}</div>
                </div>
                ${item.amount ? `<div class="history-amount">${item.amount}</div>` : ''}
            </div>
        `).join('');
    }
    
    getHistoryIcon(action) {
        const iconMap = {
            'Points Earned': 'fa-coins',
            'Welcome Bonus': 'fa-gift',
            'Withdrawal Request': 'fa-wallet',
            'Ad Watched': 'fa-rectangle-ad'
        };
        return iconMap[action] || 'fa-clock';
    }
    
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return `${Math.floor(diff / 86400000)}d ago`;
    }
    
    // Leaderboard Management
    initializeLeaderboard() {
        const savedLeaderboard = localStorage.getItem('mira-leaderboard');
        if (savedLeaderboard) {
            this.leaderboardData = JSON.parse(savedLeaderboard);
        } else {
            // Generate demo leaderboard data
            this.leaderboardData = [
                { name: 'CryptoKing', points: 25000 },
                { name: 'MiraQueen', points: 22500 },
                { name: 'AdMaster', points: 20000 },
                { name: 'PointHunter', points: 18500 },
                { name: 'EarnGuru', points: 17000 },
                { name: 'TaskLord', points: 15500 },
                { name: 'RewardSeeker', points: 14000 },
                { name: 'ClickMaster', points: 12500 },
                { name: 'BonusHunter', points: 11000 },
                { name: 'MiraFan', points: 9500 }
            ];
        }
        
        // Add current user to leaderboard if not present
        const userInLeaderboard = this.leaderboardData.find(user => user.name === this.userData.username);
        if (!userInLeaderboard && this.userData.username !== 'Loading...') {
            this.leaderboardData.push({ name: this.userData.username, points: this.userData.points });
            this.leaderboardData.sort((a, b) => b.points - a.points);
        }
        
        this.renderLeaderboard();
    }
    
    renderLeaderboard() {
        const leaderboardList = document.getElementById('leaderboard-list');
        if (!leaderboardList) return;
        
        const sortedData = [...this.leaderboardData].sort((a, b) => b.points - a.points);
        
        leaderboardList.innerHTML = sortedData.map((user, index) => `
            <div class="leaderboard-item">
                <div class="rank-badge ${index < 3 ? 'top-3' : ''}">${index + 1}</div>
                <div class="leaderboard-info">
                    <div class="name">${user.name}</div>
                    <div class="points">${user.points.toLocaleString()} points</div>
                </div>
            </div>
        `).join('');
    }
    
    // Navigation
    showView(viewId) {
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        
        // Show target view
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.add('active');
        }
        
        // Update navigation buttons
        document.querySelectorAll('.nav-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Find and activate corresponding nav button
        const navButton = document.querySelector(`[onclick="showView('${viewId}')"]`);
        if (navButton) {
            navButton.classList.add('active');
        }
        
        this.currentView = viewId;
    }
    
    // Ad Integration
    loadAds() {
        // Initialize ad SDK if available
        if (window.show_9657195) {
            console.log('Ad SDK loaded successfully');
        }
    }
    
    showRewardedInterstitial() {
        this.showLoadingState();
        
        // Try to show real ad first
        if (window.show_9657195 && typeof window.show_9657195.showRewardedInterstitial === 'function') {
            window.show_9657195.showRewardedInterstitial({
                onRewarded: () => {
                    this.hideLoadingState();
                    this.addPoints(500);
                    this.addToHistory('Ad Watched', 'Rewarded Interstitial', new Date());
                },
                onError: () => {
                    this.hideLoadingState();
                    this.showFallbackReward('interstitial');
                }
            });
        } else {
            // Fallback for demo
            setTimeout(() => {
                this.hideLoadingState();
                this.showFallbackReward('interstitial');
            }, 2000);
        }
    }
    
    showRewardedPopup() {
        this.showLoadingState();
        
        // Try to show real ad first
        if (window.show_9657195 && typeof window.show_9657195.showRewardedPopup === 'function') {
            window.show_9657195.showRewardedPopup({
                onRewarded: () => {
                    this.hideLoadingState();
                    this.addPoints(200);
                    this.addToHistory('Ad Watched', 'Rewarded Popup', new Date());
                },
                onError: () => {
                    this.hideLoadingState();
                    this.showFallbackReward('popup');
                }
            });
        } else {
            // Fallback for demo
            setTimeout(() => {
                this.hideLoadingState();
                this.showFallbackReward('popup');
            }, 1500);
        }
    }
    
    showFallbackReward(type) {
        const points = type === 'interstitial' ? 500 : 200;
        const message = `Demo mode: You earned ${points} points!`;
        
        this.addPoints(points);
        this.addToHistory('Ad Watched', `Demo ${type}`, new Date());
        this.showNotification(message, 'success');
    }
    
    showLoadingState() {
        document.body.style.pointerEvents = 'none';
        document.body.style.opacity = '0.7';
    }
    
    hideLoadingState() {
        document.body.style.pointerEvents = 'auto';
        document.body.style.opacity = '1';
    }
    
    // Modal Management
    openWithdrawModal() {
        const modal = document.getElementById('withdraw-modal');
        if (modal) {
            modal.classList.add('active');
        }
    }
    
    closeWithdrawModal() {
        const modal = document.getElementById('withdraw-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
    
    requestWithdraw() {
        if (this.userData.balance < 1.00) {
            this.showNotification('Minimum withdrawal amount is $1.00', 'error');
            this.closeWithdrawModal();
            return;
        }
        
        // Simulate withdrawal request
        const amount = this.userData.balance;
        this.userData.balance = 0;
        this.updateUI();
        this.saveUserData();
        
        this.addToHistory('Withdrawal Request', `$${amount.toFixed(2)}`, new Date());
        this.showNotification(`Withdrawal request of $${amount.toFixed(2)} submitted!`, 'success');
        this.closeWithdrawModal();
    }
    
    // Telegram Integration
    initializeTelegram() {
        if (window.Telegram && window.Telegram.WebApp) {
            const tg = window.Telegram.WebApp;
            
            // Set up Telegram WebApp
            tg.ready();
            tg.expand();
            
            // Set theme
            if (tg.colorScheme === 'dark') {
                document.body.classList.add('dark-theme');
            }
            
            // Handle back button
            tg.BackButton.onClick(() => {
                if (this.currentView !== 'home-view') {
                    this.showView('home-view');
                } else {
                    tg.close();
                }
            });
            
            // Show back button when not on home
            if (this.currentView !== 'home-view') {
                tg.BackButton.show();
            }
        }
    }
    
    // Share Functionality
    shareApp() {
        const shareData = {
            title: 'MIRA Network',
            text: 'Join me on MIRA Network and earn rewards by watching ads!',
            url: window.location.href
        };
        
        if (window.Telegram && window.Telegram.WebApp) {
            // Use Telegram sharing
            const tg = window.Telegram.WebApp;
            const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.text)}`;
            tg.openTelegramLink(shareUrl);
        } else if (navigator.share) {
            // Use native sharing
            navigator.share(shareData).catch(err => {
                console.log('Error sharing:', err);
                this.fallbackShare(shareData);
            });
        } else {
            this.fallbackShare(shareData);
        }
    }
    
    fallbackShare(shareData) {
        // Copy to clipboard as fallback
        const textToCopy = `${shareData.text}\n${shareData.url}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                this.showNotification('Share link copied to clipboard!', 'success');
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showNotification('Share link copied to clipboard!', 'success');
        }
    }
    
    // Notification System
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fa-solid ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#00b894' : type === 'error' ? '#e74c3c' : '#6c5ce7'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            animation: slideDown 0.3s ease-out;
            max-width: 90%;
            text-align: center;
        `;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 8px;
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Event Listeners
    setupEventListeners() {
        // Modal click outside to close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeWithdrawModal();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeWithdrawModal();
            }
        });
        
        // Update leaderboard when user earns points
        const originalAddPoints = this.addPoints.bind(this);
        this.addPoints = function(amount) {
            originalAddPoints(amount);
            
            // Update user in leaderboard
            const userIndex = this.leaderboardData.findIndex(user => user.name === this.userData.username);
            if (userIndex !== -1) {
                this.leaderboardData[userIndex].points = this.userData.points;
            } else if (this.userData.username !== 'Loading...') {
                this.leaderboardData.push({ name: this.userData.username, points: this.userData.points });
            }
            
            this.leaderboardData.sort((a, b) => b.points - a.points);
            localStorage.setItem('mira-leaderboard', JSON.stringify(this.leaderboardData));
            this.renderLeaderboard();
        };
    }
}

// Global Functions (for HTML onclick handlers)
let app;

function showView(viewId) {
    if (app) app.showView(viewId);
}

function openWithdrawModal() {
    if (app) app.openWithdrawModal();
}

function closeWithdrawModal() {
    if (app) app.closeWithdrawModal();
}

function requestWithdraw() {
    if (app) app.requestWithdraw();
}

function showRewardedInterstitial() {
    if (app) app.showRewardedInterstitial();
}

function showRewardedPopup() {
    if (app) app.showRewardedPopup();
}

function shareApp() {
    if (app) app.shareApp();
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app = new MiraApp();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && app) {
        // Refresh data when page becomes visible
        app.updateUI();
        app.renderLeaderboard();
        app.renderHistory();
    }
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then((registration) => {
            console.log('SW registered: ', registration);
        }).catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}