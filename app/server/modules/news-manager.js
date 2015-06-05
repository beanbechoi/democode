var Mogodb = require('../mongodb/connection');

var seq_mod = require('../modules/sequence-manager');
var _ = require('../modules/underscore');
var news = Mogodb.news;
var util = require('util');
var ObjectID = Mogodb.ObjectID;

// ------------------------------------
// Insert item news
// note: document item news
// callback:Document item news
// ------------------------------------
exports.insertNews = function(document, callback) {

	delete document.token;
	var date = new Date();
	document.date_create = date;
	document.date_edit = date;
	document.date_public = date;
	// var document = {
	// 	title : req.param('title'),
	// 	alias : req.param('alias'),
	// 	date_create : req.param('date_create'),
	// 	date_edit : req.param('date_edit'),
	// 	date_public : req.param('date_public'),
	// 	date_start_event : req.param('date_start_event'),
	// 	status : req.param('status'),
	// 	image : req.param('image'),
	// 	is_hot : req.param('is_hot'),
	// 	hot_image : req.param('hot_image'),
	// 	cat_id : req.param('cat_id'),
	// 	user_create : req.param('user_create'),
	// 	user_approved : req.param('user_approved'),
	// 	descript : req.param('descript'),
	// 	content : req.param('content'),
	// 	data_temp : req.param('data_temp')
	// };
	seq_mod.getNextSequence('news', function(err, result) {
		if (err) {
			callback(err, null);
		} else {
			document._id = result.seq;
			news.insert(document, {
				safe : true
			}, function(err, record) {
				if(!err){
					callback(null, record);
				}else{
					callback(err, null);
				}
			});
		}
	});
};

//------------------------------------
//Get item news
//document: 
//callback: 
//------------------------------------
exports.getItemNews = function(idItem, callback){

	news.findOne({_id:parseInt(idItem)}, function(err, res){
		if(res){
			callback(null, res);
		}else{
			callback(null,err);
		}
	});
};

exports.getAllItemNews = function(document, callback){
	var limit = parseInt(document.limit);
	var skip = parseInt(document.skip);
	var order = document.order;
	delete document.limit;
	delete document.skip;
	delete document.order;
	delete document.token;
	if(!_.isUndefined(document._id) && document._id.length > 0){
		document._id = parseInt(document._id);
	}
	
	news.find(document).toArray(function(err, res){
		if(res){
			callback(null, res);
		}else{
			callback(err,null);
		}
	});
};



//------------------------------------
//Update item news
//document: 
//callback: 
//------------------------------------
exports.updateNews = function(document, callback){
	var documentID = parseInt(document._id);
	delete document._id;
	document.date_edit = new Date();
	news.update({_id:documentID}, {$set: document}, {multi:true}, function(err, res) {
		if(!err){
			callback(null,res);
		}else{
			callback(err,null);
		}
	});
};

exports.deleteNews = function(idItem, callback){
	var documentID = parseInt(idItem);
	news.remove({
		_id : documentID
	}, function(err, res) {
		if(!err){
			callback(null,res);
		}else{
			callback(err,null);
		}
	});
};

//------------------------------------
//Update item news
//document: 
//callback: 
//------------------------------------
exports.checkEixtNewsOfUser = function(idNews, user_create, status, callback){

	news.findOne({_id:idNews}, function(err, res){
		if(res){
			if(res.user_create == user_create){
				news.update({_id:new ObjectID(idNews)}, {$set: {status:status}}, {multi:true}, function(errResult, resResult) {
					if(!errResult){
						callback(null,res);
					}else{
						callback(errResult,null);
					}
				});
			}
		}else{
			callback(null,err);
		}
	});
};