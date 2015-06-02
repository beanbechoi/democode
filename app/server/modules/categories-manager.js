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
			if (_.isNumber(document.parentID)) {
				document.parentID = parseInt(document.parentID);
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
