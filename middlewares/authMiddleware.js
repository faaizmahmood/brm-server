const jwt = require('jsonwebtoken');
require('dotenv').config();

const secreteKey = process.env.SECRETEJWTKEY;

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Unauthorized: Missing or malformed Authorization header',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, secreteKey);

        // Optional: Validate token payload
        if (!decoded.id || !decoded.email) {
            return res.status(401).json({
                message: 'Unauthorized: Invalid token payload',
            });
        }

        req.user = decoded; // Attach decoded token data to request
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Forbidden: Token expired' });
        }
        return res.status(401).json({
            message: 'Unauthorized: Token invalid or expired',
        });
    }
};

module.exports = authMiddleware;
