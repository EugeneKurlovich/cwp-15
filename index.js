const express = require('express');
const Sequelize = require('sequelize');
const app = express();
const config = require('./config.json');
const db = require('./models')(Sequelize, config);
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const router = express.Router();
const fleets_controller = require('./route/apiFleets');
const vehicles_controller = require('./route/apiVehicles');
const motions_controller = require('./route/apiMotions');
const auth_controller = require('./route/auth');
const header_controller = require('./route/middleware');

app.use('/api/*(fleets|vehicles|motions)',header_controller);
app.use('/api/fleets', fleets_controller);
app.use('/api/vehicles', vehicles_controller);
app.use('/api/motions', motions_controller);
app.use('/api/auth',auth_controller);


app.listen(3000, () => {
  WorkWork();
   console.log('Example app listening on port 3000!');
})



async function WorkWork() {
  console.log("start");
    await require('./insertData')(db);
console.log("end");
}