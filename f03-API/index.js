const express = require("express");
const bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.json());

var port = process.env.PORT || 80;

const BASE_API_URL = "/api/v1";

var motogp_statistics = [];

//---------------- /GET motogp-statistics/loadInitialData -------------------------

app.get(BASE_API_URL + "/motogp-statistics/loadInitialData", (req, res) =>{
	
	var motogp_statisticsInitial = [
		{
		country: "Spain",
		pilot: "Jorge Lorenzo",
		last_title: 2015,
		world_title: 3,
		victory: 47,
		podium: 114
		},

		{
		country: "Spain",
		pilot: "Marc Marquez",
		last_title: 2019,
		world_title: 6,
		victory: 56,
		podium: 95
		}
	];
	
	motogp_statistics = motogp_statisticsInitial;
	res.send(JSON.stringify(motogp_statistics,null,2));
});


//--------------------- GET /motogp_statistics---------------------------------------

app.get(BASE_API_URL+"/motogp-statistics", (req,res) =>{
	res.send(JSON.stringify(motogp_statistics,null,2));
});

//-------------------- POST /motogp_statistics---------------------------------------

app.post(BASE_API_URL+"/motogp-statistics",(req,res) =>{
	
	var newStat = req.body;
	
	if((newStat == "") || ((newStat.name == null) && (newStat.country == null))){
		res.sendStatus(400, "BAD REQUEST");
	}else{
		motogp_statistics.push(newStat);
		res.sendStatus(201,"CREATED");
	}
});

//--------------------- DELETE /motogp_statistics-----------------------------------

app.delete(BASE_API_URL + "/motogp-statistics", (req,res) => {
	motogp_statistics = [];
	res.sendStatus(200, "OK");
});


//---------------------- GET /motogp_statistics/name----------------------------------

app.get(BASE_API_URL+"/contacts/:name", (req,res)=>{
	
	var name = req.params.name
	
	var filteredContacts = contacts.filter((c) => {
		return (c.name == name);
	});
	
	if(filteredContacts.length >= 1){
		res.send(filteredContacts[0]);
	}else{
		res.sendStatus(404,"NOT FOUND");
	}
});
//----------------------- PUT /motogp_statistics/name-----------------------------------





//----------------------- DELETE /motogp_statistics/name--------------------------------

app.delete(BASE_API_URL+"/contacts/:name", (req,res)=>{
	
	var name = req.params.name
	
	var filteredContacts = contacts.filter((c) => {
		return (c.name != name);
	});
	
	if(filteredContacts.length < contacts.length){
		contacts = filteredContacts;
		res.sendStatus(200,"OK");
	}else{
		res.sendStatus(404,"NOT FOUND");
	}
});

app.listen(port, () => {
	console.log("Server ready");
});

console.log("Starting server...");