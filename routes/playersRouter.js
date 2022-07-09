const express = require("express");
const router = express.Router();
const Player = require("../models/player");
const getPlayer = require("../middlewares/getPlayer");
const paginatedResults = require("../middlewares/paginatedResults");

//get all players
router.get('/', paginatedResults(Player), async (req, res) => {
    try {
        // const players =  await Player.find();
        res.setHeader("Content-Type", "application/json").json(res.paginatedResults);
    }
    catch (err) {
        // res.setHeader("Content-Type", "application/json").status(500).json({message: err.message});
    }
});

//get one player
router.get('/:id', getPlayer, (req, res) => {
    res.json(res.player);
});

//Create one player
router.post('/', async (req, res) => {
    const player = new Player({
        Player: req.body.Player,
        height: req.body.height,
        weight: req.body.weight,
        collage: req.body.collage,
        born: req.body.born,
        birth_city: req.body.born,
        birth_state: req.body.birth_state
    });

    try {
        const newPlayer = await player.save();
        res.status(201).setHeader("Content-Type", "application/json").json(newPlayer);
    }
    catch (err) {
        res.status(400).setHeader("Content-Type", "application/json").json({message: err.message});
    }
});

//updating player
router.patch('/:id', getPlayer, async (req, res) => {
    if (req.body.Player != null) {
        res.player.Player = req.body.Player || res.player.Player;
        res.player.height = req.body.height || res.player.height;
        res.player.weight = req.body.weight || res.player.weight;
        res.player.collage = req.body.collage || res.player.collage;
        res.player.born = req.body.born || res.player.born;
        res.player.birth_city = req.body.birth_city || res.player.birth_city;
        res.player.birth_state = req.body.Player || res.player.birth_state;
    }
    try {
        const updatedPlayer = await res.player.save();
        res.setHeader("Content-Type", "application/json").json(updatedPlayer);
    } catch (err) {
        res.setHeader("Content-Type", "application/json").status(400).json({ message: err.message })
    }
});

//deleting player
router.delete('/:id', getPlayer,async (req, res) => {
    try {
        await res.player.remove();
        res.setHeader("Content-Type", "application/json").json({message: "player deleted:)"});
    }
    catch (err) {
        res.status(500).setHeader("Content-Type", "application/json").json({ message: err.message });
    }
});


module.exports = router;
