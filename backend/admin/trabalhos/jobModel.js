const mongoose = require("mongoose");

const schemaOptions = {
    collection: "jobs",
};


let schema = new mongoose.Schema({
    date: Date,
    jobType: String,
    salary: String,
    body: {
        "cargo": String,
        "responsabilidades": String,
        "requisitos": String,
        "beneficios": String,
        "vagas": String,
        "oferta": String
    },
    jobSector: String,
    jobFunction: String,
    expirationDate: Date,
    location: String,
    company: String,
    gender: String,
    ruser: {
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
        "roles": [],

    },
    application: [{
        ruser: {
            "_id": Object,
            "date": Date,
            "username": String,
            curriculum: String,
            "name": {
                "title": String,
                "firstName": String,
                "lastName": String,
            }
        },
        body: {
            "bdate": Date,
            "application": String
        },

        messages: [{
            message: String,
            ruser: {
                "_id": Object,
                "date": Date,
                "username": String,
                "name": {
                    "title": String,
                    "firstName": String,
                    "lastName": String,
                },
                "mdate": Date
            }
        }],
        status: Boolean,

        "stats": {
            "read": Boolean,
            "status": String //Favorite, Archived , Deleted
        }

    }],

}, schemaOptions);

module.exports = mongoose.model("job", schema);