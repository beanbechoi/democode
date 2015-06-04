var Mogodb = require('../mongodb/connection');
var news = Mogodb.news;
var util = require('util');
var ObjectID = Mogodb.ObjectID;

// ------------------------------------
// Insert item news
// note: document item news
// callback:Document item news
// ------------------------------------
exports.insertNews = function(document, callback) {

	news.insert(document, {
		safe : true
	}, function(err, record) {
		if(!err){
			callback(null, record[0]);
		}else{
			callback(err, null);
		}
	});
};

//------------------------------------
//Get item news
//document: 
//callback: 
//------------------------------------
exports.getItemNews = function(idItem, callback){
	news.findOne({_id:new ObjectID(idItem)}, function(err, res){
		if(res){
			callback(null, res);
		}else{
			callback(null,err);
		}
	});
};

//------------------------------------
//Update item news
//document: 
//callback: 
//------------------------------------
exports.updateNews = function(idNews, document, callback){
	news.update({_id:new ObjectID(idNews)}, {$set: document}, {multi:true}, function(err, res) {
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
	news.findOne({_id:new ObjectID(idNews)}, function(err, res){
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