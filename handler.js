const serverless = require("serverless-http");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const players = require("./routes/playersRouter");
const authUser = require("./routes/authRouter");
const authUsers = require("./middlewares/authUser");
app.use(express.json());

mongoose.connect("mongodb+srv://azim:4444@cluster0.mdf4u.mongodb.net/nba_players?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connected to the db nba_player "));


app.use("/players", authUsers, players);
app.use("/", authUser);

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
