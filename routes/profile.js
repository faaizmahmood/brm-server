const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/profile', authMiddleware, async (req, res) => {
    try {
        // Access the user object set by the authMiddleware
        const user = req.user;

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        // get user urls

        // Respond with user profile data
        res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Error retrieving profile:', error);

        // Return a 500 response for unexpected server errors
        res.status(500).json({
            message: 'Internal Server Error',
        });
    }
});

module.exports = router;
