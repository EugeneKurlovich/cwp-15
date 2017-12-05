const express = require('express');
var bodyParser = require('body-parser');
const config = require('../config.json');
const Sequelize = require('sequelize');
const router = express.Router();
const db = require('../models')(Sequelize, config);
const geolib = require('geolib');

const app = express();
app.use(bodyParser.json()); 
module.exports = router;

router.post('/milage', async function (req, res, next) {
    let vehicle = await db.vehicles.findAll({
        where:
    {
        id:req.body.id
    }
    });
    if (req.manager.super || (vehicle && vehicle.fleetId == req.manager.fleetId)) {
    if (vehicle) {
        let coords = await db.motions.findAll({
            where:{
              vehicleId:  req.body.id
            }
        });


        let coordss = [];

        coords.forEach((motion) => {
            coordss.push(motion.latLng)
        });

        if (coordss.length < 2)
        {
            res.send(JSON.stringify(0));
        }
            
        else {
            let distance = geolib.getPathLength(coordss);
            res.send(JSON.stringify(distance));
        }
    }
    else
    {
        res.send("ERROR 400");
    }  
}
else
{
    res.send("ERROR");
}    
});

router.post('/readAll',async function(req,res,next){
    let result;
    if (req.manager.super)
    {
        result = await db.vehicles.findAll();
    }
    else
    {
    result = await db.vehicles.findAll({
        where:
        {
            fleetId : req.manager.fleetId
        }
    });
    }
    if (result !== undefined)
    {
        res.send(JSON.stringify(result));
    }
    else
    {
        res.end('ERROR');
    }
});




router.post('/read',async function(req,res,next){

    let result = await db.vehicles.findAll({
        where:
        {
            id : req.body.id
        }
    });

        if (req.manager.super || (result && result.fleetId == req.manager.fleetId))
        {
            res.send(JSON.stringify(result));
        }
    else
    {
        res.end('ERROR 404');
    }
});

router.post('/create',async function(req,res,next){
    let result;
    if (req.manager.super)
    {
     result = await db.vehicles.create(req.body);
    }
    else
    {
     req.body.fleetId = req.manager.fleetId;
     result = await db.vehicles.create(req.body);
    }

    if (result !== undefined)
    {
        res.send(JSON.stringify(result));
    }
    else
    {
        res.end('ERROR CREATE');
    }
});

router.post('/update',async function(req,res,next){
    let result = await db.vehicles.update(
        req.body,
        {
            where: {
                id: req.body.id
            }
        });

        if (req.manager.super || (result && result.fleetId === req.manager.fleetId ))
        {
            if (result !== undefined)
            {
                res.send(JSON.stringify(result));
            }
            else
            {
                res.end('ERROR 404');
            }
        }
        res.send("ERROR ");
});

router.post('/delete',async function(req,res,next){
    let result = await db.vehicles.destroy({
            where: {
                id: req.body.id
            }
    });
    if (req.manager.super || (result && result.fleetId == req.manager.fleetId)) {
    if (result !== undefined)
    {
        res.send(JSON.stringify(result));
    }
    else
    {
        res.end('ERROR 404');
    }
}
res.send("ERROR ");
});