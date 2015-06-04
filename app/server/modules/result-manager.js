// --------------------------------
// Author: Hai_Nguyen_Huu
// Date: 05/03/2015
// --------------------------------


// ------------------------------------
// SAMPLE RESULT JSON
// param_ func_: function name excute_
// mthod_: method excute_ [POST/GET]
// stt_: result status of function
// msg_: message status
// err: error detail of result excute_ function
// res: result of function
// Return: json_ result
// ------------------------------------
exports.createJsonResult = function(func, mthod, stt, msg, err, res, callback) {
	var jsonResult = {
		func_cd : func,
		method : mthod,
		code : stt,
		msg : msg,
		error : err,
		data : res,
	};
	callback(null, jsonResult);
};

// ------------------------------------
// CREATE RESULT CALLBACK
// res: result of function
// Return: json_ result
// ------------------------------------
exports.createResult = function(stt, msg, res, callback) {
	var jsonResult;
	if (res !== null) {
		jsonResult = {
			code : stt,
			msg : msg,
			data : res
		};
	} else {
		jsonResult = {
			code : stt,
			msg : msg
		};
	}
	callback(null, jsonResult);
};
