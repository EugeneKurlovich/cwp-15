const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const config = require('../config.json');
const db = require('../models')(Sequelize, config);

router.all('/*', async function (req, res, next) {

    
    if (req.header("Authorization")) {
        console.log("qwe");
        if (req.manager === undefined) {
            let token = req.header("Authorization").split(" ")[1];
            jwt.verify(token, 'secret', async function (err, decoded) {
                if (!err) {
                    let manager = await db.managers.findById(decoded.id);
                    req.manager = manager.get({raw: true});
                    next();
                }
                else {
                    console.log("ERROR 403");
                }
            });
        }
    }
    else
    res.send("ERROR 401");

     
});

module.exports = router;