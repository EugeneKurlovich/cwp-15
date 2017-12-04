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
    let manager = await db.managers.find({
        where: {
            email: req.body.email
        }
    });

    if (manager) {
      let id = manager.id;
      let status = bcrypt.compareSync(req.body.password, manager.password);        
      console.log("status " + status);
        if (status)
        {
            console.log("AUTH");
            console.log("id : " + id);
            console.log("email : " + manager.email);
            console.log("password : " + req.body.password);
            console.log("crypt : " + manager.password);
            res.end(jwt.sign({
                id: id,
                email: req.body.email
            }, "secret", {expiresIn: 60 * 5}));
        }
        else
        {
            res.send("AUTH ERROR");
        }

    }
    else
    {
        res.send("AUTH ERROR");
    }
});

module.exports = router;