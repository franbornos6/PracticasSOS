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
		pilot: "Jorge_Lorenzo",
		last_title: 2015,
		world_title: 3,
		victory: 47,
		podium: 114
		},

		{
		country: "Spain",
		pilot: "Marc_Marquez",
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
	
	if((newStat == "") || ((newStat.country == null) && (newStat.name == null))){
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


//---------------------- GET /motogp_statistics/pilot----------------------------------

app.get(BASE_API_URL+"/motogp-statistics/:pilot", (req,res)=>{
	
	var pilot = req.params.pilot
	
	var filteredMotogpStatstats = motogp_statistics.filter((c) => {
		return (c.pilot == pilot);
	});
	
	if(filteredMotogpStatstats.length >= 1){
		res.send(filteredMotogpStatstats[0]);
	}else{
		res.sendStatus(404,"NOT FOUND");
	}
});
//----------------------- PUT /motogp_statistics/pilot-----------------------------------





//----------------------- DELETE /motogp_statistics/pilot--------------------------------

app.delete(BASE_API_URL+"/motogp-statistics/:pilot", (req,res)=>{
	
	var pilot = req.params.pilot
	
	var filteredMotogpStatstats = motogp_statistics.filter((c) => {
		return (c.pilot != pilot);
	});
	
	if(filteredMotogpStatstats.length < motogp_statistics.length){
		motogp_statistics = filteredMotogpStatstats;
		res.sendStatus(200,"OK");
	}else{
		res.sendStatus(404,"NOT FOUND");
	}
});

app.listen(port, () => {
	console.log("Server ready");
});

console.log("Starting server...");