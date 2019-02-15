const express = require('express')
const db = require('./db')

const router = express.Router()

// Get
router.get('/', async (req, res) => {
    const newsCollection = await db.loadNewsCollection();
    const newsList = await newsCollection.find({}).toArray();
    res.send(newsList.reverse());
});

router.post('/', async (req, res) => {
    const news = await db.loadNewsCollection();
    await news.insertOne({
        title: req.body.title,
        desc: req.body.desc,
        createdAt: new Date()
    });
    res.status(201).send();
});

module.exports = router;