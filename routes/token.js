require('dotenv').config()

var express = require('express');
var router = express.Router();


const sequelize = require('../models/index.js').sequelize;
var initModels = require("../models/init-models");
var models = initModels(sequelize);

const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = process.env;


router.get('/', function (req, res, next) {
    const payload = {
        user: {
            id: req.session.id,
            username: req.session.username
        },
        role: req.session.role
    };

    const token = jwt.sign(payload, TOKEN_SECRET, { expiresIn: '1h' });
    res.render('token', {token});
});


module.exports = router;
