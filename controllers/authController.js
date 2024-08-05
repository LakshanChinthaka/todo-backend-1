const express = require('express')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const dotenv = require('dotenv');
const generateToken = require('../utils/generateToken');

dotenv.config();

//user registration
exports.registerUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        user = new User({ firstName, lastName, email, password });

        //encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save(); 
        
        //after save generate token
        const payload = {
            user: {
                id: user.id,
                firstName: firstName,
                lastName: lastName
            }
        }

        //generate token
        generateToken(payload, res, "Registration successful")

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server error');
    }
}

//login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ msg: 'Invalid email or password' });
        }

        //compare password 
        const isMatchPassword = await bcrypt.compare(password, user.password);
        if (!isMatchPassword) {
            return res.status(400).send({ msg: 'Invalid email or password' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };
        uid = user.id //get user id and pass to generate token
        //generate token
        generateToken(payload, res, "Successfully Login",uid)

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server error');
    }
}
