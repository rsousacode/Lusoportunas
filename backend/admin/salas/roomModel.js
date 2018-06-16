let mongoose = require("mongoose");

let schemaOptions = {
    collection: "rooms",
};


let schema = new mongoose.Schema({
    name: { type: String, required: true}
}, schemaOptions);


module.exports = mongoose.model("room", schema);