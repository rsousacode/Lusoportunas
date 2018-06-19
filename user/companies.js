const express = require("express");
const ObjectID = require("mongodb").ObjectId;
const router = express.Router();
const lusDB = require("../backend/data/lusDB");
const uuid = require("uuid");
const fs = require("fs");

module.exports = router;


router.route('/empresa/editar/:id')
    .all(function (req, res, next) {
        let companieId = req.params.id;

        lusDB.connect
            .then(db => db.collection("users").find({"company._id": new ObjectID(companieId)}, {
                "company.$": 1,
                "_id": new ObjectID(companieId)
            }).next())
            .then(user => {

                if (!user) {
                    res.sendStatus(404);
                    return;
                }
                res.locals.ruser = user;
                next();
            })
            .catch(next);
    })
    .get(function (req, res, next) {
        res.render("c/user-recruit-company-edit",
            {
                title: "Lusoportunas - Editar Empresa",
                ruser: req.user
            }
        ).catch(next);
    })
    .post(function (req, res, next) {

        let logo = req.files.logo;

        if (logo) {

            let fileType = "";
            if (logo.mimetype === "image/jpeg") {
                fileType = ".jpg";

            }
            if (logo.mimetype === "image/png") {
                fileType = ".png";
            }


            var profilePath3 = './user/uploads/' + req.user._id ;

            if (!fs.existsSync(profilePath3)) {
                fs.mkdirSync(profilePath3);
            }

            else {
                let thisDir3 = __dirname;
                let thisNewDir3 = thisDir3.replace('/user', '');
                let newfileName3 = uuid.v4() + fileType;
                let cutPath3 = profilePath3.replace('.', '');
                var finalPath3 = cutPath3 + '/' + newfileName3;

                logo.mv(thisNewDir3 + finalPath3, function (err) {
                    if (err) {
                        return res.status(500).send(err);
                    }
                })
            }
        }


        function companyFromRequestBody(user, request) {
            user.company[0] = {

                location: request.body.location,
                name: request.body.name,
                description: request.body.description,
                mission: request.body.mission,
                objectives: request.body.objectives,
                if(finalPath3){logo : finalPath3.replace('/user/uploads', '')}

            };
        }

        companyFromRequestBody(res.locals.user, req);

            res.locals.user.save()
                .then(() => res.redirect(req.baseUrl + "/minhasempresas"))
                .catch(error => {
                    if (error.name === "Validation Error") {
                        res.locals.error = error;
                        res.render("user/empresas/editar",{
                            title: "Lusoportunas - Editar Empresa"
                        });
                        return;
                    }
                    next(error);
                });

        }
    );



router.route('/empresa/:id')
    .all(function (req, res, next) {
        let companieId = req.params.id;

        lusDB.connect
            .then(db => db.collection("users").find({"company._id": new ObjectID(companieId)}, {
                "company.$": 1,
                "_id": new ObjectID(companieId)
            }).next())
            .then(user => {

                if (!user) {
                    res.sendStatus(404);
                    return;
                }
                res.locals.user = user;
                next();
            })
            .catch(next);
    })
    .get(function (req, res) {
        res.render("user/empresas/empresa",
            {
                ruser: req.user,
                title: "Lusoportunas"+" - "+res.locals.user.company[0].name
            }
        );
    });

router.get('/empresas', async function (req, res) {
    let name = req.query.name; //filter alias , SEARCH
    let query = {};
    if (name) {
        query.name = {$regex: name};
    }

    lusDB.User.find(query).exec()
        .then(function (users) {
            res.render("c/all-companies", {
                title: "Lusoportunas - Empresas",
                ruser: req.user,
                users: users
            });
        })
        .catch(next);

});

router.get('/minhasempresas', async function (req, res) {
    let uname = req.user.username;
    let query = {"ruser.username": uname};

    lusDB.User.find(query).exec()
        .then(function (company) {
            res.render("c/user-recruit-companies", {
                title: "Lusoportunas - Minhas Empresas",
                ruser: req.user,
                company: company
            });
        })
        .catch(next);
});


router.route('/perfil/:id/adicionarEmpresa')
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
        res.render("user/empresas/adicionar",
            {
                title: "Lusoportunas - Adicionar Empresa",
                ruser: req.user
            }
        );
    })
    .post(function (req, res, next) {

        let profilePicture = req.files.profilePicture;

        if (profilePicture) {

            let fileType = "";
            if (profilePicture.mimetype === "image/jpeg") {
                fileType = ".jpg";

            }
            if (profilePicture.mimetype === "image/png") {
                fileType = ".png";
            }


            var profilePath = './user/uploads/' + req.user._id ;

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

        let space = res.locals.user.company.length;

        function companyFromRequestBody(user, request, profilepic) {
            user.company[space] = {
                    if(profilePath){
                        if(profilepic){
                            logo : profilepic.replace('/user/uploads', '')

                        }

                    },


                location: request.body.location,
                name: request.body.name,
                description: request.body.description,
                mission: request.body.mission,
                objectives: request.body.objectives,

            };
        }

        companyFromRequestBody(res.locals.user, req, finalPath, profilePath);

        res.locals.user.save()
            .then(() => res.redirect(req.baseUrl + "/minhasEmpresas"))
            .catch(error => {
                if (error.name === "Validation Error") {
                    res.locals.error = error;
                    res.render("user/empresas/adicionar",{
                        title: "Lusoportunas - Adicionar Empresa (erro)"
                    });
                    return;
                }
                next(error);
            });

    });
