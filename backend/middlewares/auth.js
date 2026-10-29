const jwt = require('jsonwebtoken');
const User = require('../models/User');

const userAuth = async (req, res, next) => {
    try {
        // READ TOKEN FROM THE REQUEST COOKIES
        const cookies = req.cookies;
        const { token } = cookies;

        // VALIDATE THE TOKEN
        if (!token) {
            return res.status(401).send("Please Login!")
        }
        const decodedMessage = await jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = decodedMessage;

        // FIND THE USER IN THE DATABASE
        const user = await User.findById(_id);
        if (!user) {
            throw new Error('Invalid user')
        }

        req.user = user;
        next();
    }
    catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
}

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Not authorized as an admin" });
    }
};

module.exports = {
    userAuth, isAdmin
}