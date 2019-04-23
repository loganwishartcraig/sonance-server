import cookieParser from 'cookie-parser';
import express, { RequestHandler } from 'express';
import { ErrorRequestHandler } from 'express-serve-static-core';
import session from 'express-session';
import validator from 'express-validator';
import createError from 'http-errors';
import logger from 'morgan';
import sassMiddleware from 'node-sass-middleware';
import path from 'path';
import { localStrategy } from './middleware/authentication';
import { IUser } from './models/User';
import { userService } from './services/Index';

import passport = require('passport');
import { registerRoutes } from './routes';

require('dotenv').config();

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true,
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(validator());
app.use(session({
  secret: process.env.COOKIE_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: false,
    secure: true,
  },
}
));

app.use(passport.initialize());
app.use(passport.session());

passport.use(localStrategy);
passport.serializeUser((user: IUser, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email: string, done) => {
  try {
    const user = await userService.findByEmail(email);
    done(null, user);
  } catch (e) {
    console.error('error deserializing user');
    done(e);
  }
});

registerRoutes(app);

const notFoundHandler: RequestHandler = (req, res, next) => {
  next(createError(404));
};

// catch 404 and forward to error handler
app.use(notFoundHandler);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
};

// error handler
app.use(errorHandler);

export default app;
