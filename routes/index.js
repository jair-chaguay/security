var express = require('express');
var router = express.Router();

let crypto = require('crypto');
const sequelize = require('../models/index.js').sequelize;
var initModels = require("../models/init-models");
var models = initModels(sequelize);


router.get('/', function (req, res, next) {
  res.render('index');
});


router.post('/login', async function (req, res, next) {
  let { username, password } = req.body

  //Verificando si las entradas que ingresa
  if (username != null && password != null) {

    try {

      //Obtiene la primera entrada que cumple con las opciones
      let user = await models.users.findOne({
        where: {
          name: username
        }
      })

      if (user != null && user.password != null) {

        let salt = user.password.split("$")[0]
        let hash = crypto.createHmac('sha512', salt).update(password).digest("base64");
        let passwordHash = salt + "$" + hash

        if (passwordHash === user.password) {

          const options={
            expires: new Date(
              Date.now() + (60 * 1000)
            )
          }

          res.cookie("username", username, options)

          res.redirect('/users');
        } else {
          res.redirect('/');
        }
      } else {
        res.redirect('/');
      }

    } catch (error) {
      res.status(400).send(error)
    }
  } else {
    res.redirect('/');
  }

});

module.exports = router;