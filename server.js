const express = require('express');
const auth = require('./middleware/auth');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

mongoose.connect('mongodb+srv://ayodejitech6896_db_user:darklovemd123@cluster0.oelvri8.mongodb.net/?appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.log('❌ MongoDB Error:', err));
// SIGNUP
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  const existing = await User.findOne({ username });
  if (existing) return res.json({ message: 'User already exists' });

  const hashed = await bcrypt.hash(password, 10);

  const user = new User({ username, email, password: hashed });
  await user.save();

  res.json({ message: 'Signup successful' });
});

// LOGIN WITH JWT
app.post('/index', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.json({ message: 'Incorrect password' });

  const token = jwt.sign({ id: user._id, role: user.role }, 'SECRET_KEY');

  res.json({ message: 'success', token });
});

// DASHBOARD (PROTECTED)
app.get('/dashboard', auth, (req, res) => {
  res.json({ message: 'Welcome user' });
});

// ADMIN STATS
app.get('/admin/stats', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const users = await User.find();

  res.json({
    totalUsers: users.length,
    users
  });
});


const PORT = 5000;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
