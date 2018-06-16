const express = require("express");
const passport = require("passport");
const user = require('./admin/utilizadores/userModel');
const _ = require('lodash');
const LocalStrategy = require('passport-local').Strategy;
const lusDB = require('./data/lusDB');
const router = express.Router();

module.exports = router;
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(function (user, done) {
    done(null, user.id);
});


passport.deserializeUser(function (id, done) {
    lusDB.User.findById(id, function (err, user) {
        err
            ? done(err)
            : done(null, user);
    });
});

router.get('/registar', function (req, res) {
    res.render('register', {});
});

router.post('/registar', function (req, res) {

    let getNow = new Date();

    let newUser = new user({
        date: getNow,
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
        role: req.body.role
    });

    //TODO MANAGING REGISTRATION ERRORS

    user.register(newUser, req.body.password,
        function (err, account) {
            if (err) {
                return res.render("register", {info: "Sorry. That username already exists. Try again."})
            }

            console.log(newUser);

            passport.authenticate('local')(req, res, function () {
                res.redirect('/perfil');
            });
        });
});

router.route("/form")
    .get(function (req, res) {
        res.render('c/form');
    });

router.route("/")

    .all(function (req, res, next) {

        lusDB.User.findById("5b0731f2d8e9f333624b8257").exec()   //find a doccument by Id
            .then(user => {
                if (!user) {
                    res.sendStatus(404);
                    return;
                }
                res.locals.user = user;
                next();

            }).catch(next)

    })

    .get(function (req, res) {

        if (req.app.get("env") === "development") {


            req.logIn(res.locals.user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.redirect('/painel');
            });
            return;
        }

        res.render("c/index", {
            title: "Lusoportunas - Conecta-te com o teu sucesso! ",
            ruser : req.user

            });


    });

router.route("/entrar")

    .all(function (req, res, next) {

        lusDB.User.findById("5b0731f2d8e9f333624b8257").exec()   //find a doccument by Id
            .then(user => {
                if (!user) {
                    res.sendStatus(404);
                    return;
                }
                res.locals.user = user;
                next();

            }).catch(next)

    })

    .get(function (req, res) {

        if (req.app.get("env") === "development") {


            req.logIn(res.locals.user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.redirect('/painel');
            });
            return;
        }

        res.render("c/user-login", {}
        );


    });

router.post("/entrar", passport.authenticate('local', {
    successRedirect: '/painel',
    failureRedirect: '/'
}));

router.post("/", passport.authenticate('local', {
    successRedirect: '/painel',
    failureRedirect: '/'
}));

router.get('/sair', function (req, res) {
    req.logout();
    res.redirect('/');
});