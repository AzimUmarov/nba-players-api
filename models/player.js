const mongoose = require("mongoose");

//mongodb db schema for players
const playerSchema = new mongoose.Schema({
    Player: {
        type: String,
        required: true
    },
    height: {
        type: Number
    },
    weight: {
        type: Number
    },
    collage: {
        type: String
    },
    born: {
        type: Number
    },
    birth_city: {
        type: String
    },
    birth_state: {
        type: String
    }
});

module.exports = mongoose.model("nba_players", playerSchema);
