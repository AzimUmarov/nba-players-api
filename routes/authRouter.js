require('dotenv').config();
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/user");
const redis = require('redis');
const authUser = require("../middlewares/authUser");

router.post("/login", async (req, res) => {
    const user = {username: req.body.username || "n", password: req.body.password || "n"};

    if(user.username.length < 3 || user.password.length < 4)
        return res.setHeader("Content-Type", "application/json").status(403).json({message: "Invalid user data"});

    const existingUser = await User.find({username: user.username});

    if(!existingUser[0])
        return res.setHeader("Content-Type", "application/json").status(401).json({message: "User not found"});
    let incorrectPassword = false;

    await jwt.verify(existingUser[0].password,user.password, (err, user) => {
        if (err)
            incorrectPassword = true;
    });

    if(incorrectPassword)
        return res.setHeader("Content-Type", "application/json").status(403).json({message: "password isn't correct, please try again!"}).end();;

    try {
        await jwt.sign(user, user.password, async (err, token) => {
            const client = redis.createClient({
                url: "redis://redis-11966.c9.us-east-1-2.ec2.cloud.redislabs.com:11966",
                password: "GszO9hckHPgACZMNlUbLr9Z6koVCjuwP"
            });
            client.on('error', (err) => console.log('Redis Client Error', err));
            await client.connect();
            await client.set(token, token);
            return res.setHeader("Content-Type", "application/json").status(200).json({token: token});
        });
    }
    catch (err){
       return res.status(500).json({message: err.message});
    }
});

router.post("/register", async (req, res) => {
    const tempUser = {username: req.body.username || "n", password: req.body.password} || "n";
    const client = redis.createClient({
        url: process.env.REDIS_ENDPOINT + "",
        password:  process.env.REDIS_PASSWORD + ""
    });

    //some validiations
    if(tempUser.username.length < 3 || tempUser.password.length < 4)
        return res.status(400).json({message: "User data not valid :)"});

    const existingUser = await User.find({username: tempUser.username});

    if(existingUser[0])
        return res.status(400).json({message: "User already exist login via /login path :)"});

    let passToken = await jwt.sign({ foo: 'bar' }, tempUser.password);

    try {
        if (passToken) {
            const user = new User({username: tempUser.username, password: passToken});
            await user.save().catch(err => console.log(err.message));

            jwt.sign(tempUser, tempUser.password, async (err, token) => {
                if (err)
                    return res.status(403).json({message: "error while generating token"});

                client.on('error', (err) => console.log('Redis Client Error', err));
                await client.connect();
                await client.set(token, token);
                res.status(200).json({message: "user created", token: token});
            });
        }
    }
    catch (err) {
        res.send(500).json({message: err.message});
    }
});

router.get("/logout", authUser, async (req, res) => {
    const token = req.headers["authorization"];
    const client = redis.createClient({
        url: "redis://redis-11966.c9.us-east-1-2.ec2.cloud.redislabs.com:11966",
        password: "GszO9hckHPgACZMNlUbLr9Z6koVCjuwP"
    });
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();
    try {
        await client.del(token);
        res.status(200).json({message: "signet out"});
    }
    catch (e){
        res.status(500).json({message: e.message});
    }
});

module.exports = router;
