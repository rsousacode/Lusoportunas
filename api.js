const express = require("express");
//let messages = require("./data/messages.json");
//let users = require("./data/users.json");
const lusDB = require("./backend/data/lusDB");
const router = express.Router();

module.exports = router;


//API for testing and playing with json
router.get("/users", function (req, res, next) {
    lusDB.connect
        .then(db => db.collection("users").find().toArray())
        .then(users => res.json(users))
        .catch(next);

});

router.get("/rooms", function (req, res, next) {

    lusDB.connect
        .then(db => db.collection("rooms").find().toArray())
        .then(rooms => res.json(rooms))
        .catch(next); //ugly error throw, no blank infinity

});

router.get("/jobs", function (req, res, next) {

    lusDB.connect
        .then(db => db.collection("jobs").find().toArray())
        .then(rooms => res.json(rooms))
        .catch(next); //ugly error throw, no blank infinity

});

// router.route("/rooms/:roomId/messages")
//     .get(function (req, res) {
//         let roomId = req.params.roomId;
//
//         let roomMessages = messages
//             .filter(m => m.roomId === roomId)
//             .map(m => {
//                 let user = _.find(users, u => u.id === m.userId);
//                 let userName = user ? user.alias : "unknown";
//                 return {text: `${userName}: ${m.text}`};
//             });
//
//         let room = _.find(rooms, r => r.id === roomId);
//         if (!room) {
//             res.sendStatus(404);
//             return;
//         }
//
//         res.json({
//             room: room,
//             messages: roomMessages
//         })
//
//     })
//     .post(function (req, res) {
//         let roomId = req.params.roomId;
//
//         let message = {
//             roomId: roomId,
//             text: req.body.text,
//             userId: req.user.id,
//             id: uuid.v4()
//         };
//
//         messages.push(message);
//
//         res.sendStatus(200);
//     })
//     .delete(function (req, res) {
//         let roomId = req.params.roomId;
//
//         // note: careful as this will not update the array that was exported from the messages.json module so if you use that array in other modules it won't update.
//         messages = messages.filter(m => m.roomId !== roomId);
//
//         res.sendStatus(200);
//     });

