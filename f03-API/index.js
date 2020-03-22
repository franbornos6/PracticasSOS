const express = require("express");
const bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.json());

var port = process.env.PORT || 80;

var motogp_statistics = [
	{
	country: "Spain",
	pilot: { 
			 name: "Jorge Lorenzo",
             last_title: 2015,
             world_title: 3,
             victory: 47,
             podium: 114
             }
	},
	
	{
	country: "Spain",
	pilot: { 
			 name: "Marc Marquez",
             last_title: 2019,
             world_title: 6,
             victory: 56,
             podium: 95
             }
	}
];

const BASE_API_URL = "/api/v1/motogp_statistics";

// GET 


app.get(BASE_API_URL+"/country", (req,res) =>{
	res.send(JSON.stringify(motogp_statistics,null,2));
});

// POST 

app.post(BASE_API_URL+"/motogp_statistics",(req,res) =>{
	motogp_statistics.push(req.body); 
	res.sendStatus(201,"CREATED");
});

app.listen(port, () => {
	console.log("Server ready");
});

console.log("Starting server...");