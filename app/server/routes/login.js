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

module.exports = function(app, nodeuuid) {

	app.post('/user', function(req, res){
		req.checkBody('username', 'Invalid username').notEmpty();
		req.checkBody('password', 'Invalid password').notEmpty();
		req.checkBody('fullname', 'Invalid fullname').notEmpty();
		req.checkBody('ip_reg', 'Invalid ip_reg').notEmpty();
		req.checkBody('status', 'Invalid status').notEmpty().isInt();
		var errors = req.validationErrors();
		if (errors) {
			var jsonResult = createJsonResult(ADD_ACCOUNT, METHOD_POS, STATUS_FAIL, SYSTEM_ERR, errors, null);
			res.json(jsonResult,STATUS_FAIL);	
		}else{
			LM.insertAccount(req.body, function(err, resResult){
				if (err) {
					var jsonResult = createJsonResult(ADD_ACCOUNT, METHOD_POS, STATUS_FAIL, SYSTEM_ERR, err, null);
					res.json(jsonResult,STATUS_FAIL);	
				}else{
					var jsonResult = createJsonResult(ADD_ACCOUNT, METHOD_POS, STATUS_SUCESS, SYSTEM_SUC, null, resResult);
					res.json(jsonResult,STATUS_SUCESS);	
				}
			})
		}
	});

	app.put('/user', function(req, res){

		req.checkBody('token', 'Invalid token').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			var jsonResult = createJsonResult(UPDATE_ACCOUNT, METHOD_POS, STATUS_FAIL, SYSTEM_ERR, errors, null);
			res.json(jsonResult,STATUS_FAIL);
			return;
		}else{
			var token = req.body.token;
			LM.checkToken(token, function (err, objects) {
				if (err) {
					var jsonResult = createJsonResult(UPDATE_ACCOUNT, METHOD_GET, STATUS_FAIL, SYSTEM_ERR, err, null);
					res.json(jsonResult, 400);
					return;
				} else if(objects != null && objects.userid != undefined ){
					LM.updateAccount(req.body, function(err, resDocument){
						if(resDocument){
							var jsonResult = createJsonResult(UPDATE_ACCOUNT, METHOD_PUT, STATUS_SUCESS, SYSTEM_SUC, null, resDocument);
							res.json(jsonResult,STATUS_SUCESS);
							return;
						}else{
							var jsonResult = createJsonResult(UPDATE_ACCOUNT, METHOD_PUT, STATUS_FAIL, SYSTEM_ERR, err, null);
							res.json(jsonResult,STATUS_FAIL);
							return;
						}
					});
				}else{
					var jsonResult = createJsonResult(UPDATE_ACCOUNT, METHOD_GET, STATUS_FAIL, SYSTEM_ERR, MSG_INVALID_TOKEN, null)
					res.json(jsonResult, 400);
					return;
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
			var jsonResult = createJsonResult(LOGIN_ACCOUNT, METHOD_POS, STATUS_FAIL, SYSTEM_ERR, errors, null);
			res.json(jsonResult,STATUS_FAIL);	
		}else{
			var input = req.body;
			var userid = input.username;
			var password = input.password;

			LM.checkLogin(userid, password, function(err, objects) {
				if (err) {
					var jsonResult = createJsonResult(LOGIN_ACCOUNT, METHOD_POS,
						STATUS_FAIL, SYSTEM_ERR, err, null)
					res.json(jsonResult, STATUS_FAIL);
				} else if (objects != null && objects._id != undefined) {
					var token = nodeuuid.v4();
					LM.insertToken(userid, token,
						function(err, objectsToken) {
							if (err) {
								var jsonResult = createJsonResult(
									LOGIN_ACCOUNT, METHOD_POS, STATUS_FAIL,
									SYSTEM_ERR, err, null);
								res.json(jsonResult, STATUS_FAIL);
								return;
							} else {
								var result = {
									_id : objects._id,
									username : objects.username,
									password : objects.password,
									fullname : objects.fullname,
									status : objects.status,
									date_create : objects.date_create,
									ip_reg : objects.ip_reg,
									token : objectsToken.token,
									lastedit : objectsToken.iDate
								}

								var jsonResult = createJsonResult(
									LOGIN_ACCOUNT, METHOD_POS,
									STATUS_SUCESS, SYSTEM_SUC, null,
									result);
								res.json(jsonResult, STATUS_SUCESS);
							}
						});
				} else {
					var jsonResult = createJsonResult(LOGIN_ACCOUNT, METHOD_POS,
						STATUS_FAIL, SYSTEM_ERR, MSG_LOGINFAIL, null);
					res.json(jsonResult, STATUS_FAIL);
				}
			});
		}

	});

	app.post('/getuser', function(req, res){
		LM.getUser(req.body, function(err, resDocument){
			if(resDocument){
				var jsonResult = createJsonResult(GET_ACCOUNT, METHOD_POS, STATUS_SUCESS, SYSTEM_SUC, null, resDocument);
				res.json(jsonResult,STATUS_SUCESS);
			}else{
				var jsonResult = createJsonResult(GET_ACCOUNT, METHOD_POS, STATUS_FAIL, SYSTEM_ERR, err, null);
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
			var jsonResult = createJsonResult(LOGOUT_ACCOUNT, METHOD_POS, STATUS_FAIL, SYSTEM_ERR, errors, null);
			res.json(jsonResult,STATUS_FAIL);	
		}else{
			var token = req.body.token;
			LM.logOut(token, function(err, objects) {
				if (err) {
					var jsonResult = createJsonResult(LOGOUT_ACCOUNT, METHOD_GET,
						STATUS_FAIL, SYSTEM_ERR, err, null);
					res.json(jsonResult, STATUS_FAIL);
					return;
				} else {
					var jsonResult = createJsonResult(LOGOUT_ACCOUNT, METHOD_GET,
						STATUS_SUCESS, SYSTEM_SUC, null, objects);
					res.json(jsonResult, STATUS_SUCESS);
				}
			});
		}
	});

	// --------------------------------
	// Register
	// Return: JSON user info
	// --------------------------------
	app.post('/register', function(req, res) {
		var input = req.body;
		var username = input.UserName;
		var userid = input.UserID;
		var password = input.Password;
		var email = input.Email;
		var phone = input.PhoneNumber;
		var address = input.Address;
		LM.addUser(userid, password, username, email, phone, address, function(
			err, objects) {
			if (err) {
				var jsonResult = createJsonResult('Register', METHOD_POS,
					STATUS_FAIL, SYSTEM_ERR, err, objects);
				res.json(jsonResult, 400);
				return;
			} else {
				var jsonResult = createJsonResult('Register', METHOD_POS,
					STATUS_SUCESS, SYSTEM_SUC, null, objects);
				res.json(jsonResult, 200);
			}
		});
	});

	// --------------------------------
	// Get User Info
	// Return: JSON user info
	// --------------------------------
	app.get('/getuserinfo', function(req, res) {
		var token = req.param('token');
		accountModel.checkToken(token, function(err, objects) {
			if (err) {
				var jsonResult = createJsonResult('GetUserInfo', METHOD_GET,
					STATUS_FAIL, SYSTEM_ERR, err, null);
				res.json(jsonResult, 400);
				return;
			} else if (objects != null && objects.userid != undefined) {
				accountModel.getUserInfo(objects.userid,
					function(err, retJson) {
						if (err) {
							var jsonResult = createJsonResult(
								'GetUserInfo', METHOD_GET, STATUS_FAIL,
								SYSTEM_ERR, err, null);
							res.json(jsonResult, 400);
							return;
						} else {
							var jsonResult = createJsonResult(
								'GetUserInfo', METHOD_GET,
								STATUS_SUCESS, SYSTEM_SUC, null,
								retJson)
							res.json(jsonResult, 200);
						}
					});
			} else {
				var jsonResult = createJsonResult('GetUserInfo', METHOD_GET,
					STATUS_FAIL, SYSTEM_ERR, MSG_INVALID_TOKEN, null)
				res.json(jsonResult, 400);
			}
		});
	});
	// --------------------------------
	// Update user info
	// Return: JSON image info
	// --------------------------------
	app.post('/updateuserinfo', function(req, res) {
		var input = req.body;
		var token = input.token;
		var iname = input.txtUserName;
		var ipass = input.txtPassword;
		var iemail = input.txtEmail;
		var icountry = input.txtCountry;
		var ifood = input.txtFavoriteFood;
		var ilocation = input.txtFavoriteLocation;
		var inotes = input.txtNote;

		accountModel.checkToken(token, function(err, objects) {
			if (err) {
				var jsonResult = createJsonResult('UpdateUserInfo', METHOD_POS,
					STATUS_FAIL, SYSTEM_ERR, err, null)
				res.json(jsonResult, 400);
				return;
			} else if (objects != null && objects.userid != undefined) {
				accountModel.updateUserInfo(objects.userid, iname, ipass,
					iemail, icountry, ifood, ilocation, inotes, function(
						err, retJson) {
						if (err) {
							var jsonResult = createJsonResult(
								'UpdateUserInfo', METHOD_POS,
								STATUS_FAIL, SYSTEM_ERR, err, null)
							res.json(jsonResult, 400);
							return;
						} else {
							var jsonResult = createJsonResult(
								'UpdateUserInfo', METHOD_POS,
								STATUS_SUCESS, SYSTEM_SUC, null,
								retJson)
							res.json(jsonResult, 200);
						}
					});
			} else {
				var jsonResult = createJsonResult('UpdateUserInfo', METHOD_POS,
					STATUS_FAIL, SYSTEM_ERR, MSG_INVALID_TOKEN, null)
				res.json(jsonResult, 400);
			}
		});
	});
};