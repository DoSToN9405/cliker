// --- State Variables ---
let points = 0;
let balance = 0.00;
let historyLog = [];
let tgUser = null;
const pointsPerAd = 1;
const ratePerPoint = 0.05;
let isAdmin = false;
const adminUserId = '1873407633'; // Your Telegram ID
let withdrawalRequests = [];

// --- Core App Logic ---
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
        tgUser = Telegram.WebApp.initDataUnsafe.user;
    }
    
    loadData();
    loadAdminData(); // Load admin data first
    loadTelegramUser();
    showView('home-view');
    renderLeaderboard();
    
    // <<< === ADDED AUTOMATIC IN-APP ADS INITIALIZATION HERE === >>>
    initializeInAppAds();
}

// --- Initialize Automatic Ads ---
function initializeInAppAds() {
    if (typeof show_9657195 === 'function') {
        // In-App Interstitial - runs automatically in the background
        show_9657195({
          type: 'inApp',
          inAppSettings: {
            frequency: 2,
            capping: 0.1,
            interval: 30,
            timeout: 5,
            everyPage: false // `false` is important for single-page apps like this
          }
        });
        console.log("Automatic In-App Interstitial Ads Initialized.");
    } else {
        console.warn("Monetag SDK not ready for In-App Ads. Retrying...");
        setTimeout(initializeInAppAds, 2000); // Retry after 2 seconds if SDK is not loaded yet
    }
}

// --- View Management ---
function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    
    document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.nav-button[onclick="showView('${viewId}')"]`);
    if(activeBtn) activeBtn.classList.add('active');
    
    if (viewId === 'history-view') renderHistory();
}

// --- Data Persistence ---
function loadData() {
    if (tgUser && tgUser.id) {
        // Load from server
        fetch(`/api/user/${tgUser.id}`)
            .then(response => response.json())
            .then(data => {
                points = data.points || 0;
                balance = data.balance || 0.00;
                historyLog = data.historyLog || [];
                updateDisplay();
            })
            .catch(error => {
                console.error('Error loading user data:', error);
                // Fallback to localStorage
                loadLocalData();
            });
    } else {
        loadLocalData();
    }
}

function loadLocalData() {
    const savedData = localStorage.getItem('easyEarningBotV2');
    if (savedData) {
        const data = JSON.parse(savedData);
        points = data.points || 0;
        balance = data.balance || 0.00;
        historyLog = data.historyLog || [];
    }
    updateDisplay();
}

function saveData() {
    if (tgUser && tgUser.id) {
        // Save to server
        fetch('/api/user/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: tgUser.id,
                data: { points, balance, historyLog }
            })
        }).catch(error => {
            console.error('Error saving user data:', error);
            // Fallback to localStorage
            localStorage.setItem('easyEarningBotV2', JSON.stringify({ points, balance, historyLog }));
        });
    } else {
        localStorage.setItem('easyEarningBotV2', JSON.stringify({ points, balance, historyLog }));
    }
}

function updateDisplay() {
    document.getElementById('points-value').textContent = points;
    document.getElementById('balance-value').textContent = `$${balance.toFixed(2)}`;
}

// --- User & Profile ---
function loadTelegramUser() {
    if (tgUser) {
        document.getElementById('username').textContent = tgUser.first_name || 'Telegram User';
        const profilePicDiv = document.getElementById('profile-pic');
        if (tgUser.photo_url) {
            profilePicDiv.innerHTML = `<img src="${tgUser.photo_url}" alt="P">`;
        } else {
            profilePicDiv.textContent = (tgUser.first_name || 'U').charAt(0);
        }
        
        // Check if user is admin
        if (tgUser.id.toString() === adminUserId) {
            isAdmin = true;
            showAdminButton();
            console.log('Admin access granted - User ID:', tgUser.id);
        }
    }
}

// --- History Logic ---
function addToHistory(type, detail) {
    const timestamp = new Date().toISOString();
    historyLog.unshift({ type, detail, timestamp });
    if (historyLog.length > 50) historyLog.pop();
    saveData();
}

function renderHistory() {
    const list = document.getElementById('history-list');
    if (historyLog.length === 0) {
        list.innerHTML = `<div class="list-item"><div class="info"><div class="name">No activity yet.</div><div class="detail">Watch some ads to get started!</div></div></div>`;
        return;
    }
    
    list.innerHTML = historyLog.map(item => {
        const icon = item.type === 'earn' 
            ? '<i class="fa-solid fa-plus-circle" style="color: var(--primary-color);"></i>' 
            : '<i class="fa-solid fa-paper-plane" style="color: var(--accent-color);"></i>';
        return `
            <div class="list-item">
                <div class="history-icon">${icon}</div>
                <div class="info">
                    <div class="name">${item.detail}</div>
                    <div class="detail">${new Date(item.timestamp).toLocaleString()}</div>
                </div>
            </div>`;
    }).join('');
}

// --- Leaderboard Logic ---
function renderLeaderboard() {
    const leaderboardData = [
        { name: "CryptoKing", score: 2540, avatar: "https://i.pravatar.cc/150?img=1" },
        { name: "Elena", score: 2210, avatar: "https://i.pravatar.cc/150?img=2" },
        { name: "ProMiner", score: 1980, avatar: "https://i.pravatar.cc/150?img=3" },
        { name: "Aisha", score: 1750, avatar: "https://i.pravatar.cc/150?img=4" },
        { name: "BotMaster", score: 1530, avatar: "https://i.pravatar.cc/150?img=5" },
    ];
    
    document.getElementById('leaderboard-list').innerHTML = leaderboardData.map((user, index) => `
        <div class="list-item">
            <div class="rank">#${index + 1}</div>
            <img src="${user.avatar}" class="avatar" alt="Avatar">
            <div class="info"><div class="name">${user.name}</div></div>
            <div class="score">${user.score} pts</div>
        </div>
    `).join('');
}

// --- Earning Functions ---
function grantReward() {
    points += pointsPerAd;
    balance = points * ratePerPoint;
    updateDisplay();
    addToHistory('earn', `+${pointsPerAd} Point(s) from Ad`);
    saveData();
    Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    alert(`Congratulations! You've earned +${pointsPerAd} point. Your new balance is $${balance.toFixed(2)}.`);
}

function showRewardedInterstitial() {
    if (typeof show_9657195 !== 'function') return alert('Ad provider is not ready.');
    show_9657195().then(grantReward).catch(e => alert('Ad could not be shown.'));
}

function showRewardedPopup() {
    if (typeof show_9657195 !== 'function') return alert('Ad provider is not ready.');
    show_9657195('pop').then(grantReward).catch(e => alert('Ad could not be shown.'));
}

// --- Withdrawal Logic ---
function openWithdrawModal() {
    if (balance < 5) {
        Telegram.WebApp.HapticFeedback.notificationOccurred('error');
        return alert("Minimum withdrawal amount is $5.00. Keep earning!");
    }
    document.getElementById('withdraw-modal').classList.add('active');
}

function closeWithdrawModal() {
    document.getElementById('withdraw-modal').classList.remove('active');
}

function requestWithdraw() {
    closeWithdrawModal();
    
    const userInfo = tgUser ? `@${tgUser.username} (ID: ${tgUser.id})` : 'Unknown User';
    
    // Send to backend server
    fetch('/api/withdrawal/request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userInfo: userInfo,
            amount: balance,
            userId: tgUser ? tgUser.id.toString() : 'Unknown'
        })
    }).then(response => response.json())
    .then(data => {
        if (data.success) {
            // Send Telegram notification
            const botToken = '7527765114:AAGcHHrq5GjcKMUYswvobGPmYTg0TyuCbrw';
            const adminUserId = '1873407633';
            const message = `💸 *Withdrawal Request*\n\n👤 *User:* ${userInfo}\n💰 *Amount:* $${balance.toFixed(2)}\n\n_Please check admin panel to process this request._`;

            fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: adminUserId, text: message, parse_mode: "Markdown" })
            });
            
            Telegram.WebApp.HapticFeedback.notificationOccurred('success');
            alert("Your withdrawal request has been sent successfully!");
            addToHistory('withdraw', `Request for $${balance.toFixed(2)}`);
        } else {
            Telegram.WebApp.HapticFeedback.notificationOccurred('error');
            alert("Failed to send request. Please try again later.");
        }
    }).catch(err => {
        console.error('Error:', err);
        Telegram.WebApp.HapticFeedback.notificationOccurred('error');
        alert("An error occurred. Check your connection and try again.");
    });
}

// --- Share & Referral ---
function shareApp() {
    if (!tgUser) return alert("Could not get user data from Telegram.");
    const botUsername = "MiraClickerBot";
    const referralLink = `https://t.me/${botUsername}?start=${tgUser.id}`;
    const text = `🎉 Join this amazing bot and start earning! Use my link to get a special bonus:`;
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`;
    Telegram.WebApp.openTelegramLink(shareUrl);
}

// --- Admin Panel Functions ---
function showAdminButton() {
    // Add admin button to navigation
    const footerNav = document.querySelector('.footer-nav');
    const adminBtn = document.createElement('button');
    adminBtn.className = 'nav-button admin-button show';
    adminBtn.onclick = () => showView('admin-view');
    adminBtn.innerHTML = '<i class="icon fa-solid fa-user-shield"></i>Admin';
    
    // Replace share button with admin button
    const shareBtn = footerNav.querySelector('button[onclick="shareApp()"]');
    footerNav.replaceChild(adminBtn, shareBtn);
    
    // Load admin data
    loadAdminData();
}

function loadAdminData() {
    console.log('=== Loading Admin Data from Server ===');
    
    if (!isAdmin) {
        console.log('Not admin, skipping admin data load');
        return;
    }
    
    // Load from server
    Promise.all([
        fetch('/api/admin/stats').then(res => res.json()),
        fetch('/api/admin/withdrawals').then(res => res.json())
    ]).then(([stats, requests]) => {
        withdrawalRequests = requests || [];
        console.log('Loaded withdrawal requests from server:', withdrawalRequests);
        
        // Update admin view if it's currently visible
        if (document.getElementById('admin-view') && document.getElementById('admin-view').classList.contains('active')) {
            renderAdminPanel();
        }
    }).catch(error => {
        console.error('Error loading admin data from server:', error);
        // Fallback to localStorage
        loadLocalAdminData();
    });
}

function loadLocalAdminData() {
    console.log('Loading admin data from localStorage as fallback');
    const savedAdminData = localStorage.getItem('adminData');
    if (savedAdminData) {
        try {
            const data = JSON.parse(savedAdminData);
            withdrawalRequests = data.withdrawalRequests || [];
        } catch (error) {
            console.error('Error parsing admin data:', error);
            withdrawalRequests = [];
        }
    }
}

function saveAdminData() {
    localStorage.setItem('adminData', JSON.stringify({
        withdrawalRequests: withdrawalRequests
    }));
}

function renderAdminPanel() {
    console.log('Rendering admin panel...');
    
    // Load fresh data from server
    fetch('/api/admin/stats')
        .then(response => response.json())
        .then(stats => {
            document.getElementById('total-users').textContent = stats.totalUsers || 0;
            document.getElementById('pending-withdrawals').textContent = stats.pendingWithdrawals || 0;
            document.getElementById('total-paid').textContent = `$${(stats.totalPaid || 0).toFixed(2)}`;
        })
        .catch(error => {
            console.error('Error loading stats:', error);
            // Fallback values
            document.getElementById('total-users').textContent = '0';
            document.getElementById('pending-withdrawals').textContent = withdrawalRequests.filter(req => req.status === 'pending').length;
            document.getElementById('total-paid').textContent = '$0.00';
        });
    
    // Load withdrawal requests
    fetch('/api/admin/withdrawals')
        .then(response => response.json())
        .then(requests => {
            withdrawalRequests = requests;
            renderWithdrawalRequests();
        })
        .catch(error => {
            console.error('Error loading withdrawal requests:', error);
            renderWithdrawalRequests(); // Render with current data
        });
}

function renderWithdrawalRequests() {
    const container = document.getElementById('withdrawal-requests');
    
    if (withdrawalRequests.length === 0) {
        container.innerHTML = `
            <div class="list-item">
                <div class="info">
                    <div class="name">No withdrawal requests</div>
                    <div class="detail">All requests have been processed</div>
                </div>
            </div>`;
        return;
    }
    
    container.innerHTML = withdrawalRequests.map((request, index) => `
        <div class="withdrawal-request">
            <div class="withdrawal-header">
                <div class="withdrawal-user">${request.username}</div>
                <div class="withdrawal-amount">$${request.amount.toFixed(2)}</div>
            </div>
            <div class="withdrawal-info">
                ID: ${request.userId} • ${new Date(request.timestamp).toLocaleString()}
            </div>
            ${request.status === 'pending' ? `
                <div class="withdrawal-actions">
                    <button class="approve-btn" onclick="approveWithdrawal(${index})">Approve</button>
                    <button class="reject-btn" onclick="rejectWithdrawal(${index})">Reject</button>
                </div>
            ` : `
                <div class="status-${request.status}">${request.status.toUpperCase()}</div>
            `}
        </div>
    `).join('');
}

// This function is no longer needed as we use the server API
// But keeping it for backward compatibility
function addWithdrawalRequest(userInfo, amount) {
    console.log('addWithdrawalRequest called, but using server API instead');
    // This function is now handled by the server API endpoint
}

function approveWithdrawal(index) {
    if (withdrawalRequests[index]) {
        const request = withdrawalRequests[index];
        
        fetch(`/api/admin/withdrawal/${request.id}/approve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`Withdrawal request for $${request.amount.toFixed(2)} has been approved!`);
                renderAdminPanel(); // Refresh the panel
            } else {
                alert('Failed to approve withdrawal');
            }
        })
        .catch(error => {
            console.error('Error approving withdrawal:', error);
            alert('Error approving withdrawal');
        });
    }
}

function rejectWithdrawal(index) {
    if (withdrawalRequests[index]) {
        const request = withdrawalRequests[index];
        
        fetch(`/api/admin/withdrawal/${request.id}/reject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`Withdrawal request for $${request.amount.toFixed(2)} has been rejected!`);
                renderAdminPanel(); // Refresh the panel
            } else {
                alert('Failed to reject withdrawal');
            }
        })
        .catch(error => {
            console.error('Error rejecting withdrawal:', error);
            alert('Error rejecting withdrawal');
        });
    }
}

// Override showView to handle admin panel
const originalShowView = showView;
showView = function(viewId) {
    originalShowView(viewId);
    
    if (viewId === 'admin-view' && isAdmin) {
        renderAdminPanel();
    }
};
