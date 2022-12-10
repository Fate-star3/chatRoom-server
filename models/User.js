const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    default: '张三',
  },
  account: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    default: '1647749125@qq.com'
  },
  avatar: {
    type: String
  },
  identity: {
    type: String,
    default: 'admin'
  },
  date: {
    type: Date,
    default: Date.now
  },

});

module.exports = User = mongoose.model('users', UserSchema);