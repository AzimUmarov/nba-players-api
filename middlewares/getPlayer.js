const Player = require("../models/player");

async function getPlayer(req, res, next) {
    let player;
    try {
        player = await Player.findById(req.params.id);

        if (player == null)
            return res.status(404).setHeader("Content-Type", "application/json").json({ message: 'player not found :(' });
    } catch (err) {
        return res.status(500).setHeader("Content-Type", "application/json").json({ message: err.message });
    }

    res.player = player;
    next();
}

module.exports = getPlayer;
