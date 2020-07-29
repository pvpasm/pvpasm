const express = require('express');
const fs = require('fs')
const path = require('path')

const router = express.Router();

router.get('/metadata', (req, res) => {
    res.sendFile(path.join(__dirname, "../learn/metadata.json"))
})

router.get('/:category/:level', (req, res) => {
    var graph;
    fs.readFile(path.join(__dirname, "../learn", req.params.category, req.params.level, "graph.json"), 'utf8', function (err, data) {
        if (err) throw err;
        graph = JSON.parse(data);
        res.status(200).json({
            "graph": graph,
            "code": "int foo(int x) {\n\n}"
        })
    });
})

module.exports = router;