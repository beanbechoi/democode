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
			var document_cat = {
				'_id' : id_seq,
				'title' : document.title,
				'alias' : document.alias,
				'descript' : document.descript,
				'order' : document.order,
				'parentID' : parseInt(document.parentID),
				'user_create' : document.user_create,
				'date_create' : date,
				'date_edit' : date,
				'child' : []
			};

			categories.insert(document_cat, {
				safe : true
			}, function(errDocument, resDocument) {
				if (errDocument) {
					callback(errDocument, null);
				} else {
					var parentID = document.parentID;
					if (_.isUndefined(document.parentID)
							|| _.isEmpty(document.parentID)) {
						callback(null, resDocument);
					} else {
						var iParentID = parseInt(parentID);
						categories.find({
							_id : iParentID
						}).toArray(function(err, resCat) {
							if (err || resCat.length == 0) {
								callback(null, resDocument);
							} else {
								var parrentObj = resCat[0];
								var ObjCat = resDocument[0];
								delete ObjCat.child;
								delete ObjCat.parentID;
								parrentObj.child.push(ObjCat);
								if (resCat) {
									categories.update({
										_id : iParentID
									}, {
										$set : {
											child : parrentObj.child
										}
									}, function(err, res) {
										if (err) {
											callback(err, null);
										} else {
											callback(null, resDocument);
										}
									});
								} else {
									callback(null, resDocument);
								}
							}
						});
					}
				}
			});
		}

	});
};
module.exports.getCategory = function(document, callback) {
	callback = (typeof callback === 'function') ? callback : function() {
	};

	var where = document;
	delete where.limit;
	delete where.skip;
	delete where.order;
	if (document._id === null || typeof document._id === 'undefined'
			|| document._id === "null" || document._id.length < 1) {
		categories.find(where).limit(parseInt(document.limit)).skip(
				parseInt(document.skip)).sort([ [ document.order, 'asc' ] ])
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
			callback(err, null)
		} else {
			categories.find({
				parentID : documentID
			}).toArray(function(e, resFind) {
				if (e) {
					callback(e, null)
				} else {
					resFind.forEach(function(item) {
						delete item.child;
						delete item.parentID;
					});
					categories.update({
						_id : documentID
					}, {
						$set : {
							'child' : resFind
						}
					}, function(err1, res1) {
						if (err1) {
							callback(err1, null)
						} else {
							callback(null, res1)
						}
					});
				}
			});
		}
	});
};

module.exports.deleteCategory = function(document, callback) {
	callback = (typeof callback === 'function') ? callback : function() {
	};
	var documentID = parseInt(document._id);
	categories.findOne({
		_id : documentID
	}, function(err, res) {
		if (err) {
			callback(err, null);
		} else {
			categories.update({
				_id : res.parentID
			}, {
				$unset : {
					'res.child._id' : documentID
				}
			}, function(err1, res1) {
				if (err1) {
					callback(err1, null);
				} else {
					categories.remove({
						_id : documentID
					}, function(err, res) {
						if (err) {
							callback(err, null);
						} else {
							callback(null, res);
						}
					});
				}
			});
		}
	});

};
