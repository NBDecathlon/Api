const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['User', 'Admin'], default: 'User' },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;