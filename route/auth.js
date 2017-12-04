const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const config = require('../config.json');
const db = require('../models')(Sequelize, config);
const app = express();
app.use(bodyParser.json()); 


router.post('/register', async function (req, res, next) {
    req.body.password = bcrypt.hashSync(req.body.password);
    let result = await db.managers.create(req.body);

    if (result !== undefined)
    {
        res.send(JSON.stringify(result));
    }
    else
    {
        res.end('ERROR CREATE');
    }
});

router.post('/login', async function (req, res, next) {

});

module.exports = router;