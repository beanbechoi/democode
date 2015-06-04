var LM = require('../modules/login-manager')
var crypto = require('crypto')

// --------------------------------
// Define Variable Category Object
// --------------------------------
var ADD_ACCOUNT = 'ADD_ACCOUNT';
var UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';
var DELETE_ACCOUNT = 'DELETE_ACCOUNT';
var GET_ACCOUNT = 'GET_ACCOUNT';
var LOGIN_ACCOUNT = 'LOGIN_ACCOUNT';
var LOGOUT_ACCOUNT = 'LOGOUT_ACCOUNT';

// --------------------------------
// Define Variable
// --------------------------------
var SYSTEM_ERR = 'ERROR';
var SYSTEM_SUC = 'SUCESS';
var METHOD_POS = 'POST';
var METHOD_GET = 'GET';
var METHOD_PUT = 'PUT';
var METHOD_DELETE = 'DELETE';
var STATUS_SUCESS = 200;
var STATUS_FAIL = 400;

// --------------------------------
// Define Message
// --------------------------------
var MSG_LOGINFAIL = 'Username or password is not correctly';
var MSG_INVALID_TOKEN = 'Your token is invalid';

// --------------------------------
// SAMPLE RESULT JSON
// param func: function name excute
// mthod: method excute [POST/GET]
// stt: result status of function
// msg: message status
// err: error detail of result excute function
// res: result of function
// Return: json result
// --------------------------------
function createJsonResult(func, mthod, stt, msg, err, res) {
	var jsonResult = {
		func_cd : func,
		method : mthod,
		code : stt,
		msg : msg,
		error : err,
		data : res,
	};
	return jsonResult;
}

function createResult(stt,msg, res){
	var jsonResult;
	if (res !== null) {
		jsonResult = {	
						code: stt,
						msg: msg,
						data: res
					};
	}else{
		jsonResult = {	
						code: stt,
						msg: msg
					};
	}
	return jsonResult;
}

module.exports = function(app, nodeuuid) {

	app.post('/user', function(req, res){
		req.checkBody('username', 'Invalid username').notEmpty();
		req.checkBody('password', 'Invalid password').notEmpty();
		req.checkBody('fullname', 'Invalid fullname').notEmpty();
		req.checkBody('ip_reg', 'Invalid ip_reg').notEmpty();
		req.checkBody('status', 'Invalid status').notEmpty().isInt();
		var errors = req.validationErrors();
		if (errors) {
			var jsonResult = createResult(STATUS_FAIL, errors, null);
			res.json(jsonResult,STATUS_FAIL);	
		}else{
			LM.insertAccount(req.body, function(err, resResult){
				if (err) {
					var jsonResult = createResult(STATUS_FAIL, err, null);
					res.json(jsonResult,STATUS_FAIL);	
				}else{
					var jsonResult = createResult(STATUS_SUCESS, SYSTEM_SUC, null);
					res.json(jsonResult,STATUS_SUCESS);	
				}
			})
		}
	});

	app.put('/changepass', function(req, res){

		req.checkBody('token', 'Invalid token').notEmpty();
		req.checkBody('userid', 'Invalid userid').notEmpty();
		req.checkBody('old_password', 'Invalid old_password').notEmpty();
		req.checkBody('new_password', 'Invalid new_password').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			var jsonResult = createResult(STATUS_FAIL, errors, null);
			res.json(jsonResult,STATUS_FAIL);
			return;
		}else{
			var token = req.body.token;
			LM.checkToken(token, function (err, objects) {
				if (err) {
					var jsonResult = createResult(STATUS_FAIL, err, null);
					res.json(jsonResult, STATUS_FAIL);
					return;
				} else{
					LM.changePassword(req.body, function(err, resDocument){
						if(err){
							var jsonResult = createResult(STATUS_FAIL, err, null);
							res.json(jsonResult,STATUS_FAIL);
							return;
						}else{
							var jsonResult = createResult(STATUS_SUCESS, SYSTEM_SUC, null);
							res.json(jsonResult,STATUS_SUCESS);
							return;
							
							
						}
					});
				}
			});
		}
	});

	app.put('/user', function(req, res){

		req.checkBody('token', 'Invalid token').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			var jsonResult = createResult(STATUS_FAIL, SYSTEM_ERR, null);
			res.json(jsonResult,STATUS_FAIL);
			return;
		}else{
			var token = req.body.token;
			LM.checkToken(token, function (err, objects) {
				if (err) {
					var jsonResult = createResult(STATUS_FAIL, SYSTEM_ERR, null);
					res.json(jsonResult, STATUS_FAIL);
					return;
				} else {
					LM.updateAccount(req.body, function(err, resDocument){
						if(resDocument){
							var jsonResult = createResult(STATUS_SUCESS, SYSTEM_SUC, null);
							res.json(jsonResult,STATUS_SUCESS);
							return;
						}else{
							var jsonResult = createResult(STATUS_FAIL, err, null);
							res.json(jsonResult,STATUS_FAIL);
							return;
						}
					});
				}
			});
		}
	});

	app.delete('/user', function(req, res){

		req.checkBody('token', 'Invalid token').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			var jsonResult = createResult(STATUS_FAIL, SYSTEM_ERR, null);
			res.json(jsonResult,STATUS_FAIL);
			return;
		}else{
			var token = req.body.token;
			LM.checkToken(token, function (err, objects) {
				if (err) {
					var jsonResult = createResult(STATUS_FAIL, SYSTEM_ERR, null);
					res.json(jsonResult, STATUS_FAIL);
					return;
				} else {
					LM.deleteAccount(req.body, function(err, resDocument){
						if(resDocument){
							var jsonResult = createResult(STATUS_SUCESS, SYSTEM_SUC, null);
							res.json(jsonResult,STATUS_SUCESS);
							return;
						}else{
							var jsonResult = createResult(STATUS_FAIL, err, null);
							res.json(jsonResult,STATUS_FAIL);
							return;
						}
					});
				}
			});
		}
	});

	// --------------------------------
	// Check Login
	// Return: Return token
	// --------------------------------
	app.post('/checkuser', function(req, res) {
		
		req.checkBody('username', 'Invalid username').notEmpty();
		req.checkBody('password', 'Invalid password').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			var jsonResult = createResult(STATUS_FAIL, errors, null);
			res.json(jsonResult,STATUS_FAIL);	
		}else{
			var input = req.body;
			var userid = input.username;
			var password = input.password;

			LM.checkLogin(userid, password, function(err, objects) {
				if (err) {
					var jsonResult = createResult(STATUS_FAIL, err, null);
					res.json(jsonResult, STATUS_FAIL);
				} else if (objects != null && objects._id != undefined) {
					var token = nodeuuid.v4();
					LM.insertToken(userid, token,
						function(err, objectsToken) {
							if (err) {
								var jsonResult = createResult(STATUS_FAIL, err, null);
								res.json(jsonResult, STATUS_FAIL);
								return;
							} else {
								var result = {
									_id : objects._id,
									username : objects.username,
									password : objects.password,
									fullname : objects.fullname,
									status : objects.status,
									last_login : objects.last_login,
									ip_reg : objects.ip_reg,
									token : objectsToken.token,
									lastedit : objectsToken.iDate
								}
								var jsonResult = createResult(STATUS_SUCESS, SYSTEM_SUC, result);
								res.json(jsonResult, STATUS_SUCESS);
							}
						});
				} else {
					var jsonResult = createResult(STATUS_FAIL, MSG_LOGINFAIL, null);
					res.json(jsonResult, STATUS_FAIL);
				}
			});
		}

	});

	app.post('/getuser', function(req, res){
		LM.getUser(req.body, function(err, resDocument){
			if(resDocument){
				var jsonResult = createResult(STATUS_SUCESS, SYSTEM_SUC, resDocument);
				res.json(jsonResult,STATUS_SUCESS);
			}else{
				var jsonResult = createResult(STATUS_FAIL, err, null);
				res.json(jsonResult,STATUS_FAIL);
			}
		});
	});

	// --------------------------------
	// Logout
	// Return: Return status
	// --------------------------------
	app.post('/logout', function(req, res) {
		req.checkBody('token', 'Invalid token').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			var jsonResult = createResult(STATUS_FAIL, errors, null);
			res.json(jsonResult,STATUS_FAIL);	
		}else{
			var token = req.body.token;
			LM.logOut(token, function(err, objects) {
				if (err) {
					var jsonResult = createResult(STATUS_FAIL, err, null);
					res.json(jsonResult, STATUS_FAIL);
					return;
				} else {
					var jsonResult = createResult(STATUS_SUCESS, SYSTEM_SUC, null);
					res.json(jsonResult, STATUS_SUCESS);
				}
			});
		}
	});
};