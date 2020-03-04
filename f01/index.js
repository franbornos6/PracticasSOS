const express = require("express");

var app = express();
var fecha= new Date();
var hora = fecha.getHours()+":"+ fecha.getMinutes()+":"+ fecha.getSeconds();

app.get("/time",(request, response) => {
	response.send("<html>"+hora+"</html>");
});
app.listen(80)

console.log("server ready");