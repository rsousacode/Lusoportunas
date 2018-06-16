const express = require("express");
const fileUpload = require('express-fileupload');
const bodyParser = require("body-parser");
const app = express();
const passport = require("passport");

app.set("views", "./views");
app.set('view engine', 'pug');

function settingStaticPaths() {
    app.use(express.static("user/uploads"));
    app.use(express.static("public"));
    app.use(express.static("node_modules/datatables/media"));
    app.use(express.static("node_modules/datatables.net-bs4"));
    app.use(express.static("node_modules/jquery/dist"));
    app.use(express.static("node_modules/popper.js/dist"));
    app.use(express.static("node_modules/bootstrap/dist"));
    app.use(express.static("node_modules/font-awesome"));
}

settingStaticPaths();


app.use(fileUpload());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(require('express-session')({
    secret: 'k9.QIG3/phIXSZIY-xtk&&DjEQw}Z,{KqIXZ-F(ndzZJO7W1ijRG-S(oU5](UGci', resave: false, saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// app.use(function (req, res, next) {
//     if (req.isAuthenticated()) {
//         res.locals.user = req.user;
//         next();
//         return;
//     }
//     res.redirect("/entrar");
// });


let authRouter = require("./backend/auth");
app.use(authRouter);

let generalRouter = require("./user/handler");
app.use("/", generalRouter);

let sriracha = require("sriracha-admin");
app.use("/sriracha", sriracha());

let apiRouter = require("./api");
app.use("/api", apiRouter);

// ADMIN ROUTES
let adminJobsRouter = require("./backend/admin/trabalhos/trabalhos");
app.use("/admin", adminJobsRouter);

let adminArticlesRouter = require("./backend/admin/artigos/artigos");
app.use("/admin", adminArticlesRouter);

let adminRoomsRouter = require("./backend/admin/salas/salas");
app.use("/admin", adminRoomsRouter);

let adminUsersRouter = require("./backend/admin/utilizadores/utilizadores");
app.use("/admin", adminUsersRouter);

// USER ROUTES

let userProfileRouter = require("./user/profile");
app.use("/", userProfileRouter);

let userCompaniesRouter = require("./user/companies");
app.use("/", userCompaniesRouter);

let userJobsRouter = require("./user/jobs");
app.use("/", userJobsRouter);

// CONNECT
app.listen(7217, function () {
    console.log('Chat app listening on port 7217!');
});

process.on('SIGINT', function () {
    console.log("SIGINT");
    process.exit(0);
});
