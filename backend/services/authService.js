const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });
  }

  async register(userData) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const user = await User.create(userData);
    const token = this.generateToken(user._id);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  async login(email, password) {
    const user = await User.findOne({ email, isActive: true }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user._id);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  async getUserById(userId) {
    const user = await User.findOne({ _id: userId, isActive: true });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

module.exports = new AuthService();