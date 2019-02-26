const express = require('express');
const db = require('./db');
const crypto = require('crypto');
const { sendResetEmail } = require('./mail');

const router = express.Router();

router.post('/login', async (req, res) => {
    const userCollection = await db.loadUserCollection();

    var user = await userCollection.findOne({
        username: req.body.username
    });

    if (!user) {
        res.status(401).json({error: "Login failed!"});
        return;
    }

    var hash = sha512(req.body.password, user.salt);

    if (hash === user.hash) {
        req.session.username = req.body.username;
        res.cookie('username', req.body.username, {maxAge: 1000 * 60 * 60 * 24 * 7});
        res.status(200).send();
    }
    else {
        res.status(401).json({error: "Login failed!"});
    }
});

router.post('/register', async (req, res) => {
    const userCollection = await db.loadUserCollection();

    var user = await userCollection.findOne({
        $or: [
            { username: req.body.username },
            { email: req.body.email }
        ]
    });

    if (user) {
        res.status(400).send({error: "User already exists!"});
        return;
    }

    var salt = genRandomString(16);
    var hash = sha512(req.body.password, salt);

    await userCollection.insertOne({
        email: req.body.email,
        username: req.body.username,
        hash: hash,
        salt: salt,
        score: 0,
        comment: ''
    });

    req.session.username = req.body.username;
    res.cookie('username', req.body.username, {maxAge: 1000 * 60 * 60 * 24 * 7});

    res.status(201).send();
});

router.get('/profile', async (req, res) => {
    if (!req.session.username) {
      res.status(400).send();
      return;
    }

    const userCollection = await db.loadUserCollection();
    var user = await userCollection.findOne({ username: req.session.username });

    res.status(200).json({
        username: user.username,
        email: user.email,
        comment: user.comment
    })
})

router.post('/profile', async (req, res) => {
    if (!req.session.username) {
      res.status(400).send();
      return;
    }

    const userCollection = await db.loadUserCollection();
    var user = await userCollection.findOne({ username: req.session.username });

    var hash = sha512(req.body.password, user.salt);
    if (hash !== user.hash) {
        res.status(400).json({ error: 'Wrong password'});
        return;
    }

    if (req.body.newPassword) {
        user.salt = genRandomString(16);
        user.hash = sha512(req.body.newPassword, user.salt);
    }
    
    if (req.body.email) {
        var emailUser = await userCollection.findOne({ email: req.body.email });
        if (emailUser && emailUser.username !== req.session.username) {
            res.status(400).json({ error: 'This email is already used' })
            return;
        }
        user.email = req.body.email;
    }

    user.comment = req.body.comment;

    await userCollection.updateOne({username: user.username}, { $set: user });
    res.status(200).send();
})

router.post('/logout', async (req, res) => {
    req.session.username = '';
    res.clearCookie('username');
    res.status(200).send();
});

function sha512(password, salt) {
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    return hash.digest('hex');
};

function genRandomString(length) {
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

router.post('/forgot', async (req, res) => {
    const userCollection = await db.loadUserCollection();

    var user = await userCollection.findOne({
        email: req.body.email
    });

    if (!user) {
        res.status(400).json({ error: 'No user with this email exists. '});
        return;
    }

    const new_pass = randomPassword();
    const salt = genRandomString(16);
    const hash = sha512(new_pass, salt);
    await userCollection.updateOne({username: user.username}, {
        $set: 
        {
          salt: salt,
          hash: hash
        }
    });
    
    await sendResetEmail(req.body.email, new_pass, (err) => {
        if (err) {
            console.log("Callback");
            console.log(err);
            res.status(500).send();
        }
        else
            res.status(200).send();
    });
});

function randomPassword() {
    var pwd = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

    for (var i = 0; i < 12; i++)
        pwd += possible.charAt(Math.floor(Math.random() * possible.length));

    return pwd;
}

module.exports = router;