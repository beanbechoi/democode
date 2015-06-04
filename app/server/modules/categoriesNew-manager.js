var Mogodb = require('../mongodb/connection');
var categoriesnew = Mogodb.categoriesnew;
var ObjectID = Mogodb.ObjectID;

//------------------------------------
//Get list place
//note: 
//callback:
//------------------------------------
exports.insertCategory = function(document, callback){
	categoriesnew.findOne({_id:document._id}, function(errCheck, resCheck){
		if(resCheck){
			callback(null, null);
		}else{
			categoriesnew.insert(document, {
				safe : true
			}, function(err, record) {
				if(!err){
					callback(null, record[0]);
				}else{
					callback(err, null);
				}
			});
		}
	});
};

//------------------------------------
//Get list category
//document: 
//callback: 
//------------------------------------
exports.getListCategory = function(parentId, callback){
	categoriesnew.find({"parent":parentId})
	.toArray(function(err, items) 
	{
		if(items){
			callback(null,items);
		}else{
			callback(null,null);
		}
	});
};

//------------------------------------
//Update item category
//document: 
//callback: 
//------------------------------------
exports.updateCategory = function(idCategory, document, callback){
	categoriesnew.update({_id:idCategory}, {$set: document}, {multi:true}, function(err, res) {
		if(!err){
			callback(null,res);
		}else{
			callback(err,null);
		}
	});
};

//------------------------------------
//Update item category
//document: 
//callback: 
//------------------------------------
exports.deleteCategory = function(idCategory, callback){
	categoriesnew.remove({_id:idCategory }, function(err, res){
		if(res){
			callback(null,res);
		}else{
			callback(err,null);
		}
	});
};