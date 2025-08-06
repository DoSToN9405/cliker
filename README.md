# MIRA Network Bot - Telegram Web App

Bu Telegram Web App loyiha admin panel bilan withdrawal requestlarni boshqarish uchun.

## Xususiyatlar

- ✅ Telegram Web App
- ✅ Admin Panel
- ✅ Withdrawal requests tizimi  
- ✅ Real-time yangilanish
- ✅ Responsive dizayn
- ✅ File-based database (development)
- ✅ Vercel KV support (production)

## Local Development

```bash
# Dependencies o'rnatish
npm install

# Serverni ishga tushirish
npm start

# Yoki development mode
npm run dev
```

Server `http://localhost:3000` da ishlaydi.

## Vercel Deploy Qilish

1. **GitHub repository yarating va kodni push qiling**

2. **Vercel da KV database yarating:**
   - Vercel dashboard ga kiring
   - Storage > KV ga o'ting
   - "Create Database" bosing
   - Nom bering (masalan: `mira-bot-db`)

3. **Environment variables o'rnating:**
   - Vercel dashboard da loyihangizni oching
   - Settings > Environment Variables ga o'ting
   - Quyidagilarni qo'shing:
     ```
     KV_REST_API_URL=<Vercel KV URL>
     KV_REST_API_TOKEN=<Vercel KV Token>
     NODE_ENV=production
     ```

4. **Deploy qiling:**
   - GitHub repository ni Vercel ga ulang
   - Automatic deploy boshlanadi

## Bot Token va Admin ID

Script.js faylida:
- `botToken` - o'zingizning bot tokeningiz
- `adminUserId` - admin Telegram ID (string format)

## Database Structure

```json
{
  "withdrawalRequests": [
    {
      "id": 1234567890,
      "username": "testuser",
      "userId": "123456789",
      "amount": 5.00,
      "timestamp": "2024-01-01T00:00:00.000Z",
      "status": "pending"
    }
  ],
  "users": {},
  "adminStats": {
    "totalUsers": 0,
    "totalPaid": 0
  }
}
```

## API Endpoints

- `GET /api/admin/stats` - Admin statistika
- `GET /api/admin/withdrawals` - Withdrawal requestlar
- `POST /api/withdrawal/request` - Yangi withdrawal request
- `POST /api/admin/withdrawal/:id/approve` - Requestni tasdiqlash  
- `POST /api/admin/withdrawal/:id/reject` - Requestni rad etish
- `POST /api/user/save` - Foydalanuvchi ma'lumotlarini saqlash
- `GET /api/user/:userId` - Foydalanuvchi ma'lumotlarini yuklash

## Troubleshooting

### Vercel da ma'lumotlar saqlanmayapti?
- Vercel KV to'g'ri sozlanganligini tekshiring
- Environment variables to'g'ri o'rnatilganligini tekshiring
- Vercel logs ni ko'ring: `vercel logs`

### Admin panel ko'rinmayapti?
- `adminUserId` to'g'ri o'rnatilganligini tekshiring
- Browser console da xatoliklarni ko'ring

### Withdrawal request yuborilmayapti?
- Network tab da API request statusini ko'ring
- Server logs ni tekshiring
