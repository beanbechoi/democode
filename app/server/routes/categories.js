var CM = require('../modules/categories-manager');
var LM = require('../modules/login-manager')
var util = require('util');
// --------------------------------
// Define Variable Category Object
// --------------------------------
var ADD_CATEGORY = 'ADD_CATEGORY';
var UPDATE_CATEGORY = 'UPDATE_CATEGORY';
var GET_CATEGORY = 'GET_CATEGORY';
var DELETE_CATEGORY = 'DELETE_CATEGORY';

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
function createJsonResult(func,mthod,stt,msg,err,res){
	var jsonResult = {	func_cd: func,
		method: mthod,
		code: stt,
		msg: msg,
		error: err,
		data: res,
	};
	return jsonResult;
}

// --------------------------------
// VALIDATE PARAMETER
// value: value of parameter
// type: type of parameter
// Return: json result
// --------------------------------
function validateParam(value, type){
	// TYPE 1 : OBJECTID
	if( type == 1){
		if( value == null){
			return "Locationid is null !";
		} else if(value.length != 24){
			return "Length of locationid is not valid !";
		} else {
			return "";
		}
	} else {
		return "";
	}
}

module.exports = function(app, server) {
	// register category form action
	app.post('/category', function(req, res){

		req.checkBody('token', 'Invalid token').notEmpty();
		req.checkBody('title', 'Invalid title').notEmpty();
		req.checkBody('alias', 'Invalid alias').notEmpty();
		req.checkBody('descript', 'Invalid descript').notEmpty();
		var parentID = req.body.parentID;
		if (parentID !== null && typeof parentID !== 'undefined' && parentID !== "null" && parentID.length > 0) {
			req.checkBody('parentID', 'Invalid parentID').notEmpty().isInt();
		}
		var errors = req.validationErrors();
		if (errors) {
			var jsonResult = createJsonResult(ADD_CATEGORY, METHOD_POS, STATUS_FAIL, SYSTEM_ERR, errors, null);
			res.json(jsonResult,STATUS_FAIL);	
		}else{
			var token = req.body.token;
			LM.checkToken(token, function (err, objects) {
				if (err) {
					var jsonResult = createJsonResult(ADD_CATEGORY, METHOD_GET, STATUS_FAIL, SYSTEM_ERR, err, null);
					res.json(jsonResult, 400);
					return;
				} else if(objects != null && objects.userid != undefined ){
					CM.insertCatetory(req.body, function(err,resDocument){
						if(resDocument){
							var jsonResult = createJsonResult(ADD_CATEGORY, METHOD_POS, STATUS_SUCESS, SYSTEM_SUC, null, resDocument);
							res.json(jsonResult,STATUS_SUCESS);
						}else{
							var jsonResult = createJsonResult(ADD_CATEGORY, METHOD_POS, STATUS_FAIL, SYSTEM_ERR, err, null);
							res.json(jsonResult,STATUS_FAIL);
						}
					});
				}else{
					var jsonResult = createJsonResult(ADD_CATEGORY, METHOD_GET, STATUS_FAIL, SYSTEM_ERR, MSG_INVALID_TOKEN, null)
					res.json(jsonResult, 400);
				}
			});
		}
	});

	app.put('/category', function(req, res){
		req.checkBody('token', 'Invalid token').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			var jsonResult = createJsonResult(UPDATE_CATEGORY, METHOD_POS, STATUS_FAIL, SYSTEM_ERR, errors, null);
			res.json(jsonResult,STATUS_FAIL);	
		}else{
			var token = req.body.token;
			LM.checkToken(token, function (err, objects) {
				if (err) {
					var jsonResult = createJsonResult(UPDATE_CATEGORY, METHOD_GET, STATUS_FAIL, SYSTEM_ERR, err, null);
					res.json(jsonResult, 400);
					return;
				} else if(objects != null && objects.userid != undefined ){
					CM.updateCategory(req.body, function(err, resDocument){
						if(resDocument){
							var jsonResult = createJsonResult(UPDATE_CATEGORY, METHOD_PUT, STATUS_SUCESS, SYSTEM_SUC, null, resDocument);
							res.json(jsonResult,STATUS_SUCESS);
						}else{
							var jsonResult = createJsonResult(UPDATE_CATEGORY, METHOD_PUT, STATUS_FAIL, SYSTEM_ERR, err, null);
							res.json(jsonResult,STATUS_FAIL);
						}
					});
				}else{
					var jsonResult = createJsonResult(UPDATE_CATEGORY, METHOD_GET, STATUS_FAIL, SYSTEM_ERR, MSG_INVALID_TOKEN, null)
					res.json(jsonResult, 400);
				}
			});
		}
	});

	app.post('/getcategory', function(req, res){
		CM.getCategory(req.body, function(err, resDocument){
			if(resDocument){
				var jsonResult = createJsonResult(GET_CATEGORY, METHOD_POS, STATUS_SUCESS, SYSTEM_SUC, null, resDocument);
				res.json(jsonResult,STATUS_SUCESS);
			}else{
				var jsonResult = createJsonResult(GET_CATEGORY, METHOD_POS, STATUS_FAIL, SYSTEM_ERR, err, null);
				res.json(jsonResult,STATUS_FAIL);
			}
		});
	});

	app.delete('/category',function(req, res){
		req.checkBody('token', 'Invalid token').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			var jsonResult = createJsonResult(DELETE_CATEGORY, METHOD_POS, STATUS_FAIL, SYSTEM_ERR, errors, null);
			res.json(jsonResult,STATUS_FAIL);	
		}else{
			var token = req.body.token;
			LM.checkToken(token, function (err, objects) {
				if (err) {
					var jsonResult = createJsonResult(DELETE_CATEGORY, METHOD_GET, STATUS_FAIL, SYSTEM_ERR, err, null);
					res.json(jsonResult, 400);
				} else if(objects != null && objects.userid != undefined ){
					CM.deleteCategory(req.body.categoryID, function(err, resDocument){
						if (resDocument) {
							var jsonResult = createJsonResult(DELETE_CATEGORY, METHOD_DELETE, STATUS_SUCESS, SYSTEM_SUC, null, resDocument);
							res.json(jsonResult,STATUS_SUCESS);
						}else{
							var jsonResult = createJsonResult(DELETE_CATEGORY, METHOD_DELETE, STATUS_FAIL, SYSTEM_ERR, err, null);
							res.json(jsonResult,STATUS_FAIL);
						}
					});
				}else{
					var jsonResult = createJsonResult(DELETE_CATEGORY, METHOD_GET, STATUS_FAIL, SYSTEM_ERR, MSG_INVALID_TOKEN, null)
					res.json(jsonResult, 400);
				}
			});
		}
	});
}