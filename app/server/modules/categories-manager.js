var Mogodb = require('../mongodb/connection');
var seq_mod = require('../modules/sequence-manager');
var _ = require('../modules/underscore');
var categories = Mogodb.categories;
var util = require('util');

module.exports.insertCatetory = function(document, callback) {
	callback = (typeof callback === 'function') ? callback : function() {
	};

	seq_mod.getNextSequence('categories', function(err, result) {
		if (err) {
			callback(err, null);
		} else {
			var id_seq = result.seq;
			var date = new Date();
			document._id = id_seq;
			document.date_create = date;
			document.date_edit = date;
			delete document.token;
			if (_.isNumber(document.parentID)) {
				document.parentID = parseInt(document.parentID);
			} else{
				document.parentID = 0;
			}
			categories.insert(document, {
				safe : true
			}, function(errDocument, resDocument) {
				if (errDocument) {
					callback(errDocument, null);
				} else {
					callback(null, resDocument);
				}
			});
		}

	});
};
module.exports.getAllCategory = function(document, callback){
	callback = (typeof callback === 'function') ? callback : function() {
	};
	categories.find({parentID:0}).toArray(function(e, res){
		if (e) {
			callback(e,null);
		}else{
			var Fiber;
			Fiber = require('fibers');
			Fiber(function() {
				var Server = require("mongo-sync").Server;
				var server = new Server('54.169.67.166');
				for (var i = res.length - 1; i >= 0; i--) {
					var obj = res[i];
					var child = server.db("TodayVoice").getCollection("categories").find({parentID: obj._id}).toArray();
					if(!_.isUndefined(child) && child.length > 0){
						for (var j = child.length - 1; j >= 0; j--) {
							var obj1 = child[j];
							var child1 = server.db("TodayVoice").getCollection("categories").find({parentID: obj1._id}).toArray();
							if(!_.isUndefined(child1) && child1.length > 0){
								obj1.child = child1;
							}
							
						}
						obj.child = child;
					}	
				};
				callback(null,res);
				return server.close();
			}).run();
		}
	});
};
module.exports.getCategoryByID = function(document, callback){
	callback = (typeof callback === 'function') ? callback : function() {
	};
	categories.find({_id:parseInt(document._id)}).toArray(function(e, res){
		if (e) {
			callback(e,null);
		}else{
			if(!_.isUndefined(res) && res.length > 0){
				var Fiber;
				Fiber = require('fibers');
				Fiber(function() {
					var Server = require("mongo-sync").Server;
					var server = new Server('54.169.67.166');
					var obj = res[0];
					var child = server.db("TodayVoice").getCollection("categories").find({parentID: obj._id}).toArray();
					if(!_.isUndefined(child) && child.length > 0){
						for (var j = child.length - 1; j >= 0; j--) {
							var obj1 = child[j];
							var child1 = server.db("TodayVoice").getCollection("categories").find({parentID: obj1._id}).toArray();
							if(!_.isUndefined(child1) && child1.length > 0){
								obj1.child = child1;
							}
							
						}
						obj.child = child;
					}
					callback(null,res);
					return server.close();
				}).run();
			}else{
				callback('not found',null);
			}
			
		}
	})
};
module.exports.getCategory = function(document, callback) {
	callback = (typeof callback === 'function') ? callback : function() {
	};
	var limit = parseInt(document.limit);
	var skip = parseInt(document.skip);
	var order = document.order;
	delete document.limit;
	delete document.skip;
	delete document.order;
	if (document._id === null || typeof document._id === 'undefined'
		|| document._id === "null" || document._id.length < 1) {
		categories.find(document).limit(limit).skip(skip).sort([[order, 'asc'] ])
	.toArray(function(e, res) {
		if (e) {
			callback(e, null)
		} else {
			callback(null, res)
		}
	});
	} else {
		categories.find({
			_id : parseInt(document._id)
		}).limit(parseInt(document.limit)).skip(parseInt(document.skip)).sort(
		[ [ document.order, 'asc' ] ]).toArray(function(e, res) {
			if (e) {
				callback(e, null)
			} else {
				callback(null, res)
			}
		});
	}
};
module.exports.updateCategory = function(document, callback) {
	callback = (typeof callback === 'function') ? callback : function() {
	};

	var documentID = parseInt(document._id);
	delete document._id;
	document.date_edit = new Date();
	if (_.isNumber(document.parentID)) {
		document.parentID = parseInt(document.parentID);
	} else{
		document.parentID = 0;
	}
	categories.update({
		_id : documentID
	}, {
		$set : document
	}, function(err, res) {
		if (err) {
			callback(err, null);
		} else {
			callback(null, res);
		}
	});
};

module.exports.deleteCategory = function(document, callback) {
	callback = (typeof callback === 'function') ? callback : function() {
	};
	var documentID = parseInt(document._id);
	categories.remove({
		_id : documentID
	}, function(err, res) {
		if (err) {
			callback(err, null);
		} else {
			callback(null, res);
		}
	});

};
