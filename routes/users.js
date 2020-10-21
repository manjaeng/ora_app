var express = require('express');
var router = express.Router();

var mysql = require('mysql')

var connection = mysql.createConnection({
        host:"127.0.0.1",
        port:"3306",
        user:"root",
        password:"notidd00",
        database:"jiv_dev"
})

connection.connect()

/* POST  users listing. */
router.post('/', function(req, res) {
	var userID = req.body.id
	var userPW = req.body.pw
	if(userID && userPW){
		connection.query("INSERT INTO USERS (email,password) VALUES ('"+userID+"','"+userPW+"')",
		function(error, result, fields){
	
			if(error)
			{
				res.send('err:'+ error )
			}
			else
			{
				console.log(userID + ',' + userPW)
				res.send('success create user : ' + userID)
			
			}
		})
	}	
	
});

module.exports = router;
