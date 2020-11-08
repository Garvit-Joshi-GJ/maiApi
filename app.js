import express from 'express'; // import express module
import mongoose from 'mongoose'; // import mongoose module
import bodyParser from 'body-parser'; // import body-parser module
// import passport from 'passport'; // import express passport
import config from './config';
import cors from 'cors';
import compression from 'compression';

import logger from 'morgan';
import dotenv from 'dotenv';
import session from 'express-session';

const MongoStore = require('connect-mongo')(session);
dotenv.config();
import Routes from './routes';
// Create a new Express Instance
const app = express();

// compress all responses
app.use(compression());

app.set('view engine', 'ejs');

//setting url of MongoDb
// var uri = 'mongodb://root:1Rootuser@ds139944.mlab.com:39944/queries';
var uri = 'mongodb+srv://root:root@cluster0.vzk5t.mongodb.net/holasa?retryWrites=true&w=majority';

// Configuration and connecting to Databse MongoDb
mongoose.connect(uri, {
//    useMongoClient: true
}, (err) => {
   if (err) {
      console.log('Connection Error: ', err);
   } else {
      console.log('Successfully Connected');
   }
});

mongoose.Promise = global.Promise;

// Cors middleware to handle request cross-origin
app.use(cors());
//body-parser middleware to handle form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));

//morgan middle-ware to logs the requests.
app.use(logger('dev'));


//configuration for passport
// require('./config/passport')(passport);
app.use(session({
   resave: false,
   proxy: true,
   saveUninitialized: true,
   secret: config.auth.session_secret,
   cookie:{
   secure: false,
   domain: 'localhost',
   maxAge: 1000 * 60 * 24 // 24 hours
   },
   store: new MongoStore({
       url: uri,
       autoReconnect: true
   })
}));

// Welcome Route for api
app.get('/api', function(req, res, next) {
    res.status(200).json({
       status: true,
       message: "Welcome to Spineor API, Ready to Handle Requests..!!"
    });
});

app.use('/api', Routes.mailRoutes);
app.use('/api', Routes.queryRoutes);
app.use('/api', Routes.userRoutes);

app.use(function(req, res, next) {
    var err = new Error("No Matching Route Please Check Again...!!");
    err.status = 404;
    next(err);
 });
 // error handler
 // define as the last app.use callback
 app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
       Error: {
          message: err.message
       }
    });
 });


 module.exports = app;