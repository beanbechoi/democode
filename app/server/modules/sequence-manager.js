//
var Mogodb   = require('../mongodb/connection');
var sequ	 = Mogodb.sequence;
// add new account
exports.getNextSequence = function(name,callback)
{
	sequ.findAndModify({_id: name},{}, {$inc: {seq: 1}}, {new:true}, function(err, object) {
		callback = (typeof callback === 'function') ? callback : function() {};
		if (err) {
			callback(err, null);
		}else{
			callback(null, object);	
		}
	     
	});
}
