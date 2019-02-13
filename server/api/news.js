const express = require('express')
const mongodb = require('mongodb')

const router = express.Router()

// Get
router.get('/', async (req, res) => {
    const news = await loadNewsCollection();
    res.send(await news.find({}).toArray());
});

router.post('/', async (req, res) => {
    const news = await loadNewsCollection();
    await news.insertOne({
        title: req.body.title,
        desc: req.body.desc,
        createdAt: new Date()
    });
    res.status(201).send();
});

async function loadNewsCollection() {
    const client = await mongodb.MongoClient.connect("mongodb+srv://pvpasm:jxJJAySr7Jt8d8X7@pvpasm-rxxxy.mongodb.net/pvpasm?retryWrites=true", {
        useNewUrlParser: true
    })

    return client.db('pvpasm').collection('news');
}

module.exports = router;