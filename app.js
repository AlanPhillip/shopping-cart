var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var config = require('./config/database');
var bodyParser = require('body-parser');
var session = require('express-session')
var expressValidator = require('express-validator');

// Connect to db
mongoose.connect(config.database, {useNewUrlParser: true, useUnifiedTopology: true  });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {
    console.log('Connected to mongodb')
})
// Init app
var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json()); 

// Express-session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

//Express validator middleware 
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace + ']';
        }
        return {
            param : formParam,
            msg : msg,
            value : value
        };
    }
}));

// Express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Set router
var pages = require('./routes/pages.js');
var adminpages = require('./routes/adminpages.js');

app.use('/admin/pages', adminpages)
app.use('/', pages)

//Start the server
var port = 3000;
app.listen(port, function() {
    console.log('Server started on port ' + port);
})