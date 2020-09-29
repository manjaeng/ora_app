var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

	var userID = req.body.id
	var userPW = req.body.pw

	if(userId && userPW){
		connection.query("INSERT INTO USERS (email,password) VALUES ('"+userId+"','"+userPW+"')",
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

	res.send('respond with a resource');
});

module.exports = router;
