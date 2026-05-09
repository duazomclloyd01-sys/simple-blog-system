const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

exports.register = async (req, res) => {
  const { username, password } = req.body;

  const existing = await userModel.findUserByUsername(username);
  if (existing) return res.status(400).json({ message: 'User exists' });

  const hashed = await bcrypt.hash(password, 10);

  const user = await userModel.createUser({
    username,
    password: hashed
  });

  res.json({ message: 'Registered', user });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await userModel.findUserByUsername(username);
  if (!user) return res.status(400).json({ message: 'User not found' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'Wrong password' });

  const token = jwt.sign({ id: user.id }, 'secretkey');

  res.json({ token });
};