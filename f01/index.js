const express = require("express");

var app = express();

app.get("/time",(request, response) => {
	var fecha= new Date();
	var hora = fecha.getHours()+":"+ fecha.getMinutes()+":"+ fecha.getSeconds();
	response.send("<html>"+hora+"</html>");
});
app.listen(80)

console.log("server ready");