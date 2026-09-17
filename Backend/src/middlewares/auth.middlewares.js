const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

// This middleware checks whether the user is authenticated by verifying JWT and checking token blacklist
async function authUser(req, res, next) {
    let token = req.cookies?.token;

    // Check Authorization header (Bearer token) if cookie is not present
    if (!token && req.headers.authorization) {
        const parts = req.headers.authorization.split(" ");
        if (parts.length === 2 && parts[0] === "Bearer") {
            token = parts[1];
        }
    }

    // If token is not provided 
    if (!token) {
        return res.status(401).json({
            message: "Token not available"
        });
    }

    try {
        // Check if token is blacklisted (logged out)
        const isBlacklisted = await tokenBlacklistModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({
                message: "Session expired or logged out. Please sign in again."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // attach user info to request
        req.user = decoded;

        next(); // move to next middleware / controller

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

module.exports = {
    authUser
};