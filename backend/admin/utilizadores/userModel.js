const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require("mongoose");


const schemaOptions = {
    collection: "users",
};


let Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


let schema = new Schema({


    username: {
        type: String,
        required: true
    },
    name: {
        title: String,
        firstName: String,
        lastName: String,

    },
    admin: Boolean,
    role: String,
    contact: {
        mobile: String
    },
    address: {
        lines: [String],
        city: String,
        district: String,
        postalcode: String,
    },

    social: {
        facebook: String,
        twitter: String,
        linkedin: String,
    },

    date: {
        type: Date,
        required: true
    },

    biography: String,

    birthday: Date,

    website: String,


    experience: [{
        "cargo": String,
        "company": String,
        "location": String,
        "date": {
            from: Date,
            to: Date,
        },
        "working": Boolean,
        "description": String,
        "attachment": String,

    }],

    education: [{
        "school ": String,
        "formation": String,
        "location": String,
        "study_area": String,
        "note": String,
        "duration": {
            from: Date,
            to: Date,
        },
        "attachment": String,
        "qualification": String,

    }],

    company: [{
        // "_id": Schema.ObjectId,
        "name": String,
        "location": String,
        "mission": String,
        "objectives": String,
        "description":String,
        "logo": String,
    }],

    curriculum: String,

    profilePicture: String,

    gender: String,


}, schemaOptions);

schema.plugin(passportLocalMongoose);


module.exports.createUser = function (newUser) {
    newUser.save();
};

module.exports = mongoose.model("user", schema);