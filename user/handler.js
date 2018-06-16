const express = require("express");
const ObjectID = require("mongodb").ObjectId;
const router = express.Router();
const lusDB = require("../backend/data/lusDB");
const uuid = require("uuid");
module.exports = router;


router.get('/', function (req, res) {
    res.render('c/index', {
        ruser: req.user,
        title: "Lusoportunas - Conecta-te com o teu Futuro"
    });
});

