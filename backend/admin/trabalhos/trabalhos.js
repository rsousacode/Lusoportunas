const _ = require("lodash");
const express = require("express");
const ObjectID = require("mongodb").ObjectId;
const router = express.Router();
const lusDB = require("../../data/lusDB");

module.exports = router;

router.get('/trabalhos', async function (req, res) {
    let name = req.query.name; //filter alias , SEARCH
    let query = {};
    if (name) {
        query.name = {$regex: name};  // $ne -> values that are not equal to ; $nin -> 	Matches values that do not exist in an array specified to the query. Almost the same thing
    }

    lusDB.Job.find(query).exec()
        .then(function (jobs) {
            res.render("admin/trabalhos/lista", {
                title: "Bem-vindos ao Lusoportunas",
                ruser: req.user,
                jobs: jobs,
                name: name,

            });
        })
        .catch(next);

});

router.route('/trabalho/adicionar')
    .get(function (req, res) {
        res.render("admin/trabalhos/adicionar",
        );
    })
    .post(function (req, res, next) {
        let getNow = new Date();
        let expDate = new Date(req.body.expirationDate);
        let job = {
            date: getNow,
            user: req.user,
            body: {
                "cargo": req.body.cargo,
                "requisitos": req.body.requisitos,
                "beneficios": req.body.beneficios,
                "responsabilidades": req.body.responsabilidades,
                "vagas": req.body.vagas,
                "oferta": req.body.oferta
            },
            location: req.body.location,
            jobType: req.body.jobType,
            jobSector: req.body.jobSector,
            jobFunction: req.body.jobFunction,
            expirationDate: expDate,

        };

        lusDB.connect
            .then(db => db.collection("jobs").insertOne(job))
            .then(result => res.redirect(req.baseUrl + "/trabalhos"));

    });

router.route('/trabalho/editar/:id')
    .all(function (req, res, next) {
        let jobId = req.params.id;
        let filter = {_id: new ObjectID(jobId)};

        lusDB.connect
            .then(db => db.collection("jobs").find(filter).next())
            .then(job => {

                if (!job) {
                    res.sendStatus(404);
                    return;
                }
                res.locals.job = job;
                next();
            })
            .catch(next);
    })
    .get(function (req, res) {
        res.render("admin/trabalhos/editar",
            {
                user: req.user,
            });
    })
    .post(function (req, res, next) {

        let jobId = req.params.id;
        let filter = {_id: new ObjectID(jobId)};
        let update = {
            $set: {
                user: req.user,
                expirationDate: new Date(req.body.expirationDate),
                body: {
                    "cargo": req.body.cargo,
                    "requisitos": req.body.requisitos,
                    "beneficios": req.body.beneficios,
                    "responsabilidades": req.body.responsabilidades,
                    "vagas": req.body.vagas,
                    "oferta": req.body.oferta
                }
                ,
                location: req.body.location,
                jobType: req.body.jobType,
                jobSector: req.body.jobSector,
                jobFunction: req.body.jobFunction,
            }
        };
        lusDB.connect
            .then(db => db.collection("jobs").updateOne(filter, update))
            .then(result => res.redirect(req.baseUrl + "/trabalhos"))
            .catch(next);
    });

router.get('/trabalho/eliminar/:id', function (req, res, next) {
    let jobId = new ObjectID(req.params.id);
    let filter = {_id: jobId};

    lusDB.connect
        .then(db => db.collection("jobs").deleteOne(filter))
        .then(result => res.redirect(req.baseUrl + "/trabalhos"))
        .catch(next);

});


router.route('/trabalho/:id')
    .all(function (req, res, next) {
        let jobId = req.params.id;
        let filter = {_id: new ObjectID(jobId)};

        lusDB.connect
            .then(db => db.collection("jobs").find(filter).next())
            .then(job => {

                if (!job) {
                    res.sendStatus(404);
                    return;
                }
                res.locals.job = job;
                next();
            })
            .catch(next);
    })
    .get(function (req, res) {
        res.render("trabalhos/trabalho",
            {
                user: req.user
            }
        );
    });

