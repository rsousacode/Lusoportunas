const express = require("express");
const passport = require("passport");
const os = require('os');
const router = express.Router();
const user = require('./userModel');
const lusDB = require("../../data/lusDB");


module.exports = router;

router.get('/utilizadores', function (req, res, next) {

    let username = req.query.username; //filter alias , SEARCH
    let query = {};
    if (username) {
        query.username = {$in: username};  // $ne -> values that are not equal to ; $nin -> 	Matches values that do not exist in an array specified to the query. Almost the same thing
    }

    lusDB.User.find(query).exec()
        .then(function (users) {
            res.render("admin/utilizadores/lista", {
                title: "Utilizadores (admin)",
                ruser: req.user,
                users: users,
                username: username
            });
        })
        .catch(next);
});




router.route('/utilizadores/adicionar')
    .get(function (req, res) {
        res.render("admin/utilizadores/adicionar",
            {
            });
    }
    );

router.post('/utilizadores/adicionar', function (req, res) {

    let getNow = new Date();

    let newUser = new user({
        date: getNow,
        role: req.body.role,
        username: req.body.username,
        password: req.body.password,
        fullName: req.body.fullName,
        address: {
            district: req.body["address.district"],
            postalcode: req.body["address.postalcode"]

        },

        name: {
            title: req.body["name.title"],
            firstName: req.body["name.firstName"],
            lastName: req.body["name.lastName"],
        },
        social: {
            facebook: req.body["social-facebook"],
            twitter: req.body["social-twitter"],
            linkedin: req.body["social-linkedin"],
        },
        gender:req.body.gender,
    });

    user.register(newUser, req.body.password,
        function (err, account) {
            if (err) {
                return res.render("register", {info: "Sorry. That username already exists. Try again."})
            }

            res.redirect("/");
        });
});

router.route('/utilizador/:id')
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
        res.render("admin/utilizadores/utilizador",
            {
                ruser: req.user
            }
        );
    });

function userFromRequestBody(user, request) {
    user.username = request.body.username;
    user.name.firstName = request.body.firstName;
    user.name.lastName = request.body.lastName;
    user.role = request.body.role;
    user.gender = request.body.gender;

    user.social = {
        facebook: request.body["social-facebook"],
        twitter: request.body["social-twitter"],
        linkedin: request.body["social-linkedin"],
    };

    user.address = {
        city: request.body["address.city"],
        district: request.body["address.district"],
        postalcode: request.body["address.postalcode"]

    };
}


router.route('/utilizador/editar/:id')
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
        res.render("admin/utilizadores/editar",
            {
                ruser: req.user,
            }
        );
    })
    .post(function (req, res, next) {
        userFromRequestBody(res.locals.user, req);

        res.locals.user.save()
            .then(() => res.redirect(req.baseUrl + "/utilizadores"))
            .catch(error => {
                if (error.name === "Validation Error") {
                    res.locals.error = error;
                    res.render("admin/utilizadores/editar");
                    return;
                }
                next(error);
            });

    });
router.get('/utilizador/eliminar/:id', function (req, res, next) {
    let userId = req.params.id;
    lusDB.User.findByIdAndRemove(userId) // use to remove from the DB with the id
        .then(() => res.redirect(req.baseUrl + "/utilizadores"))
        .catch(next);

});

router.route('/utilizador/:id/adicionarEmpresa')
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
        res.render("admin/utilizadores/adicionarEmpresa",
            {
                ruser: req.user
            }
        );
    })
    .post(function (req, res, next) {

        let space = res.locals.user.company.length;

        function companyFromRequestBody(user, request) {

            user.company[space] = {
                name: request.body["name"],
                location: request.body["location"],

            };
        }


        companyFromRequestBody(res.locals.user, req);

        res.locals.user.save()
            .then(() => res.redirect(req.baseUrl + "/utilizadores"))
            .catch(error => {
                if (error.name === "Validation Error") {
                    res.locals.error = error;
                    res.render("admin/utilizadores/editar");
                    return;
                }
                next(error);
            });

    });

router.route('/utilizador/:id/adicionarExperiencia')
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
        res.render("admin/utilizadores/adicionarExperiencia",
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
            .then(() => res.redirect(req.baseUrl + "/utilizadores"))
            .catch(error => {
                if (error.name === "Validation Error") {
                    res.locals.error = error;
                    res.render("admin/utilizadores/");
                    return;
                }
                next(error);
            });

    });

router.route('/utilizador/:id/adicionarEducacao')
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
        res.render("admin/utilizadores/adicionarEducacao",
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
            .then(() => res.redirect(req.baseUrl + "/utilizadores"))
            .catch(error => {
                if (error.name === "Validation Error") {
                    res.locals.error = error;
                    res.render("admin/utilizadores/");
                    return;
                }
                next(error);
            });

    });