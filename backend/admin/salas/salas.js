const express = require("express");
const ObjectID = require("mongodb").ObjectId;
const lusDB = require("../../data/lusDB");
const router = express.Router();
module.exports = router;


router.get('/salas', async function (req, res) {

    let db = await lusDB.connect;
    let rooms = await db.collection("rooms").find().toArray();
    res.render("admin/salas/lista", {
        ruser: req.user,
        title: "Salas de chat (Admin)",
        rooms: rooms
    });

});


router.route('/salas/adicionar')
    .get(function (req, res) {
        res.render("admin/salas/adicionar",
            {
                ruser: req.user
            });
    })
    .post(function (req, res, next) {
        let room = {
            name: req.body.name,
        };

        lusDB.connect
            .then(db => db.collection("rooms").insertOne(room))
            .then(result => res.redirect(req.baseUrl + "/salas"));

    });

router.route('/sala/editar/:id')
    .all(function (req, res, next) {
        let roomId = req.params.id;
        let filter = {_id: new ObjectID(roomId)};

        lusDB.connect
            .then(db => db.collection("rooms").find(filter).next())
            .then(room => {

                if (!room) {
                    res.sendStatus(404);
                    return;
                }
                res.locals.room = room;
                next();
            })
            .catch(next);
    })
    .get(function (req, res) {
        res.render("admin/salas/editar",
            {
                ruser: req.user
            });

    })
    .post(function (req, res, next) {

        let roomId = req.params.id;
        let filter = {_id: new ObjectID(roomId)};
        let update = {
            $set: {
                name: req.body.name,
            }
        };
        lusDB.connect
            .then(db => db.collection("rooms").updateOne(filter, update))
            .then(result => res.redirect(req.baseUrl + "/salas"))
            .catch(next);

    });

router.get('/sala/eliminar/:id', function (req, res, next) {
    let roomId = new ObjectID(req.params.id);
    let filter = {_id: roomId};

    lusDB.connect
        .then(db => db.collection("rooms").deleteOne(filter))
        .then(result => res.redirect(req.baseUrl + "/salas"))
        .catch(next);

}); //
