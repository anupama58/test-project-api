const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");


const userRoute = require('./routes/user');
const app = express();

const allowedOrigins = ["http://localhost:3000/user/login"];

app.use(cors());

app.use(bodyParser.json());
//app.use(express.urlencoded({ extended: true }));

app.use('/user',userRoute);

// app.get('/', (req, res) =>{
//     res.send('Hello World');
// });

// app.get('/blog', (req, res) =>{
//     res.send('Hello Blog');
// });
module.exports = app ; 