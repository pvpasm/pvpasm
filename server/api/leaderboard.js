const express = require('express')
const mongodb = require('mongodb')

const router = express.Router()

// Get
router.get('/', async (req, res) => {
    const userCollection = await loadUserCollection();

    var leaderboard = await userCollection.find().sort({score: 1}).toArray();
    res.send(leaderboard.map((item, index) => ({
        rank: index + 1,
        username: item.username,
        score: item.score
    })));
});

async function loadUserCollection() {
    const client = await mongodb.MongoClient.connect("mongodb+srv://pvpasm:jxJJAySr7Jt8d8X7@pvpasm-rxxxy.mongodb.net/pvpasm?retryWrites=true", {
        useNewUrlParser: true
    })

    return client.db('pvpasm').collection('user');
}

module.exports = router;