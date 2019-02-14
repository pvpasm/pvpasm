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

  history = history.map(item => formatChallengeEntry(item, req.session.username));

  res.json(history);
});

router.post('/start', async (req, res) => {
  const challengeCollection = await loadChallengeCollection();

  var available = await challengeCollection.findOne({
    winner: "",
    homeUser: { $ne: req.session.username }
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
  if (!req.session.challenge || req.session.challenge.score[0] != -1) {
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

  req.session.challenge.score[0] = code === 'pass' ? 1 : 0;

  res.status(200).json({result: req.session.challenge.score[0]});
});

router.post('/chall2', async (req, res) => {
  if (!req.session.challenge || req.session.challenge.score[1] != -1) {
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

  req.session.challenge.score[1] = code === 'pass' ? 1 : 0;

  res.status(200).json({result: req.session.challenge.score[1]});
});

router.post('/chall3', async (req, res) => {
  if (!req.session.challenge || req.session.challenge.score[2] != -1) {
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

  req.session.challenge.score[2] = code === 'pass' ? 1 : 0;

  res.status(200).json({result: req.session.challenge.score[2]});
});

router.post('/end', async (req, res) => {
  if (!req.session.challenge) {
    res.status(400).send();
    return;
  }

  const challengeCollection = await loadChallengeCollection();

  var duration = (new Date()).getTime() - req.session.challenge.start.getTime();

  var challenge = req.session.challenge;
  var id = '';

  if (challenge.id) {
    id = challenge.id;
    const win = isWin(challenge.score, duration, challenge.opp.homeScore, challenge.opp.homeTime);
    const winner = win ? req.session.username : challenge.opp.homeUser;

    await challengeCollection.updateOne({_id: challenge.id}, {
      $set: 
      {
        awayUser: req.session.username,
        awayScore: challenge.score,
        awayTime: duration,
        awayDate: challenge.start,
        winner: winner
      }
    });

    const userCollection = await loadUserCollection();
    const user = await userCollection.findOne({username: winner});
    await userCollection.updateOne({username: winner}, {
      $set:
      {
        score: user.score + 25
      }
    })
  }
  else {
    const result = await challengeCollection.insertOne({
      homeUser: req.session.username,
      homeScore: challenge.score,
      homeTime: duration,
      homeDate: challenge.start,
      awayUser: '',
      awayTime: 0,
      awayDate: '',
      awayScore: [-1, -1, -1],
      challenges: challenge.challenges,
      winner: '',
    });
    id = result.insertedId;
  }

  req.session.challenge = null;

  challenge = await challengeCollection.findOne({_id: id});
  res.status(200).json(formatChallengeEntry(challenge, req.session.username));
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
    return time < oppTime;
  }
  return points > oppPoints;
};

function formatChallengeEntry(item, username) {
  return {
    opponent: item.homeUser === username ? item.awayUser : item.homeUser,
    myScore: item.homeUser === username ? item.homeScore : item.awayScore,
    oppScore: item.homeUser === username ? item.awayScore : item.homeScore,
    myTime: item.homeUser === username ? item.homeTime : item.awayTime,
    oppTime: item.homeUser === username ? item.awayTime : item.homeTime,
    date: item.homeUser === username ? item.homeDate : item.awayDate,
    win: item.winner === "" ? -1 : item.winner === username ? 1 : 0
  }
}

module.exports = router;