let MongoClient = require("mongodb").MongoClient;
let ObjectID = require("mongodb").ObjectId;
let mongoose = require("mongoose");
let Logger = require("mongodb").Logger;
let passport= require("passport");


let password = "mVb1jRd%Z{r2K5~-ufYIkWWwh,EIFQHeK";
let url = "mongodb://d1j2ygf1:"+password+"@localhost:28172/lusoportu";
let connect = MongoClient.connect(url);


connectMongoose =   mongoose.connect(url);
mongoose.Promise = global.Promise;

// Logger.setLevel("debug", false);

let User = require("../admin/utilizadores/userModel");
let Room = require("../admin/salas/roomModel");
let Job = require("../admin/trabalhos/jobModel");
let Article = require("../admin/artigos/articleModel");



module.exports = {
    connect,
    User,
    Room,
    Job,
    Article,
    close: function () {
        connect.then(db => db.close());
        mongoose.disconnect();
    }
};
