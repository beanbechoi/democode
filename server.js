/**
 * MODULE DEPENDENCIES
 * -------------------------------------------------------------------------------------------------
 * include any modules you will use through out the file
 */

var express = require('express'), expressValidator = require('express-validator'), util = require('util'), http = require('http'), fs = require('fs'), nconf = require('nconf'), path = require('path'), everyauth = require('everyauth'), node_uuid = require('node-uuid'), async = require('async'), uglify = require("uglify-js"), uglifycss = require('uglifycss'), Recaptcha = require('recaptcha').Recaptcha;

/**
 * CONFIGURATION
 * -------------------------------------------------------------------------------------------------
 * load configuration settings from ENV, then settings.json. Contains keys for
 * OAuth logins. See settings.example.json.
 */
nconf.env().file({
	file : 'settings.json'
});

var app = express();

app
		.configure(function() {
			app.set('port', process.env.PORT || 8080);
			app.set('views', __dirname + '/app/server/views');
			app.set('view engine', 'jade');
			app.use(express.compress());
			app.use(express.favicon());
			app.use(express.logger('dev'));
			app.use(express.bodyParser());
			app
					.use(expressValidator({
						errorFormatter : function(param, msg, value) {
							var namespace = param.split('.'), root = namespace
									.shift(), formParam = root;

							while (namespace.length) {
								formParam += '[' + namespace.shift() + ']';
							}
							return {
								param : formParam,
								msg : msg,
								value : value
							};
						}
					}));
			app.use(express.methodOverride());
			app.use(express.cookieParser('azure zomg'));
			app.use(express.session({
				secret : 'super-duper-secret-secret'
			}));
			app.use(everyauth.middleware(app));
			app.use(app.router);

			app.use(require('less-middleware')({
				src : __dirname + '/app/public'
			}));
			app.use(express.static(path.join(__dirname, 'app/public')));
			app.use(express.favicon(path.join(__dirname, '/app/public',
					'images', 'file_icon.png')));
		});

app.configure('development', function() {
	app.use(express.errorHandler());
});

var server = http.createServer(app);

var should = require('should');

process.on('uncaughtException', function(err) {
	console.log('Caught exception: ' + err);
});

* ROUTING
* -------------------------------------------------------------------------------------------------
* include a route file for each major area of functionality in the site
**/
// require('./app/server/routes/home')(app);
// require('./app/server/routes/account')(app);
// require('./app/server/routes/image')(app);
// require('./app/server/routes/chat')(app);
// require('./app/server/routes/place')(app,async);
// require('./app/server/routes/findplace')(app);
// require('./app/server/routes/profile')(app);
require('use-strict')
// require('./app/server/socket.io/real_time')(app,server);
require('./app/server/routes/categories')(app, node_uuid);
require('./app/server/routes/login')(app, node_uuid);
require('./app/server/routes/news')(app, node_uuid);
require('./app/server/routes/emails')(app, node_uuid);
require('./app/server/routes/pages')(app, node_uuid);
require('./app/server/routes/topics')(app, node_uuid);
require('./app/server/routes/videos')(app, node_uuid);
/**
 * RUN
 * -------------------------------------------------------------------------------------------------
 * this starts up the server on the given port
 */

server.listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});
