const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Database configuration
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
const DB_FILE = path.join(process.cwd(), 'database.json');

// Try to import Vercel KV for production
let kv = null;
if (isProduction) {
    try {
        const { kv: vercelKV } = require('@vercel/kv');
        kv = vercelKV;
        console.log('Vercel KV initialized');
    } catch (error) {
        console.log('Vercel KV not available, using memory storage');
    }
}

// Default database structure
const getDefaultData = () => ({
    withdrawalRequests: [
        {
            id: Date.now() - 10000, // Make sure it's unique
            username: 'testuser',
            userId: '123456789',
            amount: 5.00,
            timestamp: new Date().toISOString(),
            status: 'pending'
        }
    ],
    users: {},
    adminStats: {
        totalUsers: 0,
        totalPaid: 0
    }
});

// In-memory cache for fallback
let dbCache = getDefaultData();

// Database functions
async function loadDatabase() {
    try {
        if (isProduction && kv) {
            // Try to load from Vercel KV
            const data = await kv.get('database');
            if (data) {
                console.log('Loaded data from Vercel KV');
                return data;
            } else {
                console.log('No data in Vercel KV, using default');
                const defaultData = getDefaultData();
                await saveDatabase(defaultData);
                return defaultData;
            }
        } else if (!isProduction) {
            // For development, use file system
            const data = await fs.readFile(DB_FILE, 'utf8');
            return JSON.parse(data);
        } else {
            // Production fallback to memory
            return { ...dbCache };
        }
    } catch (error) {
        console.log('Error loading database, using default data:', error.message);
        const defaultData = getDefaultData();
        await saveDatabase(defaultData);
        return defaultData;
    }
}

async function saveDatabase(data) {
    try {
        if (isProduction && kv) {
            // Save to Vercel KV
            await kv.set('database', data);
            console.log('Database saved to Vercel KV successfully');
        } else if (!isProduction) {
            // For development, save to file
            await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
            console.log('Database saved to file successfully');
        } else {
            // Production fallback to memory
            dbCache = { ...data };
            console.log('Database saved to memory cache successfully');
        }
    } catch (error) {
        console.error('Error saving database:', error);
    }
}

// API Routes
app.get('/api/admin/stats', async (req, res) => {
    try {
        const data = await loadDatabase();
        const stats = {
            totalUsers: Object.keys(data.users).length,
            pendingWithdrawals: data.withdrawalRequests.filter(req => req.status === 'pending').length,
            totalPaid: data.adminStats.totalPaid
        };
        res.json(stats);
    } catch (error) {
        console.error('Error loading stats:', error);
        res.status(500).json({ error: 'Failed to load stats' });
    }
});

app.get('/api/admin/withdrawals', async (req, res) => {
    try {
        const data = await loadDatabase();
        res.json(data.withdrawalRequests);
    } catch (error) {
        console.error('Error loading withdrawals:', error);
        res.status(500).json({ error: 'Failed to load withdrawals' });
    }
});

app.post('/api/withdrawal/request', async (req, res) => {
    try {
        const { userInfo, amount, userId } = req.body;
        
        console.log('=== NEW WITHDRAWAL REQUEST ===');
        console.log('Received data:', { userInfo, amount, userId });
        console.log('Request headers:', req.headers);
        console.log('Environment:', { isProduction, hasKV: !!kv });
        
        let username = 'Unknown User';
        try {
            if (userInfo && userInfo.includes('@')) {
                username = userInfo.split(' ')[0].replace('@', '');
            } else if (userInfo) {
                username = userInfo.split(' ')[0] || 'Unknown';
            }
        } catch (error) {
            console.error('Error parsing user info:', error);
        }
        
        const request = {
            id: Date.now(),
            username: username,
            userId: userId || 'Unknown',
            amount: parseFloat(amount) || 0,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        
        console.log('Created request object:', request);
        
        // Load current data
        const data = await loadDatabase();
        console.log('Current data before adding:', {
            totalRequests: data.withdrawalRequests.length,
            requests: data.withdrawalRequests.map(r => ({ id: r.id, username: r.username, amount: r.amount }))
        });
        
        // Add new request
        data.withdrawalRequests.unshift(request);
        
        console.log('Total withdrawal requests after adding:', data.withdrawalRequests.length);
        
        // Save to database
        await saveDatabase(data);
        
        // Verify save
        const verifyData = await loadDatabase();
        console.log('Verification - requests after save:', verifyData.withdrawalRequests.length);
        console.log('=== END WITHDRAWAL REQUEST ===');
        
        res.json({ success: true, message: 'Withdrawal request added successfully' });
    } catch (error) {
        console.error('Error processing withdrawal request:', error);
        res.status(500).json({ success: false, message: 'Failed to process request' });
    }
});

app.post('/api/admin/withdrawal/:id/approve', async (req, res) => {
    try {
        const requestId = parseInt(req.params.id);
        const data = await loadDatabase();
        const request = data.withdrawalRequests.find(r => r.id === requestId);
        
        if (request) {
            request.status = 'approved';
            data.adminStats.totalPaid += request.amount;
            await saveDatabase(data);
            res.json({ success: true, message: 'Withdrawal approved' });
        } else {
            res.status(404).json({ success: false, message: 'Request not found' });
        }
    } catch (error) {
        console.error('Error approving withdrawal:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/api/admin/withdrawal/:id/reject', async (req, res) => {
    try {
        const requestId = parseInt(req.params.id);
        const data = await loadDatabase();
        const request = data.withdrawalRequests.find(r => r.id === requestId);
        
        if (request) {
            request.status = 'rejected';
            await saveDatabase(data);
            res.json({ success: true, message: 'Withdrawal rejected' });
        } else {
            res.status(404).json({ success: false, message: 'Request not found' });
        }
    } catch (error) {
        console.error('Error rejecting withdrawal:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/api/user/save', async (req, res) => {
    try {
        const { userId, data: userData } = req.body;
        const data = await loadDatabase();
        data.users[userId] = userData;
        await saveDatabase(data);
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving user data:', error);
        res.status(500).json({ success: false });
    }
});

app.get('/api/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const data = await loadDatabase();
        const userData = data.users[userId] || { points: 0, balance: 0, historyLog: [] };
        res.json(userData);
    } catch (error) {
        console.error('Error loading user data:', error);
        res.status(500).json({ points: 0, balance: 0, historyLog: [] });
    }
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
});
