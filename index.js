
var express = require('express'),
    session = require('express-session'),
    mongoose = require('mongoose'),
    MongoStore = require('connect-mongo')(session);
api = require('./api/api'),
    app = express();


var sess = {
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection}),
    secret: 'addhe3ddzrf6eezefzefzefzefzefprr'
}



app
    .use(express.static('./public'))
    .use(session(sess))
    .use('/api',api)
    .get('*',function(req,res){
        res.sendfile('public/index.html')
    })
    .listen(3000);
