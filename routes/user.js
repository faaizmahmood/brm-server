const express = require('express')
const User = require('../models/user')

const { setUser } = require('../services/auth')

const router = express.Router()


// signup
router.post('/signup', async (req, res) => {

    const { name, email, password } = req.body

    try {

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }


        const newUser = new User({
            name,
            email,
            password,
        });


        await newUser.save()


        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
        });


    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }

})


// signin


router.post('/signin', async (req, res) => {

    const { email, password } = req.body;


    try {

        const userData = await User.findOne({ email })

        if (!userData) {

            res.status(404).json({
                error: "user not found."
            })

        }

        const isMatch = await userData.comparePassword(password)

        if (isMatch) {

            const tokenPayload = {
                id: userData._id,
                name: userData.name,
                email: userData.email,
            }

            const token = setUser(tokenPayload)

            res.status(200).json({
                message: "Login successful",
                user: token,
            });

        } else {

            res.status(401).json({
                error: "Password is incorrect."
            });

        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }

})

module.exports = router