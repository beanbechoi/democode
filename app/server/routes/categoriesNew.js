var CNM = require('../modules/categoriesNew-manager');
var RM = require('../modules/result-manager');

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

module.exports = function(app, server) {
	
	// Add new category
	app.post('/categories', function (req, res) {
		var document = { 
			_id: req.param('_id'), 
			parent:req.param('parentid'), 
			name: req.param('name')
		};
		CNM.insertCategory(document, function(errResult, resResult){
			if(resResult){
				RM.createResult(STATUS_SUCESS, SYSTEM_SUC, null, function(errJson, resJson){
					res.json(resResult, STATUS_SUCESS);	
				});
			}else{
				RM.createResult(STATUS_FAIL, errResult, null, function(errJson, resJson){
					res.json(resJson, STATUS_FAIL);	
				});
			}
		});
	});
	
	app.get('/categories', function (req, res) {
		var parentId = req.query.parentid;
		if(parentId != undefined){
			CNM.getListCategory(parentId,function(errResult, resResult){
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
	
	// Edit item of category
	app.put('/categories', function (req, res) {
		req.checkBody('_id', 'Invalid _id').notEmpty();
		req.checkBody('parentid', 'Invalid parent id').notEmpty();
		req.checkBody('name', 'Invalid name').notEmpty();
		//...
		//...
		var errors = req.validationErrors();
		if (errors) {
			RM.createResult(STATUS_FAIL, errors, null, function(errResult, resResult){
				res.json(resResult,STATUS_FAIL);	
			});
		}else{
			var idCategory = req.param('_id');
			var document = {
				parent : req.param('parentid'),
				name : req.param('name')
			};
			CNM.updateCategory(idCategory, document, function(errResult, resResult){
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
	
	// Delete item category
	app.del('/categories', function(req, res){
		req.checkBody('_id', 'Invalid _id').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			var jsonResult = createResult(STATUS_FAIL, SYSTEM_ERR, null);
			res.json(jsonResult,STATUS_FAIL);
			return;
		}else{
			var idCategory = req.query._id;
			CNM.deleteCategory(idCategory, function(errResult, resResult){
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
	
};