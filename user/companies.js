const express = require("express");
const ObjectID = require("mongodb").ObjectId;
const router = express.Router();
const lusDB = require("../backend/data/lusDB");
const uuid = require("uuid");
module.exports = router;

router.use(function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
        next();
        return;
    }
    res.redirect("/entrar");
});

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
                ruser: req.user
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
            res.render("user/empresas/todasEmpresas", {
                title: "Lusoportunas - Empresas",
                ruser: req.user,
                users: users
            });
        })
        .catch(next);

});

router.get('/minhasEmpresas', async function (req, res) {
    let uname = req.user.username;
    let query = {"ruser.username": uname};

    lusDB.User.find(query).exec()
        .then(function (company) {
            res.render("user/empresas/minhasEmpresas", {
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
                ruser: req.user
            }
        );
    })
    .post(function (req, res, next) {

        let sampleFile = req.files.sampleFile;

        if (sampleFile) {

            let fileType = "";
            if (req.files.sampleFile.mimetype === "image/jpeg") {
                fileType = ".jpg";

            }
            if (req.files.sampleFile.mimetype === "image/png") {
                fileType = ".png";
            }

            if (sampleFile.mimeType) {
                console.log(sampleFile.mimeType);

            }

            var rawUrl = 'uploads/users/profile/' + uuid.v4() + fileType;

            sampleFile.mv(__dirname + '/public/' + rawUrl, function (err) {
                if (err) {
                    return res.status(500).send(err);
                }
            })
        }

        let space = res.locals.user.company.length;
        let imgUrl = "";

        function companyFromRequestBody(user, request) {
             imgUrl = rawUrl;
            user.company[space] = {

                logo : imgUrl,
                location: request.body.location,
                name: request.body.name,
                description: request.body.description,
                mission: request.body.mission,
                objectives: request.body.objectives,

            };
        }

        companyFromRequestBody(res.locals.user, req, rawUrl);

        res.locals.user.save()
            .then(() => res.redirect(req.baseUrl + "/minhasEmpresas"))
            .catch(error => {
                if (error.name === "Validation Error") {
                    res.locals.error = error;
                    res.render("user/empresas/adicionar");
                    return;
                }
                next(error);
            });

    });
