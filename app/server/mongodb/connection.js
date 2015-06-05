var crypto 		= require('crypto');
var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;
var moment 		= require('moment');
var ObjectID	= require('mongodb').ObjectID;

var dbPort 		= 27017;
// var dbHost 		= '54.169.67.166';
var dbHost 		= 'localhost';
var dbName 		= 'TodayVoice';

/* establish the database connection  */

var db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
db.open(function(error, d){
	if (error) {
		console.log(error);
	}else{
		console.log('connected to database :: ' + dbName);
	}
});


// var crypto      = require('crypto');
// var MongoDB  	= require('mongodb').Db;
// var Server      = require('mongodb').Server;
// var moment      = require('moment');
// var moment      = require('moment');
// var ObjectID 	= require('mongodb').ObjectID;

// var dbPort                 = 10063; //27017;
// var dbHost                 = 'oceanic.mongohq.com';//'localhost';
// var dbName                 = 'location';
// var mongo_db_username = 'userdb';
// var mongo_db_password = 'userdb';


// // establish the database connection 
// // cai nay copy qua ben em, cai nay moi connect duoc db online, cai hien hanh cua em ko connect duoc dau ok ?
// // copy het luon hay sao
// // copy xong chay o local xem no connect duoc ko  
// var db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
// db.open(function(e, p_client){
        // if (e) {
                // console.log(e);
        // }        else{
            // p_client.authenticate(mongo_db_username,mongo_db_password,{},function(err,success){
                // if (err) {
                    // console.warn("MONGO ERROR: unauthorized "+ err.message);

                // } else {
                    // console.log("MONGO Authorized");
                            // console.log('connected to database :: ' + dbName);
                // }
            // });
        // }
// });

module.exports = {
		categories:db.collection('categories'),
		sequence:db.collection('sequence'),
		systemstatus:db.collection('systemstatus'),
		account:db.collection('account'),
		crypto:crypto,
		ObjectID:ObjectID,
		
		news:db.collection('news'),
		pages:db.collection('pages'),
		emails:db.collection('emails'),
		topics:db.collection('topics'),
		videos:db.collection('videos'),
		categoriesnew:db.collection('categoriesnew'),
		moment:moment 
};