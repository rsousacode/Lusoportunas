let articles = require(__dirname + "/articles.json");
let lusDB = require("./lusDB");


lusDB.Article.insertMany(articles)
    .then(() => {
        console.log("inserted");
        lusDB.close();

    })
    .catch(error => {
        console.error(error);
    });
