const express = require('express')
const router = express.Router()

const axios = require('axios')

const User = require('../models/user')

const { setUser } = require("../services/auth")


router.post('/oauth/google', async (req, res) => {

    const { credential } = req.body

    try {

        const googleUser = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${credential}`)

        let user = await User.findOne({ email: googleUser.data.email })

        if (!user) {

            user = new User({
                name: googleUser.data.name,
                email: googleUser.data.email,
                provider: "google"
            })

            await user.save()

        }


        const payload = {
            id: user._id,
            name: user.name,
            email: user.email
        }

        const token = setUser(payload)

        res.status(200).json({
            message: "Login successful",
            user: token,
        });

    } catch (error) {

        res.status(500).json({ message: "Authentication failed." });

    }

})

module.exports = router