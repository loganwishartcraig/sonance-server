import cookieParser from 'cookie-parser';
import express, { RequestHandler } from 'express';
import { ErrorRequestHandler } from 'express-serve-static-core';
import session from 'express-session';
import createError from 'http-errors';
import logger from 'morgan';
import sassMiddleware from 'node-sass-middleware';
import path from 'path';
import { GenericError } from './common/GenericError';
import { wrapCatch } from './common/Utilities';
import { DatabaseServiceErrorCode } from './constants/error_codes';
import { IUser } from './models';
import { registerRoutes } from './routes';
import { userService } from './services';
import { localStrategy } from './strategies/local';

import passport = require('passport');

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

// Passport.js config

app.use(passport.initialize());
app.use(passport.session());

passport.use(localStrategy);
passport.serializeUser((user: IUser, done) => {
  done(null, user.email);
});

passport.deserializeUser(wrapCatch(
  async (email: string, done: (err: any, user?: IUser) => void) => {

    const user = await userService.findByEmail(email);

    if (!user) {
      throw new GenericError({
        httpStatus: 422,
        code: DatabaseServiceErrorCode.RECORD_NOT_FOUND,
        message: 'User not found',
      });
    }

    done(null, user);

  })
);

registerRoutes(app);

const notFoundHandler: RequestHandler = (req, res, next) => {
  next(createError(404));
};

// catch 404 and forward to error handler
app.use(notFoundHandler);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {

  if (err instanceof GenericError) {
    console.warn('Caught error!', err);
    res.status(err.httpStatus).json(err.toJSON());
  } else {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  }

};

// error handler
app.use(errorHandler);

export default app;
