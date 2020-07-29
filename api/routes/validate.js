const express = require('express');
const fs = require('fs')
const path = require('path')
const os = require('os');
const { exec } = require('child_process');

const router = express.Router();

router.post('/:category/:level', (req, res) => {
    fs.mkdtemp(path.join(os.tmpdir()), (err, folder) => {
        if (err) throw err;
        let chall = `../learn/${req.params.category}/${req.params.level}/chall.c`
        fs.copyFileSync(path.join(__dirname, "../validator/saw"), path.join(folder, "saw"))
        fs.copyFileSync(path.join(__dirname, "../validator/validate.saw"), path.join(folder, "validate.saw"))
        fs.copyFileSync(path.join(__dirname, "../validator/validate.sh"), path.join(folder, "validate.sh"))
        fs.copyFileSync(path.join(__dirname, chall), path.join(folder, "chall.c"))
        fs.writeFileSync(path.join(folder, "submission.c"), req.body.code)

        output = exec(`cd ${folder}; ./validate.sh`, (err, stdout, stderr) => {
            if (err) {
                res.status(200).json({ "msg": stderr.toString() });
            }
            else {
                res.status(200).json({ "msg": stdout.toString() });
            }
        })
    });
})

module.exports = router;