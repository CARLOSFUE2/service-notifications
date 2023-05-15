import  express  from "express";
import  path  from "path";
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import 'dotenv/config' 
import cors from './configurations/cors'
import createRouter from "./controllers/index"



var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.set('port',process.env.PORT|| 3001)

app.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

//create router
createRouter(app);

const server = app.listen(app.get('port'),()=>{
  console.log('server on port ' +  app.get('port'))
}) 

module.exports = app;
