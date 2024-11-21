const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['User', 'Admin'], default: 'User' },
});

const User = mongoose.model('user', UserSchema);

module.exports = User;