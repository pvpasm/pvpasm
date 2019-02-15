const express = require('express')
const db = require('./db')

const router = express.Router()

// Get
router.get('/', async (req, res) => {
    const userCollection = await db.loadUserCollection();

    var leaderboard = await userCollection.find().sort({score: -1}).toArray();
    res.send(leaderboard.map((item, index) => ({
        rank: index + 1,
        username: item.username,
        score: item.score
    })));
});

module.exports = router;