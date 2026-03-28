# FinTrak Backend

## Setup

```bash
cd backend
npm install
cp .env.example .env   # edit MONGO_URI and JWT_SECRET
npm run dev            # development (nodemon)
npm start              # production
```

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /auth/register | Register user |
| POST | /auth/login | Login → returns user + token |
| GET | /transaction/:userId | Get all transactions |
| POST | /transaction/add | Add transaction |
| PUT | /transaction/:id | Update transaction |
| DELETE | /transaction/:id | Delete transaction |
| POST | /group/create | Create group |
| GET | /group/:userId | Get user's groups |
| POST | /group/:groupId/expense | Add expense to group |
| DELETE | /group/:groupId | Delete group |

## Requirements
- Node.js 18+
- MongoDB (local or Atlas)
