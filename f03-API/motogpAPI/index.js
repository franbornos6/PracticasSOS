module.exports = function(app) {
	
	console.log("Registrando API...");
	
		const dataStore = require("nedb");
		const path = require("path");
		const dbFileName = path.join(__dirname,"motogp_statistics.db");
		
		const BASE_API_URL = "/api/v1";

		const db = new dataStore({
						filename: dbFileName,
						autoload: true	
					});
	
		
		var motogp_statistics = [
	{country: "Spain", pilot: "Jorge_Lorenzo", last_title: 2015, world_title: 3, victory: 47, podium: 114},
	{country: "Spain", pilot: "Marc_Marquez", last_title: 2019, world_title: 6, victory: 56, podium: 95},
	{country: "Italy", pilot: "Giacomo_Agostini", last_title: 1975, world_title: 8, victory: 68, podium: 88},
	{country: "Italy", pilot: "Valentino_Rossi", last_title: 2009, world_title: 7, victory: 64, podium: 198},
	{country: "Australia", pilot: "Mick_Doohan", last_title: 1998, world_title: 5, victory: 54, podium: 95},
	{country: "Australia", pilot: "Casey_Stoner", last_title: 2011, world_title: 2, victory: 38, podium: 69},
	{country: "EEUU", pilot: "Wayne Rainey", last_title: 1992, world_title: 3, victory: 24, podium: 64},
	{country: "Great_Britain", pilot: "Mike_Hailwood", last_title: 1965, world_title: 4, victory: 37, podium: 48},
	{country: "EEUU", pilot: "Eddie_Lawson", last_title: 1989, world_title: 4, victory: 31, podium: 78}
		];

	//---------------- /GET motogp-statistics/loadInitialData -------------------------

	app.get(BASE_API_URL + "/motogp-statistics/loadInitialData", (req, res) =>{
		console.log("New GET .../motogp_statistics");

		db.insert(motogp_statistics);
		 res.status(200).send("Datos Cargados");
		console.log("Initial motogp_statistics loaded: "+JSON.stringify(motogp_statistics,null,2));
	});


	//--------------------- GET /motogp-statistics---------------------------------------

	app.get(BASE_API_URL+"/motogp-statistics", (req,res) =>{
		console.log("New GET .../motogp_statistics");

		var limit = parseInt(req.query.limit);
		var offset = parseInt(req.query.offset);
		var search = {};
		
		if(req.query.country) search["country"] = req.query.country;
		if(req.query.pilot) search["pilot"] = req.query.pilot;
		
		if(req.query.last_title){
			search["last_title"] = parseInt(req.query.last_title);
		}else if(parseInt(req.query.from) && parseInt(req.query.to)){
			search["last_title"]= {$gte: parseInt(req.query.from), $lte: parseInt(req.query.to)};
		}
		
		if(req.query.world_titleMin && req.query.world_titleMax) search["world_title"] = {$gte: parseInt(req.query.world_titleMin), $lte: parseInt(req.query.world_titleMax)};
		if(req.query.world_titleMin && !req.query.world_titleMax) search["world_title"] = {$gte: parseInt(req.query.world_titleMin)};
		if(!req.query.world_titleMin && req.query.world_titleMax) search["world_title"] = {$lte: parseInt(req.query.world_titleMax)};

		if(req.query.victoryMin && req.query.victoryMax) search["victory"] = {$gte: parseInt(req.query.victoryMin), $lte: parseInt(req.query.victoryMax)};
		if(req.query.victoryMin && !req.query.victoryMax) search["victory"] = {$gte: parseInt(req.query.victoryMin)};
		if(!req.query.victoryMin && req.query.victoryMax) search["victory"] = {$lte: parseInt(req.query.victoryMax)};
		
		if(req.query.podiumMin && req.query.podiumMax) search["podium"] = {$gte: parseInt(req.query.podiumMin), $lte: parseInt(req.query.podiumMax)};
		if(req.query.podiumMin && !req.query.podiumMax) search["podium"] = {$gte: parseInt(req.query.podiumMin)};
		if(!req.query.podiumMin && req.query.podiumMax) search["podium"] = {$lte: parseInt(req.query.podiumMax)};
		
		db.find(search).skip(offset).limit(limit).exec(function (err,motogp_statistics) {
			
			motogp_statistics.forEach((e) => {
				delete e._id;
			});

			if(motogp_statistics == 0){
				res.status(404).send("No hay datos");
			}else{
				res.send(JSON.stringify(motogp_statistics,null,2));
				console.log(JSON.stringify(motogp_statistics,null,2));
			}
		});
	});

	//-------------------- POST /motogp-statistics---------------------------------------

	app.post(BASE_API_URL+"/motogp-statistics", (req,res) =>{

		var newStat = req.body;
		var newPilot = req.body.pilot;
		
		if(newStat.length == 6 || !newStat.hasOwnProperty("country") || !newStat.hasOwnProperty("pilot")
		   || !newStat.hasOwnProperty("last_title") || !newStat.hasOwnProperty("world_title") 
		   || !newStat.hasOwnProperty("victory") || !newStat.hasOwnProperty("podium")){
			
			res.sendStatus(400);
			
		}else{
			
			db.find({"pilot": newPilot},(error, motogp_statistics)=>{
			
				if(motogp_statistics !=0){
					res.status(409).send("Conflicto, El objeto con ese nombre ya existe");

				}else if((newStat == "") || (newStat.country == "") || (newStat.pilot == "")){
					res.status(400).send("BAD REQUEST, Como minimo debe rellenar los campo country y pilot");

				}else{
					db.insert(newStat);
					res.sendStatus(201,"CREATED");
				}
			});
		}
	});

	// --------------------- PUT /motogp-statistics------------------------------------

	app.put(BASE_API_URL + "/motogp-statistics", (req,res) => {
			res.sendStatus(405,"Method Not Allowed");
	});

	//--------------------- DELETE /motogp-statistics-----------------------------------

	app.delete(BASE_API_URL + "/motogp-statistics", (req,res) => {
		db.remove({}, { multi: true }, function (err, numRemoved) {
		});
	res.sendStatus(200, "OK");
	});


	//---------------------- GET /motogp-statistics/:pilot----------------------------------

	app.get(BASE_API_URL+"/motogp-statistics/:pilot", (req,res)=>{

		var pilot = req.params.pilot;

		db.find({pilot : pilot}, (err,motogp_statistics)=>{
			
			motogp_statistics.forEach((e) => {
				delete e._id;
			});
			
			if(motogp_statistics.length==0){
				res.sendStatus(404);
				
			}else if(motogp_statistics.length==1){
				res.send(JSON.stringify(motogp_statistics[0], null, 2));
				
			}else{
				res.status(409).send("Hay mรกs de un piloto con ese nombre");

			}
		});
	});

	// ---------------------- POST /motogp-statistics/:pilot----------------------------------

		app.post(BASE_API_URL + "/motogp-statistics/:pilot", (req,res) => {
			res.sendStatus(405,"Method NOT Allowed");
		});

	//----------------------- PUT /motogp-statistics/:pilot-----------------------------------

		app.put(BASE_API_URL + "/motogp-statistics/:pilot", (req,res) => {

			var pilot = req.params.pilot;
			var newPilot = req.body;
			
			if(!newPilot.hasOwnProperty("country") || newPilot.country == null || !newPilot.hasOwnProperty("pilot")
			   || newPilot.pilot == null || !newPilot.hasOwnProperty("last_title") || newPilot.last_title == null
			   || !newPilot.hasOwnProperty("world_title") || newPilot.world_title == null || !newPilot.hasOwnProperty("victory")
			   || newPilot.victory == null || !newPilot.hasOwnProperty("podium") || newPilot.podium == null){
				
				res.status(400).send("Debe de tener los campos country, pilot, last_title, world_title, victory y podium");
				
			}else{
				db.find({pilot: pilot}, function(err, motogp_statistics){
				
					if(motogp_statistics ==0){
						res.status(404).send("No existe ese piloto");

					}else if(pilot != newPilot.pilot){ 
						res.status(400).send("El piloto debe ser el mismo");

					}else{
						db.update({pilot: pilot}, {$set: {country: newPilot.country, last_title: newPilot.last_title,  
						world_title: newPilot.world_title, victory: newPilot.victory, podium: newPilot.podium}}, {}, function(err, numReplaced){});

						res.sendStatus(200,"Ok");
					}
				});
			}
		});

	//----------------------- DELETE /motogp-statistics/:pilot--------------------------------

	app.delete(BASE_API_URL+"/motogp-statistics/:pilot", (req,res)=>{

		var pilot = req.params.pilot

		db.remove({pilot : pilot}, {}, function (err, numRemoved) {
			
			res.sendStatus(200,"OK");
		});
	});
	
	console.log("Ok");	
};		