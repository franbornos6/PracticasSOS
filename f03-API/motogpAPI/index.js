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

	//---------------- /GET motogp-statistics/loadInitialData -------------------------

	app.get(BASE_API_URL + "/motogp-statistics/loadInitialData", (req, res) =>{
		console.log("New GET .../motogp_statistics");

		db.insert(motogp_statisticsInitial);
		 res.sendStatus(200);
		console.log("Initial motogp_statistics loaded: "+JSON.stringify(motogp_statistics,null,2));
	});


	//--------------------- GET /motogp-statistics---------------------------------------

	app.get(BASE_API_URL+"/motogp-statistics", (req,res) =>{
		console.log("New GET .../motogp_statistics");

		db.find({}, (err,motogp_statistics) => {

			if(motogp_statistics == 0){
				res.status(404).send("No hay datos cargados");
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
			res.send(JSON.stringify(motogp_statistics[0], null, 2));
			res.sendStatus(200);
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
			
			db.find({pilot: pilot}, function(err, motogp_statistics){
				
				if(motogp_statistics ==0){
					res.status(404).send("No existe ese piloto");
					
				}else if(pilot != newPilot.pilot){ 
					res.status(400).send("El piloto debe ser el mismo");
					
				}else{
					db.update({pilot: pilot}, {$set: {country: newPilot.country, last_title: newPilot.last_title, 					  world_title: newPilot.world_title, victory: newPilot.victory, podium: newPilot.podium}}, {}, 					    function(err, numReplaced){});
				
					res.sendStatus(200,"Ok");
				}
			});
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