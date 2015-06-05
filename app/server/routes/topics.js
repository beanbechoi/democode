var CM = require('../modules/topics-manager');
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
	
	// Demo news
	app.get('/topics', function (req, res) {
		res.send('xxx', 200);
	});
	
};