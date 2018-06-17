const _ = require("lodash");
const express = require("express");
const ObjectID = require("mongodb").ObjectId;
const router = express.Router();
const lusDB = require("../../data/lusDB");

module.exports = router;


router.use(function (req, res, next) {
    if (req.isAuthenticated() && req.user.admin) {
        res.locals.user = req.user;
        next();
        return;
    }
    res.sendStatus(404);
});

router.get('/artigos', async function (req, res) {
    let name = req.query.name; //filter alias , SEARCH
    let query = {};
    if (name) {
        query.name = {$regex: name};  // $ne -> values that are not equal to ; $nin -> 	Matches values that do not exist in an array specified to the query. Almost the same thing
    }

    lusDB.Article.find(query).exec()
        .then(function (articles, body, date) {
            res.render("admin/artigos/lista", {
                ruser: req.user,
                title: "Bem-vindos ao Lusoportunas",
                articles: articles,
                name: name,
                body: body,
                date: date

            });
        })
        .catch(next);

});


router.route('/artigo/adicionar')
    .get(function (req, res) {
        res.render("admin/artigos/adicionar");
    })
    .post(function (req, res, next) {
        let getNow = new Date();
        let article = {
            user: req.user,
            userId: req.user._id,
            name: req.body.name,
            body: req.body.body,
            category: req.body.category,
            date: getNow

        };

        lusDB.connect
            .then(db => db.collection("articles").insertOne(article))
            .then(result => res.redirect(req.baseUrl+"/artigos"));

    });

router.route('/artigo/editar/:id')
    .all(function (req, res, next) {
        let articleId = req.params.id;
        let filter = {_id: new ObjectID(articleId)};

        lusDB.connect
            .then(db => db.collection("articles").find(filter).next())
            .then(article => {

                if (!article) {
                    res.sendStatus(404);
                    return;
                }
                res.locals.article = article;
                next();
            })
            .catch(next);
    })
    .get(function (req, res) {
        res.render("admin/artigos/editar",
            {
                user: req.user
            });
    })
    .post(function (req, res, next) {

        let articleId = req.params.id;
        let filter = {_id: new ObjectID(articleId)};
        let update = {
            $set: {
                name: req.body.name,
                body: req.body.body,
                category: req.body.category
            }
        };
        lusDB.connect
            .then(db => db.collection("articles").updateOne(filter, update))
            .then(result => res.redirect(req.baseUrl+"/artigos"))
            .catch(next);

    });

router.get('/artigo/eliminar/:id', function (req, res, next) {
    let articleId = new ObjectID(req.params.id);
    let filter = {_id: articleId};

    lusDB.connect
        .then(db => db.collection("articles").deleteOne(filter))
        .then(result => res.redirect(req.baseUrl+"/artigos"))
        .catch(next);

});
router.route('/artigo/editar/:id')
    .all(function (req, res, next) {
        let articleId = req.params.id;
        let filter = {_id: new ObjectID(articleId)};

        lusDB.connect
            .then(db => db.collection("articles").find(filter).next())
            .then(article => {

                if (!article) {
                    res.sendStatus(404);
                    return;
                }
                res.locals.article = article;
                next();
            })
            .catch(next);
    })
    .get(function (req, res) {
        res.render("admin/artigos/editar",
            {
                user: req.user
            });
    })
    .post(function (req, res, next) {

        let articleId = req.params.id;
        let filter = {_id: new ObjectID(articleId)};
        let update = {
            $set: {
                user: req.user,
                name: req.body.name,
                body: req.body.body,
                category: req.body.category
            }
        };
        lusDB.connect
            .then(db => db.collection("articles").updateOne(filter, update))
            .then(result => res.redirect(req.baseUrl+"/artigos"))
            .catch(next);

    });
//
// router.use(function(req, res, next) {
//     if (req.url === '/admin/artigos/artigo') {
//         req.url = '/artigo';
//     }
//     next();
// });

router.route('/artigo/:id')
    .all(function (req, res, next) {
        let articleId = req.params.id;
        let filter = {_id: new ObjectID(articleId)};

        lusDB.connect
            .then(db => db.collection("articles").find(filter).next())
            .then(article => {

                if (!article) {
                    res.sendStatus(404);
                    return;
                }
                res.locals.article = article;
                next();
            })
            .catch(next);
    })
    .get(function (req, res) {
        res.render("admin/artigos/artigo",
            {
                user: req.user
            });
    })
    .post(function (req, res, next) {

        let articleId = req.params.id;
        let filter = {_id: new ObjectID(articleId)};
        let update = {
            $set: {
                name: req.body.name,
                body: req.body.body,
                category: req.body.category
            }
        };
        lusDB.connect
            .then(db => db.collection("articles").get(filter, update))
            .then(result => res.redirect(req.baseUrl+"/artigos"))
            .catch(next);

    });
