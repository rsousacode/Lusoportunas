const express = require("express");
const ObjectID = require("mongodb").ObjectId;
const router = express.Router();
const lusDB = require("../backend/data/lusDB");
module.exports = router;


/* Trabalhos 2 */
router.get('/meustrabalhos', async function (req, res) {
    let uname = req.user.username;
    let query = {"ruser.username": uname};

    lusDB.Job.find(query).exec()
        .then(function (jobs) {
            res.render("user-jobs-active", {
                title: "Lusoportunas - Ofertas de emprego publicadas",
                ruser: req.user,
                jobs: jobs
            });
        })
        .catch(next);
});

/* Trabalhos 2 END */

/* Trabalhos 2 */
router.get('/candidaturas', async function (req, res) {
    let uname = req.user.username;
    let query = {"ruser.username": uname};

    lusDB.Job.find(query).exec()
        .then(function (jobs) {
            res.render("user-recruit-applications", {
                title: "Lusoportunas - Ofertas de emprego publicadas",
                ruser: req.user,
                jobs: jobs
            });
        })
        .catch(next);
});

router.route('/candidatura/arquivar/:id')

    .all(function (req, res, next) {

        const applicationId = req.params.id;

        lusDB.Job.find({"application._id": new ObjectID(applicationId)}, {
            "application.$": 1,
            "_id": new ObjectID(applicationId)
        }).exec()
            .then(job => {
                if (!job) {
                    res.sendStatus(404);
                    return;
                }
                res.locals.job = job;

            }).catch(next);

    })
    .get(function (req, res, next) {

        function archive(job) {

            job.application[0] = {
                "status": false

            };
        }

        archive(res.locals.job, req);

        res.locals.job.save()
            .then(() => res.redirect(req.baseUrl + "/perfil/"))
            .catch(error => {
                if (error.name === "Validation Error") {
                    res.locals.error = error;
                    res.render("user/perfil/atributos/education/adicionarEducacao");
                    return;
                }
                next(error);
            });

    });

/* Trabalhos 2 END */

/* Trabalhos 3 */
router.get('/trabalhosExpirados', async function (req, res) {
    let uname = req.user.username;
    let query = {"ruser.username": uname};

    lusDB.Job.find(query).exec()
        .then(function (jobs) {
            res.render("user-jobs-expired", {
                title: "Lusoportunas - Ofertas de emprego publicadas",
                ruser: req.user,
                jobs: jobs
            });
        })
        .catch(next);
});

/* Trabalhos 3 END */


router.get('/meusTrabalhos', async function (req, res) {
    let uname = req.user.username;
    console.log(req.user.username);
    let query = {"ruser.username": uname};

    lusDB.Job.find(query).exec()
        .then(function (jobs) {
            res.render("user/trabalhos/meusTrabalhos", {
                title: "Bem-vindos ao Lusoportunas",
                ruser: req.user,
                jobs: jobs
            });
        })
        .catch(next);
});

router.get('/trabalhos', async function (req, res) {
    let name = req.query.name;
    let query = {};
    if (name) {
        query.name = {$in: name};
    }

    lusDB.Job.find(query).exec()
        .then(function (jobs) {
            res.render("all-jobs", {
                title: " Lusoportunas - Trabalhos",
                ruser: req.user,
                jobs: jobs
            });
        })
        .catch(next);

});

router.route('/empresa/apagar/:id')
    .get(function (req, res) {
        let companyId = req.params.id;
        lusDB.User
            .findByIdAndUpdate(req.user._id, {
                $pull: {
                    company: {
                        _id: companyId
                    }
                }
            }, function (err) {
            });
        res.redirect(req.baseUrl + "/minhasEmpresas")
    });

router.route('/trabalho/adicionar')
    .get(function (req, res) {

        lusDB.User.find({}).exec()
            .then(function (users) {
                res.render("user/trabalhos/adicionar", {
                    title: "Lusoportunas - Adicionar Trabalho",
                    ruser: req.user,
                    users: users
                });
            })
    })
    .post(function (req, res, next) {
        lusDB.User.find({"company.name": "kaka"}, {"company.$": 1, "name": "kaka"}).exec()
            .then(function (user) {
                let getNow = new Date();
                let expDate = new Date(req.body.expirationDate);
                let job = {
                    date: getNow,
                    ruser: req.user,
                    body: {
                        "cargo": req.body.cargo,
                        "requisitos": req.body.requisitos,
                        "beneficios": req.body.beneficios,
                        "responsabilidades": req.body.responsabilidades,
                        "vagas": req.body.vagas,
                        "oferta": req.body.oferta
                    },
                    location: req.body.location,
                    company: req.body.company,
                    jobType: req.body.jobType,
                    jobSector: req.body.jobSector,
                    jobFunction: req.body.jobFunction,
                    expirationDate: expDate,
                    gender: req.body.gender

                };

                lusDB.connect
                    .then(db => db.collection("jobs").insertOne(job))
                    .then(result => res.redirect(req.baseUrl + "/painel"));
            });
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
        lusDB.User.find({}).exec()
            .then(function (users) {
                res.render("user/trabalhos/editar", {
                    title: "Lusoportunas - Editar Trabalho",
                    ruser: req.user,
                    users: users
                });
            })
    })
    .post(function (req, res, next) {

        let jobId = req.params.id;
        let filter = {_id: new ObjectID(jobId)};
        let expDate = new Date(req.body.expirationDate);
        let update = {
            $set: {

                body: {
                    "cargo": req.body.cargo,
                    "requisitos": req.body.requisitos,
                    "beneficios": req.body.beneficios,
                    "responsabilidades": req.body.responsabilidades,
                    "vagas": req.body.vagas,
                    "oferta": req.body.oferta
                },
                location: req.body.location,
                company: req.body.company,
                jobType: req.body.jobType,
                jobSector: req.body.jobSector,
                jobFunction: req.body.jobFunction,
                expirationDate: expDate,
                gender: req.body.gender
            }
        };
        lusDB.connect
            .then(db => db.collection("jobs").updateOne(filter, update))
            .then(result => res.redirect(req.baseUrl + "/painel"))
            .catch(next);
    });

router.get('/trabalho/eliminar/:id', function (req, res, next) {
    let jobId = new ObjectID(req.params.id);
    let filter = {_id: jobId};

    lusDB.connect
        .then(db => db.collection("jobs").deleteOne(filter))
        .then(result => res.redirect(req.baseUrl + "/painel"))
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
        res.render("single-job",
            {
                title: "Lusoportunas - " + res.locals.job.jobFunction,
                ruser: req.user
            }
        );
    });

/* CONCORRER 2 */

router.route('/trabalho/concorrer/:id')
    .all(function (req, res, next) {
        const jobId = req.params.id;
        lusDB.Job.findById(jobId).exec()   //find a doccument by Id
            .then(job => {
                if (!job) {
                    res.sendStatus(404);
                    return;
                }
                res.locals.job = job;
                next();

            }).catch(next);

    })
    .get(function (req, res) {
        res.render("user-application-compose",
            {
                title: "Lusoportunas - Candidatar-se",
                ruser: req.user
            }
        );
    })
    .post(function (req, res, next) {
        let curriculumFile = req.files.curriculum;


        if (curriculumFile) {


            let fileType2 = "";
            if (curriculumFile.mimetype === "application/pdf") {
                fileType2 = ".pdf";
            }
            var curriculumPath = './user/uploads/' + req.user._id;

            if (!fs.existsSync(curriculumPath)) {
                fs.mkdirSync(curriculumPath);
            }

            else {
                let thisDir2 = __dirname;
                let thisNewDir2 = thisDir2.replace('/user', '');
                let newfileName2 = "curriculo-" + shortid.generate() + fileType2;
                let cutPath2 = curriculumPath.replace('.', '');
                var finalPathThis = cutPath2 + '/' + newfileName2;

                curriculumFile.mv(thisNewDir2 + finalPathThis, function (err) {
                    if (err) {
                        return res.status(500).send(err);
                    }
                })
            }
        }


        let space = res.locals.job.application.length;
        let setDate = new Date();

        function applicationFromRequestBody(job, request, curriculum) {

            job.application[space] = {
                if(curriculumPath){
                    ruser.curriculum = curriculum.replace('/user/uploads', '');
                },
                ruser: req.user,
                body: {
                    bdate: setDate,
                    application: request.body["message"],

                },
            };
        }

        applicationFromRequestBody(res.locals.job, req, finalPathThis);

        res.locals.job.save()
            .then(() => res.redirect(req.baseUrl + "/painel"))
            .catch(error => {
                if (error.name === "Validation Error") {
                    res.locals.error = error;
                    res.render("user-application-compose", {
                        title: "Lusoportunas - Candidatar-se (erro)"
                    });
                    return;
                }
                next(error);
            });

    });


/*CONCORRer 2 */
//
// router.route('/trabalho/concorrer/:id')
//     .all(function (req, res, next) {
//         const jobId = req.params.id;
//         lusDB.Job.findById(jobId).exec()   //find a doccument by Id
//             .then(job => {
//                 if (!job) {
//                     res.sendStatus(404);
//                     return;
//                 }
//                 res.locals.job = job;
//                 next();
//
//             }).catch(next);
//
//     })
//     .get(function (req, res) {
//         res.render("user/trabalhos/applications/aplicar",
//             {
//                 ruser: req.user
//             }
//         );
//     })
//     .post(function (req, res, next) {
//
//         let space = res.locals.job.application.length;
//         let setDate= new Date();
//         function applicationFromRequestBody(job, request) {
//             job.application[space] = {
//                 message: request.body["message"],
//                 date: setDate,
//                 ruser: req.user
//             };
//         }
//
//         applicationFromRequestBody(res.locals.job, req);
//
//         res.locals.job.save()
//             .then(() => res.redirect(req.baseUrl + "/meusTrabalhos"))
//             .catch(error => {
//                 if (error.name === "Validation Error") {
//                     res.locals.error = error;
//                     res.render("user/perfil/atributos/education/adicionarEducacao");
//                     return;
//                 }
//                 next(error);
//             });
//
//     });

router.route('/minhasCandidaturas/:id')
    .get(function (req, res, next) {
        const userId = req.params.id;
        let query = {"application.ruser._id": new ObjectID(userId)};

        lusDB.Job.find(query).exec()
            .then(function (jobs) {
                res.render("user-my-applications", {
                    title: " Lusoportunas - Minhas Candidaturas",
                    ruser: req.user,
                    jobs: jobs
                });
            })
            .catch(next);
    });

router.route('/applications/:id')
    .all(function (req, res, next) {
        const jobId = req.params.id;

        lusDB.Job.findById(jobId).exec()   //find a doccument by Id
            .then(job => {
                if (!job) {
                    res.sendStatus(404);
                    return;
                }
                res.locals.job = job;
                next();

            }).catch(next);

    })
    .get(function (req, res) {
        res.render("user-job-applications",
            {
                title: "Lusoportunas - Candidaturas",
                ruser: req.user
            }
        );
    });



router.route('/application/:id')
    .all(function (req, res, next) {
        let appId = "";
        appId = req.params.id;

        let query = {"application._id": new ObjectID(appId)};

        lusDB.connect
            .then(db => db.collection("jobs").find(query, {
                "jobFunction": 1,
                "application.$": 1,
                "_id": new ObjectID(appId)
            }).next())
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
        res.render("user-application",
            {
                title: "Lusoportunas - Candidatura a " + res.locals.job.jobFunction,
                ruser: req.user
            }
        );
    });
