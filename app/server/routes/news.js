var NM = require('../modules/news-manager');
var RM = require('../modules/result-manager');
var crypto = require('crypto');
// --------------------------------
// Define Variable Category Object
// --------------------------------
var ADD_NEWS = 'ADD_NEWS';
var GET_NEWS = 'GET_NEWS';
var EDIT_NEWS = 'EDIT_NEWS';
var UPDATE_STATUS_NEWS = 'UPDATE_STATUS_NEWS';
var GET_LIST_NEWS = 'GET_LIST_NEWS';
var GET_TOTAL_ROWS_NEWS = 'GET_TOTAL_ROWS_NEWS';
var GET_TOTAL_ROWS_NEWS = 'GET_TOTAL_ROWS_NEWS';
var DELETE_ITEM_NEWS = 'DELETE_ITEM_NEWS';


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

module.exports = function(app, server) {
	
	// Add news
	app.post('/news', function (req, res) {


		req.checkBody('title', 'Invalid title').notEmpty();
		req.checkBody('token', 'Invalid token').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			RM.createResult(STATUS_FAIL, errors, null, function(errResult, resResult){
				res.json(resResult,STATUS_FAIL);	
			});
		}else{
			LM.checkToken(token, function (err, objects) {
				if (err) {
					RM.createResult(STATUS_FAIL, err, null, function(errResult, resResult){
						res.json(resResult,STATUS_FAIL);	
					});
				} else{
					NM.insertNews(req.body, function(errResult, resResult){
						if (errResult) {
							RM.createResult(STATUS_FAIL, errResult, null, function(errJson, resJson){
								res.json(resJson, STATUS_FAIL);	
							});	
						}else{
							RM.createResult(STATUS_SUCESS, SYSTEM_SUC, null, function(errJson, resJson){
								res.json(resJson, STATUS_SUCESS);	
							});
						}	
					});
				}
			});
			
		}
	});
	
	
	// Edit item of news
	app.put('/news', function (req, res) {
		req.checkBody('_id', 'Invalid title').notEmpty();
		req.checkBody('title', 'Invalid title').notEmpty();
		req.checkBody('token', 'Invalid token').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			RM.createResult(STATUS_FAIL, errors, null, function(errResult, resResult){
				res.json(resResult,STATUS_FAIL);	
			});
		}else{
			LM.checkToken(token, function (err, objects) {
				if (err) {
					RM.createResult(STATUS_FAIL, err, null, function(errResult, resResult){
						res.json(resResult,STATUS_FAIL);	
					});
				} else{
					NM.updateNews(req.body, function(errResult, resResult){
						if (errResult) {
							RM.createResult(STATUS_FAIL, errResult, null, function(errJson, resJson){
								res.json(resJson, STATUS_FAIL);	
							});	
						}else{
							RM.createResult(STATUS_SUCESS, SYSTEM_SUC, null, function(errJson, resJson){
								res.json(resJson, STATUS_SUCESS);	
							});
						}	
					});
				}
			});
			
		}
	});
	
	// Edit item of news
	app.put('/updatestatus', function (req, res) {
		req.checkBody('_id', 'Invalid _id').notEmpty().isInt();
		req.checkBody('status', 'Invalid status').notEmpty();
		req.checkBody('user_create', 'Invalid user_create').notEmpty();
		req.checkBody('token', 'Invalid token').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			RM.createResult(STATUS_FAIL, errors, null, function(errResult, resResult){
				res.json(resResult,STATUS_FAIL);	
			});
		}else{
			LM.checkToken(token, function (err, objects) {
				if (err) {
					RM.createResult(STATUS_FAIL, err, null, function(errResult, resResult){
						res.json(resResult,STATUS_FAIL);	
					});
				} else{
					var idNews = req.body._id;
					var user_create = req.body.user_create;
					var status = req.body.status;
					NM.checkEixtNewsOfUser(idNews, user_create, status, function(errFlag, resFlag){
						RM.createResult(STATUS_SUCESS, SYSTEM_SUC, null, function(errJson, resJson){
							res.json(resJson, STATUS_SUCESS);	
						});
					});
				}
			});
			
		}
	});

	// Get news with id of news
	app.post('/getNewsByID', function (req, res) {
		req.checkBody('_id', 'Invalid _id').notEmpty().isInt();
		var errors = req.validationErrors();
		if (errors) {
			RM.createResult(STATUS_FAIL, errors, null, function(errResult, resResult){
				res.json(resResult,STATUS_FAIL);	
			});
		}else{
			NM.getItemNews(req.body._id, function(errResult, resResult){
				if (errResult) {
					RM.createResult(STATUS_FAIL, errResult, null, function(errJson, resJson){
						res.json(resJson, STATUS_FAIL);	
					});	
				}else{
					RM.createResult(STATUS_SUCESS, SYSTEM_SUC, resResult, function(errJson, resJson){
						res.json(resJson, STATUS_SUCESS);	
					});
				}
			});
		}
		
	});

	app.post('/getNews', function (req, res) {
		NM.getAllItemNews(req.body, function(errResult, resResult){
			if (errResult) {
				RM.createResult(STATUS_FAIL, errResult, null, function(errJson, resJson){
					res.json(resJson, STATUS_FAIL);	
				});	
			}else{
				RM.createResult(STATUS_SUCESS, SYSTEM_SUC, resResult, function(errJson, resJson){
					res.json(resJson, STATUS_SUCESS);	
				});
			}
		});
	});

	// Get news with id of news
	app.delete('/news', function (req, res) {
		req.checkBody('_id', 'Invalid _id').notEmpty().isInt();
		req.checkBody('token', 'Invalid token').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			RM.createResult(STATUS_FAIL, errors, null, function(errResult, resResult){
				res.json(resResult,STATUS_FAIL);	
			});
		}else{
			LM.checkToken(token, function (err, objects) {
				if (err) {
					RM.createResult(STATUS_FAIL, err, null, function(errResult, resResult){
						res.json(resResult,STATUS_FAIL);	
					});
				} else{
					NM.deleteNews(req.body._id, function(errResult, resResult){
						if (errResult) {
							RM.createResult(STATUS_FAIL, errResult, null, function(errJson, resJson){
								res.json(resJson, STATUS_FAIL);	
							});	
						}else{
							RM.createResult(STATUS_SUCESS, SYSTEM_SUC, null, function(errJson, resJson){
								res.json(resJson, STATUS_SUCESS);	
							});
						}
					});
				}
			});
			
		}
		
	});

};