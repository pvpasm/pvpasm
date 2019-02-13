const express = require('express');
const mongodb = require('mongodb');
const crypto = require('crypto');
const fs = require('fs');

const router = express.Router();

// get challenge history
router.get('/history', async (req, res) => {
    const challengeCollection = await loadChallengeCollection();
    
    if (!req.session.username) {
        res.status(400).send();
        return;
    }

    var history = await challengeCollection.find({
        $or: [
            {homeUser: req.session.username},
            {awayUser: req.session.username}
        ]
    }).sort({'_id': -1}).toArray();

    res.send(history.map(item => ({
        opponent: item.homeUser === req.session.username ? item.awayUser : item.homeUser,
        myScore: item.homeUser === req.session.username ? item.homeScore : item.awayScore,
        oppScore: item.homeUser === req.session.username ? item.awayScore : item.homeScore,
        myTime: item.homeUser === req.session.username ? item.homeTime : item.awayTime,
        oppTime: item.homeUser === req.session.username ? item.awayTime : item.homeTime,
        date: item.homeUser === req.session.username ? item.homeDate : item.awayDate,
        win: item.winner === "" ? -1 : item.winner === req.session.username ? 1 : 0
    })));
});

router.post('/start', async (req, res) => {
    const challengeCollection = await loadChallengeCollection();

    var available = await challengeCollection.findOne({
        winner: ""
    });

    req.session.challenge = {
        start: new Date(),
        score: [-1, -1, -1]
    }

    if (!available) {
        req.session.challenge.challenges = [1, 1, 1];
    }
    else {
        req.session.challenge.challenges = available.challenges;
        req.session.challenge.id = available._id;
        req.session.challenge.opp = available;
    }

    res.status(201).send();
});

router.get('/chall1', async (req, res) => {
    if (!req.session.challenge) {
        res.status(400).send();
        return;
    }

    var challnum = req.session.challenge.challenges[0];

    fs.readFile('server/challenges/easy/asm/' + challnum, (err, data) => {
        if (err) throw err;
        res.status(200).send({code: data.toString()});
    });
});

router.get('/chall2', async (req, res) => {
    if (!req.session.challenge) {
        res.status(400).send();
        return;
    }

    var challnum = req.session.challenge.challenges[1];

    fs.readFile('server/challenges/medium/asm/' + challnum, (err, data) => {
        if (err) throw err;
        res.status(200).send({code: data.toString()});
    });
});

router.get('/chall3', async (req, res) => {
    if (!req.session.challenge) {
        res.status(400).send();
        return;
    }

    var challnum = req.session.challenge.challenges[2];

    fs.readFile('server/challenges/hard/asm/' + challnum, (err, data) => {
        if (err) throw err;
        res.status(200).send({code: data.toString()});
    });
});

router.post('/chall1', async (req, res) => {
    if (!req.session.challenge) {
        res.status(400).send();
        return;
    }

    var challnum = req.session.challenge.challenges[0];
    var code = req.body.code;
    
    var fullcode = `
    #include <

    int main(int argc, char** argv) {
        int 
    }
    `;

    // compile code

    // validate from 0-1000

    req.session.challenge.challenges[0] = 1;
    res.status(200).send("1");
});

router.post('/chall2', async (req, res) => {
    if (!req.session.challenge) {
        res.status(400).send();
        return;
    }

    var challnum = req.session.challenge.challenges[1];
    var code = req.body.code;
    
    var fullcode = `
    #include <

    int main(int argc, char** argv) {
        int 
    }
    `;

    // compile code

    // validate from 0-1000

    req.session.challenge.challenges[1] = 1;
    res.status(200).send("1");
});

router.post('/chall3', async (req, res) => {
    if (!req.session.challenge) {
        res.status(400).send();
        return;
    }

    var challnum = req.session.challenge.challenges[2];
    var code = req.body.code;
    
    var fullcode = `
    #include <

    int main(int argc, char** argv) {
        int 
    }
    `;

    // compile code

    // validate from 0-1000

    req.session.challenge.challenges[2] = 1;
    res.status(200).send("1");
});

router.post('/end', async (req, res) => {
    const challengeCollection = await loadChallengeCollection();

    var duration = (new Date()).getSeconds() - req.session.challenge.start.getSeconds();

    var win = isWin(challenge.score, duration, challenge.opp.homeScore, challenge.opp.homeTime);
    var challenge = req.session.challenge;

    if (challenge.id) {
        await challengeCollection.update({_id: challenge.id}, {
            awayUser: req.session.username,
            awayScore: challenge.score,
            awayTime: duration,
            awayDate: challenge.start,
            winner: win ? challenge.opp.homeUser : req.session.username
        });
    }
    else {
        await challengeCollection.insertOne({
            homeUser: req.session.username,
            homeScore: challenge.score,
            homeTime: duration,
            homeDate: challenge.start,
            awayUser: '',
            awayTime: 0,
            awayDate: "",
            awayScore: [-1, -1, -1],
            challenges: challenge.challenges,
            winner: '',
        });
    }
    
    const userCollection = await loadUserCollection();
    if (win) {
        var user = await userCollection.findOne({username: req.session.username});
        await userCollection.updateOne({username: req.session.username}, {
            score: user.score + 25
        })
    }
});

async function loadChallengeCollection() {
    const client = await mongodb.MongoClient.connect("mongodb+srv://pvpasm:jxJJAySr7Jt8d8X7@pvpasm-rxxxy.mongodb.net/pvpasm?retryWrites=true", {
        useNewUrlParser: true
    })

    return client.db('pvpasm').collection('challenge');
};

async function loadUserCollection() {
    const client = await mongodb.MongoClient.connect("mongodb+srv://pvpasm:jxJJAySr7Jt8d8X7@pvpasm-rxxxy.mongodb.net/pvpasm?retryWrites=true", {
        useNewUrlParser: true
    })

    return client.db('pvpasm').collection('user');
}

function isWin(score, time, oppScore, oppTime) {
    var points = 0;
    for (var i = 0; i < 3; ++i) {
        if (score[i] == 1)
            points++;
    }
    var oppPoints = 0;
    for (var i = 0; i < 3; ++i) {
        if (oppScore[i] == 1)
            oppPoints++;
    }

    if (points == oppPoints) {
        return time <= oppTime;
    }
    return points > oppPoints;
};

module.exports = router;