var crypto 		= require('crypto');
var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;
var moment 		= require('moment');
var ObjectID	= require('mongodb').ObjectID;

var dbPort 		= 27017;
//var dbHost 		= '54.169.67.166';
var dbHost 		= 'localhost';
var dbName 		= 'location';

/* establish the database connection  */

var db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
db.open(function(error, d){
	if (error) {
		console.log(error);
	}else{
		console.log('connected to database :: ' + dbName);
	}
});

module.exports = {
		categories:db.collection('categories'),
		// counters:db.collection('counters'),
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