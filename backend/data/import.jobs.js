let jobs = require(__dirname + "/jobs.json");
let lusDB = require("./lusDB");


lusDB.Job.insertMany(jobs)
    .then(() => {
        console.log("inserted");
        lusDB.close();

    })
    .catch(error => {
        console.error(error);
    });
