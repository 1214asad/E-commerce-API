const db = require("mongoose");

const connectdb = (url) => {
  db.connect(url).then(() => console.log("connect to database."));
};

module.exports = connectdb;
