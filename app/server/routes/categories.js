var CM = require('../modules/categories-manager');
var LM = require('../modules/login-manager')
var RM = require('../modules/result-manager');
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
			RM.createResult(STATUS_FAIL, errors, null, function(errResult, resResult){
				res.json(resResult,STATUS_FAIL);	
			});
		}else{
			var token = req.body.token;
			LM.checkToken(token, function (err, objects) {
				if (err) {
					RM.createResult(STATUS_FAIL, err, null, function(errResult, resResult){
						res.json(resResult,STATUS_FAIL);	
					});
				} else{
					CM.insertCatetory(req.body, function(err,resDocument){
						if(resDocument){
							RM.createResult(STATUS_SUCESS, SYSTEM_SUC, null, function(errResult, resResult){
								res.json(resResult,STATUS_SUCESS);	
							});
						}else{
							RM.createResult(STATUS_FAIL, err, null, function(errResult, resResult){
								res.json(resResult,STATUS_FAIL);	
							});
						}
					});
				}
			});
		}
	});

app.put('/category', function(req, res){
	req.checkBody('token', 'Invalid token').notEmpty();
	req.checkBody('parentID', 'Invalid parentID').notEmpty().isInt();
	var errors = req.validationErrors();
	if (errors) {
		RM.createResult(STATUS_FAIL, errors, null, function(errResult, resResult){
			res.json(resResult,STATUS_FAIL);	
		});
	}else{
		var token = req.body.token;
		LM.checkToken(token, function (err, objects) {
			if (err) {
				var jsonResult = createResult(STATUS_FAIL, err, null);
				res.json(jsonResult, STATUS_FAIL);
				return;
			} else{
				CM.updateCategory(req.body, function(err, resDocument){
					if(resDocument){
						RM.createResult(STATUS_SUCESS, SYSTEM_SUC, null, function(errResult, resResult){
							res.json(resResult,STATUS_SUCESS);	
						});
					}else{
						RM.createResult(STATUS_FAIL, err, null, function(errResult, resResult){
							res.json(resResult,STATUS_FAIL);	
						});
					}
				});
			}
		});
	}
});



app.delete('/category',function(req, res){
	req.checkBody('token', 'Invalid token').notEmpty();
	req.checkBody('_id', 'Invalid _id').notEmpty().isInt();
	var errors = req.validationErrors();
	if (errors) {
		RM.createResult(STATUS_FAIL, errors, null, function(errResult, resResult){
			res.json(resResult,STATUS_FAIL);	
		});	
	}else{
		var token = req.body.token;
		LM.checkToken(token, function (err, objects) {
			if (err) {
				RM.createResult(STATUS_FAIL, err, null, function(errResult, resResult){
					res.json(resResult,STATUS_FAIL);	
				});
			} else {
				CM.deleteCategory(req.body._id, function(err, resDocument){
					if (resDocument) {
						RM.createResult(STATUS_SUCESS, SYSTEM_SUC, null, function(errResult, resResult){
							res.json(resResult,STATUS_SUCESS);	
						});
					}else{
						RM.createResult(STATUS_FAIL, err, null, function(errResult, resResult){
							res.json(resResult,STATUS_FAIL);	
						});
					}
				});
			}
		});
	}
});

app.post('/getCategoryByID', function(req, res){
	req.checkBody('_id', 'Invalid categoryID').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		RM.createResult(STATUS_FAIL, errors, null, function(errResult, resResult){
			res.json(resResult,STATUS_FAIL);	
		});
	}else{
		CM.getCategoryByID(req.body, function(err, resDocument){
			if(resDocument){
				RM.createResult(STATUS_SUCESS, SYSTEM_SUC, resDocument, function(errResult, resResult){
					res.json(resResult,STATUS_SUCESS);	
				});
			}else{
				RM.createResult(STATUS_FAIL, err, null, function(errResult, resResult){
					res.json(resResult,STATUS_FAIL);	
				});
			}
		});
	}

});

app.post('/getAllCategory', function(req, res){
	CM.getAllCategory(req.body, function(err, resDocument){
		if(resDocument){
			RM.createResult(STATUS_SUCESS, SYSTEM_SUC, resDocument, function(errResult, resResult){
				res.json(resResult,STATUS_SUCESS);	
			});
		}else{
			RM.createResult(STATUS_FAIL, err, null, function(errResult, resResult){
				res.json(resResult,STATUS_FAIL);	
			});
		}
	});
});

}