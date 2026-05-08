import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vanguard-security')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- MODELS ---
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
// Prevent model overwrite upon hot reloads in serverless functions
const User = mongoose.models.User || mongoose.model('User', userSchema);

const vaultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  website: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
});
const Vault = mongoose.models.Vault || mongoose.model('Vault', vaultSchema);

// --- MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- ROUTES ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Username already exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'supersecretkey');
    res.json({ token, username });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });
    
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ message: 'Invalid password' });
    
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'supersecretkey');
    res.json({ token, username });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/vault', authenticateToken, async (req, res) => {
  try {
    const { website, username, password } = req.body;
    const vaultItem = new Vault({ userId: req.user.id, website, username, password });
    await vaultItem.save();
    res.json(vaultItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/vault', authenticateToken, async (req, res) => {
  try {
    const items = await Vault.find({ userId: req.user.id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/vault/:id', authenticateToken, async (req, res) => {
  try {
    await Vault.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default app;
