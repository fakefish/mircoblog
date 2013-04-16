
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// add mongodb
var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
// add connect-flash
var flash=require('connect-flash');


// all environments

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(flash());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser());
app.use(express.session({ 
		secret: settings.cookieSecret, 
		store: new MongoStore({ 
		db: settings.db 
	}) 
}));
// app.use(express.router(routes));
routes(app);

app.use(function(req,res,next){
var err = req.flash('error'),
    success = req.flash('success');
res.locals.user = req.session.user;
res.locals.error = err.length ? err : null;
res.locals.success = success.length ? success : null;
next();
});

// 添加动态视图助手
// app.dynamicHelpers({
//   user: function(req,res){
//     return req.session.user;
//   },
//   error:function(req, res){
//     var err=req.flash('error');
//     if (err.length)
//       return err;
//     else
//       return null;
//   },
//   success: function(req, res){
//     var succ = req.flash('success');
//     if (succ.length)
//       return succ;
//     else
//       return null;
//   }
// })

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
