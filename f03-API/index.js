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


//--------------------- GET /motogp-statistics---------------------------------------

app.get(BASE_API_URL+"/motogp-statistics", (req,res) =>{
	
	if(motogp_statistics == 0){
		res.sendStatus(404,"NO HAY DATOS CARGADOS");
	}else{
		res.send(JSON.stringify(motogp_statistics,null,2));	
	}
	
});

//-------------------- POST /motogp-statistics---------------------------------------

app.post(BASE_API_URL+"/motogp-statistics", (req,res) =>{
	
	var newStat = req.body;
	
	if((newStat == "") || ((newStat.country == null) && (newStat.name == null))){
		res.sendStatus(400, "BAD REQUEST");
	}else{
		motogp_statistics.push(newStat);
		res.sendStatus(201,"CREATED");
	}
});

// --------------------- PUT /motogp-statistics------------------------------------

app.put(BASE_API_URL + "/motogp-statistics", (req,res) => {
		res.sendStatus(405,"Method Not Allowed");
});

//--------------------- DELETE /motogp-statistics-----------------------------------

app.delete(BASE_API_URL + "/motogp-statistics", (req,res) => {
	motogp_statistics = [];
	res.sendStatus(200, "OK");
});


//---------------------- GET /motogp-statistics/:pilot----------------------------------

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

// ---------------------- POST /motogp-statistics/:pilot----------------------------------

	app.post(BASE_API_URL + "/motogp-statistics/:pilot", (req,res) => {
		res.sendStatus(405,"Method NOT Allowed");
	});

//----------------------- PUT /motogp-statistics/:pilot-----------------------------------

	app.put(BASE_API_URL + "/motogp-statistics/:pilot", (req,res) => {
		
		var pilot = req.params.pilot
		var newPilot = req.body
		var filteredpilot = motogp_statistics.filter((c) => {
		return (c.pilot == pilot);
		});
		
		if(filteredpilot.pilot != newPilot.pilot){
			res.sendStatus(409,"CONFLICT");	
		}else{
			res.push(newPilot);
		}
	})



//----------------------- DELETE /motogp-statistics/:pilot--------------------------------

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