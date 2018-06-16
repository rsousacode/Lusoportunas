let users = require(__dirname + "/users.json");
let lusDB = require("./lusDB");


lusDB.User.insertMany(users)
    .then(() => {
        console.log("inserted");
        lusDB.close();

    })
    .catch(error => {
        console.error(error);
    });
