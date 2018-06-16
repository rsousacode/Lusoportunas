const mongoose = require("mongoose");

const schemaOptions = {
    collection: "articles",
};


let schema = new mongoose.Schema({
    name: {type: String, required: true},
    body: {type: String, required: true},
    category: ["Empregos", "Lusoportunas", "Geral", "Motivacional"],
    date: {type: Date, required: true},
    user: {
        "_id": Object,
        "date": Date,
        "username": String,
        "name": {
            "title": String,
            "firstName": String,
            "lastName": String,

        },
        "admin": Boolean,
        "address": {
            "state": String,
            "city": String,
            "lines": [String]
        },
        "contact": {
            "email": String,
            "phone": String
        },
        "roles": []
    },
    userId: [Array]

}, schemaOptions);


module.exports = mongoose.model("article", schema);