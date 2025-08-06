// --- State Variables ---
let points = 0;
let balance = 0.00;
let historyLog = [];
let tgUser = null;
const pointsPerAd = 1;
const ratePerPoint = 0.05;

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
    localStorage.setItem('easyEarningBotV2', JSON.stringify({ points, balance, historyLog }));
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
    if (balance < 0.30) {
        Telegram.WebApp.HapticFeedback.notificationOccurred('error');
        return alert("Minimum withdrawal amount is $0.30. Keep earning!");
    }
    document.getElementById('withdraw-modal').classList.add('active');
}

function closeWithdrawModal() {
    document.getElementById('withdraw-modal').classList.remove('active');
}

function requestWithdraw() {
    closeWithdrawModal();
    const botToken = '7527765114:AAGcHHrq5GjcKMUYswvobGPmYTg0TyuCbrw';
    const adminUserId = '1873407633';
    const userInfo = tgUser ? `@${tgUser.username} (ID: ${tgUser.id})` : 'Unknown User';
    const message = `💸 *Withdrawal Request*\n\n👤 *User:* ${userInfo}\n💰 *Amount:* $${balance.toFixed(2)}\n\n_Please process this request._`;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: adminUserId, text: message, parse_mode: "Markdown" })
    }).then(res => res.json())
    .then(data => {
        if (data.ok) {
            Telegram.WebApp.HapticFeedback.notificationOccurred('success');
            alert("Your withdrawal request has been sent successfully!");
            addToHistory('withdraw', `Request for $${balance.toFixed(2)}`);
        } else {
            Telegram.WebApp.HapticFeedback.notificationOccurred('error');
            alert("Failed to send request. Please try again later.");
        }
    }).catch(err => {
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

