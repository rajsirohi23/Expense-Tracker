# Expense-Tracker
<div align="center">

### Finance & Expense Tracker

## 🚀 Live Demo

🌐 Frontend: https://fintak.netlify.app
⚙️ Backend: https://expense-tracker-1-xdp5.onrender.com

*Track every rupee like a pro — beautiful, fast, and completely free.*

---

![FinTrak Dashboard Preview](https://via.placeholder.com/900x480/0d1220/8b5cf6?text=FinTrak+Dashboard+Preview)

</div>

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🧠 About the Project

**FinTrak** is a full-stack, production-grade personal finance dashboard built from scratch using vanilla HTML, CSS, JavaScript, Node.js, Express, and MongoDB — no frontend framework required.

It was designed to look and feel like a real SaaS fintech product (think Stripe, Razorpay, or modern banking apps) while remaining lightweight, fast, and easy to self-host or deploy for free.

> Built as a college project — transformed into a world-class product.

---

## ✨ Features

### 🔐 Authentication
- Secure registration & login with JWT tokens
- Password hashing with bcryptjs (10 salt rounds)
- 7-day session persistence via localStorage
- Live password strength meter on register
- Show/hide password toggle
- Demo account for instant preview (no sign-up needed)

### 📊 Dashboard
- Animated summary cards — Total Balance, Income, Expense, Savings
- Savings rate percentage calculation
- Animated number counters on load
- Animated virtual credit card with 3D hover effect
- Top spending categories with animated progress bars
- Savings trend mini-chart

### 💸 Transaction Management
- Add / Edit / Delete transactions
- 11 categories with emoji icons (Food, Transport, Shopping, Entertainment, Health, Bills, Education, Travel, Salary, Investment, Other)
- Income vs Expense type toggle
- Date picker for historical entries
- Filter by type (All / Income / Expense)
- Filter by category (quick filter buttons)
- Real-time search with instant dropdown results
- Hover-reveal edit/delete actions with ripple effect

### 📈 Analytics
- **Line Chart** — Monthly income vs expense trend (last 6 months) with gradient fill
- **Donut Chart** — Category-wise expense breakdown with percentages
- **Bar Chart** — Side-by-side monthly comparison
- **Savings Mini Chart** — Trend sparkline on dashboard
- All charts use Chart.js with custom gradients, tooltips, and animations

### 👥 Group Expenses
- Create groups with emoji picker and tag-based member input
- Add expenses to groups with custom split logic
- Auto-calculate who owes whom using greedy settlement algorithm
- **Group Detail Panel** with 3 tabs:
  - ⚖️ Balances — per-member net + settlement plan
  - 📋 Expenses — reverse-chronological expense history
  - 👥 Members — add/remove members from live group
- One-click "Settle" button to mark balances as paid
- Delete groups with confirmation

### ⚡ Quick Split Calculator
- Total bill + number of people + tip percentage
- Live per-person amount calculation
- Shows total-with-tip alongside split amount

### 💡 Smart Insights
- Auto-generated spending analysis cards:
  - Savings rate celebration / warning
  - Top spending category callout
  - Food / entertainment overspend alerts
  - Investment encouragement tips
- Monthly summary table (income, expense, savings per month)

### 🎨 UI/UX
- Glassmorphism + dark/light theme toggle (persisted in localStorage)
- Smooth page section transitions (no page reloads — SPA)
- Collapsible sidebar on desktop, slide-in on mobile
- Notification dropdown with sample alerts
- Toast notification system (success / error / info / warning)
- Ripple click effects on interactive elements
- Loading skeleton placeholders while fetching data
- Empty state illustrations with CTAs
- Fully responsive — mobile, tablet, desktop

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| HTML5 | Semantic page structure |
| CSS3 | Custom design system (1,000+ lines, CSS variables, glassmorphism) |
| Vanilla JavaScript | SPA logic, DOM manipulation, API calls |
| Chart.js | Data visualization (line, donut, bar charts) |
| Google Fonts (Syne + Inter) | Typography |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | HTTP server & routing |
| MongoDB | NoSQL database |
| Mongoose | ODM for MongoDB |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT auth tokens |
| cors | Cross-origin request handling |

### Deployment
| Service | Role | Cost |
|---|---|---|
| Netlify | Frontend hosting | Free |
| Render | Backend API hosting | Free |
| MongoDB Atlas | Cloud database | Free (512MB) |
| GitHub | Version control | Free |

---

## 📁 Project Structure

```
fintrak/
│
├── 📂 frontend/                  # Static frontend (no build step)
│   ├── index.html                # Landing page
│   ├── login.html                # Login page
│   ├── register.html             # Registration page
│   ├── dashboard.html            # Main SPA dashboard (all sections)
│   │
│   ├── 📂 css/
│   │   └── style.css             # Complete design system
│   │
│   ├── 📂 js/
│   │   ├── auth.js               # Login, register, logout logic
│   │   └── dashboard.js          # All dashboard features & API calls
│   │
│   └── 📂 charts/
│       └── chart.js              # Chart.js configurations & helpers
│
├── 📂 backend/                   # Node.js REST API
│   ├── server.js                 # All routes, models, middleware (single file)
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- [MongoDB](https://mongodb.com) (local or Atlas)
- [Git](https://git-scm.com)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/fintrak.git
cd fintrak
```

### 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your values:

```env
MONGO_URI=mongodb://localhost:27017/fintrak
JWT_SECRET=your_super_secret_key_here
PORT=5000
```

Start the backend:

```bash
npm run dev        # development (auto-restart)
# or
npm start          # production
```

You should see:
```
✅ MongoDB connected
🚀 Server running on http://localhost:5000
```

### 3. Set up the frontend

Open `frontend/js/auth.js` and `frontend/js/dashboard.js`.

Make sure line 1 says:
```javascript
const url = "http://localhost:5000";
```

### 4. Open the frontend

Simply open `frontend/index.html` in your browser, or use VS Code Live Server (recommended):

1. Install the **Live Server** extension in VS Code
2. Right-click `index.html` → **"Open with Live Server"**
3. App opens at `http://127.0.0.1:5500`

### 5. Try the demo account

Click **"Demo Account"** on the login page — loads instantly with sample data, no sign-up needed.

---

## 🔐 Environment Variables

| Variable | Description | Example |
|---|---|---|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/fintrak` |
| `JWT_SECRET` | Secret key for JWT signing | `my$uper$ecretKey2025` |
| `PORT` | Port for the Express server | `5000` |

For production (MongoDB Atlas):
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/fintrak?retryWrites=true&w=majority
```

---

## 📡 API Reference

**Base URL:** `http://localhost:5000` (local) or your Render URL (production)

### Auth

| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/auth/register` | `{ name, email, password }` | Register a new user |
| `POST` | `/auth/login` | `{ email, password }` | Login → returns user + JWT token |

### Transactions

| Method | Endpoint | Body | Description |
|---|---|---|---|
| `GET` | `/transaction/:userId` | — | Get all transactions for user |
| `POST` | `/transaction/add` | `{ userId, title, amount, category, type, date }` | Add new transaction |
| `PUT` | `/transaction/:id` | `{ title, amount, category, type, date }` | Update transaction |
| `DELETE` | `/transaction/:id` | — | Delete transaction |

### Groups

| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/group/create` | `{ name, members, userId, emoji }` | Create group |
| `GET` | `/group/:userId` | — | Get all groups with computed balances |
| `POST` | `/group/:groupId/expense` | `{ title, amount, paidBy, splitAmong }` | Add expense to group |
| `POST` | `/group/:groupId/settle` | `{ from, to, amount }` | Settle a balance |
| `POST` | `/group/:groupId/member` | `{ name }` | Add member to group |
| `DELETE` | `/group/:groupId/member/:name` | — | Remove member from group |
| `DELETE` | `/group/:groupId` | — | Delete entire group |

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Returns API status |

---

## ☁️ Deployment

### Quick Deploy (Recommended)

| Step | Service | Time |
|---|---|---|
| 1. Database | [MongoDB Atlas](https://mongodb.com/atlas) — Free M0 cluster | ~5 min |
| 2. Backend | [Render](https://render.com) — Connect GitHub repo | ~5 min |
| 3. Frontend | [Netlify](https://netlify.com) — Drag & drop or GitHub | ~2 min |

**Full step-by-step guide** is in the [DEPLOYMENT.md](DEPLOYMENT.md) file.

### Update backend URL before deploying frontend

In both `frontend/js/auth.js` and `frontend/js/dashboard.js`, change:

```javascript
// Development
const url = "http://localhost:5000";

// Production — replace with your Render URL
const url = "https://fintrak-backend.onrender.com";
```

### Update CORS in production

In `backend/server.js`, replace `app.use(cors())` with:

```javascript
app.use(cors({
  origin: [
    "https://your-app.netlify.app",
    "http://localhost:5500",
    "http://127.0.0.1:5500"
  ],
  credentials: true
}));
```

---

## 📸 Screenshots

| Page | Description |
|---|---|
| 🏠 Landing | Animated hero with floating cards and particle effects |
| 🔐 Login | Clean auth form with demo account button |
| 📝 Register | Password strength meter + tag-based validation |
| 📊 Dashboard | Summary cards + credit card + charts + recent transactions |
| 💸 Transactions | Full list with filters, search, edit/delete |
| 📈 Analytics | Line, donut, and bar charts with gradient fills |
| 👥 Groups | Group cards + detail panel with 3 tabs + split calculator |
| 💡 Insights | Auto-generated spending analysis + monthly summary table |

---

## 🧩 Key Design Decisions

**Single-file backend** — All routes, models, and middleware live in `server.js`. This keeps the project beginner-friendly while still being production-ready.

**No frontend framework** — Pure HTML/CSS/JS with zero build step. Open the file in a browser and it just works. Great for learning and fast iteration.

**Demo mode** — If the backend is unreachable (e.g., Render cold start), the app automatically falls back to rich sample data so users always see a fully working UI.

**Greedy settlement algorithm** — The balance calculator minimizes the number of transactions needed to settle all debts in a group, not just a naive "everyone pays everyone" approach.

**SPA without a router** — All dashboard sections are hidden/shown via CSS classes, with `navigateTo()` handling state — giving the feel of a single-page app with zero dependencies.

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

### Ideas for contributions
- [ ] Export transactions to CSV / PDF
- [ ] Email notifications for spending alerts
- [ ] Recurring transaction support
- [ ] Budget goals with progress tracking
- [ ] Dark/light theme per-section customization
- [ ] Multi-currency support
- [ ] PWA support (offline mode)
- [ ] Google OAuth login

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

Built with ❤️ as a full-stack web development project.

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

[![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/fintrak?style=social)](https://github.com/YOUR_USERNAME/fintrak)

*Made with HTML · CSS · JavaScript · Node.js · MongoDB*

</div>
