const express = require('express');
const db = require('./db')
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const router = express.Router();

// get challenge history
router.get('/history', async (req, res) => {
  const challengeCollection = await db.loadChallengeCollection();

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
  const challengeCollection = await db.loadChallengeCollection();

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

router.get('/chall/:mode', async (req, res) => {
  const mode = req.params.mode;
  if (mode < 0 || mode  > 2) {
    res.status(400).send();
    return;
  }

  if (!req.session.challenge) {
    res.status(400).send();
    return;
  }

  const challnum = req.session.challenge.challenges[mode];
  const code = fs.readFileSync(`server/challenges/${mode}/${challnum}/chall.s`).toString();

  const types = fs.readFileSync(`server/challenges/${mode}/${challnum}/chall.f`).toString().split('\n');
  const rettype = types[0];
  const params = types[1].split(',');
  var func = `${rettype} f(`;

  for (var i = 0; i < params.length; ++i) {
    if (i > 0) func += ', ';
    func += `${params[i].trim()} a${i}`;
  }

  func += `)`
  
  res.status(200).send({
    code,
    func
  });
});

router.post('/chall/:mode', async (req, res) => {
  var mode = req.params.mode;
  if (mode < 0 || mode  > 2) {
    res.status(400).send();
    return;
  }

  if (!req.session.challenge || req.session.challenge.score[mode] != -1) {
    res.status(400).send();
    return;
  }

  var challnum = req.session.challenge.challenges[mode];
  var code = req.body.code;
  
  code = code.replace("__asm__", "asm");

  var result = await exec(`cd server/grader; ./pregrade.sh ${req.sessionID} ${mode} ${challnum}`);
  if (result.error) {
    res.status(500).send();
    return;
  }
  var dirname = result.stdout.trim();

  fs.writeFileSync(`server/grader/${dirname}/solution.c`, code);

  var result;
  var gccError = '';
  try {
    await exec(`cd server/grader; ./grade.sh ${dirname}`);
    result = 1;
  } catch(err) {
    result = 0;
  }

  if (result) {
    try {
      gccError = fs.readFileSync(`server/grader/${dirname}/log.txt`).toString().trim();
      result = -1;
    } catch (err) {
      result = 1;
    }
  }

  req.session.challenge.score[mode] = result;

  await exec(`cd server/grader; ./postgrade.sh ${dirname}`)

  res.status(200).json({ result: req.session.challenge.score[mode], error: gccError });
});

router.post('/end', async (req, res) => {
  if (!req.session.challenge) {
    res.status(400).send();
    return;
  }

  var numSolved = 0;
  for (var i = 0; i < 3; ++i) {
    if (req.session.challenge.score[i] !== -1)
      numSolved++;
  }

  if (numSolved !== 3) {
    req.status(400).send();
    return;
  }

  const challengeCollection = await db.loadChallengeCollection();

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

    const userCollection = await db.loadUserCollection();
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