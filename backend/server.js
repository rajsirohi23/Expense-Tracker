// const express = require("express");
// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const cors = require("cors");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // ── CONFIG ──────────────────────────────────────
// const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/fintrakk";
// const JWT_SECRET = process.env.JWT_SECRET || "fintrak_secret_key";
// const PORT = process.env.PORT || 5000;

// mongoose.connect(MONGO_URI).then(() => console.log("✅ MongoDB connected")).catch(console.error);

// // ── MODELS ──────────────────────────────────────
// const User = mongoose.model("User", new mongoose.Schema({
//   name:     { type: String, required: true },
//   email:    { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// }, { timestamps: true }));

// const Transaction = mongoose.model("Transaction", new mongoose.Schema({
//   userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   title:    { type: String, required: true },
//   amount:   { type: Number, required: true },
//   category: { type: String, default: "Other" },
//   type:     { type: String, enum: ["income", "expense"], required: true },
//   date:     { type: Date, default: Date.now },
// }, { timestamps: true }));



// // 18 April
// const Group = mongoose.model("Group", new mongoose.Schema({
//   name:     { type: String, required: true },
//   emoji:    { type: String, default: "👥" },
//   members:  [String],
//   userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   expenses: [{
//     title:   String,
//     amount:  Number,
//     paidBy:  String,
//     splitAmong: [String],
//     date:    { type: Date, default: Date.now },
//   }],
//   total:    { type: Number, default: 0 },
// }, { timestamps: true }));



// // ── AUTH MIDDLEWARE ──────────────────────────────
// const auth = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "No token" });
//   try { req.user = jwt.verify(token, JWT_SECRET); next(); }
//   catch { res.status(401).json({ message: "Invalid token" }); }
// };

// // ── AUTH ROUTES ──────────────────────────────────
// app.post("/auth/register", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });
//     if (await User.findOne({ email })) return res.status(400).json({ message: "Email already registered" });
//     const hashed = await bcrypt.hash(password, 10);
//     const user = await User.create({ name, email, password: hashed });
//     res.json({ message: "Registered successfully", userId: user._id });
//   } catch (e) { res.status(500).json({ message: e.message }); }
// });

// app.post("/auth/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user || !(await bcrypt.compare(password, user.password)))
//       return res.status(401).json({ message: "Invalid email or password" });
//     const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
//     res.json({ _id: user._id, name: user.name, email: user.email, token });
//   } catch (e) { res.status(500).json({ message: e.message }); }
// });

// // ── TRANSACTION ROUTES ───────────────────────────
// // Get all transactions for a user
// app.get("/transaction/:userId", async (req, res) => {
//   try {
//     const txs = await Transaction.find({ userId: req.params.userId }).sort({ date: -1 });
//     res.json(txs);
//   } catch (e) { res.status(500).json({ message: e.message }); }
// });

// // Add transaction
// app.post("/transaction/add", async (req, res) => {
//   try {
//     const { userId, title, amount, category, type, date } = req.body;
//     if (!userId || !title || !amount || !type) return res.status(400).json({ message: "Missing fields" });
//     const tx = await Transaction.create({ userId, title, amount, category, type, date: date || Date.now() });
//     res.json(tx);
//   } catch (e) { res.status(500).json({ message: e.message }); }
// });

// // Update transaction
// app.put("/transaction/:id", async (req, res) => {
//   try {
//     const tx = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!tx) return res.status(404).json({ message: "Transaction not found" });
//     res.json(tx);
//   } catch (e) { res.status(500).json({ message: e.message }); }
// });

// // Delete transaction
// app.delete("/transaction/:id", async (req, res) => {
//   try {
//     await Transaction.findByIdAndDelete(req.params.id);
//     res.json({ message: "Deleted" });
//   } catch (e) { res.status(500).json({ message: e.message }); }
// });




// // ── GROUP ROUTES ─────────────────────────────────
// // Create group
// app.post("/group/create", async (req, res) => {
//   try {
//     const { name, members, userId, emoji } = req.body;
//     if (!name || !members?.length) return res.status(400).json({ message: "Name and members required" });
//     const group = await Group.create({ name, members, userId, emoji: emoji || "👥" });
//     res.json({ ...group.toObject(), balances: [] });
//   } catch (e) { res.status(500).json({ message: e.message }); }
// });

// // Get all groups for user
// app.get("/group/:userId", async (req, res) => {
//   try {
//     const groups = await Group.find({ userId: req.params.userId });
//     // Calculate balances per group
//     const result = groups.map(g => {
//       const balances = calcBalances(g);
//       return { ...g.toObject(), balances };
//     });
//     res.json(result);
//   } catch (e) { res.status(500).json({ message: e.message }); }
// });

// // Add expense to group
// app.post("/group/:groupId/expense", async (req, res) => {
//   try {
//     const { title, amount, paidBy, splitAmong } = req.body;
//     if (!title || !amount || !paidBy) return res.status(400).json({ message: "Missing fields" });
//     const group = await Group.findById(req.params.groupId);
//     if (!group) return res.status(404).json({ message: "Group not found" });
//     group.expenses.push({ title, amount, paidBy, splitAmong: splitAmong || group.members });
//     group.total += Number(amount);
//     await group.save();
//     res.json({ ...group.toObject(), balances: calcBalances(group) });
//   } catch (e) { res.status(500).json({ message: e.message }); }
// });

// // Settle a balance between two members
// app.post("/group/:groupId/settle", async (req, res) => {
//   try {
//     const { from, to, amount } = req.body;
//     const group = await Group.findById(req.params.groupId);
//     if (!group) return res.status(404).json({ message: "Group not found" });
//     // Add a settlement expense so balances recalculate correctly
//     group.expenses.push({ title: `Settlement: ${from} → ${to}`, amount, paidBy: from, splitAmong: [to] });
//     await group.save();
//     res.json({ ...group.toObject(), balances: calcBalances(group) });
//   } catch (e) { res.status(500).json({ message: e.message }); }
// });

// // Add member to group
// app.post("/group/:groupId/member", async (req, res) => {
//   try {
//     const { name } = req.body;
//     const group = await Group.findById(req.params.groupId);
//     if (!group) return res.status(404).json({ message: "Group not found" });
//     if (group.members.includes(name)) return res.status(400).json({ message: "Member already exists" });
//     group.members.push(name);
//     await group.save();
//     res.json({ ...group.toObject(), balances: calcBalances(group) });
//   } catch (e) { res.status(500).json({ message: e.message }); }
// });

// // Remove member from group
// app.delete("/group/:groupId/member/:name", async (req, res) => {
//   try {
//     const group = await Group.findById(req.params.groupId);
//     if (!group) return res.status(404).json({ message: "Group not found" });
//     group.members = group.members.filter(m => m !== req.params.name);
//     await group.save();
//     res.json({ ...group.toObject(), balances: calcBalances(group) });
//   } catch (e) { res.status(500).json({ message: e.message }); }
// });

// // Delete group
// app.delete("/group/:groupId", async (req, res) => {
//   try {
//     await Group.findByIdAndDelete(req.params.groupId);
//     res.json({ message: "Group deleted" });
//   } catch (e) { res.status(500).json({ message: e.message }); }
// });

// // ── BALANCE CALCULATOR ───────────────────────────
// function calcBalances(group) {
//   const net = {};
//   group.members.forEach(m => net[m] = 0);
//   group.expenses.forEach(({ amount, paidBy, splitAmong }) => {
//     const share = amount / (splitAmong?.length || group.members.length);
//     net[paidBy] = (net[paidBy] || 0) + amount;
//     (splitAmong || group.members).forEach(m => net[m] = (net[m] || 0) - share);
//   });
//   // Settle: build who owes whom
//   const creditors = [], debtors = [];
//   Object.entries(net).forEach(([name, bal]) => {
//     if (bal > 0.01) creditors.push({ name, bal });
//     else if (bal < -0.01) debtors.push({ name, bal: -bal });
//   });
//   const balances = [];
//   let i = 0, j = 0;
//   while (i < debtors.length && j < creditors.length) {
//     const pay = Math.min(debtors[i].bal, creditors[j].bal);
//     balances.push({ from: debtors[i].name, to: creditors[j].name, amount: Math.round(pay * 100) / 100 });
//     debtors[i].bal -= pay;
//     creditors[j].bal -= pay;
//     if (debtors[i].bal < 0.01) i++;
//     if (creditors[j].bal < 0.01) j++;
//   }
//   return balances;
// }

// // ── HEALTH CHECK ─────────────────────────────────
// app.get("/", (req, res) => res.json({ status: "FinTrak API running 🚀", version: "1.0.0" }));

// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));




































const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ── CONFIG ──────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/fintrak";
const JWT_SECRET = process.env.JWT_SECRET || "fintrak_secret_key";
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI).then(() => console.log("✅ MongoDB connected")).catch(console.error);

// ── MODELS ──────────────────────────────────────
const User = mongoose.model("User", new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true }));

const Transaction = mongoose.model("Transaction", new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title:    { type: String, required: true },
  amount:   { type: Number, required: true },
  category: { type: String, default: "Other" },
  type:     { type: String, enum: ["income", "expense"], required: true },
  date:     { type: Date, default: Date.now },
}, { timestamps: true }));

const Group = mongoose.model("Group", new mongoose.Schema({
  name:     { type: String, required: true },
  emoji:    { type: String, default: "👥" },
  members:  [String],
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  expenses: [{
    title:   String,
    amount:  Number,
    paidBy:  String,
    splitAmong: [String],
    date:    { type: Date, default: Date.now },
  }],
  total:    { type: Number, default: 0 },
}, { timestamps: true }));

// ── AUTH MIDDLEWARE ──────────────────────────────
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ message: "Invalid token" }); }
};

// ── AUTH ROUTES ──────────────────────────────────
app.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });
    if (await User.findOne({ email })) return res.status(400).json({ message: "Email already registered" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    res.json({ message: "Registered successfully", userId: user._id });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Invalid email or password" });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ _id: user._id, name: user.name, email: user.email, token });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── TRANSACTION ROUTES ───────────────────────────
// Get all transactions for a user
app.get("/transaction/:userId", async (req, res) => {
  try {
    const txs = await Transaction.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(txs);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Get transactions for a user filtered by date range
// Usage: GET /transaction/:userId/range?from=2024-01-01&to=2024-01-31&type=expense&category=Food
app.get("/transaction/:userId/range", async (req, res) => {
  try {
    const { from, to, type, category } = req.query;
    const query = { userId: req.params.userId };

    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from + 'T00:00:00.000Z');
      if (to)   query.date.$lte = new Date(to   + 'T23:59:59.999Z');
    }
    if (type && type !== 'all')  query.type     = type;
    if (category)                query.category = category;

    const txs = await Transaction.find(query).sort({ date: -1 });

    // Compute summary
    let income = 0, expense = 0;
    txs.forEach(t => { if (t.type === 'income') income += t.amount; else expense += t.amount; });

    res.json({
      transactions: txs,
      summary: { income, expense, balance: income - expense, count: txs.length }
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Add transaction
app.post("/transaction/add", async (req, res) => {
  try {
    const { userId, title, amount, category, type, date } = req.body;
    if (!userId || !title || !amount || !type) return res.status(400).json({ message: "Missing fields" });
    const tx = await Transaction.create({ userId, title, amount, category, type, date: date || Date.now() });
    res.json(tx);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Update transaction
app.put("/transaction/:id", async (req, res) => {
  try {
    const tx = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tx) return res.status(404).json({ message: "Transaction not found" });
    res.json(tx);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Delete transaction
app.delete("/transaction/:id", async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── GROUP ROUTES ─────────────────────────────────
// Create group
app.post("/group/create", async (req, res) => {
  try {
    const { name, members, userId, emoji } = req.body;
    if (!name || !members?.length) return res.status(400).json({ message: "Name and members required" });
    const group = await Group.create({ name, members, userId, emoji: emoji || "👥" });
    res.json({ ...group.toObject(), balances: [] });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Get all groups for user
app.get("/group/:userId", async (req, res) => {
  try {
    const groups = await Group.find({ userId: req.params.userId });
    // Calculate balances per group
    const result = groups.map(g => {
      const balances = calcBalances(g);
      return { ...g.toObject(), balances };
    });
    res.json(result);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Add expense to group
app.post("/group/:groupId/expense", async (req, res) => {
  try {
    const { title, amount, paidBy, splitAmong } = req.body;
    if (!title || !amount || !paidBy) return res.status(400).json({ message: "Missing fields" });
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });
    group.expenses.push({ title, amount, paidBy, splitAmong: splitAmong || group.members });
    group.total += Number(amount);
    await group.save();
    res.json({ ...group.toObject(), balances: calcBalances(group) });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Settle a balance between two members
app.post("/group/:groupId/settle", async (req, res) => {
  try {
    const { from, to, amount } = req.body;
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });
    // Add a settlement expense so balances recalculate correctly
    group.expenses.push({ title: `Settlement: ${from} → ${to}`, amount, paidBy: from, splitAmong: [to] });
    await group.save();
    res.json({ ...group.toObject(), balances: calcBalances(group) });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Add member to group
app.post("/group/:groupId/member", async (req, res) => {
  try {
    const { name } = req.body;
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });
    if (group.members.includes(name)) return res.status(400).json({ message: "Member already exists" });
    group.members.push(name);
    await group.save();
    res.json({ ...group.toObject(), balances: calcBalances(group) });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Remove member from group
app.delete("/group/:groupId/member/:name", async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });
    group.members = group.members.filter(m => m !== req.params.name);
    await group.save();
    res.json({ ...group.toObject(), balances: calcBalances(group) });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Delete group
app.delete("/group/:groupId", async (req, res) => {
  try {
    await Group.findByIdAndDelete(req.params.groupId);
    res.json({ message: "Group deleted" });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── BALANCE CALCULATOR ───────────────────────────
function calcBalances(group) {
  const net = {};
  group.members.forEach(m => net[m] = 0);
  group.expenses.forEach(({ amount, paidBy, splitAmong }) => {
    const share = amount / (splitAmong?.length || group.members.length);
    net[paidBy] = (net[paidBy] || 0) + amount;
    (splitAmong || group.members).forEach(m => net[m] = (net[m] || 0) - share);
  });
  // Settle: build who owes whom
  const creditors = [], debtors = [];
  Object.entries(net).forEach(([name, bal]) => {
    if (bal > 0.01) creditors.push({ name, bal });
    else if (bal < -0.01) debtors.push({ name, bal: -bal });
  });
  const balances = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const pay = Math.min(debtors[i].bal, creditors[j].bal);
    balances.push({ from: debtors[i].name, to: creditors[j].name, amount: Math.round(pay * 100) / 100 });
    debtors[i].bal -= pay;
    creditors[j].bal -= pay;
    if (debtors[i].bal < 0.01) i++;
    if (creditors[j].bal < 0.01) j++;
  }
  return balances;
}

// ── HEALTH CHECK ─────────────────────────────────
app.get("/", (req, res) => res.json({ status: "FinTrak API running 🚀", version: "1.0.0" }));

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));