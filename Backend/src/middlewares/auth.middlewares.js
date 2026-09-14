const jwt = require("jsonwebtoken");

// This middleware will check whether the user is authenticated or not by checking the token in cookies and verifying it

function authUser(req, res, next) {
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


    // If token is provided we need to check it whether it is genuine or not 
    /**
     * Token = header + payload + signature

    Verification:
    newSignature = HASH(header + payload + SECRET)

    If newSignature == token.signature → VALID ✅
    Else → INVALID ❌
     */

    
    try {
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



module.exports={
    authUser
}