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
		var errors = req.validationErrors();
		if (errors) {
			RM.createResult(STATUS_FAIL, errors, null, function(errResult, resResult){
				res.json(resResult,STATUS_FAIL);	
			});
		}else{
			var document = {
				title : req.param('title'),
				alias : req.param('alias'),
				date_create : req.param('date_create'),
				date_edit : req.param('date_edit'),
				date_public : req.param('date_public'),
				date_start_event : req.param('date_start_event'),
				status : req.param('status'),
				image : req.param('image'),
				is_hot : req.param('is_hot'),
				hot_image : req.param('hot_image'),
				cat_id : req.param('cat_id'),
				user_create : req.param('user_create'),
				user_approved : req.param('user_approved'),
				descript : req.param('descript'),
				content : req.param('content'),
				data_temp : req.param('data_temp')
			};
			NM.insertNews(document, function(errResult, resResult){
				if (errResult) {
					RM.createResult(STATUS_FAIL, errResult, null, function(errJson, resJson){
						res.json(resJson, STATUS_FAIL);	
					});	
				}else{
					RM.createResult(STATUS_SUCESS, SYSTEM_SUC, null, function(errJson, resJson){
						res.json(resResult, STATUS_SUCESS);	
					});
				}	
			});
		}
	});
	
	// Get news with id of news
	app.get('/news', function (req, res) {
		var idItem = req.query._id;
		if(idItem != undefined){
			NM.getItemNews(idItem, function(errResult, resResult){
				if (errResult) {
					RM.createResult(STATUS_FAIL, errResult, null, function(errJson, resJson){
						res.json(resJson, STATUS_FAIL);	
					});	
				}else{
					RM.createResult(STATUS_SUCESS, SYSTEM_SUC, null, function(errJson, resJson){
						res.json(resResult, STATUS_SUCESS);	
					});
				}
			});
		}
	});
	
	// Edit item of news
	app.put('/news', function (req, res) {
		req.checkBody('_id', 'Invalid title').notEmpty();
		req.checkBody('title', 'Invalid title').notEmpty();
		//...
		//...
		var errors = req.validationErrors();
		if (errors) {
			RM.createResult(STATUS_FAIL, errors, null, function(errResult, resResult){
				res.json(resResult,STATUS_FAIL);	
			});
		}else{
			var idNews = req.param('_id');
			var document = {
				title : req.param('title'),
				alias : req.param('alias'),
				date_create : req.param('date_create'),
				date_edit : req.param('date_edit'),
				date_public : req.param('date_public'),
				date_start_event : req.param('date_start_event'),
				status : req.param('status'),
				image : req.param('image'),
				is_hot : req.param('is_hot'),
				hot_image : req.param('hot_image'),
				cat_id : req.param('cat_id'),
				user_create : req.param('user_create'),
				user_approved : req.param('user_approved'),
				descript : req.param('descript'),
				content : req.param('content'),
				data_temp : req.param('data_temp')
			};
			NM.updateNews(idNews, document, function(errResult, resResult){
				if (errResult) {
					RM.createResult(STATUS_FAIL, errResult, null, function(errJson, resJson){
						res.json(resJson, STATUS_FAIL);	
					});	
				}else{
					RM.createResult(STATUS_SUCESS, SYSTEM_SUC, null, function(errJson, resJson){
						res.json(resResult, STATUS_SUCESS);	
					});
				}	
			});
		}
	});
	
	// Edit item of news
	app.put('/updatestatus', function (req, res) {
		req.checkBody('_id', 'Invalid _id').notEmpty();
		req.checkBody('status', 'Invalid status').notEmpty();
		req.checkBody('user_create', 'Invalid user_create').notEmpty();
		
		var errors = req.validationErrors();
		if (errors) {
			RM.createResult(STATUS_FAIL, errors, null, function(errResult, resResult){
				res.json(resResult,STATUS_FAIL);	
			});
		}else{
			var idNews = req.param('_id');
			var user_create = req.param('user_create');
			var status = req.param('status');
			NM.checkEixtNewsOfUser(idNews, user_create, status, function(errFlag, resFlag){
				RM.createResult(STATUS_SUCESS, SYSTEM_SUC, null, function(errJson, resJson){
					res.json(resFlag, STATUS_SUCESS);	
				});
			});
		}
	});
	 
};