var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var mongoose = require('mongoose');
const bodyParser = require('body-parser');
const vesselController = require('./controllers/VesselController');
require('./config/keys');

var app = express();
app.use(cors());
app.options('*', cors());

// DB Config
const db = require('./config/keys').MongoURI;

const options = {
	useNewUrlParser: true,
	reconnectTries: Number.MAX_VALUE,
	poolSize: 10
};

mongoose
	.connect(db, options)
	.then(() => console.log('MongoDB Connection established'))
	.catch((err) => console.log('Error connecting MongoDB database due to: ', err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Bodyparser
app.use(express.urlencoded({ extended: false }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	next();
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

// const PORT = process.env.PORT || 3001;
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

app.route('/vessels/all').get(vesselController.getBaseAll);
app.route('vessels/:id/track').get(vesselController.getCurrent);
app.route('/vessels').get(vesselController.getHistory);

app.listen(PORT, console.log(`Server started on port ${PORT}`));

module.exports = app;
