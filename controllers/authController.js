const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ username, email, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here', { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, username, email, role: user.role } });
    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ success: false, msg: 'Registration Failed', error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here', { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ success: false, msg: 'Login Failed', error: err.message });
    }
};
