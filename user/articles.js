const express = require("express");
const ObjectID = require("mongodb").ObjectId;
const router = express.Router();
const lusDB = require("../backend/data/lusDB");
const uuid = require("uuid");
module.exports = router;


router.get('/artigos/:id', async function (req, res) {
    let uname = req.user.username;
    console.log(req.user.username);
    let query = {"ruser.username": uname};

    lusDB.Job.find(query).exec()
        .then(function (articles) {
            res.render("user/artigos/home", {
                title: "Bem-vindos ao Lusoportunas",
                ruser: req.user,
                articles: articles
            });
        })
        .catch(next);
});

router.get('/artigos', async function (req, res) {
    let name = req.query.name;
    let query = {};
    if (name) {
        query.name = {$regex: name};
    }

    lusDB.Job.find(query).exec()
        .then(function (articles) {
            res.render("user/artigos/lista", {
                title: "Bem-vindos ao Lusoportunas",
                ruser: req.user,
                articles: articles
            });
        })
        .catch(next);

});
