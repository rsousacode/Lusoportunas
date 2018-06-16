let mongoose = require("mongoose");

let schemaOptions = {
    collection: "messages",
};


let schema = new mongoose.Schema({
    text: {type: String, required: true}
}, schemaOptions);


module.exports = mongoose.model("message", schema);

// "text": "test",
//     "roomId": "f2754172-1c58-41ed-ae84-74e046888adb",
//     "userId": "44f885e8-87e9-4911-973c-4074188f408a",
//     "id": "b7d42e5d-f78e-4ee2-98c8-1f2be7843ab7"