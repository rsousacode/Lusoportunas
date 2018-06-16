const express = require("express");
const ObjectID = require("mongodb").ObjectId;
const router = express.Router();
const lusDB = require("../backend/data/lusDB");
const uuid = require("uuid");
module.exports = router;
let fs = require('fs');
let shortid = require('shortid');


router.route('/perfil/:id')
    .all(function (req, res, next) {
        const userId = req.params.id;

        lusDB.User.findById(userId).exec()   //find a doccument by Id
            .then(user => {
                if (!user) {
                    res.sendStatus(404);
                    return;
                }
                res.locals.user = user;
                res.locals.userHasRole = function (role) { //check roles
                    return (user.roles || []).indexOf(role) > -1
                };
                next();

            }).catch(next);

    })
    .get(function (req, res) {
        res.render("user/perfil/perfilPublico",
            {
                ruser: req.user
            }
        );
    });


router.route('/perfil')
    .get(function (req, res) {
        if (req.user.role === "Recruta") {

            let uname = req.user.username;
            let query = {"ruser.username": uname};

            lusDB.Job.find(query).exec()
                .then(function (jobs) {
                    res.render("user/perfil/recruta", {
                        title: "Bem-vindos ao Lusoportunas",
                        ruser: req.user,
                        jobs: jobs
                    });
                });
        } else {

            res.render("user/perfil/utilizador",
                {
                    ruser: req.user
                });
        }
    });

router.route('/painel')
    .get(function (req, res) {
        if (req.user.role === "Recruta") {

            let uname = req.user.username;
            let query = {"ruser.username": uname};

            lusDB.Job.find(query).exec()
                .then(function (jobs) {
                    res.render("c/user-panel", {
                        title: "Bem-vindos ao Lusoportunas",
                        ruser: req.user,
                        jobs: jobs
                    });
                });
        } else {

            res.render("user/perfil/utilizador",
                {
                    ruser: req.user
                });
        }
    });

router.route('/perfil/:id/editar')
    .all(function (req, res, next) {
        const userId = req.params.id;

        lusDB.User.findById(userId).exec()
            .then(user => {
                if (!user) {
                    res.sendStatus(404);
                    return;
                }
                res.locals.user = user;
                res.locals.userHasRole = function (role) {
                    return (user.roles || []).indexOf(role) > -1
                };
                next();

            }).catch(next);

    })
    .get(function (req, res) {
        res.render("user/perfil/editar",
            {
                ruser: req.user
            }
        );
    })
    .post(function (req, res, next) {

            let profilePicture = req.files.profilePicture;
            let curriculumFile = req.files.curriculum;

            if (profilePicture) {

                let fileType = "";
                if (profilePicture.mimetype === "image/jpeg") {
                    fileType = ".jpg";

                }
                if (profilePicture.mimetype === "image/png") {
                    fileType = ".png";
                }


                var profilePath = './user/uploads/' + req.user._id + '' + '/profile';

                if (!fs.existsSync(profilePath)) {
                    fs.mkdirSync(profilePath);
                }


                else {
                    let thisDir = __dirname;
                    let thisNewDir = thisDir.replace('/user', '');
                    let newfileName = uuid.v4() + fileType;
                    let cutPath = profilePath.replace('.', '');
                    var finalPath = cutPath + '/' + newfileName;

                    profilePicture.mv(thisNewDir + finalPath, function (err) {
                        if (err) {
                            return res.status(500).send(err);
                        }
                    })
                }
            }


            else if (curriculumFile) {

                let fileType2 = "";
                if (curriculumFile.mimetype === "application/pdf") {
                    fileType2 = ".pdf";
                }
                var curriculumPath = './user/uploads/' + req.user._id + '' + '/curriculum';

                if (!fs.existsSync(curriculumPath)) {
                    fs.mkdirSync(curriculumPath);
                }

                else {
                    let thisDir2 = __dirname;
                    let thisNewDir2 = thisDir2.replace('/user', '');
                    let newfileName2 = "curriculo-"+shortid.generate() + fileType2;
                    let cutPath2 = curriculumPath.replace('.', '');
                    var finalPathThis = cutPath2 + '/' + newfileName2;

                    curriculumFile.mv(thisNewDir2 + finalPathThis, function (err) {
                        if (err) {
                            return res.status(500).send(err);
                        }
                    })
                }
            }

            function userFromRequestBody(user, request, profilepic, curriculum) {


                if (profilePath) {
                    user.profilePicture = profilepic.replace('/user/uploads', '');
                }
                if (curriculumPath) {
                    user.curriculum = curriculum.replace('/user/uploads', '');
                }
                user.username = request.body.username;
                user.name.firstName = request.body.firstName;
                user.name.lastName = request.body.lastName;
                user.role = request.body.role;
                user.address = {
                    city: request.body["address.city"],
                    district: request.body["address.district"],
                    postalcode: request.body["address.postalcode"]
                };

                user.social = {
                    facebook: request.body["social-facebook"],
                    twitter: request.body["social-twitter"],
                    linkedin: request.body["social-linkedin"],
                };

            }

            userFromRequestBody(res.locals.user, req, finalPath, finalPathThis);

            res.locals.user.save()
                .then(() => res.redirect(req.baseUrl + "/perfil"))
                .catch(error => {
                    if (error.name === "Validation Error") {
                        res.locals.error = error;
                        res.render("user/perfil/editar");
                        return;
                    }
                    next(error);
                });

        }
    );


router.route('/perfil/:id/adicionarExperiencia')
    .all(function (req, res, next) {
        const userId = req.params.id;

        lusDB.User.findById(userId).exec()   //find a doccument by Id
            .then(user => {
                if (!user) {
                    res.sendStatus(404);
                    return;
                }
                res.locals.user = user;
                res.locals.userHasRole = function (role) { //check roles
                    return (user.roles || []).indexOf(role) > -1
                };
                next();

            }).catch(next);

    })
    .get(function (req, res) {
        res.render("user/perfil/atributos/experience/adicionarExperiencia",
            {
                ruser: req.user
            }
        );
    })
    .post(function (req, res, next) {
        let space = res.locals.user.experience.length;


        function experienceFromRequestBody(user, request) {
            user.experience[space] = {
                cargo: request.body["cargo"],
                company: request.body["company"],
                location: request.body["location"],
                description: request.body["description"]

            };
        }

        experienceFromRequestBody(res.locals.user, req);

        res.locals.user.save()
            .then(() => res.redirect(req.baseUrl + "/perfil"))
            .catch(error => {
                if (error.name === "Validation Error") {
                    res.locals.error = error;
                    res.render("user/perfil/atributos/experience/adicionarExperiencia");
                    return;
                }
                next(error);
            });

    });

router.route('/perfil/:id/adicionarEducacao')
    .all(function (req, res, next) {
        const userId = req.params.id;
        lusDB.User.findById(userId).exec()   //find a doccument by Id
            .then(user => {
                if (!user) {
                    res.sendStatus(404);
                    return;
                }
                res.locals.user = user;
                res.locals.userHasRole = function (role) { //check roles
                    return (user.roles || []).indexOf(role) > -1
                };
                next();

            }).catch(next);

    })
    .get(function (req, res) {
        res.render("user/perfil/atributos/education/adicionarEducacao",
            {
                ruser: req.user
            }
        );
    })
    .post(function (req, res, next) {

        let space = res.locals.user.education.length;

        function educationFromRequestBody(user, request) {
            user.education[space] = {
                school: request.body["school"],
                formation: request.body["formation"],
                location: request.body["location"],
                study_area: request.body["study_area"],
                qualification: request.body["qualification"],
                attachment: request.body["attachment"]

            };
        }

        educationFromRequestBody(res.locals.user, req);

        res.locals.user.save()
            .then(() => res.redirect(req.baseUrl + "/perfil"))
            .catch(error => {
                if (error.name === "Validation Error") {
                    res.locals.error = error;
                    res.render("user/perfil/atributos/education/adicionarEducacao");
                    return;
                }
                next(error);
            });

    });


