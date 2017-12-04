const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.post('/api/auth/register', async function (req, res, next) {
    req.body.password = bcrypt.hashSync(req.body.password);
    await dbWorker.create(req.body).catch((err) => {
        console.log("Duplicate email");
        res.status(409).end("Registration error");
        return;
    });
    res.status(201).end();
});

router.post('/api/auth/login', async function (req, res, next) {
    let result = await dbWorker.login(req.body.email, req.body.password);

    if (result && result.status) {
        res.end(jwt.sign({
            id: result.id,
            email: req.body.email
        }, "secret", {expiresIn: 60 * 5}));
        return;
    }
    else {
        res.status(401).end("Login error");
    }
});

module.exports = router;