const User = require('../models/user');
const generateToken = require('../utils/generateToken');


//Register a user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });

    if (user) {
        res.cookie('token', generateToken(user._id), { httpOnly: true });
        res.status(201).json({ id: user._id, name, email });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

//Login a user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.cookie('token', generateToken(user._id), { httpOnly: true });
        res.json({ id: user._id, name: user.name, email });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};


//Logout a user
const logoutUser = (req, res) => {
    res.cookie('token', '', { expires: new Date(0), httpOnly: true });
    res.json({ message: 'Logged out successfully' });
};

module.exports = { registerUser, loginUser, logoutUser };
