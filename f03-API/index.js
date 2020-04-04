const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const motogpAPI= require(path.join(__dirname,"motogpAPI"));
const port = process.env.PORT || 80;

const app = express();
app.use(bodyParser.json());

motogpAPI(app);

app.listen(port, () => {
	console.log("Server ready");
});

console.log("Starting server...");