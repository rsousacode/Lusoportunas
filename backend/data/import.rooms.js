let rooms = require(__dirname + "/rooms.json");
let lusDB = require("./lusDB");

lusDB.Room.insertMany(rooms)
    .then(() => {
        console.log("inserted");
        lusDB.close();

    })
    .catch(error => {
        console.error(error);
    });


// lusDB.connect(url, function (error, db) {
//     // db.rooms.insert("rooms")(rooms, function(error, result ){
//     //     console.log(result);
//     // })
//
//      rooms.forEach((room) => db.collection("rooms").insert(room)); // for mongodb 2.4
//
//     // db.collection('users').find().toArray(function(error, rooms) {
//     //     if(error){
//     //         console.error(error);
//     //         return;
//     //     }
//     //    console.log(rooms);
//     // });
//
//     db.collection("rooms").find().toArray(function (error, rooms) {
//         if (error) {
//             console.error(error);
//             return;
//         }
//         console.log(rooms);
//         db.close();
//
//     });
//
// });