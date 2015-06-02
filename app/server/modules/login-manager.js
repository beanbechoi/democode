var cnMongoDB = require('../mongodb/connection');
var crypto = require('crypto');
var accountDB = cnMongoDB.account;
var systemDB = cnMongoDB.systemstatus;

module.exports.insertAccount = function(document, callback){
	callback = (typeof callback === 'function') ? callback : function() {
	};
	document._id = document.username;
	document.date_create = new Date();
	accountDB.insert(document,{
		safe : true
	}, function(err, res){
		if (err) {
			if (err.code == 11000) {
				callback('Username already exists. Please enter a different username!', null);
			} else{
				callback('Can not register user', null);
			}
		}else{
			callback(null, res);
		}
	});
};

module.exports.updateAccount = function(document, callback) {
	callback = (typeof callback === 'function') ? callback : function() {
	};

	var documentID = parseInt(document._id);
	delete document._id;
	document.date_edit = new Date();
	accountDB.update({
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

// Check user & password when login
module.exports.checkLogin = function(userid, password, callback) {
	callback = (typeof callback === 'function') ? callback : function() {
	};
	accountDB.findOne({
		$and : [ {
			"_id" : userid,
			"password" : password
		} ]
	}, function(err, result) {
		if (err)
			callback(err, null);
		else {
			callback(null, result);
		}
	});
}

// Create token
module.exports.insertToken = function(userid, token, callback) {
	callback = (typeof callback === 'function') ? callback : function() {
	};

	var iDate = new Date();
	systemDB.update({
		"userid" : userid
	}, {
		$set : {
			"token" : token,
			"userid" : userid,
			"lastedit" : iDate
		}
	}, {
		upsert : true
	}, function(err, resultSystem) {
		if (err) {
			callback(err, 'Can not login');
		} else {
			systemDB.findOne({
				"userid" : userid
			}, function(err, resultAcc) {
				if (err) {
					callback(err, 'Can not get user info');
				} else {
					callback(null, resultAcc);
				}
			});
		}
	});
}
module.exports.getUser = function(document, callback) {
	callback = (typeof callback === 'function') ? callback : function() {
	};

	var where = document;
	delete where.limit;
	delete where.skip;
	delete where.order;
	if (document._id === null || typeof document._id === 'undefined'
			|| document._id === "null" || document._id.length < 1) {
		accountDB.find(where).limit(parseInt(document.limit)).skip(
				parseInt(document.skip)).sort([ [ document.order, 'asc' ] ])
				.toArray(function(e, res) {
					if (e) {
						callback(e, null)
					} else {
						callback(null, res)
					}
				});
	} else {
		accountDB.find({
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

// Logout
module.exports.logOut = function(token, callback) {
	callback = (typeof callback === 'function') ? callback : function() {
	};

	systemDB.remove({
		"token" : token
	}, function(err, result) {
		if (err)
			callback(err, 'Can not logout');
		else
			callback(null, result);
	});
}

// Logout
module.exports.checkToken = function(token, callback) {
	callback = (typeof callback === 'function') ? callback : function() {
	};

	systemDB.findOne({
		"token" : token
	}, function(err, result) {
		if (err)
			callback(err, 'Can not check token');
		else
			callback(null, result);
	});
}

// Get user info
module.exports.getUserInfo = function(userid, callback) {
	callback = (typeof callback === 'function') ? callback : function() {
	};

	accountDB.findOne({
		"_id" : userid
	}, function(err, result) {
		if (err)
			callback(err, 'Can not get user info');
		else
			callback(null, result);
	});
}

module.exports.addUser = function(userid, password, username, email, phone,
	address, callback) {
	callback = (typeof callback === 'function') ? callback : function() {
	};

	var pword = crypto.createHash('md5').update(password).digest("hex");
	var iDate = new Date();
	accountDB
	.insert(
	{
		"_id" : userid,
		"password" : pword,
		"UserName" : username,
		"Email" : email,
		"Phone" : phone,
		"Address" : address,
		"RegisterDate" : iDate
	},
	function(err, result) {
		if (err) {
			if (err.code == 11000) {
				callback(err,
					'Username already exists. Please enter a different username!');
			} else
			callback(err, 'Can not register user');
		} else
		callback(null, result);
	});
}

// Update comment and like
module.exports.updatePassWord = function(userid, ipass, callback) {
	callback = (typeof callback === 'function') ? callback : function() {
	};

	var pword = crypto.createHash('md5').update(ipass).digest("hex");
	accountDB.update({
		'_id' : userid
	}, {
		$set : {
			password : pword
		}
	}, function(err, result) {
		if (err)
			callback(err, 'Can not update user');
		else
			callback(null, result);
	});
}